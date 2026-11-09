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

export interface ZodBooleanOptions<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends boolean | null | undefined = undefined,
> extends ZodHelperOptions<
  boolean,
  ZodCommonMessageKey,
  TRequired,
  TNullable,
  TDefault
> {
  coerce?: boolean
  trim?: boolean
  caseInsensitive?: boolean
}

/** Creates a normalized boolean schema with validated defaults and synchronous rules. */
export function zodBoolean<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends boolean | null | undefined = undefined,
>(
  options: ZodBooleanOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<boolean, TRequired, TNullable, TDefault> {
  validateConfig(options, ['coerce', 'trim', 'caseInsensitive'], commonMessages)
  if (
    options.default !== undefined &&
    options.default !== null &&
    typeof options.default !== 'boolean'
  )
    configError('boolean defaults must be booleans')
  const schema = z.preprocess(
    (value) => {
      if (!options.coerce || typeof value !== 'string') return value
      let text = options.trim === false ? value : value.trim()
      if (options.caseInsensitive !== false) text = text.toLowerCase()
      return text === 'true' ? true : text === 'false' ? false : value
    },
    z.boolean({
      errorMap: errorMap(options, `${label(options)} must be true or false`),
    }),
  )
  return finish(schema, options)
}
