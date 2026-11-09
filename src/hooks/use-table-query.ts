import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { FilterValues } from '@/helpers/filters'
import {
  buildTableParams,
  DEFAULT_TABLE_FILTER_SCHEMA,
  readTableUrl,
  tableUrlSlice,
  tableValueKey,
} from '@/helpers/table-query'
import { rememberListSearch } from '@/helpers/list-return'
import type { TableQueryOptions } from '@/types/datatable.types'
import { useTableQueryStore } from '@/stores/table-query-store'
import { useTableFilters } from './use-table-filters'
import { useTableState } from './use-table-state'
import { queueTableUrlUpdate } from './table-url-sync'

/** One owner per tableKey. Mount under a React Router; keep configuration stable. */
export function useTableQuery<TFilters extends FilterValues = FilterValues>(
  options: TableQueryOptions<TFilters>,
) {
  const { tableKey } = options
  if (!tableKey.trim()) throw new Error('tableKey must not be empty.')
  const location = useLocation()
  const navigate = useNavigate()
  const configRef = useRef(options)

  configRef.current = options

  const locationRef = useRef(location)
  locationRef.current = location

  const [owner] = useState(() => Symbol('table-owner'))
  const [initial] = useState(() => readTableUrl(location.search, options))
  const table = useTableState({ ...options, initialState: initial.state })

  const filter = useTableFilters(tableKey)
  const { state: filterState } = filter

  const resetFilters = useCallback(() => {
    const result = filter.resetFilters()
    if (!result.success) return
    filter.setSearch('')
    table.setPage(1)
  }, [filter.resetFilters, filter.setSearch, table.setPage])

  const filterIdentity = tableValueKey([
    filterState.filters,
    filterState.search,
  ])

  const [anchor, setAnchor] = useState({ tableKey, identity: filterIdentity })
  const [readyKey, setReadyKey] = useState<string | null>(null)

  const sync = useRef({
    raw: '',
    pending: null as string | null,
    mounted: false,
  })

  const raw = tableUrlSlice(location.search, tableKey)

  const isReady =
    readyKey === tableKey &&
    filterState.epoch > 0 &&
    filterState === useTableQueryStore.getState().tables[tableKey] &&
    (raw === sync.current.raw || raw === sync.current.pending)

  const resetPage =
    isReady &&
    (anchor.tableKey !== tableKey || anchor.identity !== filterIdentity)

  const state = useMemo(
    () => (resetPage ? { ...table.state, page: 1 } : table.state),
    [resetPage, table.state],
  )

  useLayoutEffect(() => {
    const config = configRef.current
    const schema = config.filterSchema ?? DEFAULT_TABLE_FILTER_SCHEMA
    const defaults = schema.parse(config.defaultFilters ?? {})
    const store = useTableQueryStore.getState()

    const release = store.configure(tableKey, {
      owner,
      schema,
      defaults,
    })

    sync.current.mounted = true

    const restored = readTableUrl(locationRef.current.search, config)
    sync.current.raw = tableUrlSlice(locationRef.current.search, tableKey)

    sync.current.pending = null

    store.restore(tableKey, restored.filters, restored.search)
    table.setState(restored.state)

    setAnchor({
      tableKey,
      identity: tableValueKey([restored.filters, restored.search]),
    })

    setReadyKey(tableKey)

    return () => {
      sync.current.mounted = false
      release()
    }
  }, [tableKey, owner, table.setState])

  useLayoutEffect(() => {
    if (raw === sync.current.pending) {
      sync.current.raw = raw
      sync.current.pending = null
      return
    }

    if (raw === sync.current.raw) return

    const restored = readTableUrl(location.search, configRef.current)

    sync.current.raw = raw
    sync.current.pending = null

    useTableQueryStore
      .getState()
      .restore(tableKey, restored.filters, restored.search)

    table.setState(restored.state)

    setAnchor({
      tableKey,
      identity: tableValueKey([restored.filters, restored.search]),
    })
  }, [raw, location.search, tableKey, table.setState])

  useLayoutEffect(() => {
    if (!isReady) return
    if (resetPage) {
      table.setState(state)
      setAnchor({ tableKey, identity: filterIdentity })
    }

    const expectedKey = location.key

    queueTableUrlUpdate({
      location,
      navigate,
      tableKey,
      state,
      filters: filterState.filters,
      search: filterState.search,
      isCurrent: () =>
        sync.current.mounted && locationRef.current.key === expectedKey,
      onWritten: (slice) => {
        sync.current.pending = slice
      },
    })
  }, [
    isReady,
    resetPage,
    state,
    filterIdentity,
    filterState,
    tableKey,
    table.setState,
    location,
    navigate,
  ])

  // Back buttons on detail pages read this to reopen the list as it was left.
  useEffect(() => {
    rememberListSearch(location.pathname, location.search)
  }, [location.pathname, location.search])

  const queryIdentity = tableValueKey([
    state,
    filterState.filters,
    filterState.search,
  ])

  const currentQuery = useRef({ queryIdentity, state, isReady })

  currentQuery.current = { queryIdentity, state, isReady }

  const acceptTotal = useCallback(
    (totalCount: number, responseIdentity: string) => {
      const current = currentQuery.current
      if (!current.isReady || responseIdentity !== current.queryIdentity) return
      if (!Number.isSafeInteger(totalCount) || totalCount < 0)
        throw new Error('totalCount must be a non-negative integer.')
      const lastPage = Math.max(1, Math.ceil(totalCount / current.state.limit))
      if (current.state.page > lastPage) table.setPage(lastPage)
    },
    [table.setPage],
  )

  const params = useMemo(
    () =>
      buildTableParams(
        state,
        filterState.filters,
        filterState.search,
        options.parameterKeys,
      ),
    [state, filterState.filters, filterState.search, options.parameterKeys],
  )

  return {
    state,
    filters: filterState.filters as TFilters,
    search: filterState.search,
    params,
    queryIdentity,
    isReady,
    acceptTotal,
    setPage: table.setPage,
    setLimit: table.setLimit,
    setSort: table.setSort,
    resetFilters,
  }
}
