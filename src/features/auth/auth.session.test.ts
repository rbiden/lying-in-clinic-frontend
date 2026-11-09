// @vitest-environment happy-dom
import { QueryClient } from '@tanstack/react-query'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useAuthStore } from './auth.store'
import { env } from '#/lib/env'
import {
  applySession,
  authKeys,
  endSession,
  handleSessionFailure,
  invalidateSessionWork,
  publishSessionChange,
  readSessionChange,
  SESSION_STORAGE_KEY,
} from './auth.session'
import type { SessionResponse } from './auth.session'
import { getSessionLoginUrl, getSessionReturnUrl } from './auth.redirect'

const client = new QueryClient()
const response = (id: string): SessionResponse => ({
  success: true,
  message: 'ok',
  data: { user: { id, email: `${id}@example.com` } },
})

beforeEach(() => {
  invalidateSessionWork(client)
  client.clear()
  useAuthStore.setState(useAuthStore.getInitialState())
  window.localStorage.clear()
})
afterEach(() => {
  client.clear()
  vi.restoreAllMocks()
})

it('stores one ME response shape and clears the previous account cache on identity change', () => {
  applySession(response('one'), useAuthStore.getState().version, client)
  client.setQueryData(['private'], ['one-only'])
  applySession(response('two'), useAuthStore.getState().version, client)
  expect(client.getQueryData(['private'])).toBeUndefined()
  expect(client.getQueryData(authKeys.me())).toEqual(response('two'))
  expect(useAuthStore.getState()).toMatchObject({
    status: 'authenticated',
    user: { id: 'two' },
  })
})

it('rejects stale session commits after logout and retains known users on temporary failures', () => {
  applySession(response('one'), useAuthStore.getState().version, client)
  handleSessionFailure(new Error('offline'), client)
  expect(useAuthStore.getState()).toMatchObject({
    status: 'error',
    isAuthenticated: true,
    user: { id: 'one' },
  })
  const obsoleteRevision = useAuthStore.getState().version
  endSession('logout', client)
  applySession(response('one'), obsoleteRevision, client)
  expect(useAuthStore.getState()).toMatchObject({
    status: 'unauthenticated',
    user: null,
    logoutCause: 'logout',
  })
  expect(client.getQueryData(authKeys.me())).toBeNull()
})

it('sends only a unique change ID and reason and never echoes remote logout', () => {
  publishSessionChange('login')
  const first = window.localStorage.getItem(SESSION_STORAGE_KEY)!
  expect(Object.keys(JSON.parse(first)).sort()).toEqual(['id', 'reason'])
  publishSessionChange('login')
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).not.toBe(first)
  useAuthStore.getState().setAuth(response('one').data.user)
  invalidateSessionWork(client)
  const before = window.localStorage.getItem(SESSION_STORAGE_KEY)
  endSession('logout', client, false)
  expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBe(before)
  expect(readSessionChange(first)).toBe('login')
  expect(readSessionChange('{bad')).toBeNull()
  expect(readSessionChange('{"reason":"logout"}')).toBeNull()
})

it.each([
  null,
  'https://outside.example',
  '//outside.example',
  '/\\outside.example',
  '/%2foutside.example',
  '/%5coutside.example',
  '/login',
  '/LOGIN?redirect=/users',
  '/%6cogin',
  '/users/../login',
  '/%00users',
  '/bad%zz',
])('rejects unsafe or looping return destination %s', (value) => {
  expect(getSessionReturnUrl(value)).toBe('/')
})

it('preserves internal search and hash and distinguishes explicit logout', () => {
  const target = '/users?name=John%20Doe#details'
  expect(getSessionReturnUrl(target)).toBe(target)
  const location = { pathname: '/users', search: '?page=2', hash: '#details' }
  expect(getSessionLoginUrl(location, 'expired')).toBe(
    '/login?redirect=%2Fusers%3Fpage%3D2%23details',
  )
  expect(getSessionLoginUrl(location, 'logout')).toBe('/login')
})

it('tolerates unavailable browser storage', () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('disabled')
  })
  expect(() => publishSessionChange('logout')).not.toThrow()
})

it('does not publish when tab synchronization is disabled', () => {
  const enabled = env.VITE_AUTH_SYNC_TABS
  env.VITE_AUTH_SYNC_TABS = false
  try {
    publishSessionChange('login')
    expect(window.localStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  } finally {
    env.VITE_AUTH_SYNC_TABS = enabled
  }
})
