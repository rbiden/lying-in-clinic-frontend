import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router'
import type { AppRouteConfig } from './types'

import { createBrowserRouter, RouterProvider } from 'react-router'
import { Login } from '../pages/Login'
import { NotFound } from '../pages/NotFound'
import { RouteGuard } from './Guard'
import { AuthLayout, GuestLayout } from '#/components/layouts'
import { authRoutes } from '#/features/auth/auth.routes'
import { userRoutes } from '#/features/users/users.routes'
import { defineRoutes } from './define-routes'

/**
 * Transforms an AppRouteConfig (with guards and metadata)
 * into a standard React Router RouteObject.
 */
export function transformRoute(route: AppRouteConfig): RouteObject {
  const {
    children,
    element,
    Component,
    requireAuth,
    guards,
    unauthorizedElement,
    meta,
    handle,
    ...rest
  } = route

  const isGuarded = Boolean(requireAuth) || (guards && guards.length > 0)

  // Resolve base element
  let resolvedElement: ReactNode = element
  if (!resolvedElement && Component) {
    resolvedElement = <Component />
  }

  // Wrap with RouteGuard if auth or custom guards are required
  if (isGuarded) {
    resolvedElement = (
      <RouteGuard
        route={{
          requireAuth,
          guards,
          unauthorizedElement,
        }}
      >
        {resolvedElement}
      </RouteGuard>
    )
  }

  const transformed: RouteObject = {
    ...rest,
    element: resolvedElement,
    handle: { ...handle, meta: meta ?? handle?.meta },
  }

  if (children && children.length > 0) {
    transformed.children = children.map(transformRoute)
  }

  return transformed
}

/**
 * Master Route Configuration ("Mother" File)
 * All feature routes, layouts, and guards are registered here.
 */
export const routes = defineRoutes([
  {
    path: '/login',
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <Login />,
        meta: { title: 'Sign In' },
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [...authRoutes, ...userRoutes],
  },
  {
    path: '*',
    element: <NotFound />,
    meta: { title: 'Not Found' },
  },
])

export const router = createBrowserRouter(routes.map(transformRoute))

export const AppRouter = () => {
  return <RouterProvider router={router} />
}
