import { z } from 'zod'
import {
  bound,
  commonMessages,
  configError,
  errorMap,
  finish,
  label,
  isRecord,
  message,
  validateConfig,
} from './zod-helper.internal'
import type {
  ZodCommonMessageKey,
  ZodHelperInput,
  ZodHelperOptions,
  ZodHelperSchema,
} from './zod-helper.types'

export type ZodUnknownKeys = 'reject' | 'strip' | 'allow'
type ObjectValue<
  TSchema extends z.ZodRawShape,
  TKey extends ZodUnknownKeys,
> = z.output<z.ZodObject<TSchema>> &
  (TKey extends 'allow' ? Record<string, unknown> : unknown)

export interface ZodObjectOptions<
  TSchema extends z.ZodRawShape,
  TKey extends ZodUnknownKeys = 'reject',
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends ObjectValue<TSchema, TKey> | null | undefined = undefined,
> extends ZodHelperOptions<
  ObjectValue<TSchema, TKey>,
  ZodCommonMessageKey | 'min' | 'unknownKeys',
  TRequired,
  TNullable,
  TDefault
> {
  shape: TSchema
  unknownKeys?: TKey
  minProperties?: number
}

/** Validates fields and counts properties after unknown-key handling. */
export function zodObject<
  TSchema extends z.ZodRawShape,
  TKey extends ZodUnknownKeys = 'reject',
  TRequired extends boolean = true,
  TNullable extends boolean = false,
  TDefault extends ObjectValue<TSchema, TKey> | null | undefined = undefined,
>(
  options: ZodObjectOptions<TSchema, TKey, TRequired, TNullable, TDefault>,
): ZodHelperSchema<
  ObjectValue<TSchema, TKey>,
  TRequired,
  TNullable,
  TDefault,
  ZodHelperInput<z.input<z.ZodObject<TSchema>>, TRequired, TNullable, TDefault>
> {
  validateConfig(
    options,
    ['shape', 'unknownKeys', 'minProperties'],
    [...commonMessages, 'min', 'unknownKeys'],
  )
  if (
    !isRecord(options.shape) ||
    Object.values(options.shape).some((value) => !(value instanceof z.ZodType))
  )
    configError('shape must contain Zod schemas')
  if (
    options.unknownKeys !== undefined &&
    !['reject', 'strip', 'allow'].includes(options.unknownKeys)
  )
    configError('invalid unknownKeys option')
  bound(options.minProperties, 'minProperties', true)
  const name = label(options)
  const base = z.object(options.shape, {
    errorMap: errorMap(options, `${name} must be an object`),
  })
  const schema =
    options.unknownKeys === 'allow'
      ? base.passthrough()
      : options.unknownKeys === 'strip'
        ? base.strip()
        : base.strict(
            message(
              options,
              'unknownKeys',
              `${name} contains unknown properties`,
            ),
          )
  const counted = schema.superRefine((value, ctx) => {
    const min = options.minProperties ?? 0
    if (Object.keys(value).length < min)
      ctx.addIssue({
        code: 'custom',
        message: message(
          options,
          'min',
          `${name} must contain at least ${min} properties`,
        ),
      })
  })
  // The mode controls runtime key handling and its corresponding public output type.
  return finish(
    counted as z.ZodType<ObjectValue<TSchema, TKey>, z.ZodTypeDef, unknown>,
    options,
  ) as ZodHelperSchema<
    ObjectValue<TSchema, TKey>,
    TRequired,
    TNullable,
    TDefault,
    ZodHelperInput<
      z.input<z.ZodObject<TSchema>>,
      TRequired,
      TNullable,
      TDefault
    >
  >
}
