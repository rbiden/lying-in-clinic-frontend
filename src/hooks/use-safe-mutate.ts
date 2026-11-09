import { useCallback } from 'react'
import type { QueryKey } from '@tanstack/react-query'
import { useLoadingStore } from '@/stores'
import { queryClient } from '@/lib'
import { getAxiosErrorMessage, normalizeErrorMessage } from '@/helpers'
import type { SafeMutateOptions, SafeMutateResult } from '@/types'

export type UnwrapData<T> = T extends Blob
  ? T
  : T extends { data: infer D }
    ? D extends undefined
      ? T
      : D
    : T

function isSafeMutateOptions(obj: unknown): obj is SafeMutateOptions {
  if (typeof obj !== 'object' || obj === null) return false
  const keys = Object.keys(obj)
  return (
    keys.length > 0 &&
    keys.every((k) => k === 'invalidate' || k === 'returnHeader')
  )
}

export interface SafeMutateFunction {
  // Overload 1: Zero argument / void argument functions: safeMutate(fn, options?)
  <TRaw = unknown, TResult = UnwrapData<TRaw>>(
    fn: () => Promise<TRaw>,
    options?: SafeMutateOptions,
  ): Promise<SafeMutateResult<TResult, TRaw>>

  <TRaw = unknown, TResult = UnwrapData<TRaw>>(
    fn: (args?: void) => Promise<TRaw>,
    options?: SafeMutateOptions,
  ): Promise<SafeMutateResult<TResult, TRaw>>

  // Overload 2: Explicit argument functions: safeMutate(fn, args, options?)
  <TArgs, TRaw = unknown, TResult = UnwrapData<TRaw>>(
    fn: (args: TArgs) => Promise<TRaw>,
    args: TArgs,
    options?: SafeMutateOptions,
  ): Promise<SafeMutateResult<TResult, TRaw>>

  // Overload 3: Optional argument functions: safeMutate(fn, args?, options?)
  <TArgs, TRaw = unknown, TResult = UnwrapData<TRaw>>(
    fn: (args?: TArgs) => Promise<TRaw>,
    args?: TArgs,
    options?: SafeMutateOptions,
  ): Promise<SafeMutateResult<TResult, TRaw>>
}

export function useSafeMutate() {
  const showLoading = useLoadingStore((state) => state.showLoading)
  const hideLoading = useLoadingStore((state) => state.hideLoading)

  const safeMutate: SafeMutateFunction = useCallback(
    async function <TArgs = void, TRaw = unknown, TResult = UnwrapData<TRaw>>(
      fn: (args?: TArgs) => Promise<TRaw>,
      argsOrOptions?: TArgs | SafeMutateOptions,
      maybeOptions?: SafeMutateOptions,
    ): Promise<SafeMutateResult<TResult, TRaw>> {
      let actualArgs: TArgs | undefined
      let options: SafeMutateOptions | undefined

      if (maybeOptions !== undefined) {
        actualArgs = argsOrOptions as TArgs
        options = maybeOptions
      } else if (isSafeMutateOptions(argsOrOptions)) {
        actualArgs = undefined
        options = argsOrOptions
      } else {
        actualArgs = argsOrOptions
        options = undefined
      }

      showLoading()

      try {
        const result =
          actualArgs !== undefined ? await fn(actualArgs) : await fn()

        if (options?.invalidate) {
          const raw = options.invalidate
          if (!Array.isArray(raw) || raw.length > 0) {
            const keys: QueryKey[] =
              Array.isArray(raw) && raw.length > 0 && Array.isArray(raw[0])
                ? (raw as QueryKey[])
                : [raw as QueryKey]

            try {
              await Promise.all(
                keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
              )
            } catch (err) {
              if (process.env.NODE_ENV !== 'production') {
                console.warn('Failed to invalidate queries:', err)
              }
            }
          }
        }

        const dataPayload = (
          result instanceof Blob
            ? result
            : typeof result === 'object' &&
                result !== null &&
                'data' in result &&
                (result as { data?: unknown }).data !== undefined
              ? (result as { data?: unknown }).data
              : result
        ) as TResult

        let message: string | undefined
        if (typeof result === 'object' && result !== null) {
          const obj = result as Record<string, unknown>
          if (typeof obj.message === 'string') {
            message = obj.message
          } else if (
            typeof obj.data === 'object' &&
            obj.data !== null &&
            typeof (obj.data as Record<string, unknown>).message === 'string'
          ) {
            message = (obj.data as Record<string, unknown>).message as string
          }
        }

        return {
          success: true,
          message,
          result: dataPayload,
          header: options?.returnHeader ? result : null,
        }
      } catch (error) {
        const parsedMessage = getAxiosErrorMessage(error)

        return {
          success: false,
          message: normalizeErrorMessage(parsedMessage),
          error,
        }
      } finally {
        hideLoading()
      }
    },
    [showLoading, hideLoading],
  )

  return { safeMutate }
}
