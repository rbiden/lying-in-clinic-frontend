import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const keys = [
  'VITE_API_BASE_URL',
  'VITE_API_TIMEOUT_MS',
  'VITE_AUTH_STALE_TIME_MS',
  'VITE_AUTH_SYNC_TABS',
] as const

beforeEach(() => {
  vi.resetModules()
  keys.forEach((key) => vi.stubEnv(key, undefined))
})
afterEach(() => vi.unstubAllEnvs())

it('uses documented defaults when settings are absent', async () => {
  const { env } = await import('./env')
  expect(env).toEqual({
    VITE_API_BASE_URL: '/api/v1',
    VITE_API_TIMEOUT_MS: 15000,
    VITE_AUTH_STALE_TIME_MS: 300000,
    VITE_AUTH_SYNC_TABS: true,
  })
})

it('parses numbers and false explicitly, including zero freshness', async () => {
  vi.stubEnv('VITE_API_BASE_URL', 'https://inventory.example/api')
  vi.stubEnv('VITE_API_TIMEOUT_MS', '20000')
  vi.stubEnv('VITE_AUTH_STALE_TIME_MS', '0')
  vi.stubEnv('VITE_AUTH_SYNC_TABS', 'false')
  const { env } = await import('./env')
  expect(env).toMatchObject({
    VITE_API_BASE_URL: 'https://inventory.example/api',
    VITE_API_TIMEOUT_MS: 20000,
    VITE_AUTH_STALE_TIME_MS: 0,
    VITE_AUTH_SYNC_TABS: false,
  })
})

it.each([
  ['VITE_API_TIMEOUT_MS', '0'],
  ['VITE_API_TIMEOUT_MS', 'NaN'],
  ['VITE_API_TIMEOUT_MS', 'Infinity'],
  ['VITE_AUTH_STALE_TIME_MS', '-1'],
  ['VITE_AUTH_STALE_TIME_MS', 'invalid'],
  ['VITE_AUTH_STALE_TIME_MS', ' '],
  ['VITE_AUTH_SYNC_TABS', 'yes'],
  ['VITE_API_BASE_URL', ''],
])('reports invalid %s=%s', async (key, value) => {
  vi.stubEnv(key, value)
  await expect(import('./env')).rejects.toThrow(key)
})
