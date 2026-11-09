import { z } from 'zod'
import type { RefinementCtx } from 'zod'
import type { ZodHelperOptions, ZodHelperSchema } from './zod-helper.types'

type InternalOptions<T> = ZodHelperOptions<
  T,
  string,
  boolean,
  boolean,
  T | null | undefined
>

const sharedKeys = [
  'required',
  'nullable',
  'label',
  'message',
  'default',
  'refine',
  'superRefine',
]

export function configError(reason: string): never {
  throw new TypeError(`Invalid Zod helper configuration: ${reason}`)
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

export function assertKeys(
  value: object,
  keys: readonly string[],
  name = 'option',
) {
  for (const key of Object.keys(value)) {
    if (!keys.includes(key)) configError(`unsupported ${name} "${key}"`)
  }
}

function synchronousFunction(value: unknown, name: string) {
  if (
    typeof value !== 'function' ||
    value.constructor.name === 'AsyncFunction'
  ) {
    configError(`${name} must be a synchronous function`)
  }
}

export function validateConfig<T>(
  options: InternalOptions<T>,
  keys: readonly string[],
  messageKeys: readonly string[],
) {
  if (!isRecord(options)) {
    configError('options must be an object')
  }
  assertKeys(options, [...sharedKeys, ...keys])
  for (const key of ['required', 'nullable', ...keys]) {
    if (
      [
        'required',
        'nullable',
        'trim',
        'coerce',
        'caseInsensitive',
        'offset',
        'local',
      ].includes(key)
    ) {
      const value = options[key]
      if (value !== undefined && typeof value !== 'boolean')
        configError(`${key} must be boolean`)
    }
  }
  if (options.label !== undefined && typeof options.label !== 'string')
    configError('label must be text')
  if (options.message !== undefined && typeof options.message !== 'string') {
    if (!isRecord(options.message)) {
      configError('message must be text or a message object')
    }
    assertKeys(options.message, messageKeys, 'message category')
    for (const value of Object.values(options.message)) {
      if (typeof value !== 'string')
        configError('message overrides must be text')
    }
  }
  if (options.refine !== undefined) {
    if (!Array.isArray(options.refine)) configError('refine must be an array')
    for (const rule of options.refine) {
      if (!rule || typeof rule !== 'object')
        configError('refine rules must be objects')
      assertKeys(rule, ['check', 'message', 'path'], 'refine option')
      synchronousFunction(rule.check, 'refine.check')
      if (rule.message !== undefined && typeof rule.message !== 'string')
        configError('rule message must be text')
      if (
        rule.path !== undefined &&
        (!Array.isArray(rule.path) ||
          rule.path.some(
            (part: unknown) =>
              typeof part !== 'string' && typeof part !== 'number',
          ))
      ) {
        configError('rule path must contain strings or numbers')
      }
    }
  }
  if (options.superRefine !== undefined)
    synchronousFunction(options.superRefine, 'superRefine')
}

export function message<T>(
  options: InternalOptions<T>,
  category: string,
  fallback: string,
) {
  return typeof options.message === 'string'
    ? options.message
    : (options.message?.[category] ?? fallback)
}

export function label<T>(options: InternalOptions<T>) {
  return options.label ?? 'This field'
}

export function errorMap<T>(
  options: InternalOptions<T>,
  invalid: string,
): z.ZodErrorMap {
  return (issue) => ({
    message: message(
      options,
      issue.code === 'invalid_type' && issue.received === 'undefined'
        ? 'required'
        : 'invalid',
      issue.code === 'invalid_type' && issue.received === 'undefined'
        ? `${label(options)} is required`
        : invalid,
    ),
  })
}

export function bound(value: unknown, name: string, count = false) {
  if (value === undefined) return
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    (count && (!Number.isSafeInteger(value) || value < 0))
  ) {
    configError(
      `${name} must be ${count ? 'a nonnegative safe integer' : 'finite'}`,
    )
  }
}

export function bounds(
  min: number | undefined,
  max: number | undefined,
  length?: number,
  count = false,
) {
  bound(min, 'min', count)
  bound(max, 'max', count)
  bound(length, 'length', true)
  if (min !== undefined && max !== undefined && min > max)
    configError('min exceeds max')
  if (
    length !== undefined &&
    ((min !== undefined && length < min) || (max !== undefined && length > max))
  ) {
    configError('length contradicts explicit bounds')
  }
}

export function pattern(value: string | RegExp | undefined) {
  if (value === undefined) return undefined
  if (typeof value !== 'string' && !(value instanceof RegExp))
    configError('regex must be a pattern string or RegExp')
  try {
    return value instanceof RegExp
      ? new RegExp(value.source, value.flags.replace(/[gy]/g, ''))
      : new RegExp(value)
  } catch {
    return configError('invalid regular expression')
  }
}

function rejectPromise(value: unknown) {
  if (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function') &&
    'then' in value &&
    typeof value.then === 'function'
  ) {
    configError('Promise-returning refinements are not supported')
  }
}

/** Wrap presence/default handling outside the validated value schema. */
export function finish<
  T,
  TRequired extends boolean,
  TNullable extends boolean,
  TDefault extends T | null | undefined,
