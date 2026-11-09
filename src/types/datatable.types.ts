import type { ComponentType, ReactNode } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { ZodType, ZodTypeDef } from 'zod'
import type { SortOrder, TableQueryConfig } from '@/constants/table-query'
import type { StatusVariant } from './common.types'
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
  sortFields?: readonly string[]
}

export interface TableStateHandlers {
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSort: (field: string | null, type: SortOrder | null) => void
}

export interface TableQueryOptions<
  TFilters extends FilterValues = FilterValues,
> extends TableStateOptions {
  tableKey: string
  filterSchema?: ZodType<TFilters, ZodTypeDef, unknown>
  defaultFilters?: TFilters
  initialSearch?: string
  parameterKeys?: Partial<TableQueryConfig['keys']>
}

export type DataTableColumn<TData> = ColumnDef<TData> & {
  headerClassName?: string
  cellClassName?: string | ((row: TData) => string)
  meta?: { sortField?: string }
}

export interface TableInstance extends TableStateHandlers {
  state: TableState
  resetFilters?: () => void
}

export interface DataTableAction<TData> {
  label: string
  className?: string
  icon?: ComponentType<{ className?: string }>
  onClick: (row: TData) => void
  variant?: 'default' | StatusVariant
  disabled?: boolean
  /** Hide this action for every row or when the row predicate returns true. */
  hidden?: boolean | ((row: TData) => boolean)
}

interface DataTableBaseProps<TData> {
  rows: TData[]
  columns: DataTableColumn<TData>[]
  actions?: readonly DataTableAction<TData>[]
  actionType?: 'dropdown' | 'inline'
  table: TableInstance
  search?: string
  /** Memoize this predicate; changing it resets client pagination. */
  filterRow?: (row: TData) => boolean
  getRowId: (row: TData) => string
  getRowClassName?: (row: TData) => string | undefined
  /** Pass both selection props to enable the checkbox column. */
  selectedIds?: readonly string[]
  onSelectionChange?: (ids: string[]) => void
  canSelectRow?: (row: TData) => boolean
  /** Keep the checkboxes visible but inert, e.g. while a record is locked. */
  selectionDisabled?: boolean
  canBulkSelectRow?: (row: TData) => boolean
  onRowClick?: (row: TData) => void
  isLoading?: boolean
  isFetching?: boolean
  showPagination?: boolean
  error?: unknown
  onRetry?: () => void
  emptyContent?: ReactNode
  errorContent?: ReactNode
  caption?: string
  className?: string
  cellClassName?: string | ((row: TData) => string | undefined)
}

export type DataTableProps<TData> = DataTableBaseProps<TData> &
  (
    | { clientSide?: false; totalCount: number }
    /** Supply the complete dataset to opt into local processing. */
    | { clientSide: true; totalCount?: never }
  )
