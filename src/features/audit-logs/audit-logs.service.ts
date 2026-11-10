import { api } from '@/lib/axios'
import type { PaginateResponse } from '@/types'
import type { AuditLog, AuditLogsParams } from './audit-logs.types'

export const AuditLogsService = {
  GET_ALL: async ({ page, limit, from, to, event }: AuditLogsParams = {}) => {
    const response = await api.get<PaginateResponse<AuditLog>>('/audit-logs', {
      params: {
        ...(page !== undefined && { page }),
        ...(limit !== undefined && { per_page: limit }),
        ...(from !== undefined && { from }),
        ...(to !== undefined && { to }),
        ...(event !== undefined && { event }),
      },
    })
    return response.data
  },
}
