import {
  finish,
  label,
  textMessages,
  textSchema,
  validateConfig,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export interface ZodStringOptions<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
> extends ZodHelperOptions<
  string,
  ZodCommonMessageKey | 'empty' | 'min' | 'max' | 'length' | 'regex',
  TRequired,
  TNullable,
  TDefault
> {
  trim?: boolean
  min?: number
  max?: number
  length?: number
  regex?: string | RegExp
  case?: 'preserve' | 'lower' | 'upper'
}

/** Creates a normalized string schema with validated defaults and synchronous rules. */
export function zodString<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
>(
  options: ZodStringOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<string, TRequired, TNullable, TDefault> {
  validateConfig(
    options,
    ['trim', 'min', 'max', 'length', 'regex', 'case'],
    [...textMessages, 'length'],
  )
  return finish(textSchema(options, `${label(options)} must be text`), options)
}
