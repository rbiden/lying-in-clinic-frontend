export type FilterValues = Record<string, unknown>

export function isEmptyFilterValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true
  if (Array.isArray(value)) return value.length === 0
  if (value instanceof Date) return Number.isNaN(value.getTime())
  if (typeof value === 'object') return Object.values(value).every(isEmptyFilterValue)
  return false
}

export function cleanFilters(values: FilterValues | null | undefined): FilterValues {
  return Object.fromEntries(
    Object.entries(values ?? {}).filter(([, v]) => !isEmptyFilterValue(v)),
  )
}

const blank = (value: unknown): unknown => {
  if (Array.isArray(value)) return []
  if (value instanceof Date) return ''
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, blank(v)]))
  }
  return ''
}

export function blankFilterValues(values: FilterValues): FilterValues {
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, blank(v)]))
}

export function filtersKey(values: FilterValues | null | undefined): string {
  return JSON.stringify(cleanFilters(values), (_key, val: unknown) =>
    val !== null && typeof val === 'object' && !Array.isArray(val)
      ? Object.fromEntries(
          Object.entries(val as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)),
        )
      : val,
  )
}

export function formatFilterValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatFilterValue).join(', ')
  if (value instanceof Date) {
    return value.toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' })
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if ('from' in obj || 'to' in obj) {
      const fromStr = obj.from ? formatFilterValue(obj.from) : '...'
      const toStr = obj.to ? formatFilterValue(obj.to) : '...'
      return `${fromStr} - ${toStr}`
    }
    return JSON.stringify(value)
  }
  return String(value)
}
