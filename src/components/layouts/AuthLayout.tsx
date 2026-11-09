import { cn } from 'cn'
import { Navigate, Outlet, useLocation, useMatches } from 'react-router'
import type { AppRouteHandle } from '#/routes/types'
import { RootLayout } from './RootLayout'
import { Sidebar } from '../Sidebar'
import { useSession } from '#/features/auth/use-session'
import { getSessionLoginUrl } from '#/features/auth/auth.redirect'
import { SessionErrorScreen } from '#/features/auth/SessionErrorScreen'
import { LoadingScreen } from '../LoadingScreen'
import { SidebarProvider } from '../ui/sidebar'
import { AuthAtmosphere } from '../background/AuthAtmosphere'
import { PageHeader } from '../PageHeader'
import { Breadcrumbs } from '../Breadcrumbs'
import {
  getBreadcrumbItems,
  normalizeBreadcrumbPath,
} from '#/routes/breadcrumbs'
import { useMemo } from 'react'
import { useBreadcrumbStore } from '#/stores/breadcrumb-store'
import { UserRound } from 'lucide-react'

interface AuthLayoutProps {
  className?: string
}

export const AuthLayout = ({ className }: AuthLayoutProps) => {
  const matches = useMatches()
  const handle = matches.at(-1)?.handle as AppRouteHandle | undefined
  const meta = handle?.meta

  const labels = useBreadcrumbStore((state) => state.labels)
  const breadcrumbs = useMemo(
    () => getBreadcrumbItems(matches, labels),
    [matches, labels],
  )
  const currentPath = normalizeBreadcrumbPath(matches.at(-1)?.pathname ?? '/')
  const showHeader = meta?.header !== false

  const { user, status, logoutCause, retry } = useSession()
  const location = useLocation()

  if (status === 'checking') return <LoadingScreen />
  if (status === 'error') return <SessionErrorScreen retry={retry} />
  if (status === 'unauthenticated') {
    return <Navigate to={getSessionLoginUrl(location, logoutCause)} replace />
  }

  return (
    <SidebarProvider key={user?.id}>
      <Sidebar />

      <div className="relative isolate min-w-0 flex-1 bg-background">
        <AuthAtmosphere />

        <header className="relative z-10 flex min-h-14 items-center justify-between gap-2 border-b bg-background/70 px-4 py-2 backdrop-blur-md">
          <Breadcrumbs items={breadcrumbs} currentPath={currentPath} />

          <span className="rounded-full border border-gray-300 p-2">
            <UserRound className="size-4" />
          </span>
        </header>

        <RootLayout
          className={cn(
            'z-10 h-auto min-h-[calc(100svh-3.5rem)] space-y-4',
            className,
          )}
        >
          {showHeader && (
            <PageHeader
              header={meta?.headerTitle}
              description={meta?.headerDescription}
            />
          )}

          <Outlet />
        </RootLayout>
      </div>
    </SidebarProvider>
  )
}
