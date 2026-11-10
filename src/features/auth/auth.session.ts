import { isAxiosError, isCancel } from 'axios'
import type { QueryClient } from '@tanstack/react-query'
import type { ApiResponse } from '#/types'
import { queryClient } from '#/lib/query-client'
import { env } from '#/lib/env'
import { useAuthStore } from './auth.store'
import { SessionChangeSchema } from './auth.schema'
import type { AuthUser, SessionChange } from './auth.schema'

export type { SessionChange } from './auth.schema'

export type SessionResponse = ApiResponse<AuthUser>
export const SESSION_STORAGE_KEY = 'inventory:session-change'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function invalidateSessionWork(client: QueryClient = queryClient) {
  const version = useAuthStore.getState().version + 1
  useAuthStore.setState({ version })
  void client.cancelQueries()
  return version
}

export function publishSessionChange(reason: SessionChange) {
  if (!env.VITE_AUTH_SYNC_TABS) return
  try {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ id: crypto.randomUUID(), reason }),
    )
  } catch {}
}

export function readSessionChange(value: string | null): SessionChange | null {
  try {
    return SessionChangeSchema.parse(JSON.parse(value ?? 'null')).reason
  } catch {}

  return null
}

export function applySession(
  response: SessionResponse,
  version: number,
  client: QueryClient = queryClient,
) {
  const state = useAuthStore.getState()
  if (version !== state.version) return

  if (state.user?.id !== response.data.id) {
    if (state.user) invalidateSessionWork(client)

    client.removeQueries({
      predicate: (query) =>
        query.queryKey[0] !== 'auth' || query.queryKey[1] !== 'me',
    })
  }

  if (client.getQueryData(authKeys.me()) !== response)
    client.setQueryData(authKeys.me(), response)
  state.setAuth(response.data)
}

export function endSession(
  cause: 'logout' | 'expired',
  client: QueryClient = queryClient,
  broadcast = true,
) {
  invalidateSessionWork(client)

  client.removeQueries({
    predicate: (query) =>
      query.queryKey[0] !== 'auth' || query.queryKey[1] !== 'me',
  })

  client.setQueryData(authKeys.me(), null)
  useAuthStore.getState().logout(cause)

  if (broadcast) publishSessionChange(cause)
}

export function handleSessionFailure(
  error: unknown,
  client: QueryClient = queryClient,
  broadcast = false,
) {
  if (isCancel(error)) return
  if (isAxiosError(error) && error.response?.status === 401) {
    endSession(
      useAuthStore.getState().logoutCause ?? 'expired',
      client,
      broadcast,
    )
  } else {
    useAuthStore.setState({ status: 'error' })
  }
}
