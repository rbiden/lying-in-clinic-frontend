// @vitest-environment happy-dom
import { act, useEffect } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  focusManager,
  notifyManager,
  onlineManager,
  QueryClientProvider,
} from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AxiosError, AxiosHeaders } from 'axios'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { queryClient } from '#/lib/query-client'
import { api } from '#/lib/axios'
import { env } from '#/lib/env'
import { GuestLayout } from '#/components/layouts/GuestLayout'
import { AuthLayout } from '#/components/layouts/AuthLayout'
import { RouteGuard } from '#/routes/Guard'
import { AuthSessionBoundary } from './AuthSessionBoundary'
import { AuthService } from './auth.service'
import { useAuthStore } from './auth.store'
import { useSession } from './use-session'
import {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} from './auth.query'
import {
  authKeys,
  invalidateSessionWork,
  SESSION_STORAGE_KEY,
} from './auth.session'
import type { SessionResponse } from './auth.session'

vi.mock('#/components/Sidebar', () => ({
  Sidebar: () => <aside>Sidebar</aside>,
}))
vi.mock('#/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}))

const response = (id = 'one'): SessionResponse => ({
  success: true,
  message: 'ok',
  data: { user: { id, email: `${id}@example.com` } },
})
const unauthorized = () =>
  new AxiosError('no session', undefined, undefined, undefined, {
    status: 401,
    statusText: 'Unauthorized',
    data: {},
    headers: new AxiosHeaders(),
    config: { headers: new AxiosHeaders() },
  })
let container: HTMLDivElement
let root: ReturnType<typeof createRoot>
let router: ReturnType<typeof createMemoryRouter>
const mounted = vi.fn()
const realMe = AuthService.ME
const realRefresh = AuthService.REFRESH
const originalAdapter = api.defaults.adapter

function LoginActions() {
  const login = useLoginMutation()
  const logout = useLogoutMutation()
  return (
    <>
      <button
        onClick={() =>
          login.mutate({ email: 'one@example.com', password: 'password' })
        }
      >
        Sign in
      </button>
      <button
        onClick={() => {
          login.mutate({ email: 'one@example.com', password: 'password' })
          logout.mutate()
        }}
      >
        Sign in then out
      </button>
    </>
  )
}
function Protected() {
  const session = useSession()
  const logout = useLogoutMutation()
  const refresh = useRefreshMutation()
  useEffect(() => {
    mounted()
  }, [])
  return (
    <div>
      Protected {session.user?.id}
      <button onClick={() => logout.mutate()}>Sign out</button>
      <button onClick={() => refresh.mutate()}>Refresh session</button>
    </div>
  )
}

beforeEach(() => {
  notifyManager.setScheduler(queueMicrotask)
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  focusManager.setFocused(true)
  onlineManager.setOnline(true)
  invalidateSessionWork()
  queryClient.clear()
  useAuthStore.setState(useAuthStore.getInitialState())
  window.localStorage.clear()
  mounted.mockClear()
  vi.spyOn(AuthService, 'ME').mockResolvedValue(response())
  vi.spyOn(AuthService, 'LOGIN').mockResolvedValue(response())
  vi.spyOn(AuthService, 'REFRESH').mockResolvedValue(response())
  vi.spyOn(AuthService, 'LOGOUT').mockResolvedValue({
    success: true,
    message: 'ok',
    data: { message: 'ok' },
  })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(async () => {
  api.defaults.adapter = originalAdapter
  await act(async () => root.unmount())
  router.dispose()
  queryClient.clear()
  container.remove()
  vi.restoreAllMocks()
  notifyManager.setScheduler((callback) => {
    setTimeout(callback, 0)
  })
  vi.unstubAllGlobals()
})

async function mount(path: string, guarded = false) {
  router = createMemoryRouter(
    [
      {
        path: '/login',
        element: <GuestLayout />,
        children: [{ index: true, element: <LoginActions /> }],
      },
      {
        path: '/',
        element: <AuthLayout />,
        children: [
          { index: true, element: <Protected /> },
          {
            path: 'users',
            element: guarded ? (
              <RouteGuard route={{ requireAuth: true }}>
                <Protected />
              </RouteGuard>
            ) : (
              <Protected />
            ),
          },
        ],
      },
      {
        path: '/outside',
        element: (
          <RouteGuard route={{ requireAuth: true }}>
            <Protected />
          </RouteGuard>
        ),
      },
    ],
    { initialEntries: [path] },
  )
  await act(async () => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <AuthSessionBoundary>
          <RouterProvider router={router} />
        </AuthSessionBoundary>
      </QueryClientProvider>,
    )
  })
}
async function click(text: string) {
  const button = [...container.querySelectorAll('button')].find(
    (item) => item.textContent === text,
  )
  expect(button).toBeDefined()
  await act(async () => button!.click())
}
async function remote(reason: string, id = crypto.randomUUID()) {
  const value = JSON.stringify({ id, reason })
  window.localStorage.setItem(SESSION_STORAGE_KEY, value)
  await act(async () =>
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: SESSION_STORAGE_KEY,
        newValue: value,
      }),
    ),
  )
  return value
}

