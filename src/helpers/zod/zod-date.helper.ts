import { z } from 'zod'
import {
  commonMessages,
  configError,
  finish,
  label,
  message,
  textSchema,
  validateConfig,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export interface ZodDateOptions<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
> extends ZodHelperOptions<
  string,
  ZodCommonMessageKey | 'empty' | 'min' | 'max',
  TRequired,
  TNullable,
  TDefault
> {
  trim?: boolean
  min?: string
  max?: string
}

/** Creates a normalized date schema with validated defaults and synchronous rules. */
export function zodDate<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
>(
  options: ZodDateOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<string, TRequired, TNullable, TDefault> {
  validateConfig(
    options,
    ['trim', 'min', 'max'],
    [...commonMessages, 'empty', 'min', 'max'],
  )
  const date = z.string().date()
  for (const value of [options.min, options.max]) {
    if (value !== undefined && !date.safeParse(value).success)
      configError('date bounds must be valid YYYY-MM-DD dates')
  }
  if (
    options.min !== undefined &&
    options.max !== undefined &&
    options.min > options.max
  )
    configError('min exceeds max')
  const name = label(options)
  // Date bounds are calendar bounds, not string-length bounds.
  const schema = textSchema(
    { ...options, min: undefined, max: undefined },
    `${name} must be a valid date in YYYY-MM-DD format`,
    (value) => date.safeParse(value).success,
  ).superRefine((value, ctx) => {
    if (!date.safeParse(value).success) return
    if (options.min !== undefined && value < options.min)
      ctx.addIssue({
        code: 'custom',
        message: message(
          options,
          'min',
          `${name} must be on or after ${options.min}`,
        ),
      })
    if (options.max !== undefined && value > options.max)
      ctx.addIssue({
        code: 'custom',
        message: message(
          options,
          'max',
          `${name} must be on or before ${options.max}`,
        ),
      })
  })
  return finish(schema, options)
}
