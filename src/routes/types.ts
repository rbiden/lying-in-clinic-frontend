import type { ComponentType, ReactNode } from 'react'
import type { RouteObject, Location, UIMatch } from 'react-router'
import type { LucideIcon } from 'lucide-react'

export interface AuthUser {
  id: string
  name?: string
  fullName?: string
  email: string
  role?: string
}

export interface GuardContext {
  user: AuthUser | null
  isAuthenticated: boolean
  location: Location
}

/**
 * Route guard predicate. Return true to allow, false or a redirect path string to block/redirect.
 */
export type RouteGuard = (
  context: GuardContext,
) => boolean | string | Promise<boolean | string>

/** Resolve a breadcrumb from the matched URL, parameters and loader data. */
export type BreadcrumbResolver = (match: UIMatch) => string | undefined

export interface RouteMeta {
  title?: string
  /** Show the page header unless explicitly false. Defaults to true. */
  header?: boolean
  /** Page heading; falls back to title in AuthLayout. */
  headerTitle?: string
  headerDescription?: string
  /** Set false to omit this route from sidebar navigation. */
  sidebar?: boolean
  icon?: LucideIcon
  breadcrumb?: string | BreadcrumbResolver
  layout?: 'default' | 'blank' | 'dashboard'
  [key: string]: unknown
}

export interface AppRouteHandle {
  meta?: RouteMeta
  [key: string]: unknown
}

/**
 * Enhanced route configuration with authentication and custom route guards.
 */
export interface AppRouteConfig extends Omit<
  RouteObject,
  'children' | 'handle'
> {
  handle?: AppRouteHandle
  /** Optional custom metadata (title, breadcrumbs, etc.) */
  meta?: RouteMeta

  /** Whether the route explicitly requires authentication */
  requireAuth?: boolean

  /** Custom route guard functions */
  guards?: RouteGuard[]

  /** Nested child routes */
  children?: AppRouteConfig[]

  /** Fallback element to render when guard check fails (defaults to redirecting to /login) */
  unauthorizedElement?: ReactNode

  /** Lazy component or standard Component */
  Component?: ComponentType<unknown>
}