it('waits on cold reload before mounting protected children, including guarded deep links', async () => {
  let resolve!: (value: SessionResponse) => void
  vi.mocked(AuthService.ME).mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      }),
  )
  await mount('/users?page=2#details', true)
  expect(container.textContent).toContain('Checking your session')
  expect(mounted).not.toHaveBeenCalled()
  await act(async () => resolve(response()))
  expect(container.textContent).toContain('Protected one')
  expect(router.state.location.pathname).toBe('/users')
  expect(AuthService.ME).toHaveBeenCalledOnce()
  expect(queryClient.getQueryData(authKeys.me())).toEqual(response())
})

it('restores an authenticated login visit and rejects unsafe return destinations', async () => {
  await mount('/login?redirect=//outside.example')
  expect(router.state.location.pathname).toBe('/')
  expect(container.textContent).toContain('Protected one')
})

it('returns to the original URL after login and centralizes explicit logout', async () => {
  vi.mocked(AuthService.ME).mockRejectedValue(unauthorized())
  await mount('/users?page=2#details')
  expect(router.state.location.pathname).toBe('/login')
  expect(
    new URLSearchParams(router.state.location.search).get('redirect'),
  ).toBe('/users?page=2#details')
  expect(mounted).not.toHaveBeenCalled()
  await click('Sign in')
  expect(router.state.location).toMatchObject({
    pathname: '/users',
    search: '?page=2',
    hash: '#details',
  })
  expect(queryClient.getQueryData(authKeys.me())).toEqual(response())
  await click('Refresh session')
  expect(queryClient.getQueryData(authKeys.me())).toEqual(response())
  await click('Sign out')
  expect(router.state.location).toMatchObject({
    pathname: '/login',
    search: '',
  })
  expect(queryClient.getQueryData(authKeys.me())).toBeNull()
})

it('offers Retry on temporary verification failures while retaining the known user', async () => {
  await mount('/users')
  vi.mocked(AuthService.ME).mockRejectedValueOnce(new Error('offline'))
  queryClient.invalidateQueries({
    queryKey: authKeys.me(),
    refetchType: 'none',
  })
  await act(async () => {
    focusManager.setFocused(false)
    focusManager.setFocused(true)
  })
  expect(container.textContent).toContain('Unable to check your session')
  expect(useAuthStore.getState().user?.id).toBe('one')
  expect(router.state.location.pathname).toBe('/users')
  await click('Retry')
  expect(container.textContent).toContain('Protected one')
})

it('handles a login event while on the guest layout without rebroadcasting it', async () => {
  vi.mocked(AuthService.ME).mockRejectedValueOnce(unauthorized())
  await mount('/login?redirect=%2Fusers')
  expect(container.textContent).toContain('Sign in')
  const marker = await remote('login')
  expect(router.state.location.pathname).toBe('/users')
  expect(container.textContent).toContain('Protected one')
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBe(marker)
})

it('applies cross-tab logout without a return URL or echo event', async () => {
  await mount('/users')
  vi.mocked(AuthService.ME).mockRejectedValue(unauthorized())
  const marker = await remote('logout')
  expect(router.state.location).toMatchObject({
    pathname: '/login',
    search: '',
  })
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBe(marker)
  expect(useAuthStore.getState().user).toBeNull()
})

