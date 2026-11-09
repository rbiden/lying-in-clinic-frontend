import type { Location, NavigateFunction } from 'react-router'
import { writeTableUrl, tableUrlSlice } from '@/helpers/table-query'
import type { FilterValues } from '@/helpers/filters'
import type { TableState } from '@/types/datatable.types'

interface UrlUpdate {
  location: Location
  navigate: NavigateFunction
  tableKey: string
  state: TableState
  filters: FilterValues
  search: string
  isCurrent: () => boolean
  onWritten: (slice: string) => void
}

// Merge same-tick updates from independent tables; each preserves other namespaces.
const pending = new Map<string, Map<string, UrlUpdate>>()
export function queueTableUrlUpdate(update: UrlUpdate) {
  const key = `${update.location.key}:${update.location.pathname}`
  const existing = pending.get(key)
  if (existing) {
    existing.set(update.tableKey, update)
    return
  }
  const updates = new Map([[update.tableKey, update]])
  pending.set(key, updates)
  queueMicrotask(() => {
    pending.delete(key)
    const current = [...updates.values()].filter((item) => item.isCurrent())
    if (!current.length) return
    const first = current[0]
    const params = new URLSearchParams(first.location.search)
    for (const item of current)
      writeTableUrl(
        params,
        item.tableKey,
        item.state,
        item.filters,
        item.search,
      )
    const search = params.toString()
    if (search === new URLSearchParams(first.location.search).toString()) return
    for (const item of current)
      item.onWritten(tableUrlSlice(search, item.tableKey))
    void first.navigate(
      {
        pathname: first.location.pathname,
        search: `?${search}`,
        hash: first.location.hash,
      },
      { replace: true, preventScrollReset: true, state: first.location.state },
    )
  })
}
