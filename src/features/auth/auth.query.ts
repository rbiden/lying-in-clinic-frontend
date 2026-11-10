import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { env } from '#/lib/env'
import { AuthService } from './auth.service'
import type { LoginDto } from './auth.schema'
import { useAuthStore } from './auth.store'
import {
  applySession,
  authKeys,
  endSession,
  invalidateSessionWork,
  publishSessionChange,
} from './auth.session'
import type { SessionResponse } from './auth.session'

export { authKeys } from './auth.session'

const SCOPE_ID = 'auth-session'

export const useLoginMutation = () => {
  const client = useQueryClient()
  return useMutation<SessionResponse, Error, LoginDto>({
    mutationKey: authKeys.all,
    scope: { id: SCOPE_ID },
    mutationFn: async (credentials) => {
      const version = invalidateSessionWork(client)
      const response = await AuthService.LOGIN(credentials)
      if (version === useAuthStore.getState().version) {
        applySession(response, version, client)
        publishSessionChange('login')
      }
      return response
    },
  })
}

export const useLogoutMutation = () => {
  const client = useQueryClient()
  return useMutation<void, Error, void>({
    mutationKey: authKeys.all,
    scope: { id: SCOPE_ID },
    mutationFn: async () => {
      const version = invalidateSessionWork(client)
      await AuthService.LOGOUT()
      if (version === useAuthStore.getState().version)
        endSession('logout', client)
    },
  })
}

export const useCurrentUserQuery = () => {
  const changing = useIsMutating({ mutationKey: authKeys.all }) > 0
  return useQuery<SessionResponse | null, Error>({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => AuthService.ME(signal),
    staleTime: env.VITE_AUTH_STALE_TIME_MS,
    retry: false,
    enabled: !changing,
    refetchOnMount: 'always',
  })
}
