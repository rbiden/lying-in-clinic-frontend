import { cn } from 'cn'
import { useEffect } from 'react'
import { Navigate, Outlet, useSearchParams } from 'react-router'
import { RootLayout } from './RootLayout'
import { useSession } from '#/features/auth/use-session'
import { useAuthStore } from '#/features/auth/auth.store'
import { getSessionReturnUrl } from '#/features/auth/auth.redirect'
import { SessionErrorScreen } from '#/features/auth/SessionErrorScreen'
import { LoadingScreen } from '../LoadingScreen'

interface GuestLayoutProps {
  className?: string
}

export const GuestLayout = ({ className }: GuestLayoutProps) => {
  const { status, retry } = useSession()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (status === 'unauthenticated') {
      // The logout destination has been reached. Future protected visits can
      // capture a fresh return URL rather than reusing the last logout cause.
      useAuthStore.setState({ logoutCause: null })
    }
  }, [status])

  if (status === 'checking') return <LoadingScreen />
  if (status === 'error') return <SessionErrorScreen retry={retry} />
  if (status === 'authenticated') {
    return (
      <Navigate
        to={getSessionReturnUrl(searchParams.get('redirect'))}
        replace
      />
    )
  }

  return (
    <RootLayout className={cn(className)}>
      <Outlet />
    </RootLayout>
  )
}
