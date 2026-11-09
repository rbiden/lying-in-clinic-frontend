import { api } from '@/lib/axios'
import type { AuthUser } from '../../routes/types'
import type { LoginDto } from './auth.schema'
import type { ApiResponse } from '#/types'

export interface CurrentUser {
  id: string
  email: string
  role: string
  fullName?: string
}

export const AuthService = {
  LOGIN: async (
    credentials: LoginDto,
  ): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await api.post<ApiResponse<{ user: AuthUser }>>(
      '/v1/auth/login',
      credentials,
    )

    return response.data
  },

  REFRESH: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await api.post<ApiResponse<{ user: AuthUser }>>(
      '/v1/auth/refresh',
      {},
    )

    return response.data
  },

  ME: async (
    signal?: AbortSignal,
  ): Promise<ApiResponse<{ user: AuthUser }>> => {
    const response = await api.get<ApiResponse<{ user: AuthUser }>>(
      '/v1/auth/me',
      { signal },
    )

    return response.data
  },

  LOGOUT: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      '/v1/auth/logout',
      {},
    )

    return response.data
  },
}
