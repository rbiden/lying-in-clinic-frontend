// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { AuditLogs } from '@/pages/AuditLogs'
import { AuditLogsService } from './audit-logs.service'
import type { AuditLogsPage } from './audit-logs.service'
import type { ApiResponse } from '@/types'
import { useTableQueryStore } from '@/stores/table-query-store'

vi.mock('./audit-logs.service', () => ({
  AuditLogsService: { GET_ALL: vi.fn() },
}))
const response = (page: number, total: number): ApiResponse<AuditLogsPage> => ({
  success: true,
  message: 'ok',
  data: {
    items:
      page <= Math.ceil(total / 10)
        ? [
            {
              id: `event-${page}`,
              userId: null,
              user: null,
              model: `Model page ${page}`,
              action: 'POST',
              createdAt: '2026-10-14T00:00:00Z',
            },
          ]
        : [],
    pagination: { page, limit: 10, total, totalPages: Math.ceil(total / 10) },
  },
})
let container: HTMLDivElement
let root: ReturnType<typeof createRoot>
let client: QueryClient
let router: ReturnType<typeof createMemoryRouter>
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.mocked(AuditLogsService.GET_ALL).mockReset()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
})
afterEach(async () => {
  await act(async () => root.unmount())
  router.dispose()
  client.clear()
  container.remove()
  vi.unstubAllGlobals()
})
async function mount(path = '/') {
  router = createMemoryRouter([{ path: '/', element: <AuditLogs /> }], {
    initialEntries: [path],
  })
  await act(async () =>
    root.render(
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  )
}
async function eventually(assertion: () => void) {
  await act(async () => {
    await vi.waitFor(assertion)
  })
}

it('shows native query failure state and retries the requested page through the service', async () => {
  vi.mocked(AuditLogsService.GET_ALL)
    .mockResolvedValueOnce(response(1, 20))
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(response(2, 20))
  await mount()
  await eventually(() =>
    expect(container.textContent).toContain('Model page 1'),
  )
  await act(async () =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="Next page"]')!
      .click(),
  )
  await eventually(() =>
    expect(container.querySelector('[role="alert"]')).not.toBeNull(),
  )
  expect(container.textContent).not.toContain('Model page 1')
  await act(async () =>
    container
      .querySelector<HTMLButtonElement>('[role="alert"] button')!
      .click(),
  )
  await eventually(() =>
    expect(container.textContent).toContain('Model page 2'),
  )
  expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
    page: 2,
    limit: 10,
  })
})

it('preserves the requested URL page when the server returns an empty page', async () => {
  vi.mocked(AuditLogsService.GET_ALL).mockImplementation(
    async ({ page = 1 } = {}) => response(page, 12),
  )
  await mount('/?audit-logs.page=5')
  await eventually(() =>
    expect(container.textContent).toContain('No records found.'),
  )
  expect(AuditLogsService.GET_ALL).toHaveBeenCalledWith({ page: 5, limit: 10 })
  expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
    page: 5,
    limit: 10,
  })
})

it('sends applied Zustand filters through the table query and resets pagination without filtering rows locally', async () => {
  vi.mocked(AuditLogsService.GET_ALL).mockImplementation(
    async ({ page = 1 } = {}) => response(page, 20),
  )
  await mount('/?audit-logs.page=2')
  await eventually(() =>
    expect(container.textContent).toContain('Model page 2'),
  )
  await act(async () => {
    useTableQueryStore
      .getState()
      .setFilters('audit-logs', { action: 'POST', model: 'User' })
  })
  await eventually(() =>
    expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
      page: 1,
      limit: 10,
      action: 'POST',
      model: 'User',
    }),
  )
  await eventually(() =>
    expect(container.textContent).toContain('Model page 1'),
  )
  expect(
    client.getQueryData([
      'audit-logs',
      { page: 1, limit: 10, action: 'POST', model: 'User' },
    ]),
  ).toBeDefined()
  await act(async () => {
    useTableQueryStore.getState().resetFilters('audit-logs')
  })
  await eventually(() =>
    expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
      page: 1,
      limit: 10,
    }),
  )
})

it('invalidates and refetches the same page without changing pagination', async () => {
  vi.mocked(AuditLogsService.GET_ALL)
    .mockResolvedValueOnce(response(2, 20))
    .mockResolvedValueOnce(response(2, 10))
  await mount('/?audit-logs.page=2')
  await eventually(() =>
    expect(container.textContent).toContain('Model page 2'),
  )
  await act(async () => {
    await client.invalidateQueries({ queryKey: ['audit-logs'] })
  })
  await eventually(() =>
    expect(container.textContent).toContain('No records found.'),
  )
  expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
    page: 2,
    limit: 10,
  })
  expect(AuditLogsService.GET_ALL).toHaveBeenCalledTimes(2)
  expect(router.state.location.search).toContain('audit-logs.page=2')
})