it('clears former account data and remounts the page on account change', async () => {
  await mount('/users')
  queryClient.setQueryData(['private'], 'old account')
  vi.mocked(AuthService.ME).mockResolvedValue(response('two'))
  const marker = await remote('changed')
  expect(container.textContent).toContain('Protected two')
  expect(queryClient.getQueryData(['private'])).toBeUndefined()
  expect(router.state.location.pathname).toBe('/users')
  expect(mounted).toHaveBeenCalledTimes(2)
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBe(marker)
})

it('ignores stale storage notifications and coalesces simultaneous focus/reconnect checks', async () => {
  await mount('/users')
  vi.mocked(AuthService.ME).mockClear()
  window.localStorage.setItem(
    SESSION_STORAGE_KEY,
    JSON.stringify({ id: 'latest', reason: 'login' }),
  )
  await act(async () =>
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: SESSION_STORAGE_KEY,
        newValue: JSON.stringify({ id: 'old', reason: 'logout' }),
      }),
    ),
  )
  expect(AuthService.ME).not.toHaveBeenCalled()
  await queryClient.invalidateQueries({
    queryKey: authKeys.me(),
    refetchType: 'none',
  })
  await act(async () => {
    focusManager.setFocused(false)
    onlineManager.setOnline(false)
    focusManager.setFocused(true)
    onlineManager.setOnline(true)
  })
  expect(AuthService.ME).toHaveBeenCalledOnce()
})

it('does not restore an old user when an obsolete ME resolves after cross-tab logout', async () => {
  let resolveOld!: (value: SessionResponse) => void
  vi.mocked(AuthService.ME)
    .mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolveOld = done
        }),
    )
    .mockRejectedValue(unauthorized())
  await mount('/users')
  await remote('logout')
  await act(async () => resolveOld(response('old')))
  expect(router.state.location).toMatchObject({
    pathname: '/login',
    search: '',
  })
  expect(useAuthStore.getState().user).toBeNull()
  expect(mounted).not.toHaveBeenCalled()
})

it('protects requireAuth routes outside AuthLayout while allowing initialization to finish', async () => {
  vi.mocked(AuthService.ME).mockRejectedValue(unauthorized())
  await mount('/outside')
  expect(router.state.location.pathname).toBe('/login')
  expect(
    new URLSearchParams(router.state.location.search).get('redirect'),
  ).toBe('/outside')
  expect(mounted).not.toHaveBeenCalled()
})

it('keeps queued auth mutations running when login clears old account caches', async () => {
  let resolveLogin!: (value: SessionResponse) => void
  vi.mocked(AuthService.ME).mockRejectedValue(unauthorized())
  vi.mocked(AuthService.LOGIN).mockImplementation(
    () =>
      new Promise((done) => {
        resolveLogin = done
      }),
  )
  await mount('/login')
  await click('Sign in then out')
  expect(AuthService.LOGIN).toHaveBeenCalledOnce()
  expect(AuthService.LOGOUT).not.toHaveBeenCalled()
  await act(async () => resolveLogin(response()))
  expect(AuthService.LOGOUT).toHaveBeenCalledOnce()
  expect(useAuthStore.getState().user).toBeNull()
  expect(router.state.location).toMatchObject({
    pathname: '/login',
    search: '',
  })
})

it('preserves a new return URL when visiting a protected page after explicit logout', async () => {
  await mount('/users')
  await click('Sign out')
  await act(async () => router.navigate('/users?page=3'))
  expect(
    new URLSearchParams(router.state.location.search).get('redirect'),
  ).toBe('/users?page=3')
})

it('removes browser listeners on unmount', async () => {
  await mount('/users')
  await act(async () => root.unmount())
  root = createRoot(container)
  vi.mocked(AuthService.ME).mockClear()
  window.dispatchEvent(new Event('focus'))
  window.dispatchEvent(new Event('online'))
  document.dispatchEvent(new Event('visibilitychange'))
  expect(AuthService.ME).not.toHaveBeenCalled()
})

