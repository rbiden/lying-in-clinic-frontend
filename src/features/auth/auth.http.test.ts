// @vitest-environment happy-dom
import { QueryObserver } from '@tanstack/react-query'
import { AxiosError, AxiosHeaders, isCancel } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { api, CSRF_URL, retrySessionReconciliation } from '#/lib/axios'
import { queryClient } from '#/lib/query-client'
import { AuthService } from './auth.service'
import { SessionResponseSchema } from './auth.schema'
import { useAuthStore } from './auth.store'
import {
  applySession,
  authKeys,
  endSession,
  handleSessionFailure,
  invalidateSessionWork,
  SESSION_STORAGE_KEY,
} from './auth.session'

const originalAdapter = api.defaults.adapter
const user = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
  active: true,
}
const session = { data: user }
let unsubscribe: (() => void) | undefined
const ok = (config: InternalAxiosRequestConfig, data: unknown = session) => ({
  config,
  data,
  status: 200,
  statusText: 'OK',
  headers: new AxiosHeaders(),
})
const fail = (config: InternalAxiosRequestConfig, status: number): never => {
  throw new AxiosError('request failed', undefined, config, undefined, {
    ...ok(config),
    status,
    statusText: 'error',
  })
}
const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

beforeEach(() => {
  invalidateSessionWork()
  queryClient.clear()
  useAuthStore.setState({
    ...useAuthStore.getInitialState(),
    version: useAuthStore.getState().version,
  })
  window.localStorage.clear()
})
afterEach(() => {
  unsubscribe?.()
  unsubscribe = undefined
  api.defaults.adapter = originalAdapter
  queryClient.clear()
})

function observeMe() {
  const observer = new QueryObserver(queryClient, {
    queryKey: authKeys.me(),
    queryFn: () => AuthService.ME(),
    retry: false,
    staleTime: Infinity,
  })
  queryClient.setQueryData(authKeys.me(), session)
  unsubscribe = observer.subscribe((result) => {
    if (result.isFetching) return
    if (result.isError) handleSessionFailure(result.error)
    else if (result.data)
      applySession(result.data, useAuthStore.getState().version)
  })
}

it('uses exact Sanctum endpoints, credentials and XSRF transport with a void logout', async () => {
  const paths: string[] = []
  api.defaults.adapter = async (config) => {
    paths.push(config.url!)
    expect(config.withCredentials).toBe(true)
    expect(config.withXSRFToken).toBe(true)
    expect(config.headers.get('Accept')).toBe('application/json')
    if (config.url === '/logout')
      return { ...ok(config, undefined), status: 204 }
    return ok(config)
  }
  expect(
    await AuthService.LOGIN({ email: user.email, password: 'example' }),
  ).toEqual(session)
  expect(await AuthService.ME()).toEqual(session)
  expect(await AuthService.LOGOUT()).toBeUndefined()
  expect(paths).toEqual([CSRF_URL, '/login', '/me', CSRF_URL, '/logout'])
})

it.each([
  { data: { ...user, id: '1' } },
  { data: { ...user, id: 1.5 } },
  { data: { ...user, id: 0 } },
  { data: { ...user, role: 'owner' } },
  { data: { ...user, active: undefined } },
  { data: { ...user, name: undefined } },
  { data: { user } },
  user,
  { user },
])(
  'rejects malformed or guessed auth payloads before session application: %j',
  async (payload) => {
    api.defaults.adapter = async (config) => ok(config, payload)
    await expect(AuthService.ME()).rejects.toThrow()
    expect(useAuthStore.getState().user).toBeNull()
  },
)

it('strips forward-compatible extra fields without coercing the actual user', () => {
  expect(
    SessionResponseSchema.parse({
      data: { ...user, extra: true },
      extra: true,
    }),
  ).toEqual(session)
})

it('expires ordinary protected 401s without a refresh request or replay', async () => {
  useAuthStore.getState().setAuth(user)
  queryClient.setQueryData(['private'], 'account data')
  const paths: string[] = []
  api.defaults.adapter = async (config) => {
    paths.push(config.url!)
    return fail(config, 401)
  }
  await expect(api.get('/private')).rejects.toBeInstanceOf(AxiosError)
  expect(paths).toEqual(['/private'])
  expect(useAuthStore.getState()).toMatchObject({
    user: null,
    status: 'unauthenticated',
    logoutCause: 'expired',
  })
  expect(queryClient.getQueryData(['private'])).toBeUndefined()
})

it.each([403, 409, 422, 429, 500])(
  'retains the session for ordinary status %s',
  async (status) => {
    useAuthStore.getState().setAuth(user)
    api.defaults.adapter = async (config) => fail(config, status)
    await expect(api.post('/private', {})).rejects.toBeInstanceOf(AxiosError)
    expect(useAuthStore.getState().status).toBe('authenticated')
  },
)

it('leaves ME failure ownership to the boundary and does not broadcast remote expiration', async () => {
  useAuthStore.getState().setAuth(user)
  api.defaults.adapter = async (config) => fail(config, 401)
  await expect(AuthService.ME()).rejects.toBeInstanceOf(AxiosError)
  expect(useAuthStore.getState().status).toBe('authenticated')
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
})

it.each([419, 422])(
  'does not recover or replay a failed login with status %s',
  async (status) => {
    const paths: string[] = []
    api.defaults.adapter = async (config) => {
      paths.push(config.url!)
      return config.url === CSRF_URL ? ok(config) : fail(config, status)
    }
    await expect(
      AuthService.LOGIN({ email: user.email, password: 'bad' }),
    ).rejects.toBeInstanceOf(AxiosError)
    expect(paths).toEqual([CSRF_URL, '/login'])
  },
)

