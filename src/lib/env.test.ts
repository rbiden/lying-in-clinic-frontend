import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const keys = [
  'VITE_API_BASE_URL',
  'VITE_API_TIMEOUT_MS',
  'VITE_AUTH_STALE_TIME_MS',
  'VITE_AUTH_SYNC_TABS',
  'VITE_APP_NAME',
  'VITE_APP_SHORT_NAME',
  'VITE_BRAND_WELCOME_TITLE',
  'VITE_BRAND_LOGIN_DESCRIPTION',
  'VITE_BRAND_ACCESS_HELP',
  'VITE_BRAND_TAGLINE',
  'VITE_BRAND_DESCRIPTION',
  'VITE_BRAND_COPYRIGHT_HOLDER',
  'VITE_BRAND_WORKSPACE_LABEL',
] as const

beforeEach(() => {
  vi.resetModules()
  keys.forEach((key) => vi.stubEnv(key, undefined))
})
afterEach(() => vi.unstubAllEnvs())

it('uses documented defaults when settings are absent', async () => {
  const { env } = await import('./env')
  expect(env).toMatchObject({
    VITE_API_BASE_URL: '/api/v1',
    VITE_API_TIMEOUT_MS: 15000,
    VITE_AUTH_STALE_TIME_MS: 300000,
    VITE_AUTH_SYNC_TABS: true,
  })
})

it('keeps current branding by default and derives optional labels from the app name', async () => {
  const { brand } = await import('./brand')
  expect(brand.name).toBe('Lying In Clinic')
  expect(brand.shortName).toBe(brand.name)
  expect(brand.copyrightHolder).toBe(brand.name)
  expect(brand.tagline).toBe('A little care.\nA lasting difference.')
})

it('rebrands public labels from environment settings', async () => {
  vi.stubEnv('VITE_APP_NAME', 'Northside Care')
  vi.stubEnv('VITE_APP_SHORT_NAME', 'Northside')
  vi.stubEnv('VITE_BRAND_WELCOME_TITLE', 'Welcome to Northside')
  vi.stubEnv('VITE_BRAND_LOGIN_DESCRIPTION', 'Open your team workspace.')
  vi.stubEnv('VITE_BRAND_ACCESS_HELP', 'Contact the Northside team for access.')
  vi.stubEnv('VITE_BRAND_TAGLINE', 'Here for you.\nEvery day.')
  vi.stubEnv('VITE_BRAND_DESCRIPTION', 'Your team, connected.')
  vi.stubEnv('VITE_BRAND_COPYRIGHT_HOLDER', 'Northside Health')
  vi.stubEnv('VITE_BRAND_WORKSPACE_LABEL', 'Team Hub')
  const { brand } = await import('./brand')
  expect(brand).toEqual({
    name: 'Northside Care',
    shortName: 'Northside',
    welcomeTitle: 'Welcome to Northside',
    loginDescription: 'Open your team workspace.',
    accessHelp: 'Contact the Northside team for access.',
    tagline: 'Here for you.\nEvery day.',
    description: 'Your team, connected.',
    copyrightHolder: 'Northside Health',
    workspaceLabel: 'Team Hub',
  })
})

it('uses a replacement app name for omitted optional brand labels', async () => {
  vi.stubEnv('VITE_APP_NAME', 'Northside Care')
  const { brand } = await import('./brand')
  expect(brand.shortName).toBe('Northside Care')
  expect(brand.copyrightHolder).toBe('Northside Care')
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
  ['VITE_APP_NAME', ''],
  ['VITE_BRAND_TAGLINE', ' '],
])('reports invalid %s=%s', async (key, value) => {
  vi.stubEnv(key, value)
  await expect(import('./env')).rejects.toThrow(key)
})
