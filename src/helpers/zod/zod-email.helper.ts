import { z } from 'zod'
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

export interface ZodEmailOptions<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
> extends ZodHelperOptions<
  string,
  ZodCommonMessageKey | 'empty' | 'min' | 'max' | 'regex',
  TRequired,
  TNullable,
  TDefault
> {
  trim?: boolean
  min?: number
  max?: number
  regex?: string | RegExp
  case?: 'preserve' | 'lower' | 'upper'
}

/** Creates a normalized email schema with validated defaults and synchronous rules. */
export function zodEmail<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
>(
  options: ZodEmailOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<string, TRequired, TNullable, TDefault> {
  validateConfig(options, ['trim', 'min', 'max', 'regex', 'case'], textMessages)
  const email = z.string().email()
  return finish(
    textSchema(
      options,
      `${label(options)} must be a valid email address`,
      (value) => email.safeParse(value).success,
    ),
    options,
  )
}
