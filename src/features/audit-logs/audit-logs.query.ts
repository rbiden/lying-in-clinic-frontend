import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { AuditLogsService } from './audit-logs.service'
import type { AuditLogsParams } from './audit-logs.types'

export const AUDIT_LOGS_QUERY_KEYS = {
  all: (params: AuditLogsParams = {}) => ['audit-logs', params] as const,
}

export function useAuditLogsQuery(
  params: AuditLogsParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEYS.all(params),
    queryFn: () => AuditLogsService.GET_ALL(params),
    enabled,
    placeholderData: keepPreviousData,
  })
}
