import axios from 'axios'

export function getAxiosErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string' && data.trim()) {
      return data
    }
    if (data && typeof data === 'object') {
      const msg =
        (data as Record<string, unknown>).message ||
        (data as Record<string, unknown>).error
      if (typeof msg === 'string' && msg.trim()) {
        return msg
      }
    }
    if (error.message) {
      return error.message
    }
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
}

export function normalizeErrorMessage(message: unknown): string {
  if (typeof message !== 'string' || !message.trim()) {
    return 'An unexpected error occurred'
  }
  const trimmed = message.trim()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
