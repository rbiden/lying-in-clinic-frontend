import { expect, it, vi } from 'vitest'
import { api } from '@/lib/axios'
import { AuditLogsService } from './audit-logs.service'

vi.mock('@/lib/axios', () => ({ api: { get: vi.fn() } }))

it('maps table pagination to the Laravel resource endpoint', async () => {
  const response = {
    data: [],
    links: { first: null, last: null, prev: null, next: null },
    meta: { current_page: 2, per_page: 10, total: 13, last_page: 2 },
  }
  vi.mocked(api.get).mockResolvedValue({ data: response })
  expect(await AuditLogsService.GET_ALL({ page: 2, limit: 10 })).toBe(response)
  expect(api.get).toHaveBeenCalledWith('/audit-logs', {
    params: { page: 2, per_page: 10 },
  })
  expect(await AuditLogsService.GET_ALL()).toBe(response)
  expect(api.get).toHaveBeenLastCalledWith('/audit-logs', { params: {} })
})

it('sends only exact-event and UTC calendar-date filters without converting them', async () => {
  const params = {
    page: 3,
    limit: 25,
    event: 'auth.login.failed',
    from: '2026-11-01',
    to: '2026-11-11',
    search: 'unsupported',
    action: 'POST',
    model: 'User',
    sortField: 'occurred_at',
    sortType: 'asc',
  }
  await AuditLogsService.GET_ALL(params)
  expect(api.get).toHaveBeenLastCalledWith('/audit-logs', {
    params: {
      page: 3,
      per_page: 25,
      event: 'auth.login.failed',
      from: '2026-11-01',
      to: '2026-11-11',
    },
  })
})