>(
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  options: ZodHelperOptions<T, string, TRequired, TNullable, TDefault>,
): ZodHelperSchema<T, TRequired, TNullable, TDefault> {
  const refined = schema.superRefine((value, ctx) => {
    const fallback = (explicit?: string) =>
      typeof options.message === 'string'
        ? options.message
        : (explicit ??
          options.message?.refine ??
          options.message?.invalid ??
          `${label(options)} does not satisfy the required condition`)
    for (const rule of options.refine ?? []) {
      const result = rule.check(value)
      rejectPromise(result)
      if (typeof result !== 'boolean')
        configError('refine.check must return boolean')
      if (!result)
        ctx.addIssue({
          code: 'custom',
          path: rule.path,
          message: fallback(rule.message),
        })
    }
    if (options.superRefine) {
      const wrappedCtx: RefinementCtx = {
        path: ctx.path,
        addIssue: (issue) =>
          ctx.addIssue({ ...issue, message: fallback(issue.message) }),
      }
      rejectPromise(options.superRefine(value, wrappedCtx))
    }
  })
  const nullable = options.nullable ? refined.nullable() : refined
  const present = options.required === false ? nullable.optional() : nullable
  const hasDefault = Object.prototype.hasOwnProperty.call(options, 'default')
  if (hasDefault && options.default === undefined)
    configError('default cannot be undefined')
  if (hasDefault && !nullable.safeParse(options.default).success)
    configError('default fails validation')
  // Parsing each time also avoids sharing mutable array/object defaults between calls.
  return z.preprocess(
    (value) => (value === undefined && hasDefault ? options.default : value),
    present,
  ) as ZodHelperSchema<T, TRequired, TNullable, TDefault>
}

export interface TextOptions {
  trim?: boolean
  min?: number
  max?: number
  length?: number
  regex?: string | RegExp
  case?: 'preserve' | 'lower' | 'upper'
}

export function textSchema<T extends InternalOptions<string> & TextOptions>(
  options: T,
  invalid: string,
  format?: (value: string) => boolean,
) {
  bounds(options.min, options.max, options.length, true)
  if (
    !format &&
    options.required !== false &&
    options.min === undefined &&
    options.length === undefined &&
    options.max === 0
  ) {
    configError('max contradicts the required string minimum of 1')
  }
  if (
    options.case !== undefined &&
    !['preserve', 'lower', 'upper'].includes(options.case)
  )
    configError('invalid case option')
  const regex = pattern(options.regex)
  const name = label(options)
  let text = z.string({ errorMap: errorMap(options, invalid) })
  if (options.trim !== false) text = text.trim()
  if (options.case === 'lower') text = text.toLowerCase()
  if (options.case === 'upper') text = text.toUpperCase()
  return text.superRefine((value, ctx) => {
    const add = (category: string, fallback: string) =>
      ctx.addIssue({
        code: 'custom',
        message: message(options, category, fallback),
      })
    if (
      value.length === 0 &&
      options.required !== false &&
      (format ||
        (options.min ?? (options.length === undefined ? 1 : 0)) > 0 ||
        (options.length ?? 0) > 0)
    ) {
      add('empty', `${name} cannot be empty`)
      return
    }
    const min =
      options.min ??
      (options.length === undefined && !format && options.required !== false
        ? 1
        : 0)
    if (format && value.length === 0) {
      add('invalid', invalid)
      return
    }
    if (value.length < min)
      add('min', `${name} must contain at least ${min} characters`)
    if (options.max !== undefined && value.length > options.max)
      add('max', `${name} must contain at most ${options.max} characters`)
    if (options.length !== undefined && value.length !== options.length)
      add('length', `${name} must contain exactly ${options.length} characters`)
    if (format && !format(value)) add('invalid', invalid)
    if (regex && !regex.test(value))
      add('regex', `${name} must match the required pattern`)
  })
}

export const commonMessages = ['required', 'invalid', 'refine'] as const
export const textMessages = [
  ...commonMessages,
  'empty',
  'min',
  'max',
  'regex',
] as const
export const numericMessages = [
  ...commonMessages,
  'min',
  'max',
  'multipleOf',
] as const

export function numericSchema<
  T extends InternalOptions<number> & {
    coerce?: boolean
    min?: number
    max?: number
    multipleOf?: number
  },
>(options: T, integer: boolean) {
  bounds(options.min, options.max)
  if (
    options.default !== undefined &&
    options.default !== null &&
    typeof options.default !== 'number'
  )
    configError('numeric defaults must be numbers')
  if (
    integer &&
    Math.ceil(
      Math.max(options.min ?? Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER),
    ) >
      Math.floor(
        Math.min(
          options.max ?? Number.MAX_SAFE_INTEGER,
          Number.MAX_SAFE_INTEGER,
        ),
      )
  ) {
    configError('bounds contain no safe integer')
  }
  if (
    options.multipleOf !== undefined &&
    (typeof options.multipleOf !== 'number' ||
      !Number.isFinite(options.multipleOf) ||
      options.multipleOf <= 0)
  )
    configError('multipleOf must be a positive finite number')
  const name = label(options)
  const invalid = `${name} must be a valid ${integer ? 'integer' : 'number'}`
  let schema = z
    .number({ errorMap: errorMap(options, invalid) })
    .finite(message(options, 'invalid', invalid))
  if (integer)
    schema = schema
      .int(message(options, 'integer', invalid))
      .min(Number.MIN_SAFE_INTEGER, message(options, 'integer', invalid))
      .max(Number.MAX_SAFE_INTEGER, message(options, 'integer', invalid))
  if (options.min !== undefined)
    schema = schema.min(
      options.min,
      message(options, 'min', `${name} must be at least ${options.min}`),
    )
  if (options.max !== undefined)
    schema = schema.max(
      options.max,
      message(options, 'max', `${name} must be at most ${options.max}`),
    )
  if (options.multipleOf !== undefined)
    schema = schema.multipleOf(
      options.multipleOf,
      message(
        options,
        'multipleOf',
        `${name} must be a multiple of ${options.multipleOf}`,
      ),
    )
  return z.preprocess((value) => {
    // Presence is handled by finish before coercion, so null cannot become zero.
    if (!options.coerce || value === undefined || value === null) return value
    try {
      return Number(value)
    } catch {
      return NaN
    }
  }, schema)
}
