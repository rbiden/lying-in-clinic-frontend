import type { ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { ZodType, ZodTypeDef } from 'zod'
import type { SortOrder, TableQueryConfig } from '@/constants/table-query'
import type { FilterValues } from '@/helpers/filters'

export interface TableState {
  page: number
  limit: number
  sortField: string | null
  sortType: SortOrder | null
}

export interface TableStateOptions {
  initialState?: Partial<TableState>
  limitOptions?: readonly number[]
  /** Server fields for columns explicitly marked enableSorting: true. */
  sortFields: readonly string[]
}

export interface TableStateHandlers {
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSort: (field: string | null, type: SortOrder | null) => void
}

export interface TableQueryOptions<
  TFilters extends FilterValues,
> extends TableStateOptions {
  tableKey: string
  filterSchema: ZodType<TFilters, ZodTypeDef, unknown>
  defaultFilters: TFilters
  initialSearch?: string
  parameterKeys?: Partial<TableQueryConfig['keys']>
}

export type DataTableColumn<TData> = ColumnDef<TData> & {
  meta?: { sortField?: string }
}

export interface TableInstance extends TableStateHandlers {
  state: TableState
}

interface DataTableBaseProps<TData> {
  rows: TData[]
  columns: DataTableColumn<TData>[]
  table: TableInstance
  search?: string
  /** Memoize this predicate; changing it resets client pagination. */
  filterRow?: (row: TData) => boolean
  getRowId: (row: TData) => string
  /** Pass both selection props to enable the checkbox column. */
  selectedIds?: readonly string[]
  onSelectionChange?: (ids: string[]) => void
  canSelectRow?: (row: TData) => boolean
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  isFetching?: boolean
  error?: unknown
  onRetry?: () => void
  emptyContent?: ReactNode
  errorContent?: ReactNode
  caption?: string
  className?: string
}

export type DataTableProps<TData> = DataTableBaseProps<TData> &
  (
    | { clientSide?: false; totalCount: number }
    /** Supply the complete dataset to opt into local processing. */
    | { clientSide: true; totalCount?: never }
  )
