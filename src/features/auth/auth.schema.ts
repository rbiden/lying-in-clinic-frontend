import type z from 'zod'
import {
  zodBoolean,
  zodEmail,
  zodEnum,
  zodNumber,
  zodObject,
  zodString,
} from '#/helpers/zod'

export const AuthUserSchema = zodObject({
  unknownKeys: 'strip',
  shape: {
    id: zodNumber({ min: 1, multipleOf: 1 }),
    name: zodString({ trim: false }),
    email: zodEmail({}),
    role: zodEnum({ values: ['admin', 'staff'] }),
    active: zodBoolean({}),
  },
})

export const SessionResponseSchema = zodObject({
  unknownKeys: 'strip',
  shape: { data: AuthUserSchema },
})

export type AuthUser = z.infer<typeof AuthUserSchema>

export const LoginSchema = zodObject({
  unknownKeys: 'strip',
  shape: {
    email: zodEmail({
      message: {
        required: 'Required',
        empty: 'Please enter a valid email address',
        invalid: 'Please enter a valid email address',
      },
    }),
    password: zodString({
      trim: false,
      message: { required: 'Required', empty: 'Password is required' },
    }),
  },
})

export type LoginDto = z.infer<typeof LoginSchema>

export const SessionChangeSchema = zodObject({
  unknownKeys: 'strip',
  shape: {
    id: zodString({ trim: false, min: 0 }),
    reason: zodEnum({ values: ['login', 'logout', 'changed', 'expired'] }),
  },
})

export type SessionChange = z.infer<typeof SessionChangeSchema>['reason']
