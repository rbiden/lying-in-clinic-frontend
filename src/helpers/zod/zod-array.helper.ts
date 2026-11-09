import { z } from 'zod'
import {
  bounds,
  commonMessages,
  configError,
  errorMap,
  finish,
  label,
  message,
  validateConfig,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export interface ZodArrayOptions<
  TSchema extends z.ZodTypeAny,
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends z.output<TSchema>[] | null | undefined = undefined,
> extends ZodHelperOptions<
  z.output<TSchema>[],
  ZodCommonMessageKey | 'min' | 'max' | 'length',
  TRequired,
  TNullable,
  TDefault
> {
  item: TSchema
  min?: number
  max?: number
  length?: number
}

/** Container constraints preserve item errors and their index paths. */
export function zodArray<
  TSchema extends z.ZodTypeAny,
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends z.output<TSchema>[] | null | undefined = undefined,
>(
  options: ZodArrayOptions<TSchema, TRequired, TNullable, TDefault>,
): ZodHelperSchema<z.output<TSchema>[], TRequired, TNullable, TDefault> {
  validateConfig(
    options,
    ['item', 'min', 'max', 'length'],
    [...commonMessages, 'min', 'max', 'length'],
  )
  if (!(options.item instanceof z.ZodType))
    configError('item must be a Zod schema')
  bounds(options.min, options.max, options.length, true)
  const name = label(options)
  let schema = z.array(options.item, {
    errorMap: errorMap(options, `${name} must be an array`),
  })
  if (options.min !== undefined)
    schema = schema.min(
      options.min,
      message(
        options,
        'min',
        `${name} must contain at least ${options.min} items`,
      ),
    )
  if (options.max !== undefined)
    schema = schema.max(
      options.max,
      message(
        options,
        'max',
        `${name} must contain at most ${options.max} items`,
      ),
    )
  if (options.length !== undefined)
    schema = schema.length(
      options.length,
      message(
        options,
        'length',
        `${name} must contain exactly ${options.length} items`,
      ),
    )
  return finish(schema, options)
}
