import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '#/features/auth/auth.schema'
import type { LoginDto } from '#/features/auth/auth.schema'
import {
  zodArray,
  zodBoolean,
  zodDate,
  zodDateTime,
  zodEmail,
  zodEnum,
  zodInt,
  zodNumber,
  zodObject,
  zodString,
  zodUrl,
} from './index'
import type { ZodStringOptions } from './index'

function issues(schema: z.ZodType<unknown>, value: unknown) {
  const result = schema.safeParse(value)
  expect(result.success).toBe(false)
  if (result.success) throw new Error('Expected invalid input')
  return result.error.issues
}

describe('presence and defaults', () => {
  it('validates defaults for every helper, including formatted and enum values', () => {
    expect(zodEmail({ default: ' USER@Example.com ' }).parse(undefined)).toBe(
      'USER@Example.com',
    )
    expect(zodUrl({ default: ' https://example.com ' }).parse(undefined)).toBe(
      'https://example.com',
    )
    expect(zodDate({ default: ' 2024-02-29 ' }).parse(undefined)).toBe(
      '2024-02-29',
    )
    expect(
      zodDateTime({ default: ' 2024-02-29T12:00:00Z ' }).parse(undefined),
    ).toBe('2024-02-29T12:00:00Z')
    expect(
      zodEnum({ values: ['read', 'write'], default: 'read' }).parse(undefined),
    ).toBe('read')
    expect(() => zodUrl({ default: 'ftp://example.com' })).toThrow(/default/)
    expect(() => zodDate({ default: '2023-02-29' })).toThrow(/default/)
    expect(() => zodDateTime({ default: '2024-02-29T12:00Z' })).toThrow(
      /default/,
    )
    expect(() =>
      Reflect.apply(zodEnum, null, [{ values: ['read'], default: 'write' }]),
    ).toThrow(/default/)
    expect(() => Reflect.apply(zodString, null, [{ default: null }])).toThrow(
      /default/,
    )
  })
  const helpers: {
    name: string
    make: (options: {
      required?: boolean
      nullable?: boolean
    }) => z.ZodType<unknown>
    value: unknown
  }[] = [
    { name: 'string', make: zodString, value: 'value' },
    { name: 'email', make: zodEmail, value: 'a@example.com' },
    { name: 'url', make: zodUrl, value: 'https://example.com' },
    { name: 'integer', make: zodInt, value: 2 },
    { name: 'number', make: zodNumber, value: 2.5 },
    { name: 'boolean', make: zodBoolean, value: false },
    { name: 'date', make: zodDate, value: '2024-02-29' },
    { name: 'datetime', make: zodDateTime, value: '2024-02-29T12:00:00Z' },
    {
      name: 'enum',
      make: (options: { required?: boolean; nullable?: boolean }) =>
        zodEnum({ ...options, values: ['a', 'b'] }),
      value: 'a',
    },
    {
      name: 'array',
      make: (options: { required?: boolean; nullable?: boolean }) =>
        zodArray({ ...options, item: z.string() }),
      value: [],
    },
    {
      name: 'object',
      make: (options: { required?: boolean; nullable?: boolean }) =>
        zodObject({ ...options, shape: {} }),
      value: {},
    },
  ]

  it.each(helpers)(
    '$name respects independent presence flags',
    ({ make, value }) => {
      expect(make({}).parse(value)).toEqual(value)
      expect(issues(make({}), undefined)[0].message).toBe(
        'This field is required',
      )
      expect(make({}).safeParse(null).success).toBe(false)
      expect(make({ required: false }).parse(undefined)).toBeUndefined()
      expect(make({ required: false }).safeParse(null).success).toBe(false)
      expect(make({ nullable: true }).parse(null)).toBeNull()
      expect(make({ nullable: true }).safeParse(undefined).success).toBe(false)
      expect(make({ required: false, nullable: true }).parse(null)).toBeNull()
    },
  )

  it('normalizes and validates defaults through all constraints and refinements', () => {
    expect(
      zodString({ default: '  ABC  ', case: 'lower' }).parse(undefined),
    ).toBe('abc')
    expect(
      zodInt({ required: false, min: 1, default: 1 }).parse(undefined),
    ).toBe(1)
    expect(zodBoolean({ default: false }).parse(undefined)).toBe(false)
    expect(
      zodString({ nullable: true, default: null }).parse(undefined),
    ).toBeNull()
    expect(zodString({ default: 'fallback' }).parse('supplied')).toBe(
      'supplied',
    )
    expect(zodString({ default: 'fallback' }).safeParse(null).success).toBe(
      false,
    )
    expect(() => zodString({ default: '', min: 2 })).toThrow(/configuration/)
    expect(() => zodEmail({ default: 'bad' })).toThrow(/default/)
    expect(() => zodInt({ default: 0, min: 1 })).toThrow(/default/)
    expect(() =>
      zodString({
        default: 'no',
        refine: [{ check: (value) => value === 'yes' }],
      }),
    ).toThrow(/default/)
    expect(() =>
      Reflect.apply(zodString, null, [{ default: undefined }]),
    ).toThrow(/default/)
    expect(() =>
      Reflect.apply(zodNumber, null, [{ default: '1', coerce: true }]),
    ).toThrow(/default/)
  })

  it('validates container defaults and returns independent parsed containers', () => {
    const array = zodArray({ item: zodString({}), default: [' a '] })
    const first = array.parse(undefined)
    first.push('b')
    expect(array.parse(undefined)).toEqual(['a'])
    expect(
      zodObject({
        shape: { name: zodString({}) },
        default: { name: ' a ' },
      }).parse(undefined),
    ).toEqual({ name: 'a' })
    expect(() => zodArray({ item: zodInt({}), default: [1.1] })).toThrow(
      /default/,
    )
    expect(() =>
      zodObject({ shape: { name: zodString({}) }, default: { name: '' } }),
    ).toThrow(/default/)
  })
})

