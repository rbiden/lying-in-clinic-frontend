export type SortOrder = 'asc' | 'desc'

export interface TableQueryConfig {
  keys: {
    page: string
    limit: string
    search: string
    sortField: string
    sortType: string
  }
  defaults: { page: number; limit: number }
  limitOptions: number[]
  searchDebounceMs: number
}

export const TABLE_QUERY_CONFIG: TableQueryConfig = {
  keys: {
    page: 'page',
    limit: 'limit',
    search: 'search',
    sortField: 'sort_by',
    sortType: 'sort_order',
  },
  defaults: { page: 1, limit: 10 },
  limitOptions: [10, 20, 50, 100],
  searchDebounceMs: 300,
}