it('keeps protected children blocked until Retry verifies the retained user', async () => {
  await mount('/users')
  vi.mocked(AuthService.ME).mockRejectedValueOnce(new Error('offline'))
  await act(async () => {
    void queryClient.invalidateQueries({ queryKey: authKeys.me() })
  })
  expect(container.textContent).toContain('Unable to check your session')
  let resolve!: (value: SessionResponse) => void
  vi.mocked(AuthService.ME).mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      }),
  )
  await click('Retry')
  expect(container.textContent).toContain('Checking your session')
  expect(container.textContent).not.toContain('Protected one')
  expect(useAuthStore.getState().user?.id).toBe('one')
  await act(async () => resolve(response()))
  expect(container.textContent).toContain('Protected one')
})

it('reuses fresh sessions on focus but always verifies received tab changes', async () => {
  await mount('/users')
  vi.mocked(AuthService.ME).mockClear()
  await act(async () => {
    focusManager.setFocused(false)
    focusManager.setFocused(true)
  })
  expect(AuthService.ME).not.toHaveBeenCalled()
  await remote('changed')
  expect(AuthService.ME).toHaveBeenCalledOnce()
})

it('forces startup verification even when the query cache is fresh', async () => {
  queryClient.setQueryData(authKeys.me(), response('cached'))
  let resolve!: (value: SessionResponse) => void
  vi.mocked(AuthService.ME).mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      }),
  )
  await mount('/users')
  expect(mounted).not.toHaveBeenCalled()
  expect(AuthService.ME).toHaveBeenCalledOnce()
  await act(async () => resolve(response('current')))
  expect(container.textContent).toContain('Protected current')
})

it('defers tab verification during login and applies the current cookie identity after it settles', async () => {
  vi.mocked(AuthService.ME)
    .mockRejectedValueOnce(unauthorized())
    .mockResolvedValue(response('current'))
  let resolveLogin!: (value: SessionResponse) => void
  vi.mocked(AuthService.LOGIN).mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolveLogin = done
      }),
  )
  await mount('/login')
  await click('Sign in')
  const marker = await remote('changed')
  expect(AuthService.ME).toHaveBeenCalledOnce()
  await act(async () => resolveLogin(response('obsolete')))
  expect(useAuthStore.getState().user?.id).toBe('current')
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBe(marker)
})

it('keeps the current user and does not publish success when logout fails', async () => {
  await mount('/users')
  vi.mocked(AuthService.LOGOUT).mockRejectedValueOnce(new Error('offline'))
  await click('Sign out')
  expect(useAuthStore.getState().user?.id).toBe('one')
  expect(router.state.location.pathname).toBe('/users')
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
})

it('ignores storage changes when explicit tab synchronization is disabled', async () => {
  const enabled = env.VITE_AUTH_SYNC_TABS
  env.VITE_AUTH_SYNC_TABS = false
  try {
    await mount('/users')
    vi.mocked(AuthService.ME).mockClear()
    await remote('logout')
    expect(AuthService.ME).not.toHaveBeenCalled()
    expect(useAuthStore.getState().user?.id).toBe('one')
  } finally {
    env.VITE_AUTH_SYNC_TABS = enabled
  }
})

it('keeps the Retry screen after Axios refresh fails during a background session check', async () => {
  await mount('/users')
  vi.mocked(AuthService.ME).mockImplementation(realMe)
  vi.mocked(AuthService.REFRESH).mockImplementation(realRefresh)
  let offline = true
  api.defaults.adapter = async (config) => {
    const reply = {
      config,
      data: response(),
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
    }
    if (offline) {
      throw new AxiosError('server unavailable', undefined, config, undefined, {
        ...reply,
        status: config.url?.endsWith('/refresh') ? 500 : 401,
      })
    }
    return reply
  }
  await act(async () => {
    await queryClient.invalidateQueries({ queryKey: authKeys.me() })
  })
  expect(container.textContent).toContain('Unable to check your session')
  expect(useAuthStore.getState().user?.id).toBe('one')
  expect(router.state.location.pathname).toBe('/users')
  offline = false
  await click('Retry')
  expect(container.textContent).toContain('Protected one')
})
