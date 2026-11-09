import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AuditLogsService } from './audit-logs.service'
import type { QueryParams } from '@/types'

export const AUDIT_LOGS_QUERY_KEYS = {
  all: (params: QueryParams = {}) => ['audit-logs', params] as const,
}

export function useAuditLogsQuery(params: QueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEYS.all(params),
    queryFn: () => AuditLogsService.GET_ALL(params),
    enabled,
    placeholderData: keepPreviousData,
  })
}
