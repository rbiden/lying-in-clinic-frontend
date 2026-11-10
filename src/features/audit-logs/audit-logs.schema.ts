import { z } from 'zod'

export const auditLogsFilterSchema = z
  .object({
    event: z
      .string()
      .max(100, 'Event must be 100 characters or fewer.')
      .optional(),
    from: z.string().date('From must be a valid calendar date.').optional(),
    to: z.string().date('To must be a valid calendar date.').optional(),
  })
  .refine(({ from, to }) => !from || !to || from <= to, {
    message: 'To must be on or after From.',
    path: ['to'],
  })

export function cleanAuditLogsSearch(search: string): string {
  const params = new URLSearchParams(search)
  for (const name of ['search', 'sortField', 'sortType']) {
    params.delete(`audit-logs.${name}`)
  }
  const encoded = params.get('audit-logs.filters')
  if (encoded !== null) {
    let filters = {}
    try {
      const parsed = auditLogsFilterSchema.safeParse(JSON.parse(encoded))
      if (parsed.success) filters = parsed.data
    } catch {
      // Old or malformed audit URLs restore the empty filter set.
    }
    params.set('audit-logs.filters', JSON.stringify(filters))
  }
  const cleaned = params.toString()
  return cleaned ? `?${cleaned}` : ''
}
