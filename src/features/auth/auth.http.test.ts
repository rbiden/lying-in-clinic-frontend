// @vitest-environment happy-dom
import { AxiosError, AxiosHeaders, isCancel } from 'axios'
import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { api } from '#/lib/axios'
import { queryClient } from '#/lib/query-client'
import { AuthService } from './auth.service'
import { useAuthStore } from './auth.store'
import {
  authKeys,
  endSession,
  invalidateSessionWork,
  SESSION_STORAGE_KEY,
} from './auth.session'

const originalAdapter = api.defaults.adapter
const user = { id: 'one', email: 'one@example.com' }
const session = { success: true, message: 'ok', data: { user } }

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

beforeEach(() => {
  invalidateSessionWork()
  queryClient.clear()
  useAuthStore.setState(useAuthStore.getInitialState())
  window.localStorage.clear()
})

afterEach(() => {
  api.defaults.adapter = originalAdapter
  queryClient.clear()
})

it('refreshes an expired access cookie and retries ME using credentials', async () => {
  let refreshed = false
  let requests = 0
  api.defaults.adapter = async (config) => {
    expect(config.withCredentials).toBe(true)
    expect(config.timeout).toBe(15000)
    if (config.url?.endsWith('/refresh')) {
      refreshed = true
      return ok(config)
    }
    requests += 1
    if (!refreshed) fail(config, 401)
    return ok(config)
  }
  expect(await AuthService.ME()).toEqual(session)
  expect(requests).toBe(2)
})

it('shares one refresh across concurrent 401s and caches the response envelope', async () => {
  useAuthStore.getState().setAuth(user)
  let resolveRefresh!: () => void
  const gate = new Promise<void>((done) => {
    resolveRefresh = done
  })
  let refreshes = 0
  const counts = new Map<string, number>()
  api.defaults.adapter = async (config) => {
    if (config.url?.endsWith('/refresh')) {
      refreshes += 1
      await gate
      return ok(config)
    }
    const key = config.url!
    counts.set(key, (counts.get(key) ?? 0) + 1)
    if (counts.get(key) === 1) fail(config, 401)
    return ok(config)
  }
  const requests = [api.get('/first'), api.get('/second')]
  await new Promise<void>((done) => setTimeout(done, 0))
  resolveRefresh()
  await Promise.all(requests)
  expect(refreshes).toBe(1)
  expect([...counts.values()]).toEqual([2, 2])
  expect(queryClient.getQueryData(authKeys.me())).toEqual(session)
})

it('bounds every queued retry when refreshed requests still return 401', async () => {
  useAuthStore.getState().setAuth(user)
  let refreshes = 0
  const counts = new Map<string, number>()
  api.defaults.adapter = async (config) => {
    if (config.url?.endsWith('/refresh')) {
      refreshes += 1
      return ok(config)
    }
    counts.set(config.url!, (counts.get(config.url!) ?? 0) + 1)
    return fail(config, 401)
  }
  const results = await Promise.allSettled([
    api.get('/first'),
    api.get('/second'),
  ])
  expect(results.every((result) => result.status === 'rejected')).toBe(true)
  expect(refreshes).toBe(1)
  expect([...counts.values()].every((count) => count <= 2)).toBe(true)
  expect(useAuthStore.getState().status).toBe('unauthenticated')
})

it.each([0, 429, 500])(
  'retains the user when refresh fails temporarily with status %s',
  async (status) => {
    useAuthStore.getState().setAuth(user)
    api.defaults.adapter = async (config) => {
      if (!config.url?.endsWith('/refresh')) return fail(config, 401)
      if (status === 0) throw new AxiosError('offline', 'ERR_NETWORK', config)
      return fail(config, status)
    }
    await expect(api.get('/private')).rejects.toBeInstanceOf(AxiosError)
    expect(useAuthStore.getState()).toMatchObject({
      status: 'error',
      user,
      isAuthenticated: true,
    })
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  },
)

it('rejects the session on a rejected refresh, but never on an ordinary 403', async () => {
  useAuthStore.getState().setAuth(user)
  api.defaults.adapter = async (config) => fail(config, 403)
  await expect(api.get('/private')).rejects.toBeInstanceOf(AxiosError)
  expect(useAuthStore.getState().status).toBe('authenticated')
  api.defaults.adapter = async (config) => fail(config, 401)
  await expect(api.get('/private')).rejects.toBeInstanceOf(AxiosError)
  expect(useAuthStore.getState()).toMatchObject({
    status: 'unauthenticated',
    user: null,
  })
})

it('does not apply remote refresh rejection or publish a logout echo', async () => {
  useAuthStore.getState().setAuth(user)
  invalidateSessionWork(queryClient)
  useAuthStore.setState({ status: 'checking', logoutCause: 'logout' })
  api.defaults.adapter = async (config) => fail(config, 401)
  await expect(AuthService.ME()).rejects.toBeInstanceOf(AxiosError)
  expect(useAuthStore.getState().logoutCause).toBe('logout')
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
})

it('cancels a response arriving after logout before it can populate a query cache', async () => {
  let resolve!: () => void
  const gate = new Promise<void>((done) => {
    resolve = done
  })
  api.defaults.adapter = (async (config) => {
    await gate
    return ok(config, ['private'])
  }) satisfies AxiosAdapter
  const request = api.get('/private').catch((error: unknown) => error)
  await new Promise<void>((done) => setTimeout(done, 0))
  endSession('logout')
  resolve()
  expect(isCancel(await request)).toBe(true)
  expect(useAuthStore.getState().user).toBeNull()
})

it('starts a new refresh after a session change instead of joining an obsolete refresh', async () => {
  useAuthStore.getState().setAuth(user)
  let finishOldRefresh!: () => void
  const gate = new Promise<void>((done) => {
    finishOldRefresh = done
  })
  let refreshes = 0
  const attempts = new Map<string, number>()
  api.defaults.adapter = async (config) => {
    if (config.url?.endsWith('/refresh')) {
      refreshes += 1
      if (refreshes === 1) await gate
      return ok(config)
    }
    attempts.set(config.url!, (attempts.get(config.url!) ?? 0) + 1)
    if (attempts.get(config.url!) === 1) fail(config, 401)
    return ok(config)
  }
  const old = api.get('/old').catch((error: unknown) => error)
  await new Promise<void>((done) => setTimeout(done, 0))
  endSession('logout')
  useAuthStore.setState({ status: 'checking' })
  const fresh = await api.get('/new')
  finishOldRefresh()
  expect(fresh.status).toBe(200)
  expect(isCancel(await old)).toBe(true)
  expect(refreshes).toBe(2)
})
