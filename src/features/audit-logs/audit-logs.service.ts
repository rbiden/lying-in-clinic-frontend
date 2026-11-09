import { api } from '@/lib/axios'
import type { ApiResponse, QueryParams } from '@/types'

export interface AuditLog {
  id: string
  userId: string | null
  model: string
  action: string
  createdAt: string
  user: { id: string; username: string; fullName: string } | null
}

export interface AuditLogsPage {
  items: AuditLog[]
  pagination: Required<Pick<QueryParams, 'page' | 'limit'>> & {
    total: number
    totalPages: number
  }
}

export const AuditLogsService = {
  GET_ALL: async (params: QueryParams = {}) => {
    const response = await api.get<ApiResponse<AuditLogsPage>>(
      '/v1/audit-logs',
      {
        params,
      },
    )
    return response.data
  },
}
