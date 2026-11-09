import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import type { NavigateOptions } from 'react-router'
import { buildRoutePath } from '#/routes/navigation'
import type { RouteTo, TypedNavigate } from '#/routes/navigation'

/** Navigate with paths and parameters inferred from the application's route tree. */
export function useSafeNavigate(): TypedNavigate {
  const navigate = useNavigate()
  return useCallback(
    (
      to: number | RouteTo,
      options?: NavigateOptions & {
        params?: Record<string, string | number | undefined>
      },
    ) => {
      if (typeof to === 'number') return navigate(to)

      const { params, ...navigateOptions } = options ?? {}
      const pathname = buildRoutePath(
        typeof to === 'string' ? to : to.pathname,
        params,
      )

      return navigate(
        typeof to === 'string' ? pathname : { ...to, pathname },
        navigateOptions,
      )
    },
    [navigate],
  )
}