describe('text helpers', () => {
  it('normalizes before bounds, exact length and pattern validation', () => {
    expect(
      zodString({ min: 3, max: 3, regex: '^abc$', case: 'lower' }).parse(
        ' ABC ',
      ),
    ).toBe('abc')
    expect(zodString({ case: 'upper' }).parse(' abc ')).toBe('ABC')
    expect(zodString({ trim: false }).parse(' secret ')).toBe(' secret ')
    expect(zodString({ required: false }).parse('   ')).toBe('')
    expect(zodString({ min: 0 }).parse('')).toBe('')
    expect(zodString({ length: 0 }).parse('')).toBe('')
    expect(issues(zodString({}), '   ')).toHaveLength(1)
    expect(issues(zodString({ length: 2 }), 'abc')[0].message).toContain(
      'exactly 2 characters',
    )
    expect(issues(zodString({ label: 'Name', min: 3 }), 'ab')[0].message).toBe(
      'Name must contain at least 3 characters',
    )
    expect(issues(zodString({ max: 2 }), 'abc')[0].message).toContain(
      'at most 2 characters',
    )
  })

  it('compiles regex strings and normalizes global/sticky flags without mutating the caller', () => {
    const regex = /abc/gy
    regex.lastIndex = 7
    const schema = zodString({ regex })
    for (let i = 0; i < 5; i++) expect(schema.parse('abc')).toBe('abc')
    expect(regex.lastIndex).toBe(7)
    expect(issues(zodString({ regex: '^abc$' }), 'other')[0].message).toContain(
      'pattern',
    )
  })

  it('always validates emails, preserves case unless configured, and supplements the format', () => {
    expect(zodEmail({}).parse(' User@Example.com ')).toBe('User@Example.com')
    expect(zodEmail({ case: 'lower' }).parse(' User@Example.com ')).toBe(
      'user@example.com',
    )
    expect(zodEmail({ case: 'upper' }).parse('a@example.com')).toBe(
      'A@EXAMPLE.COM',
    )
    expect(
      zodEmail({ regex: '@example\\.com$', case: 'lower' }).safeParse(
        'a@elsewhere.com',
      ).success,
    ).toBe(false)
    expect(zodEmail({ required: false }).safeParse('').success).toBe(false)
    expect(issues(zodEmail({ min: 3, regex: '^x' }), '')).toHaveLength(1)
    expect(zodEmail({ min: 10 }).safeParse('a@b.co').success).toBe(false)
    expect(zodEmail({ max: 4 }).safeParse('a@b.co').success).toBe(false)
  })

  it('checks URL syntax, protocols and hostnames without serializing the URL', () => {
    const schema = zodUrl({ hostnameRegex: /(^|\.)example\.com$/g })
    const input = 'HTTPS://Example.com/path?q=a%20b'
    expect(schema.parse(` ${input} `)).toBe(input)
    expect(schema.safeParse('https://elsewhere.com').success).toBe(false)
    expect(zodUrl({}).safeParse('/relative').success).toBe(false)
    expect(zodUrl({}).safeParse('ftp://example.com').success).toBe(false)
    expect(zodUrl({ protocols: ['ftp'] }).parse('ftp://example.com')).toBe(
      'ftp://example.com',
    )
    expect(zodUrl({ trim: false }).parse(' https://example.com ')).toBe(
      ' https://example.com ',
    )
    expect(issues(zodUrl({}), '')).toHaveLength(1)
    for (let i = 0; i < 3; i++)
      expect(schema.safeParse('https://example.com').success).toBe(true)
  })
})

