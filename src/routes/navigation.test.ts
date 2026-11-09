import { describe, expect, expectTypeOf, it } from 'vitest'
import { buildRoutePath } from './navigation'
import type {
  AppRoutePath,
  RouteParams,
  RoutePaths,
  TypedNavigate,
} from './navigation'
import { defineRoutes } from './define-routes'

describe('typed route navigation', () => {
  it('infers actual application paths and dynamic parameters', () => {
    expectTypeOf<
      '/' | '/login' | '/pos' | '/users' | '/users/:id'
    >().toExtend<AppRoutePath>()
    expectTypeOf<string>().not.toExtend<AppRoutePath>()
    expectTypeOf<RouteParams<'/users/:id'>>().toEqualTypeOf<{
      id: string | number
    }>()
    expectTypeOf<RouteParams<'/reports/:date?'>>().toEqualTypeOf<{
      date?: string | number
    }>()
    expectTypeOf<RouteParams<'/files/*'>>().toEqualTypeOf<{ '*': string }>()
  })

  it('resolves nested, absolute, index and pathless routes without the catch-all', () => {
    const routes = defineRoutes([
      {
        path: '/',
        children: [
          { index: true },
          { path: 'users', children: [{ path: ':id' }] },
          { children: [{ path: 'reports' }] },
          { path: 'settings', children: [{ path: '/help' }] },
          { path: '*' },
        ],
      },
    ])
    expectTypeOf<RoutePaths<typeof routes>>().toEqualTypeOf<
      '/' | '/users' | '/users/:id' | '/reports' | '/settings' | '/help'
    >()
  })

  it('enforces navigation targets and options at compile time', () => {
    const compileOnly = (navigate: TypedNavigate) => {
      navigate('/users')
      navigate('/users/:id', { params: { id: 123 }, replace: true })
      navigate(
        { pathname: '/users/:id', search: '?tab=profile', hash: '#details' },
        { params: { id: '123' } },
      )
      navigate(-1)
      // @ts-expect-error Unregistered route.
      navigate('/missing')
      // @ts-expect-error Dynamic destinations require parameters.
      navigate('/users/:id')
      // @ts-expect-error Dynamic destinations require the correctly named parameter.
      navigate('/users/:id', { params: { userId: '123' } })
      // @ts-expect-error Boolean IDs are not valid parameter values.
      navigate('/users/:id', { params: { id: true } })
      // @ts-expect-error Static routes have no parameters.
      navigate('/users', { params: { id: '123' } })
      // @ts-expect-error Catch-all routes do not grant permission for arbitrary URLs.
      navigate('*')
      // @ts-expect-error Query/hash belongs in a typed destination object.
      navigate('/users?tab=all')
      // @ts-expect-error Object pathnames also require valid routes.
      navigate({ pathname: '/missing' })
    }
    expectTypeOf(compileOnly).returns.toBeVoid()
  })

  it.each([
    ['/users', {}, '/users'],
    ['/users/:id', { id: '123' }, '/users/123'],
    ['/users/:id', { id: 0 }, '/users/0'],
    ['/users/:id', { id: 'John Doe/#?' }, '/users/John%20Doe%2F%23%3F'],
    ['/reports/:date?', {}, '/reports'],
    ['/reports/:date?', { date: '2026-10-13' }, '/reports/2026-10-13'],
    ['/files/*', { '*': 'folder/a b' }, '/files/folder/a%20b'],
  ] as const)(
    'builds %s with encoded parameter values',
    (path, params, expected) => {
      expect(buildRoutePath(path, params)).toBe(expected)
    },
  )

  it('rejects missing and empty required values at runtime', () => {
    expect(() => buildRoutePath('/users/:id')).toThrow(/Missing required/)
    expect(() => buildRoutePath('/users/:id', { id: '' })).toThrow(
      /Missing required/,
    )
  })
})
