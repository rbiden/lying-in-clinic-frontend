import { expect, it, vi } from 'vitest'
import { api } from '@/lib/axios'
import { AuditLogsService } from './audit-logs.service'

vi.mock('@/lib/axios', () => ({ api: { get: vi.fn() } }))

it('uses shared Axios with the pagination contract', async () => {
  const response = {
    success: true,
    message: 'ok',
    data: {
      items: [],
      pagination: { page: 2, limit: 10, total: 13, totalPages: 2 },
    },
  }
  vi.mocked(api.get).mockResolvedValue({ data: response })
  expect(await AuditLogsService.GET_ALL({ page: 2, limit: 10 })).toBe(response)
  expect(api.get).toHaveBeenCalledWith('/v1/audit-logs', {
    params: { page: 2, limit: 10 },
  })
  expect(await AuditLogsService.GET_ALL()).toBe(response)
  expect(api.get).toHaveBeenLastCalledWith('/v1/audit-logs', { params: {} })
})
