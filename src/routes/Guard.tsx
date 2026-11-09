import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '#/features/auth/use-session'
import { SessionErrorScreen } from '#/features/auth/SessionErrorScreen'
import { getSessionLoginUrl } from '#/features/auth/auth.redirect'
import { LoadingScreen } from '#/components/LoadingScreen'
import type { AppRouteConfig } from './types'

interface RouteGuardProps {
  route: AppRouteConfig
  children?: ReactNode
}

export const RouteGuard = ({ route, children }: RouteGuardProps) => {
  const location = useLocation()
  const { user, isAuthenticated, status, logoutCause, retry } = useSession()

  const { requireAuth, guards = [], unauthorizedElement } = route

  const isAuthRequired = requireAuth || guards.length > 0

  if (isAuthRequired && status === 'checking') return <LoadingScreen />
  if (isAuthRequired && status === 'error')
    return <SessionErrorScreen retry={retry} />

  if (isAuthRequired && !isAuthenticated) {
    return <Navigate to={getSessionLoginUrl(location, logoutCause)} replace />
  }

  if (guards.length > 0) {
    const context = {
      user,
      isAuthenticated,
      location,
    }

    for (const guard of guards) {
      const result = guard(context)
      if (typeof result === 'string') {
        return <Navigate to={result} replace />
      }
      if (!result) {
        if (unauthorizedElement) {
          return <>{unauthorizedElement}</>
        }
        return <Navigate to="/login" replace />
      }
    }
  }

  return <>{children || <Outlet />}</>
}