it('accepts logout 401 as local logout completion but preserves other failures', async () => {
  api.defaults.adapter = async (config) =>
    config.url === CSRF_URL ? ok(config) : fail(config, 401)
  await expect(AuthService.LOGOUT()).resolves.toBeUndefined()
  api.defaults.adapter = async (config) =>
    config.url === CSRF_URL ? ok(config) : fail(config, 419)
  await expect(AuthService.LOGOUT()).rejects.toBeInstanceOf(AxiosError)
})

it('coalesces simultaneous protected 419s into one CSRF and ME recovery without replay', async () => {
  useAuthStore.getState().setAuth(user)
  observeMe()
  const paths: string[] = []
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  api.defaults.adapter = async (config) => {
    paths.push(config.url!)
    if (config.url === CSRF_URL) {
      await gate
      return ok(config)
    }
    if (config.url === '/me') return ok(config)
    return fail(config, 419)
  }
  await Promise.allSettled([api.post('/first'), api.post('/second')])
  expect(useAuthStore.getState().status).toBe('checking')
  release()
  await vi.waitFor(() => expect(paths).toContain('/me'))
  await vi.waitFor(() =>
    expect(useAuthStore.getState().status).toBe('authenticated'),
  )
  expect(paths.filter((path) => path === CSRF_URL)).toHaveLength(1)
  expect(paths.filter((path) => path === '/first')).toHaveLength(1)
  expect(paths.filter((path) => path === '/second')).toHaveLength(1)
})

it.each([401, 500])(
  'reconciles ME status %s after a protected CSRF mismatch',
  async (status) => {
    useAuthStore.getState().setAuth(user)
    observeMe()
    api.defaults.adapter = async (config) => {
      if (config.url === CSRF_URL) return ok(config)
      return fail(config, config.url === '/me' ? status : 419)
    }
    await expect(api.post('/private')).rejects.toBeInstanceOf(AxiosError)
    await vi.waitFor(() =>
      expect(useAuthStore.getState().status).toBe(
        status === 401 ? 'unauthenticated' : 'error',
      ),
    )
    expect(useAuthStore.getState().user).toEqual(status === 401 ? null : user)
  },
)

it('allows explicit Retry to reacquire failed CSRF before verifying ME', async () => {
  useAuthStore.getState().setAuth(user)
  observeMe()
  let csrfFails = true
  const paths: string[] = []
  api.defaults.adapter = async (config) => {
    paths.push(config.url!)
    if (config.url === CSRF_URL)
      return csrfFails ? fail(config, 500) : ok(config)
    if (config.url === '/me') return ok(config)
    return fail(config, 419)
  }
  await expect(api.post('/private')).rejects.toBeInstanceOf(AxiosError)
  await vi.waitFor(() => expect(useAuthStore.getState().status).toBe('error'))
  expect(paths).not.toContain('/me')
  csrfFails = false
  await retrySessionReconciliation()
  await vi.waitFor(() =>
    expect(useAuthStore.getState().status).toBe('authenticated'),
  )
  expect(paths).toEqual(['/private', CSRF_URL, CSRF_URL, '/me'])
})

it('keeps failed CSRF recovery visible when an earlier focus ME finishes later', async () => {
  useAuthStore.getState().setAuth(user)
  observeMe()
  let finishMe!: () => void
  const gate = new Promise<void>((resolve) => {
    finishMe = resolve
  })
  let csrfFails = true
  let firstMe = true
  api.defaults.adapter = async (config) => {
    if (config.url === CSRF_URL)
      return csrfFails ? fail(config, 500) : ok(config)
    if (config.url === '/me') {
      if (firstMe) {
        firstMe = false
        await gate
      }
      return ok(config)
    }
    return fail(config, 419)
  }
  const focusMe = queryClient.refetchQueries({
    queryKey: authKeys.me(),
    exact: true,
  })
  await tick()
  await expect(api.post('/private')).rejects.toBeInstanceOf(AxiosError)
  await vi.waitFor(() => expect(useAuthStore.getState().status).toBe('error'))
  finishMe()
  await focusMe
  await tick()
  expect(useAuthStore.getState().status).toBe('error')
  await expect(AuthService.ME()).rejects.toSatisfy(isCancel)
  csrfFails = false
  await retrySessionReconciliation()
  await vi.waitFor(() =>
    expect(useAuthStore.getState().status).toBe('authenticated'),
  )
})

it('cancels an obsolete CSRF bootstrap before its login mutation', async () => {
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  const paths: string[] = []
  api.defaults.adapter = async (config) => {
    paths.push(config.url!)
    await gate
    return ok(config)
  }
  const pending = AuthService.LOGIN({
    email: user.email,
    password: 'example',
  }).catch((error: unknown) => error)
  await tick()
  endSession('logout')
  release()
  expect(isCancel(await pending)).toBe(true)
  expect(paths).toEqual([CSRF_URL])
})

it('cancels obsolete protected responses after logout before cache application', async () => {
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  api.defaults.adapter = async (config) => {
    await gate
    return ok(config)
  }
  const pending = api.get('/private').catch((error: unknown) => error)
  await tick()
  endSession('logout')
  release()
  expect(isCancel(await pending)).toBe(true)
})
