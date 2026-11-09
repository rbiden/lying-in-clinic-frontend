import { create } from 'zustand'
import type { ZodType, ZodTypeDef } from 'zod'
import { cleanFilters } from '@/helpers/filters'
import type { FilterValues } from '@/helpers/filters'
import { tableValueKey } from '@/helpers/table-query'

export interface TableFilterState {
  filters: FilterValues
  search: string
  /** Restoration invalidates pending field/search debounce. */
  epoch: number
}
export const DEFAULT_FILTER_STATE: TableFilterState = {
  filters: {},
  search: '',
  epoch: 0,
}
export type FilterUpdateResult =
  { success: true; filters: FilterValues } | { success: false; message: string }
interface FilterDefinition {
  owner: symbol
  schema: ZodType<FilterValues, ZodTypeDef, unknown>
  defaults: FilterValues
}
const definitions = new Map<string, FilterDefinition>()
let restorationEpoch = 0
interface TableQueryStore {
  tables: Record<string, TableFilterState>
  configure: (key: string, definition: FilterDefinition) => () => void
  restore: (key: string, filters: FilterValues, search: string) => void
  setFilters: (key: string, values: FilterValues) => FilterUpdateResult
  setFilter: (key: string, name: string, value: unknown) => FilterUpdateResult
  setSearch: (key: string, search: string) => void
  resetFilters: (key: string) => FilterUpdateResult
}

export const useTableQueryStore = create<TableQueryStore>((set, get) => ({
  tables: {},
  configure: (key, definition) => {
    const previous = definitions.get(key)
    if (previous && previous.owner !== definition.owner)
      throw new Error(
        `Only one useTableQuery owner may manage tableKey "${key}".`,
      )
    definitions.set(key, definition)
    return () => {
      if (definitions.get(key)?.owner !== definition.owner) return
      definitions.delete(key)
      set((state) => {
        const tables = { ...state.tables }
        delete tables[key]
        return { tables }
      })
    }
  },
  restore: (key, filters, search) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [key]: { filters, search, epoch: ++restorationEpoch },
      },
    })),
  setFilters: (key, values) => {
    const definition = definitions.get(key)
    if (!definition)
      return {
        success: false,
        message: 'Mount useTableQuery before applying filters.',
      }
    const parsed = definition.schema.safeParse(cleanFilters(values))
    if (!parsed.success)
      return {
        success: false,
        message: parsed.error.issues.map((issue) => issue.message).join(' '),
      }
    const current = get().tables[key] ?? DEFAULT_FILTER_STATE
    if (tableValueKey(parsed.data) !== tableValueKey(current.filters)) {
      set((state) => ({
        tables: {
          ...state.tables,
          [key]: { ...current, filters: parsed.data },
        },
      }))
    }
    return { success: true, filters: parsed.data }
  },
  setFilter: (key, name, value) => {
    const current = get().tables[key] ?? DEFAULT_FILTER_STATE
    return get().setFilters(key, { ...current.filters, [name]: value })
  },
  setSearch: (key, search) => {
    if (!definitions.has(key)) return
    const current = get().tables[key] ?? DEFAULT_FILTER_STATE
    if (current.search === search) return
    set((state) => ({
      tables: { ...state.tables, [key]: { ...current, search } },
    }))
  },
  resetFilters: (key) => {
    const definition = definitions.get(key)
    if (!definition)
      return {
        success: false,
        message: 'Mount useTableQuery before resetting filters.',
      }
    const filters = definition.schema.parse(definition.defaults)
    const current = get().tables[key] ?? DEFAULT_FILTER_STATE
    set((state) => ({
      tables: {
        ...state.tables,
        [key]: { ...current, filters, epoch: ++restorationEpoch },
      },
    }))
    return { success: true, filters }
  },
}))

export const selectTableFilters = (key: string) => (state: TableQueryStore) =>
  state.tables[key] ?? DEFAULT_FILTER_STATE
