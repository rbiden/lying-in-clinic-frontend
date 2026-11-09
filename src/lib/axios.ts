import axios, { CanceledError } from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import {
  applySession,
  handleSessionFailure,
} from '#/features/auth/auth.session'
import { AuthService } from '#/features/auth/auth.service'
import { useAuthStore } from '#/features/auth/auth.store'
import { queryClient } from './query-client'
import { env } from './env'

interface SessionRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
  _sessionVersion?: number
}

let refreshRequest: { version: number; promise: Promise<void> } | null = null

const isAuthMutation = (url: string | undefined) =>
  /\/auth\/(login|refresh|logout)(?:[/?]|$)/.test(url ?? '')

export const API_BASE_URL = env.VITE_API_BASE_URL

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT_MS,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config: SessionRequestConfig) => {
  // Keep the original session version when replaying a request after refresh.
  config._sessionVersion ??= useAuthStore.getState().version
  if (config._sessionVersion !== useAuthStore.getState().version) {
    throw new CanceledError('Session changed')
  }

  // Block protected requests while login/logout/refresh changes the cookies.
  if (
    queryClient.isMutating({ mutationKey: ['auth'] }) > 0 &&
    !isAuthMutation(config.url)
  ) {
    throw new CanceledError('Authentication is changing')
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    const config = response.config as SessionRequestConfig

    // An old account's response must not enter the current account's cache.
    if (config._sessionVersion !== useAuthStore.getState().version) {
      throw new CanceledError('Session changed')
    }

    return response
  },
  async (error: AxiosError) => {
    const request = error.config as SessionRequestConfig | undefined

    // Recovery needs the original request; canceled work must stay canceled.
    if (!request || axios.isCancel(error)) return Promise.reject(error)

    // Ignore failures from a session that has already been replaced.
    if (request._sessionVersion !== useAuthStore.getState().version) {
      return Promise.reject(new CanceledError('Session changed'))
    }

    // Refresh only protected-request 401s. Auth endpoints must not recurse.
    if (error.response?.status !== 401 || isAuthMutation(request.url))
      return Promise.reject(error)

    // All requests, including queued ones, get at most one replay.
    if (request._retry) {
      handleSessionFailure(
        error,
        queryClient,
        useAuthStore.getState().status !== 'checking',
      )
      return Promise.reject(error)
    }

    request._retry = true

    // Concurrent 401s share one refresh for the current session version.
    if (refreshRequest?.version !== useAuthStore.getState().version) {
      const version = useAuthStore.getState().version

      const promise = AuthService.REFRESH()
        .then((data) => {
          // A pending ME reconciliation owns the commit and tab notification.
          if (useAuthStore.getState().status !== 'checking')
            applySession(data, version)
        })
        .catch((refreshError: unknown) => {
          if (
            version === useAuthStore.getState().version &&
            !axios.isCancel(refreshError)
          ) {
            handleSessionFailure(
              refreshError,
              queryClient,
              useAuthStore.getState().status !== 'checking',
            )
          }
          throw refreshError
        })
        .finally(() => {
          // An older refresh finishing must not clear a newer refresh promise.
          if (refreshRequest?.promise === promise) refreshRequest = null
        })

      refreshRequest = { version, promise }
    }

    // Replay only after cookies are refreshed; the request guard rechecks its version.
    await refreshRequest.promise
    return api(request)
  },
)

export default api
