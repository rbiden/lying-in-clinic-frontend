import { CanceledError, isAxiosError } from 'axios'
import { api, initializeCsrf } from '@/lib/axios'
import { useAuthStore } from './auth.store'
import { SessionResponseSchema } from './auth.schema'
import type { LoginDto } from './auth.schema'
import type { SessionResponse } from './auth.session'

export const AuthService = {
  LOGIN: async (credentials: LoginDto): Promise<SessionResponse> => {
    const version = useAuthStore.getState().version
    await initializeCsrf(version)

    const response = await api.post('/login', credentials)

    if (version !== useAuthStore.getState().version)
      throw new CanceledError('Session changed')

    return SessionResponseSchema.parse(response.data)
  },

  ME: async (signal?: AbortSignal): Promise<SessionResponse> => {
    const response = await api.get('/me', { signal })
    return SessionResponseSchema.parse(response.data)
  },

  LOGOUT: async (): Promise<void> => {
    const version = useAuthStore.getState().version
    await initializeCsrf(version)

    try {
      await api.post('/logout', {})
    } catch (error) {
      if (!isAxiosError(error) || error.response?.status !== 401) throw error
    }
  },
}
