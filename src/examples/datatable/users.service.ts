import type { TableState } from '@/types/datatable.types'
import type { ExampleUser, UserFilters } from './users.schema'

const names = [
  'John Doe',
  'Jane Santos',
  'Alex Reyes',
  'Sam Rivera',
  'Chris Tan',
  'Pat Cruz',
  'Morgan Lee',
  'Taylor Lim',
  'Jamie Ong',
  'Robin Diaz',
  'Casey Chua',
  'Jordan Yap',
]

const users: ExampleUser[] = Array.from({ length: 37 }, (_, index) => ({
  id: `user-${index + 1}`,
  name: `${names[index % names.length]}${index >= names.length ? ` ${Math.floor(index / names.length) + 1}` : ''}`,
  email: `user${index + 1}@example.com`,
  status: index % 4 === 0 ? 'inactive' : 'active',
  joinedDate: `2026-${String((index % 9) + 1).padStart(2, '0')}-${String((index % 27) + 1).padStart(2, '0')}`,
}))

export interface UserTableRequest {
  state: TableState
  filters: UserFilters
  search: string
  queryIdentity: string
}
export interface MockScenario {
  delayMs: number
  mode: 'normal' | 'error' | 'empty' | 'reduced'
}

/** Simulates server work, not a client row model inside DataTable. */
export async function getExampleUsers(
  request: UserTableRequest,
  scenario: MockScenario,
  signal?: AbortSignal,
) {
  await new Promise<void>((resolve, reject) => {
    if (signal?.aborted)
      return reject(new DOMException('Aborted', 'AbortError'))
    const abort = () => {
      clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', abort)
      resolve()
    }, scenario.delayMs)
    signal?.addEventListener('abort', abort, { once: true })
  })
  if (scenario.mode === 'error')
    throw new Error('Example request failed. Switch to Normal and retry.')
  const source =
    scenario.mode === 'empty'
      ? []
      : scenario.mode === 'reduced'
        ? users.slice(0, 3)
        : users
  const search = request.search.trim().toLowerCase()
  const filtered = source.filter(
    (user) =>
      (!search || user.name.toLowerCase().includes(search)) &&
      (!request.filters.status || user.status === request.filters.status) &&
      (!request.filters.joined?.from ||
        user.joinedDate >= request.filters.joined.from) &&
      (!request.filters.joined?.to ||
        user.joinedDate <= request.filters.joined.to),
  )
  if (request.state.sortField && request.state.sortType) {
    const field = request.state.sortField
    const direction = request.state.sortType === 'desc' ? -1 : 1
    const value = (user: ExampleUser) =>
      field === 'joined_date'
        ? user.joinedDate
        : field === 'status'
          ? user.status
          : user.name
    filtered.sort(
      (a, b) =>
        direction * value(a).localeCompare(value(b)) ||
        a.id.localeCompare(b.id),
    )
  }
  const start = (request.state.page - 1) * request.state.limit
  return {
    rows: filtered.slice(start, start + request.state.limit),
    totalCount: filtered.length,
    queryIdentity: request.queryIdentity,
  }
}
