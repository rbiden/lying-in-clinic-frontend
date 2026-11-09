import type { AppRouteConfig, RouteMeta } from './types'

export interface SidebarRouteItem {
  to: string
  title: string
  icon?: RouteMeta['icon']
  end: boolean
  disabled: boolean
}

/** Build links only for titled routes with concrete URLs. */
export function getSidebarItems(
  routes: AppRouteConfig[],
  parentPath = '/',
): SidebarRouteItem[] {
  const items: SidebarRouteItem[] = []

  for (const route of routes) {
    const path = route.path?.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path ?? ''}`
    const to = path.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
    const isConcrete = !/[:*?]/.test(to)

    if (
      route.meta?.sidebar !== false &&
      route.meta?.title &&
      (route.index || route.path) &&
      isConcrete
    ) {
      items.push({
        to,
        title: route.meta.title,
        icon: route.meta.icon,
        end: Boolean(route.index) || to === '/',
        disabled: !route.element,
      })
    }

    if (route.children) {
      items.push(...getSidebarItems(route.children, to))
    }
  }

  return items.filter(
    (item, index) => items.findIndex((other) => other.to === item.to) === index,
  )
}
