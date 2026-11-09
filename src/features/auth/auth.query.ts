import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { env } from '#/lib/env'
import type { ApiResponse } from '#/types'
import { AuthService } from './auth.service'
import type { LoginDto } from './auth.schema'
import { useAuthStore } from './auth.store'
import {
  applySession,
  authKeys,
  endSession,
  handleSessionFailure,
  invalidateSessionWork,
  publishSessionChange,
} from './auth.session'
import type { SessionResponse } from './auth.session'

export { authKeys } from './auth.session'

const SCOPE_ID = 'auth-session'

export const useLoginMutation = () => {
  const client = useQueryClient()
  return useMutation<SessionResponse, AxiosError, LoginDto>({
    mutationKey: authKeys.all,
    scope: { id: SCOPE_ID },
    mutationFn: async (credentials: LoginDto) => {
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
  return useMutation<ApiResponse<{ message: string }>, AxiosError, void>({
    mutationKey: authKeys.all,
    scope: { id: SCOPE_ID },
    mutationFn: async () => {
      const version = invalidateSessionWork(client)
      const response = await AuthService.LOGOUT()

      if (version === useAuthStore.getState().version) {
        endSession('logout', client)
      }

      return response
    },
  })
}

export const useRefreshMutation = () => {
  const client = useQueryClient()
  return useMutation<SessionResponse, AxiosError, void>({
    mutationKey: authKeys.all,
    scope: { id: SCOPE_ID },
    mutationFn: async () => {
      const version = invalidateSessionWork(client)
      try {
        const response = await AuthService.REFRESH()

        if (version === useAuthStore.getState().version)
          applySession(response, version, client)
        else void client.resetQueries({ queryKey: authKeys.me(), exact: true })

        return response
      } catch (error) {
        if (version === useAuthStore.getState().version)
          handleSessionFailure(error, client)
        else void client.resetQueries({ queryKey: authKeys.me(), exact: true })

        throw error
      }
    },
  })
}

export const useCurrentUserQuery = () => {
  const changing = useIsMutating({ mutationKey: authKeys.all }) > 0
  return useQuery<SessionResponse | null, AxiosError>({
    queryKey: authKeys.me(),
    queryFn: ({ signal }) => AuthService.ME(signal),
    staleTime: env.VITE_AUTH_STALE_TIME_MS,
    retry: false,
    enabled: !changing,
    refetchOnMount: 'always',
  })
}
