import { zodEnum, zodNumber, zodObject, zodString } from '#/helpers/zod'
import { brandDefaults } from './brand-defaults'

const settings = zodObject({
  unknownKeys: 'strip',
  shape: {
    VITE_APP_NAME: zodString({ default: brandDefaults.name }),
    VITE_APP_SHORT_NAME: zodString({ required: false }),
    VITE_BRAND_WELCOME_TITLE: zodString({
      default: brandDefaults.welcomeTitle,
    }),
    VITE_BRAND_LOGIN_DESCRIPTION: zodString({
      default: brandDefaults.loginDescription,
    }),
    VITE_BRAND_ACCESS_HELP: zodString({ default: brandDefaults.accessHelp }),
    VITE_BRAND_TAGLINE: zodString({ default: brandDefaults.tagline }),
    VITE_BRAND_DESCRIPTION: zodString({ default: brandDefaults.description }),
    VITE_BRAND_COPYRIGHT_HOLDER: zodString({ required: false }),
    VITE_BRAND_WORKSPACE_LABEL: zodString({
      default: brandDefaults.workspaceLabel,
    }),
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
