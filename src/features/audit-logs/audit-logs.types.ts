export interface AuditLog {
  id: number
  actor_id: number | null
  event: string
  subject_type: string | null
  subject_id: number | null
  changed_fields: string[]
  old_values: Record<string, unknown> | []
  new_values: Record<string, unknown> | []
  occurred_at: string
  correlation_id: string
}

export interface AuditLogsParams {
  page?: number
  limit?: number
  from?: string
  to?: string
  event?: string
}
