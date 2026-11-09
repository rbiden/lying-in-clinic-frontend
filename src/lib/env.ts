import { zodEnum, zodNumber, zodObject, zodString } from '#/helpers/zod'

const settings = zodObject({
  unknownKeys: 'strip',
  shape: {
    VITE_API_BASE_URL: zodString({ default: '/api/v1' }),
    VITE_API_TIMEOUT_MS: zodString({ default: '15000' }).pipe(
      zodNumber({ coerce: true }).refine(
        (value) => value > 0,
        'Must be greater than zero',
      ),
    ),
    VITE_AUTH_STALE_TIME_MS: zodString({ default: '300000' }).pipe(
      zodNumber({ coerce: true, min: 0 }),
    ),
    VITE_AUTH_SYNC_TABS: zodEnum({
      values: ['true', 'false'],
      default: 'true',
    }).transform((value) => value === 'true'),
  },
})

export const env = settings.parse(import.meta.env)
