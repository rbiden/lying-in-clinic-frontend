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

export interface ZodIntOptions<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends number | null | undefined = undefined,
> extends ZodHelperOptions<
  number,
  ZodCommonMessageKey | 'min' | 'max' | 'integer' | 'multipleOf',
  TRequired,
  TNullable,
  TDefault
> {
  coerce?: boolean
  min?: number
  max?: number
  multipleOf?: number
}

/** Creates a normalized int schema with validated defaults and synchronous rules. */
export function zodInt<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends number | null | undefined = undefined,
>(
  options: ZodIntOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<number, TRequired, TNullable, TDefault> {
  validateConfig(
    options,
    ['coerce', 'min', 'max', 'multipleOf'],
    [...numericMessages, 'integer'],
  )
  return finish(numericSchema(options, true), options)
}
