import { useCallback, useState } from 'react'
import { TABLE_QUERY_CONFIG } from '@/constants/table-query'
import type { SortOrder } from '@/constants/table-query'
import { tableDefaults } from '@/helpers/table-query'
import type { TableState, TableStateOptions } from '@/types/datatable.types'

export function useTableState(options: TableStateOptions) {
  const [state, setState] = useState<TableState>(() => tableDefaults(options))
  const limits = options.limitOptions ?? TABLE_QUERY_CONFIG.limitOptions
  const fields = options.sortFields
  const setPage = useCallback((page: number) => {
    if (!Number.isSafeInteger(page) || page < 1)
      throw new Error('Page must be a positive integer.')
    setState((current) =>
      current.page === page ? current : { ...current, page },
    )
  }, [])
  const setLimit = useCallback(
    (limit: number) => {
      if (!limits.includes(limit))
        throw new Error('Limit must be one of this table’s allowed limits.')
      setState((current) => ({ ...current, limit, page: 1 }))
    },
    [limits],
  )
  const setSort = useCallback(
    (sortField: string | null, sortType: SortOrder | null) => {
      if (
        (sortField === null) !== (sortType === null) ||
        (sortField !== null && !fields?.includes(sortField)) ||
        (sortType !== null && !['asc', 'desc'].includes(sortType))
      )
        throw new Error(
          'Sorting requires an allowed field and direction, or null/null.',
        )
      setState((current) => ({ ...current, sortField, sortType }))
    },
    [fields],
  )
  return { state, setState, setPage, setLimit, setSort }
}
