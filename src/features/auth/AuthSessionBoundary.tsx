import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { env } from '#/lib/env'
import { useCurrentUserQuery } from './auth.query'
import {
  applySession,
  authKeys,
  handleSessionFailure,
  invalidateSessionWork,
  readSessionChange,
  SESSION_STORAGE_KEY,
} from './auth.session'
import { useAuthStore } from './auth.store'

export function AuthSessionBoundary({ children }: { children: ReactNode }) {
  const client = useQueryClient()
  const query = useCurrentUserQuery()

  useEffect(() => {
    if (!query.isEnabled) return
    if (query.isPending) useAuthStore.setState({ status: 'checking' })
    else if (query.isFetching) return
    else if (query.isError) handleSessionFailure(query.error, client)
    else if (query.data)
      applySession(query.data, useAuthStore.getState().version, client)
  }, [
    query.isEnabled,
    query.isPending,
    query.isFetching,
    query.isError,
    query.error,
    query.data,
    query.dataUpdatedAt,
    client,
  ])

  useEffect(() => {
    if (!env.VITE_AUTH_SYNC_TABS) return

    const onStorage = (event: StorageEvent) => {
      if (event.key !== SESSION_STORAGE_KEY) return
      const reason = readSessionChange(event.newValue)

      if (!reason) return

      try {
        if (window.localStorage.getItem(SESSION_STORAGE_KEY) !== event.newValue)
          return
      } catch {}

      invalidateSessionWork(client)

      useAuthStore.setState({
        status: 'checking',
        logoutCause: reason === 'logout' ? 'logout' : null,
      })

      void client.resetQueries({ queryKey: authKeys.me(), exact: true })
    }

    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [client])

  return children
}