describe('numbers and booleans', () => {
  it('accepts safe integers and finite numbers only', () => {
    const int = zodInt({})
    for (const value of [
      1.5,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_SAFE_INTEGER + 1,
      '1',
    ])
      expect(int.safeParse(value).success).toBe(false)
    expect(int.parse(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
    expect(int.parse(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)
    expect(zodNumber({}).parse(0.25)).toBe(0.25)
    for (const value of [NaN, Infinity, -Infinity, '1'])
      expect(zodNumber({}).safeParse(value).success).toBe(false)
  })

  it('coerces numerics with Zod conversion behavior while preserving presence', () => {
    const schema = zodInt({ coerce: true })
    for (const value of ['2', true, '', '  ', [], [1], 3n]) {
      expect(schema.parse(value)).toBe(z.coerce.number().int().parse(value))
    }
    expect(schema.safeParse(null).success).toBe(false)
    expect(schema.safeParse(undefined).success).toBe(false)
    expect(zodInt({ coerce: true, nullable: true }).parse(null)).toBeNull()
    expect(
      zodInt({ coerce: true, required: false }).parse(undefined),
    ).toBeUndefined()
    for (const value of ['no', Symbol('x'), {}, 1.5])
      expect(schema.safeParse(value).success).toBe(false)
    expect(zodNumber({ coerce: true }).parse('2.5')).toBe(2.5)
  })

  it('enforces inclusive bounds and multipleOf, with relevant messages', () => {
    const schema = zodNumber({ min: 1, max: 2, multipleOf: 0.5, label: 'Page' })
    expect(schema.parse(1)).toBe(1)
    expect(schema.parse(2)).toBe(2)
    expect(issues(schema, 0)[0].message).toBe('Page must be at least 1')
    expect(issues(schema, 3)[0].message).toBe('Page must be at most 2')
    expect(issues(schema, 1.1)[0].message).toContain('multiple of 0.5')
    expect(
      issues(zodInt({ message: { integer: 'Whole numbers only' } }), 1.5)[0]
        .message,
    ).toBe('Whole numbers only')
  })

  it('parses boolean strings explicitly instead of using truthiness', () => {
    expect(zodBoolean({}).parse(false)).toBe(false)
    expect(zodBoolean({}).safeParse('false').success).toBe(false)
    expect(zodBoolean({ coerce: true }).parse(' FALSE ')).toBe(false)
    expect(zodBoolean({ coerce: true }).parse('true')).toBe(true)
    for (const value of [1, 0, '', 'yes', '0', [], {}])
      expect(zodBoolean({ coerce: true }).safeParse(value).success).toBe(false)
    expect(
      zodBoolean({ coerce: true, trim: false }).safeParse(' false ').success,
    ).toBe(false)
    expect(
      zodBoolean({ coerce: true, caseInsensitive: false }).safeParse('FALSE')
        .success,
    ).toBe(false)
  })
})

describe('dates and datetimes', () => {
  it('validates actual calendar dates and inclusive date bounds', () => {
    const schema = zodDate({ min: '2024-02-29', max: '2024-03-01' })
    expect(schema.parse(' 2024-02-29 ')).toBe('2024-02-29')
    expect(schema.parse('2024-03-01')).toBe('2024-03-01')
    for (const value of [
      '2023-02-29',
      '1900-02-29',
      '2024-04-31',
      '2024-2-01',
      '2024-01-01T00:00:00Z',
      new Date(),
      '2024-02-28',
      '2024-03-02',
    ])
      expect(schema.safeParse(value).success).toBe(false)
    expect(zodDate({}).parse('2000-02-29')).toBe('2000-02-29')
    expect(zodDate({ trim: false }).safeParse(' 2024-02-29 ').success).toBe(
      false,
    )
    expect(issues(zodDate({}), '')).toHaveLength(1)
  })

  it('requires seconds and UTC by default while allowing fractional seconds', () => {
    const schema = zodDateTime({})
    for (const value of ['2024-02-29T12:34:56Z', '2024-02-29T12:34:56.123Z'])
      expect(schema.parse(value)).toBe(value)
    for (const value of [
      '2024-02-29T12:34Z',
      '2024-02-29T12:34:56',
      '2024-02-29T12:34:56+08:00',
      '2023-02-29T12:34:56Z',
      '2024-02-29T24:00:00Z',
      '2024-02-29T12:60:00Z',
      '2024-02-29T12:34:60Z',
    ])
      expect(schema.safeParse(value).success).toBe(false)
    expect(schema.parse(' 2024-02-29T12:34:56Z ')).toBe('2024-02-29T12:34:56Z')
  })

  it('supports local/offset modes and exact precision contracts', () => {
    expect(
      zodDateTime({ offset: true }).parse('2024-02-29T12:34:56+08:00'),
    ).toBe('2024-02-29T12:34:56+08:00')
    expect(
      zodDateTime({ offset: true }).parse('2024-02-29T12:34:56+0800'),
    ).toBe('2024-02-29T12:34:56+0800')
    expect(
      zodDateTime({ offset: true }).safeParse('2024-02-29T12:34:56+99:99')
        .success,
    ).toBe(false)
    expect(zodDateTime({ local: true }).parse('2024-02-29T12:34:56')).toBe(
      '2024-02-29T12:34:56',
    )
    expect(zodDateTime({ precision: -1 }).parse('2024-02-29T12:34Z')).toBe(
      '2024-02-29T12:34Z',
    )
    expect(
      zodDateTime({ precision: -1 }).safeParse('2024-02-29T12:34:56Z').success,
    ).toBe(false)
    expect(zodDateTime({ precision: 0 }).parse('2024-02-29T12:34:56Z')).toBe(
      '2024-02-29T12:34:56Z',
    )
    expect(
      zodDateTime({ precision: 0 }).safeParse('2024-02-29T12:34Z').success,
    ).toBe(false)
    expect(
      zodDateTime({ precision: 0 }).safeParse('2024-02-29T12:34:56.1Z').success,
    ).toBe(false)
    expect(
      zodDateTime({ precision: 3 }).parse('2024-02-29T12:34:56.123Z'),
    ).toBe('2024-02-29T12:34:56.123Z')
    expect(
      zodDateTime({ precision: 3 }).safeParse('2024-02-29T12:34:56.12Z')
        .success,
    ).toBe(false)
  })
})

describe('enum and containers', () => {
  it('matches enum values exactly', () => {
    const schema = zodEnum({ values: ['read', 'write'], label: 'Permission' })
    expect(schema.parse('read')).toBe('read')
    expect(issues(schema, 'READ')[0].message).toBe(
      'Permission must be one of: read, write',
    )
    expect(schema.safeParse(' read ').success).toBe(false)
  })

  it('enforces array counts independently from item messages and paths', () => {
    expect(zodArray({ item: zodInt({}) }).parse([])).toEqual([])
    const schema = zodArray({
      item: zodInt({ label: 'Item' }),
      min: 1,
      max: 2,
      message: 'Container error',
    })
    expect(issues(schema, [1.5])[0]).toMatchObject({
      path: [0],
      message: 'Item must be a valid integer',
    })
    expect(issues(schema, [1, 2, 3])[0].message).toBe('Container error')
    expect(issues(schema, [])[0].message).toBe('Container error')
    expect(
      issues(zodArray({ item: z.string(), length: 2 }), ['a'])[0].message,
    ).toContain('exactly 2 items')
    expect(
      issues(
        zodArray({ item: z.string(), max: 100, label: 'Permissions' }),
        Array.from({ length: 101 }, () => 'x'),
      )[0].message,
    ).toBe('Permissions must contain at most 100 items')
  })

  it('rejects unknown keys by default, or strips/allows them explicitly', () => {
    const shape = { name: zodString({ label: 'Name' }) }
    expect(issues(zodObject({ shape }), { name: 'a', extra: 1 })[0].code).toBe(
      'unrecognized_keys',
    )
    expect(
      zodObject({ shape, unknownKeys: 'strip' }).parse({
        name: ' a ',
        extra: 1,
      }),
    ).toEqual({ name: 'a' })
    expect(
      zodObject({ shape, unknownKeys: 'allow' }).parse({ name: 'a', extra: 1 }),
    ).toEqual({ name: 'a', extra: 1 })
    expect(
      issues(zodObject({ shape, message: 'Container error' }), { name: '' })[0],
    ).toMatchObject({ path: ['name'], message: 'Name cannot be empty' })
    expect(
      issues(zodObject({ shape, message: { unknownKeys: 'No extras' } }), {
        name: 'a',
        extra: 1,
      })[0].message,
    ).toBe('No extras')
  })

  it('counts properties after parsing, including defaults and retained extras', () => {
    expect(
      zodObject({
        shape: { name: zodString({ default: 'a' }) },
        minProperties: 1,
      }).parse({}),
    ).toEqual({ name: 'a' })
    expect(
      zodObject({
        shape: { name: zodString({ required: false }) },
        minProperties: 1,
      }).safeParse({}).success,
    ).toBe(false)
    expect(
      zodObject({
        shape: {},
        unknownKeys: 'strip',
        minProperties: 1,
      }).safeParse({ extra: 1 }).success,
    ).toBe(false)
    expect(
      zodObject({ shape: {}, unknownKeys: 'allow', minProperties: 1 }).parse({
        extra: 1,
      }),
    ).toEqual({ extra: 1 })
  })
})

describe('messages and refinements', () => {
  it('supports partial category overrides and a blanket helper message', () => {
    const schema = zodString({
      min: 3,
      max: 5,
      label: 'Name',
      message: { min: 'Too short' },
    })
    expect(issues(schema, undefined)[0].message).toBe('Name is required')
    expect(issues(schema, '')[0].message).toBe('Name cannot be empty')
    expect(issues(schema, 'ab')[0].message).toBe('Too short')
    expect(issues(schema, 'abcdef')[0].message).toBe(
      'Name must contain at most 5 characters',
    )
    expect(issues(schema, 1)[0].message).toBe('Name must be text')
    const blanket = zodString({ min: 3, regex: '^a', message: 'Override' })
    for (const value of [undefined, null, 1, '', 'z'])
      expect(
        issues(blanket, value).every((issue) => issue.message === 'Override'),
      ).toBe(true)
  })

  it('refines normalized present values and skips null, omission and invalid types', () => {
    const check = vi.fn((value: string) => value === 'abc')
    const schema = zodString({
      case: 'lower',
      required: false,
      nullable: true,
      refine: [{ check }],
    })
    schema.parse(' ABC ')
    schema.parse(null)
    schema.parse(undefined)
    schema.safeParse(1)
    expect(check).toHaveBeenCalledExactlyOnceWith('abc')
    expect(issues(schema, 'no')[0].message).toBe(
      'This field does not satisfy the required condition',
    )
  })

  it('preserves cross-field paths, issue codes and refinement message priority', () => {
    const schema = zodObject({
      shape: {
        password: zodString({ trim: false }),
        confirm: zodString({ trim: false }),
      },
      message: { refine: 'Fallback' },
      refine: [
        {
          check: (value) => value.password === value.confirm,
          message: 'Mismatch',
          path: ['confirm'],
        },
      ],
      superRefine: (_value, ctx) => {
        ctx.addIssue({
          code: 'custom',
          path: ['password'],
          message: 'Explicit',
        })
        ctx.addIssue({
          code: 'too_small',
          path: ['confirm'],
          minimum: 5,
          inclusive: true,
          type: 'string',
        })
      },
    })
    expect(issues(schema, { password: 'a', confirm: 'b' })).toMatchObject([
      { code: 'custom', path: ['confirm'], message: 'Mismatch' },
      { code: 'custom', path: ['password'], message: 'Explicit' },
      { code: 'too_small', path: ['confirm'], message: 'Fallback', minimum: 5 },
    ])
    expect(
      issues(
        zodString({
          message: { invalid: 'Invalid fallback' },
          refine: [{ check: () => false }],
        }),
        'a',
      )[0].message,
    ).toBe('Invalid fallback')
    expect(
      issues(
        zodString({
          message: 'Blanket',
          refine: [{ check: () => false, message: 'Rule' }],
          superRefine: (_value, ctx) => {
            ctx.addIssue({ code: 'custom', message: 'Explicit' })
          },
        }),
        'a',
      ).map((issue) => issue.message),
    ).toEqual(['Blanket', 'Blanket'])
  })

  it('supports ordinary native chaining with independent messages', () => {
    const schema = zodString({ message: 'Helper' })
      .refine(() => false, 'Native')
      .superRefine((_value, ctx) => {
        ctx.addIssue({ code: 'custom', message: 'Native super' })
      })
    expect(issues(schema, 'a').map((issue) => issue.message)).toEqual([
      'Native',
      'Native super',
    ])
  })

  it('rejects async callbacks at construction and hidden Promises during parsing', () => {
    expect(() =>
      Reflect.apply(zodString, null, [
        { refine: [{ check: async () => true }] },
      ]),
    ).toThrow(/synchronous/)
    expect(() =>
      Reflect.apply(zodString, null, [{ superRefine: async () => {} }]),
    ).toThrow(/synchronous/)
    const refine = Reflect.apply(zodString, null, [
      { refine: [{ check: () => Promise.resolve(true) }] },
    ]) as z.ZodType<string>
    expect(() => refine.parse('a')).toThrow(/Promise/)
    const superRefine = Reflect.apply(zodString, null, [
      { superRefine: () => Promise.resolve() },
    ]) as z.ZodType<string>
    expect(() => superRefine.parse('a')).toThrow(/Promise/)
  })

  it('skips object refinements after child type failures and preserves fatal issue behavior', () => {
    const check = vi.fn(() => true)
    const schema = zodObject({
      shape: { value: zodInt({}) },
      refine: [{ check }],
    })
    schema.safeParse({ value: 'wrong' })
    expect(check).not.toHaveBeenCalled()
    const native = vi.fn(() => true)
    const fatal = zodString({
      superRefine: (_value, ctx) => {
        ctx.addIssue({
          code: 'custom',
          fatal: true,
          path: ['detail'],
          message: 'Stop',
        })
      },
    }).refine(native)
    expect(issues(fatal, 'a')[0]).toMatchObject({
      fatal: true,
      path: ['detail'],
      message: 'Stop',
    })
    expect(native).not.toHaveBeenCalled()
  })
})

describe('configuration and inference', () => {
  it('accepts void synchronous callbacks and rejects async callbacks in public types', () => {
    const callback = (value: string): void => {
      expect(value).toBe('a')
    }
    zodString({ superRefine: callback }).parse('a')
    const compileOnly = () => {
      // @ts-expect-error Async rules are outside the synchronous contract.
      zodString({ refine: [{ check: async () => true }] })
      // @ts-expect-error Async superRefine callbacks are outside the synchronous contract.
      zodString({ superRefine: async () => {} })
      // @ts-expect-error A number is not a string default.
      zodString({ default: 1 })
      // @ts-expect-error Null defaults require nullable=true.
      zodString({ default: null })
      // @ts-expect-error Integer messages are not valid string message categories.
      zodString({ message: { integer: 'Invalid' } })
    }
    expectTypeOf(compileOnly).returns.toBeVoid()
  })

  it('rejects contradictory safe-integer bounds and wrong-type coercible defaults', () => {
    expect(() => zodInt({ min: Number.MAX_SAFE_INTEGER + 1 })).toThrow(
      /safe integer/,
    )
    expect(() => zodInt({ min: 0.1, max: 0.9 })).toThrow(/safe integer/)
    expect(() => zodString({ max: 0 })).toThrow(/minimum/)
    expect(() =>
      Reflect.apply(zodBoolean, null, [{ default: 'false', coerce: true }]),
    ).toThrow(/default/)
  })
  it.each([
    () => zodString({ min: -1 }),
    () => zodString({ max: 1.5 }),
    () => zodString({ min: 3, max: 2 }),
    () => zodString({ min: 3, length: 2 }),
    () => zodString({ max: 1, length: 2 }),
    () => zodString({ regex: '[' }),
    () => zodNumber({ min: Infinity }),
    () => zodNumber({ multipleOf: 0 }),
    () => zodInt({ multipleOf: -1 }),
    () => zodArray({ item: z.string(), min: -1 }),
    () => zodDate({ min: '2023-02-29' }),
    () => zodDate({ min: '2024-02-02', max: '2024-02-01' }),
    () => zodDateTime({ precision: -2 }),
    () => zodDateTime({ precision: 0.5 }),
    () => zodUrl({ protocols: [] }),
    () => zodUrl({ protocols: ['https:'] }),
    () => zodObject({ shape: {}, minProperties: -1 }),
  ])('rejects invalid bounds and patterns', (create) => {
    expect(create).toThrow(/configuration/)
  })

  it('rejects unsupported runtime configuration and irrelevant message keys', () => {
    for (const options of [
      { unsupported: true },
      { trim: 'yes' },
      { label: 1 },
      { case: 'title' },
      { message: { integer: 'bad' } },
      { message: { min: 1 } },
      { refine: [{}] },
    ])
      expect(() => Reflect.apply(zodString, null, [options])).toThrow(
        /configuration/,
      )
    expect(() => Reflect.apply(zodEnum, null, [{ values: [] }])).toThrow(
      /configuration/,
    )
    expect(() => Reflect.apply(zodArray, null, [{ item: {} }])).toThrow(
      /configuration/,
    )
    expect(() =>
      Reflect.apply(zodObject, null, [{ shape: { name: {} } }]),
    ).toThrow(/configuration/)
    expect(() =>
      Reflect.apply(zodObject, null, [{ shape: {}, unknownKeys: 'other' }]),
    ).toThrow(/configuration/)
  })

  it('infers presence, defaults, enum literals, items and object fields', () => {
    const required = zodString({})
    const optional = zodString({ required: false })
    const nullable = zodString({ nullable: true })
    const both = zodString({ required: false, nullable: true })
    const defaulted = zodInt({ required: false, default: 1 })
    const enumeration = zodEnum({ values: ['read', 'write'] })
    const array = zodArray({ item: enumeration })
    const object = zodObject({
      shape: { name: required, note: both, page: defaulted },
      refine: [
        {
          check: (value) => {
            expectTypeOf(value.page).toEqualTypeOf<number>()
            return true
          },
        },
      ],
    })
    expectTypeOf<z.output<typeof required>>().toEqualTypeOf<string>()
    expectTypeOf<z.output<typeof optional>>().toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf<z.output<typeof nullable>>().toEqualTypeOf<string | null>()
    expectTypeOf<z.output<typeof both>>().toEqualTypeOf<
      string | null | undefined
    >()
    expectTypeOf<z.output<typeof defaulted>>().toEqualTypeOf<number>()
    expectTypeOf<z.output<typeof enumeration>>().toEqualTypeOf<
      'read' | 'write'
    >()
    expectTypeOf<z.output<typeof array>>().toEqualTypeOf<('read' | 'write')[]>()
    expectTypeOf<z.output<typeof object>>().toEqualTypeOf<{
      name: string
      page: number
      note?: string | null | undefined
    }>()
    expectTypeOf<LoginDto>().toEqualTypeOf<{
      email: string
      password: string
    }>()
    const boolean = zodBoolean({
      refine: [
        {
          check: (value) => {
            expectTypeOf(value).toEqualTypeOf<boolean>()
            return true
          },
        },
      ],
    })
    expectTypeOf<z.output<typeof boolean>>().toEqualTypeOf<boolean>()
    const allowed = zodObject({
      shape: { name: required },
      unknownKeys: 'allow',
    })
    expectTypeOf(allowed.parse({ name: 'a' }).extra).toEqualTypeOf<unknown>()
    const config: ZodStringOptions<false> = { required: false }
    expectTypeOf<z.output<ReturnType<typeof zodString<false>>>>().toEqualTypeOf<
      string | undefined
    >()
    expect(zodString(config).parse(undefined)).toBeUndefined()
  })
})

describe('existing form compatibility', () => {
  const original = z.object({
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
  })

  it.each([
    { email: ' User@Example.com ', password: ' secret ', extra: true },
    { email: 'a@example.com', password: '   ' },
    { email: '', password: '' },
    { email: 'invalid', password: '' },
    { email: 'a@example.com' },
    {},
  ])(
    'preserves login parsed values, explicit messages and paths: %j',
    (value) => {
      const before = original.safeParse(value)
      const after = LoginSchema.safeParse(value)
      expect(after.success).toBe(before.success)
      if (before.success && after.success)
        expect(after.data).toEqual(before.data)
      if (!before.success && !after.success)
        expect(
          after.error.issues.map(({ path, message }) => ({ path, message })),
        ).toEqual(
          before.error.issues.map(({ path, message }) => ({ path, message })),
        )
    },
  )

  it('returns parsed values and field errors through the existing Zod resolver', async () => {
    const resolve = zodResolver(LoginSchema)
    const options = { fields: {}, shouldUseNativeValidation: false }
    expect(
      await resolve(
        { email: ' a@example.com ', password: ' secret ' },
        undefined,
        options,
      ),
    ).toEqual({
      errors: {},
      values: { email: 'a@example.com', password: ' secret ' },
    })
    const result = await resolve(
      { email: '', password: '' },
      undefined,
      options,
    )
    expect(result.errors.email?.message).toBe(
      'Please enter a valid email address',
    )
    expect(result.errors.password?.message).toBe('Password is required')
  })
})
