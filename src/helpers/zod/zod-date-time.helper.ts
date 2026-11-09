import { z } from 'zod'
import {
  commonMessages,
  configError,
  finish,
  label,
  textSchema,
  validateConfig,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export interface ZodDateTimeOptions<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
> extends ZodHelperOptions<
  string,
  ZodCommonMessageKey | 'empty',
  TRequired,
  TNullable,
  TDefault
> {
  trim?: boolean
  offset?: boolean
  local?: boolean
  precision?: number
}

/** Creates a normalized datetime schema with validated defaults and synchronous rules. */
export function zodDateTime<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
>(
  options: ZodDateTimeOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<string, TRequired, TNullable, TDefault> {
  validateConfig(
    options,
    ['trim', 'offset', 'local', 'precision'],
    [...commonMessages, 'empty'],
  )
  const precision = options.precision
  if (
    precision !== undefined &&
    (!Number.isSafeInteger(precision) || precision < -1)
  )
    configError('precision must be an integer of at least -1')
  const datetime = z.string().datetime({
    offset: options.offset ?? false,
    local: options.local ?? false,
    precision: precision === -1 ? undefined : precision,
  })
  // Zod 3 permits omitted seconds by default; enforce this helper's precision contract.
  const time =
    precision === -1
      ? /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?:Z|[+-]\d{2}:?\d{2})?$/
      : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/
  return finish(
    textSchema(
      options,
      `${label(options)} must be a valid ISO date and time`,
      (value) => {
        if (!time.test(value) || !datetime.safeParse(value).success)
          return false
        const offset = /[+-](\d{2}):?(\d{2})$/.exec(value)
        return !offset || (Number(offset[1]) <= 23 && Number(offset[2]) <= 59)
      },
    ),
    options,
  )
}
