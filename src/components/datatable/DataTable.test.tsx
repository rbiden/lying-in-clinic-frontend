// @vitest-environment happy-dom
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { DataTable } from './DataTable'
import { useTableState } from '@/hooks/use-table-state'
import type { DataTableColumn, TableInstance } from '@/types/datatable.types'

const rows = [
  { id: '1', name: 'Beta', active: true },
  { id: '2', name: 'Gamma', active: false },
  { id: '3', name: 'Alpha', active: true },
  { id: '4', name: 'Delta', active: true },
]
type Item = (typeof rows)[number]
const columns: DataTableColumn<Item>[] = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
]
let container: HTMLDivElement
let root: ReturnType<typeof createRoot>
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})
afterEach(async () => {
  await act(async () => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})
const names = () =>
  [...container.querySelectorAll('tbody tr')].map((row) => row.textContent)
const click = async (selector: string) => {
  await act(async () =>
    container.querySelector<HTMLButtonElement>(selector)!.click(),
  )
}

it('leaves server pagination under caller control when a response is empty', async () => {
  const setPage = vi.fn()
  const table: TableInstance = {
    state: { page: 3, limit: 10, sortField: null, sortType: null },
    setPage,
    setLimit: vi.fn(),
    setSort: vi.fn(),
  }
  const render = async (status: {
    isLoading?: boolean
    isFetching?: boolean
    error?: unknown
  }) => {
    await act(async () =>
      root.render(
        <DataTable
          table={table}
          rows={[]}
          columns={columns}
          totalCount={20}
          getRowId={(row) => row.id}
          {...status}
        />,
      ),
    )
  }
  await render({})
  await render({ isLoading: true })
  await render({ isFetching: true })
  await render({ error: new Error('offline') })
  await render({})
  expect(setPage).not.toHaveBeenCalled()
})

it('passes the entire supplied server page through without local search, filtering, sorting or slicing', async () => {
  const filterRow = vi.fn(() => false)
  function Example() {
    const table = useTableState({
      sortFields: ['name'],
      limitOptions: [2],
      initialState: { page: 2, limit: 2, sortField: 'name', sortType: 'asc' },
    })
    return (
      <DataTable
        table={table}
        rows={rows}
        columns={columns}
        totalCount={12}
        search="absent"
        filterRow={filterRow}
        getRowId={(row) => row.id}
      />
    )
  }
  await act(async () => root.render(<Example />))
  expect(names()).toEqual(['Beta', 'Gamma', 'Alpha', 'Delta'])
  expect(filterRow).not.toHaveBeenCalled()
  await click('th button')
  expect(names()).toEqual(['Beta', 'Gamma', 'Alpha', 'Delta'])
})

it('processes local filters/search before sorting and pagination, resets filters and clamps removed pages', async () => {
  const active = (row: Item) => row.active
  function Example({
    data = rows,
    search = '',
    filtered = false,
  }: {
    data?: Item[]
    search?: string
    filtered?: boolean
  }) {
    const table = useTableState({
      sortFields: ['name'],
      limitOptions: [2],
      initialState: { limit: 2 },
    })
    return (
      <DataTable
        table={table}
        clientSide
        rows={data}
        columns={columns}
        search={search}
        filterRow={filtered ? active : undefined}
        getRowId={(row) => row.id}
      />
    )
  }
  await act(async () => root.render(<Example />))
  expect(names()).toEqual(['Beta', 'Gamma'])
  await click('th button')
  expect(names()).toEqual(['Gamma', 'Delta'])
  await click('[aria-label="Next page"]')
  expect(names()).toEqual(['Beta', 'Alpha'])
  await act(async () => root.render(<Example filtered search="a" />))
  expect(names()).toEqual(['Delta', 'Beta'])
  expect(container.textContent).toContain('of 3 rows')
  await click('[aria-label="Next page"]')
  expect(names()).toEqual(['Alpha'])
  await act(async () =>
    root.render(<Example filtered search="a" data={rows.slice(0, 1)} />),
  )
  expect(names()).toEqual(['Beta'])
  await act(async () => root.render(<Example search="missing" />))
  expect(names()).toEqual(['No records found.'])
})

it('selects only the visible client page and preserves selections across pages', async () => {
  function Example() {
    const table = useTableState({
      sortFields: ['name'],
      limitOptions: [2],
      initialState: { limit: 2 },
    })
    const [selectedIds, onSelectionChange] = useState<string[]>(['4'])
    return (
      <>
        <output>{selectedIds.join(',')}</output>
        <DataTable
          table={table}
          clientSide
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
        />
      </>
    )
  }
  await act(async () => root.render(<Example />))
  await click('[aria-label="Select all selectable rows on this page"]')
  expect(container.querySelector('output')?.textContent).toBe('4,1,2')
  await click('[aria-label="Next page"]')
  await click('[aria-label="Select all selectable rows on this page"]')
  expect(container.querySelector('output')?.textContent).toBe('4,1,2,3')
})
