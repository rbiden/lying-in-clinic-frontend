// @vitest-environment happy-dom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { AuditLogs } from '@/pages/AuditLogs'
import { AuditLogsService } from './audit-logs.service'
import type { AuditLog } from './audit-logs.types'
import type { PaginateResponse } from '@/types'
import { useTableQueryStore } from '@/stores/table-query-store'

vi.mock('./audit-logs.service', () => ({
  AuditLogsService: { GET_ALL: vi.fn() },
}))
const response = (page: number, total: number): PaginateResponse<AuditLog> => ({
  data:
    page <= Math.ceil(total / 10)
      ? [
          {
            id: page,
            actor_id: null,
            subject_type: `Subject page ${page}`,
            subject_id: null,
            event: 'created',
            changed_fields: [],
            old_values: [],
            new_values: { active: true },
            occurred_at: '2026-10-14T00:00:00Z',
            correlation_id: 'request-id',
          },
        ]
      : [],
  links: { first: null, last: null, prev: null, next: null },
  meta: {
    current_page: page,
    per_page: 10,
    total,
    last_page: Math.ceil(total / 10),
    from: null,
    to: null,
    path: '/api/v1/audit-logs',
    links: [],
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
    expect(container.textContent).toContain('Subject page 1'),
  )
  await act(async () =>
    container
      .querySelector<HTMLButtonElement>('[aria-label="Next page"]')!
      .click(),
  )
  await eventually(() =>
    expect(container.querySelector('[role="alert"]')).not.toBeNull(),
  )
  expect(container.textContent).not.toContain('Subject page 1')
  await act(async () =>
    container
      .querySelector<HTMLButtonElement>('[role="alert"] button')!
      .click(),
  )
  await eventually(() =>
    expect(container.textContent).toContain('Subject page 2'),
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
    expect(container.textContent).toContain('Subject page 2'),
  )
  await act(async () => {
    useTableQueryStore.getState().setFilters('audit-logs', {
      event: 'auth.login.failed',
      from: '2026-10-01',
      to: '2026-10-14',
    })
  })
  await eventually(() =>
    expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
      page: 1,
      limit: 10,
      event: 'auth.login.failed',
      from: '2026-10-01',
      to: '2026-10-14',
    }),
  )
  await eventually(() =>
    expect(container.textContent).toContain('Subject page 1'),
  )
  expect(
    client.getQueryData([
      'audit-logs',
      {
        page: 1,
        limit: 10,
        event: 'auth.login.failed',
        from: '2026-10-01',
        to: '2026-10-14',
      },
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
    expect(container.textContent).toContain('Subject page 2'),
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

it('cleans old audit URLs before requesting rows and preserves other URL state', async () => {
  vi.mocked(AuditLogsService.GET_ALL).mockResolvedValue(response(2, 20))
  const params = new URLSearchParams({
    'audit-logs.page': '2',
    'audit-logs.limit': '10',
    'audit-logs.search': 'old search',
    'audit-logs.sortField': 'createdAt',
    'audit-logs.sortType': 'asc',
    'audit-logs.filters': JSON.stringify({
      action: 'POST',
      model: 'User',
      event: 'created',
      from: '2026-10-01',
    }),
    tab: 'history',
  })
  await mount(`/?${params}#events`)
  await eventually(() =>
    expect(AuditLogsService.GET_ALL).toHaveBeenCalledWith({
      page: 2,
      limit: 10,
      event: 'created',
      from: '2026-10-01',
    }),
  )
  const restored = new URLSearchParams(router.state.location.search)
  expect(restored.has('audit-logs.search')).toBe(false)
  expect(restored.has('audit-logs.sortField')).toBe(false)
  expect(restored.has('audit-logs.sortType')).toBe(false)
  expect(JSON.parse(restored.get('audit-logs.filters')!)).toEqual({
    event: 'created',
    from: '2026-10-01',
  })
  expect(restored.get('tab')).toBe('history')
  expect(router.state.location.hash).toBe('#events')
  expect(container.querySelector('input[type="search"]')).toBeNull()
  expect(container.querySelector('[aria-sort]')).toBeNull()
  expect(useTableQueryStore.getState().tables['audit-logs'].search).toBe('')

  await act(async () => {
    await router.navigate('/?audit-logs.page=1&audit-logs.search=stale')
  })
  await eventually(() =>
    expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
      page: 1,
      limit: 10,
    }),
  )
  expect(
    new URLSearchParams(router.state.location.search).has('audit-logs.search'),
  ).toBe(false)
})

it('rejects invalid calendar dates and reversed ranges before changing applied filters', async () => {
  vi.mocked(AuditLogsService.GET_ALL).mockResolvedValue(response(1, 20))
  await mount()
  await eventually(() =>
    expect(AuditLogsService.GET_ALL).toHaveBeenCalledTimes(1),
  )
  const store = useTableQueryStore.getState()
  expect(
    store.setFilters('audit-logs', { from: '2026-11-11', to: '2026-11-01' }),
  ).toEqual({ success: false, message: 'To must be on or after From.' })
  expect(store.setFilters('audit-logs', { from: '2026-02-29' }).success).toBe(
    false,
  )
  expect(
    store.setFilters('audit-logs', { event: 'a'.repeat(101) }).success,
  ).toBe(false)
  expect(AuditLogsService.GET_ALL).toHaveBeenCalledTimes(1)
  await act(async () => {
    expect(
      store.setFilters('audit-logs', { from: '2026-11-11', to: '2026-11-11' })
        .success,
    ).toBe(true)
  })
  await eventually(() =>
    expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
      page: 1,
      limit: 10,
      from: '2026-11-11',
      to: '2026-11-11',
    }),
  )
})

it('cleans invalid restored dates and displays null identifiers without inventing an actor', async () => {
  const result = response(1, 1)
  result.data[0].subject_type = null
  vi.mocked(AuditLogsService.GET_ALL).mockResolvedValue(result)
  await mount(
    `/?audit-logs.filters=${encodeURIComponent(JSON.stringify({ from: '2026-11-11', to: '2026-11-01' }))}`,
  )
  await eventually(() =>
    expect(container.textContent).toContain('Not recorded'),
  )
  expect(AuditLogsService.GET_ALL).toHaveBeenLastCalledWith({
    page: 1,
    limit: 10,
  })
  expect(container.textContent.match(/Not recorded/g)).toHaveLength(3)
  expect(container.textContent).not.toContain('System')
  expect(container.textContent).toContain('UTC calendar date')
  expect(container.textContent).toContain('Asia/Manila')
})
