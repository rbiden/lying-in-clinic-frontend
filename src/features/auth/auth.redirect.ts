import type { Location } from 'react-router'

const URL_PLACEHOLDER = 'https://inventory.local'

export function getSessionReturnUrl(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/'

  try {
    const decoded = decodeURIComponent(value)

    if (
      decoded.includes('\\') ||
      decoded.startsWith('//') ||
      Array.from(decoded).some(
        (character) =>
          character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
      )
    ) {
      return '/'
    }

    const url = new URL(decoded, URL_PLACEHOLDER)

    if (
      url.origin !== URL_PLACEHOLDER ||
      /^\/login(?:\/|$)/i.test(url.pathname)
    ) {
      return '/'
    }

    const original = new URL(value, URL_PLACEHOLDER)

    return original.pathname + original.search + original.hash
  } catch {
    return '/'
  }
}

export function getSessionLoginUrl(
  location: Pick<Location, 'pathname' | 'search' | 'hash'>,
  cause: 'logout' | 'expired' | null,
) {
  if (cause === 'logout') return '/login'

  const destination = getSessionReturnUrl(
    location.pathname + location.search + location.hash,
  )

  return `/login?redirect=${encodeURIComponent(destination)}`
}
