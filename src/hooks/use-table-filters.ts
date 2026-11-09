import { useMemo } from 'react'
import { cleanFilters } from '@/helpers/filters'
import type { FilterValues } from '@/helpers/filters'
import {
  selectTableFilters,
  useTableQueryStore,
} from '@/stores/table-query-store'

/** Filter-only subscription; never creates a pagination/URL lifecycle owner. */
export function useTableFilters(tableKey: string) {
  const state = useTableQueryStore(selectTableFilters(tableKey))
  const actions = useMemo(() => {
    const store = useTableQueryStore.getState()
    return {
      setFilters: (values: FilterValues) => store.setFilters(tableKey, values),
      setFilter: (name: string, value: unknown) =>
        store.setFilter(tableKey, name, value),
      setSearch: (search: string) => store.setSearch(tableKey, search),
      resetFilters: () => store.resetFilters(tableKey),
    }
  }, [tableKey])
  return {
    state,
    activeCount: Object.keys(cleanFilters(state.filters)).length,
    ...actions,
  }
}
