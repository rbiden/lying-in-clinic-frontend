import type z from 'zod'
import { zodEmail, zodEnum, zodObject, zodString } from '#/helpers/zod'

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
