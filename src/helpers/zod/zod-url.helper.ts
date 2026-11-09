import {
  finish,
  label,
  pattern,
  configError,
  textMessages,
  textSchema,
  validateConfig,
  message,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export interface ZodUrlOptions<
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
  protocols?: readonly string[]
  hostnameRegex?: string | RegExp
}

/** Creates a normalized url schema with validated defaults and synchronous rules. */
export function zodUrl<
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends string | null | undefined = undefined,
>(
  options: ZodUrlOptions<TRequired, TNullable, TDefault>,
): ZodHelperSchema<string, TRequired, TNullable, TDefault> {
  validateConfig(
    options,
    ['trim', 'min', 'max', 'protocols', 'hostnameRegex'],
    textMessages,
  )
  const protocols = options.protocols ?? ['http', 'https']
  if (
    !Array.isArray(protocols) ||
    protocols.length === 0 ||
    protocols.some(
      (value) =>
        typeof value !== 'string' || !/^[a-z][a-z0-9+.-]*$/i.test(value),
    )
  )
    configError(
      'protocols must be a nonempty array of protocol names without colons',
    )
  const allowed = protocols.map((value) => value.toLowerCase())
  const hostname = pattern(options.hostnameRegex)
  const invalid = `${label(options)} must be a valid URL`
  const schema = textSchema(options, invalid, (value) => {
    try {
      return allowed.includes(new URL(value).protocol.slice(0, -1))
    } catch {
      return false
    }
  }).superRefine((value, ctx) => {
    if (!hostname || !value) return
    try {
      if (!hostname.test(new URL(value).hostname))
        ctx.addIssue({
          code: 'custom',
          message: message(
            options,
            'regex',
            `${label(options)} must match the required hostname pattern`,
          ),
        })
    } catch {
      /* Syntax errors are reported by the text schema. */
    }
  })
  return finish(schema, options)
}
