import type { RefinementCtx, ZodType, ZodTypeDef } from 'zod'

/** A synchronous rule applied to a present, normalized value. */
export interface ZodRefineRule<T> {
  check: (value: T) => boolean
  message?: string
  path?: (string | number)[]
}

export type ZodMessages<TKey extends string> = Partial<Record<TKey, string>>
export type ZodCommonMessageKey = 'required' | 'invalid' | 'refine'

/** Presence flags affect output inference; a default is parsed and validated. */
export interface ZodHelperOptions<
  T,
  TKey extends string,
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends T | null | undefined = undefined,
> {
  required?: TRequired
  nullable?: TNullable
  label?: string
  message?: string | ZodMessages<TKey>
  default?: TDefault & (T | (TNullable extends true ? null : never))
  refine?: readonly ZodRefineRule<T>[]
  superRefine?: (value: T, ctx: RefinementCtx) => void | undefined
}

export type ZodHelperOutput<
  T,
  TRequired extends boolean,
  TNullable extends boolean,
  TDefault,
> =
  | T
  | (TNullable extends false ? never : null)
  | (undefined extends TDefault
      ? TRequired extends true
        ? never
        : undefined
      : never)

export type ZodHelperInput<
  T,
  TRequired extends boolean,
  TNullable extends boolean,
  TDefault,
> =
  | T
  | (TNullable extends false ? never : null)
  | (TRequired extends true
      ? undefined extends TDefault
        ? never
        : undefined
      : undefined)

export type ZodHelperSchema<
  T,
  TRequired extends boolean,
  TNullable extends boolean,
  TDefault,
  TInput = unknown,
> = ZodType<
  ZodHelperOutput<T, TRequired, TNullable, TDefault>,
  ZodTypeDef,
  TInput
>
