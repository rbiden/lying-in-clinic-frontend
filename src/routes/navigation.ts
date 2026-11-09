import { generatePath } from 'react-router'
import type { NavigateOptions } from 'react-router'
import type { routes } from './index'

type TrimStart<TPath extends string> = TPath extends `/${infer TRest}`
  ? TrimStart<TRest>
  : TPath
type TrimEnd<TPath extends string> = TPath extends `${infer TRest}/`
  ? TrimEnd<TRest>
  : TPath
type Normalize<TPath extends string> = `/${TrimEnd<TrimStart<TPath>>}`
type Join<
  TParent extends string,
  TPath extends string,
> = TPath extends `/${string}`
  ? Normalize<TPath>
  : Normalize<`${TrimEnd<TParent>}/${TPath}`>
type CurrentPath<TRoute, TParent extends string> = TRoute extends {
  path: infer TPath extends string
}
  ? Join<TParent, TPath>
  : TParent
type NodePaths<TRoute, TParent extends string> = TRoute extends { path: '*' }
  ? never
  : TRoute extends unknown
    ? | CurrentPath<TRoute, TParent>
      | (TRoute extends { children: infer TChildren extends readonly unknown[] }
          ? RoutePaths<TChildren, CurrentPath<TRoute, TParent>>
          : never)
    : never

/** Absolute patterns from the actual route tree, excluding the catch-all 404. */
export type RoutePaths<
  TRoutes extends readonly unknown[],
  TParent extends string = '/',
> = NodePaths<TRoutes[number], TParent>
export type AppRoutePath = RoutePaths<typeof routes>

type SegmentParams<TSegment extends string> =
  TSegment extends `:${infer TName}?`
    ? { [TKey in TName]?: string | number }
    : TSegment extends `:${infer TName}`
      ? { [TKey in TName]: string | number }
      : TSegment extends '*'
        ? { '*': string }
        : Record<never, never>
type ExtractParams<TPath extends string> =
  TPath extends `${infer TSegment}/${infer TRest}`
    ? SegmentParams<TSegment> & ExtractParams<TRest>
    : SegmentParams<TPath>
type Simplify<T> = { [TKey in keyof T]: T[TKey] }
export type RouteParams<TPath extends string> = Simplify<ExtractParams<TPath>>
type RequiredKeys<T> = {
  [TKey in keyof T]-?: object extends Pick<T, TKey> ? never : TKey
}[keyof T]
export type RouteNavigateOptions<TPath extends string> = NavigateOptions &
  (keyof RouteParams<TPath> extends never
    ? { params?: never }
    : RequiredKeys<RouteParams<TPath>> extends never
      ? { params?: RouteParams<TPath> }
      : { params: RouteParams<TPath> })
type NavigateArguments<TPath extends string> =
  RequiredKeys<RouteParams<TPath>> extends never
    ? [options?: RouteNavigateOptions<TPath>]
    : [options: RouteNavigateOptions<TPath>]
export type RouteTo<TPath extends string = AppRoutePath> =
  TPath | { pathname: TPath; search?: string; hash?: string }
export interface TypedNavigate {
  (delta: number): void | Promise<void>
  <TPath extends AppRoutePath>(
    to: RouteTo<TPath>,
    ...args: NavigateArguments<NoInfer<TPath>>
  ): void | Promise<void>
}

/** Encode parameters as path segments while preserving splat path separators. */
export function buildRoutePath(
  pattern: string,
  params: Readonly<Record<string, string | number | undefined>> = {},
): string {
  const encoded: Record<string, string | undefined> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    if (typeof value !== 'string' && typeof value !== 'number')
      throw new TypeError(`Invalid route parameter: ${key}`)
    const text = String(value)
    encoded[key] =
      key === '*' ? text.split('/').map(encodeURIComponent).join('/') : text
  }
  for (const segment of pattern.split('/')) {
    if (
      segment.startsWith(':') &&
      !segment.endsWith('?') &&
      !encoded[segment.slice(1)]
    )
      throw new Error(`Missing required route parameter: ${segment.slice(1)}`)
  }
  return generatePath(pattern, encoded)
}
