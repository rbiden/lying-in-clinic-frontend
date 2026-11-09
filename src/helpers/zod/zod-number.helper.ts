import {
  finish,
  numericMessages,
  numericSchema,
  validateConfig,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export interface ZodNumberOptions<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends number | null | undefined = undefined,
> extends ZodHelperOptions<
  number,
  ZodCommonMessageKey | 'min' | 'max' | 'multipleOf',
  TRequired,
  TNullable,
  TDefault
> {
  coerce?: boolean
  min?: number
  max?: number
  multipleOf?: number
}

/** Creates a normalized number schema with validated defaults and synchronous rules. */
export function zodNumber<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends number | null | undefined = undefined,
>(
  options: ZodNumberOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<number, TRequired, TNullable, TDefault> {
  validateConfig(
    options,
    ['coerce', 'min', 'max', 'multipleOf'],
    numericMessages,
  )
  return finish(numericSchema(options, false), options)
}
