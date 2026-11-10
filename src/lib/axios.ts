import axios, { CanceledError } from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { authKeys, handleSessionFailure } from '#/features/auth/auth.session'
import { useAuthStore } from '#/features/auth/auth.store'
import { queryClient } from './query-client'
import { env } from './env'

interface SessionRequestConfig extends InternalAxiosRequestConfig {
  _sessionVersion?: number
}

const endpoint = (url?: string) =>
  (url ?? '').split(/[?#]/)[0].replace(/\/$/, '')
const isCsrf = (url?: string) => endpoint(url).endsWith('/sanctum/csrf-cookie')
const isMe = (url?: string) => endpoint(url).endsWith('/me')
const isAuthTransport = (url?: string) =>
  isCsrf(url) || /\/(login|logout)$/.test(endpoint(url))

export const API_BASE_URL = env.VITE_API_BASE_URL
export const CSRF_URL = new URL(
  '/sanctum/csrf-cookie',
  new URL(
    API_BASE_URL,
    typeof window === 'undefined' ? 'http://localhost' : window.location.origin,
  ),
).href

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: env.VITE_API_TIMEOUT_MS,
  withCredentials: true,
  withXSRFToken: true,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

let recovery: { version: number; promise: Promise<void> } | null = null
let csrfRecoveryVersion: number | null = null

export async function initializeCsrf(
  version = useAuthStore.getState().version,
) {
  if (version !== useAuthStore.getState().version)
    throw new CanceledError('Session changed')
  await api.get(CSRF_URL)
  if (version !== useAuthStore.getState().version)
    throw new CanceledError('Session changed')
}

export function retrySessionReconciliation(): Promise<void> {
  const version = useAuthStore.getState().version
  if (recovery?.version === version) return recovery.promise
  useAuthStore.setState({ status: 'checking' })
  const promise = (async () => {
    try {
      if (csrfRecoveryVersion === version) {
        await initializeCsrf(version)
        csrfRecoveryVersion = null
      }
      if (version !== useAuthStore.getState().version) return
      await queryClient.resetQueries({ queryKey: authKeys.me(), exact: true })
    } catch (error) {
      if (version === useAuthStore.getState().version && !axios.isCancel(error))
        handleSessionFailure(error, queryClient)
      throw error
    }
  })().finally(() => {
    if (recovery?.promise === promise) recovery = null
  })
  recovery = { version, promise }
  return promise
}

api.interceptors.request.use((config: SessionRequestConfig) => {
  config._sessionVersion ??= useAuthStore.getState().version
  if (config._sessionVersion !== useAuthStore.getState().version)
    throw new CanceledError('Session changed')
  if (
    !isAuthTransport(config.url) &&
    (queryClient.isMutating({ mutationKey: authKeys.all }) > 0 ||
      csrfRecoveryVersion === config._sessionVersion ||
      (!isMe(config.url) && recovery?.version === config._sessionVersion))
  )
    throw new CanceledError('Authentication is changing')
  return config
})

api.interceptors.response.use(
  (response) => {
    const config = response.config as SessionRequestConfig
    if (config._sessionVersion !== useAuthStore.getState().version)
      throw new CanceledError('Session changed')
    if (isMe(config.url) && csrfRecoveryVersion === config._sessionVersion)
      throw new CanceledError(
        'CSRF recovery must finish before session verification',
      )
    return response
  },
  async (error: AxiosError) => {
    const request = error.config as SessionRequestConfig | undefined
    if (!request || axios.isCancel(error)) throw error
    if (request._sessionVersion !== useAuthStore.getState().version)
      throw new CanceledError('Session changed')
    if (isMe(request.url) && csrfRecoveryVersion === request._sessionVersion)
      throw new CanceledError(
        'CSRF recovery must finish before session verification',
      )
    if (isAuthTransport(request.url) || isMe(request.url)) throw error
    if (error.response?.status === 401) {
      handleSessionFailure(error, queryClient, true)
    } else if (
      error.response?.status === 419 &&
      !['get', 'head', 'options'].includes(request.method ?? 'get')
    ) {
      if (recovery?.version !== request._sessionVersion)
        csrfRecoveryVersion = request._sessionVersion!
      // Recovery reconciles the session; the failed action is never replayed.
      void retrySessionReconciliation().catch(() => {})
    }
    throw error
  },
)

export default api
