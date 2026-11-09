import { z } from 'zod'
import {
  commonMessages,
  configError,
  errorMap,
  finish,
  label,
  validateConfig,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export interface ZodEnumOptions<
  TValues extends readonly [string, ...string[]],
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends TValues[number] | null | undefined = undefined,
> extends ZodHelperOptions<
  TValues[number],
  ZodCommonMessageKey,
  TRequired,
  TNullable,
  TDefault
> {
  values: TValues
}

/** Exact, case-sensitive enum matching with literal union inference. */
export function zodEnum<
  const TValues extends readonly [string, ...string[]],
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends TValues[number] | null | undefined = undefined,
>(
  options: ZodEnumOptions<TValues, TRequired, TNullable, TDefault>,
): ZodHelperSchema<TValues[number], TRequired, TNullable, TDefault> {
  validateConfig(options, ['values'], commonMessages)
  if (
    !Array.isArray(options.values) ||
    options.values.length === 0 ||
    options.values.some((value) => typeof value !== 'string')
  )
    configError('values must be a nonempty tuple of strings')
  const values = [...options.values] as [TValues[number], ...TValues[number][]]
  return finish(
    z.enum(values, {
      errorMap: errorMap(
        options,
        `${label(options)} must be one of: ${values.join(', ')}`,
      ),
    }),
    options,
  )
}
