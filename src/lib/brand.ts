import { env } from './env'

export const brand = {
  name: env.VITE_APP_NAME,
  shortName: env.VITE_APP_SHORT_NAME ?? env.VITE_APP_NAME,
  welcomeTitle: env.VITE_BRAND_WELCOME_TITLE,
  loginDescription: env.VITE_BRAND_LOGIN_DESCRIPTION,
  accessHelp: env.VITE_BRAND_ACCESS_HELP,
  tagline: env.VITE_BRAND_TAGLINE,
  description: env.VITE_BRAND_DESCRIPTION,
  copyrightHolder: env.VITE_BRAND_COPYRIGHT_HOLDER ?? env.VITE_APP_NAME,
  workspaceLabel: env.VITE_BRAND_WORKSPACE_LABEL,
}
