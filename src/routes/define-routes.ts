import type { AppRouteConfig } from './types'

export function defineRoutes<const TRoutes extends AppRouteConfig[]>(
  routes: TRoutes,
): TRoutes {
  return routes
}
