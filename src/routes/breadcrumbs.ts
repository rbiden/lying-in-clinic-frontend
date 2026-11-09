import type { UIMatch } from 'react-router'
import type { AppRouteHandle } from './types'

export interface BreadcrumbItem {
  to: string
  label: string
}

/** Index routes may add a trailing slash to the same logical breadcrumb URL. */
export function normalizeBreadcrumbPath(path: string): string {
  return path.replace(/\/+$/, '') || '/'
}

/** Use matched URLs so nested and parameter routes link to resolved paths. */
export function getBreadcrumbItems(
  matches: UIMatch[],
  labels: Readonly<Record<string, string | undefined>> = {},
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = []

  for (const matched of matches) {
    const path = normalizeBreadcrumbPath(matched.pathname)
    const handle = matched.handle as AppRouteHandle | undefined
    const breadcrumb = handle?.meta?.breadcrumb

    const label =
      labels[path] ??
      (typeof breadcrumb === 'function' ? breadcrumb(matched) : breadcrumb) ??
      handle?.meta?.title
    if (!label) continue

    const item = { to: path, label }

    // Layout and index matches can share a URL; keep the more specific label.
    if (items.at(-1)?.to === item.to) items[items.length - 1] = item
    else items.push(item)
  }

  if (items[0]?.to !== '/') items.unshift({ to: '/', label: 'Home' })

  return items
}
