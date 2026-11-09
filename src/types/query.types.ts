import type { SortOrder } from '@/constants/table-query'

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sortField?: string
  sortType?: SortOrder
}
