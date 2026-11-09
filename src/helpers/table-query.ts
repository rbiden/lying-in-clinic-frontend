import type { ColumnDef } from '@tanstack/react-table'
import type { FilterValues } from './filters'
import type { TableQueryOptions, TableState, TableStateOptions } from '@/types/datatable.types'
import type { TableQueryConfig } from '@/constants/table-query'
import { TABLE_QUERY_CONFIG } from '@/constants/table-query'

export const TABLE_URL_FIELDS = ['page', 'limit', 'sortField', 'sortType', 'search', 'filters'] as const

/** Stable JSON identity; does not remove valid empty/default schema values. */
export function tableValueKey(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) =>
    item !== null && typeof item === 'object' && !Array.isArray(item)
      ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
      : item,
  )
}

export function tableDefaults(options: TableStateOptions): TableState {
  const limits = options.limitOptions ?? TABLE_QUERY_CONFIG.limitOptions
  const initial = options.initialState
  const state: TableState = {
    page: initial?.page ?? TABLE_QUERY_CONFIG.defaults.page,
    limit: initial?.limit ?? TABLE_QUERY_CONFIG.defaults.limit,
    sortField: initial?.sortField ?? null,
    sortType: initial?.sortType ?? null,
  }
  if (!Number.isSafeInteger(state.page) || state.page < 1 || limits.length === 0 ||
    limits.some((limit) => !Number.isSafeInteger(limit) || limit < 1) || !limits.includes(state.limit)) {
    throw new Error('Table defaults require a positive page and an allowed positive limit.')
  }
  if ((state.sortField === null) !== (state.sortType === null) ||
    (state.sortField !== null && !options.sortFields.includes(state.sortField)) ||
    (state.sortType !== null && !['asc', 'desc'].includes(state.sortType))) {
    throw new Error('Initial sorting requires an allowed field and asc/desc direction, or null/null.')
  }
  return state
}

export function getTableSortFields<TData>(columns: ColumnDef<TData>[]): string[] {
  return columns.flatMap((column) => {
    if ('columns' in column && column.columns) return getTableSortFields(column.columns)
    if (column.enableSorting !== true) return []
    const id = column.id ?? ('accessorKey' in column ? String(column.accessorKey).replace(/\./g, '_') : undefined)
    if (!id) throw new Error('Sortable columns require an id or accessorKey.')
    return [columnSortField(column.meta, id)]
  })
}

export function tableUrlSlice(search: string, tableKey: string): string {
  const params = new URLSearchParams(search)
  return JSON.stringify(TABLE_URL_FIELDS.map((name) => params.getAll(`${tableKey}.${name}`)))
}

export function readTableUrl<TFilters extends FilterValues>(search: string, options: TableQueryOptions<TFilters>): { state: TableState; filters: TFilters; search: string } {
  const params = new URLSearchParams(search)
  const get = (name: string) => params.get(`${options.tableKey}.${name}`)
  const defaults = tableDefaults(options)
  const limits = options.limitOptions ?? TABLE_QUERY_CONFIG.limitOptions
  const positive = (value: string | null, fallback: number) => {
    if (value === null || !/^\d+$/.test(value)) return fallback
    const parsed = Number(value)
    return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
  }
  const page = positive(get('page'), defaults.page)
  const requestedLimit = positive(get('limit'), defaults.limit)
  const limit = limits.includes(requestedLimit) ? requestedLimit : defaults.limit
  const field = get('sortField')
  const type = get('sortType')
  const hasSort = field !== null || type !== null
  const hasNamespace = TABLE_URL_FIELDS.some((name) => get(name) !== null)
  const validSort = field !== null && options.sortFields.includes(field) && (type === 'asc' || type === 'desc')
  let filters = options.filterSchema.parse(options.defaultFilters)
  const encoded = get('filters')
  if (encoded !== null) {
    try {
      const parsed = options.filterSchema.safeParse(JSON.parse(encoded))
      if (parsed.success) filters = parsed.data
    } catch { /* Invalid JSON uses the validated defaults. */ }
  }
  return {
    state: {
      page, limit,
      sortField: validSort ? field : hasSort || !hasNamespace ? defaults.sortField : null,
      sortType: validSort ? type : hasSort || !hasNamespace ? defaults.sortType : null,
    },
    filters,
    search: get('search') ?? (hasNamespace ? '' : options.initialSearch ?? ''),
  }
}

export function columnSortField(meta: unknown, id: string): string {
  return meta !== null && typeof meta === 'object' && 'sortField' in meta && typeof meta.sortField === 'string' ? meta.sortField : id
}

export function writeTableUrl(params: URLSearchParams, tableKey: string, state: TableState, filters: FilterValues, search: string) {
  for (const name of TABLE_URL_FIELDS) params.delete(`${tableKey}.${name}`)
  params.set(`${tableKey}.page`, String(state.page))
  params.set(`${tableKey}.limit`, String(state.limit))
  if (state.sortField && state.sortType) {
    params.set(`${tableKey}.sortField`, state.sortField)
    params.set(`${tableKey}.sortType`, state.sortType)
  }
  if (search) params.set(`${tableKey}.search`, search)
  params.set(`${tableKey}.filters`, tableValueKey(filters))
}

export function buildTableParams(state: TableState, filters: FilterValues, search: string, parameterKeys?: Partial<TableQueryConfig['keys']>): Record<string, unknown> {
  const keys = { ...TABLE_QUERY_CONFIG.keys, ...parameterKeys }
  const params: Record<string, unknown> = { ...filters, [keys.page]: state.page, [keys.limit]: state.limit }
  if (search) params[keys.search] = search
  if (state.sortField && state.sortType) {
    params[keys.sortField] = state.sortField
    params[keys.sortType] = state.sortType
  }
  return params
}
