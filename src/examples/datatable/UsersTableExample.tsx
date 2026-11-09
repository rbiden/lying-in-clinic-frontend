import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable } from '@/components/datatable/DataTable'
import { Filter } from '@/components/Filter'
import { DatePicker } from '@/components/DatePicker'
import { Select } from '@/components/Select'
import { useTableQuery } from '@/hooks/use-table-query'
import { getTableSortFields } from '@/helpers/table-query'
import { Button } from '@/components/ui/Button'
import { DEFAULT_USER_FILTERS, userFilterSchema } from './users.schema'
import type { ExampleUser } from './users.schema'
import { createUserColumns } from './users.columns'
import { useExampleUsersQuery } from './users.query'
import type { MockScenario } from './users.service'

/** Unrouted example: render inside existing QueryClientProvider and Router. */
export function UsersTableExample({
  tableKey = 'example-users',
}: {
  tableKey?: string
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewed, setViewed] = useState<ExampleUser | null>(null)
  const [mode, setMode] = useState<MockScenario['mode']>('normal')
  const [delayMs, setDelayMs] = useState(500)
  const onView = useCallback((user: ExampleUser) => setViewed(user), [])
  const columns = useMemo(() => createUserColumns(onView), [onView])
  const sortFields = useMemo(() => getTableSortFields(columns), [columns])
  const table = useTableQuery({
    tableKey,
    filterSchema: userFilterSchema,
    defaultFilters: DEFAULT_USER_FILTERS,
    sortFields,
  })
  const query = useExampleUsersQuery(
    {
      state: table.state,
      filters: table.filters,
      search: table.search,
      queryIdentity: table.queryIdentity,
    },
    { mode, delayMs },
    table.isReady,
  )

  useEffect(() => {
    if (
      query.isSuccess &&
      query.data &&
      !query.isPlaceholderData &&
      !query.isFetching
    ) {
      table.acceptTotal(query.data.totalCount, query.data.queryIdentity)
    }
  }, [
    query.isSuccess,
    query.isPlaceholderData,
    query.isFetching,
    query.data,
    table.acceptTotal,
  ])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <Select
          useForm={false}
          label="Example response"
          value={mode}
          onValueChange={setMode}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'error', label: 'Error' },
            { value: 'empty', label: 'Empty' },
            { value: 'reduced', label: 'Reduced to 3 records' },
          ]}
        />
        <Select
          useForm={false}
          label="Example delay"
          value={String(delayMs)}
          onValueChange={(value) => setDelayMs(Number(value))}
          options={[
            { value: '500', label: '500 ms' },
            { value: '2000', label: '2 seconds' },
          ]}
        />
        <p className="pb-2 text-sm text-muted-foreground">
          {selectedIds.length} selected across pages
        </p>
        <Button
          variant="ghost"
          disabled={!selectedIds.length}
          onClick={() => setSelectedIds([])}
        >
          Clear selection
        </Button>
      </div>
      <Filter
        tableKey={tableKey}
        searchPlaceholder="Search users by name…"
        labels={{ status: 'Status', joined: 'Joined' }}
        onRefetch={() => {
          void query.refetch()
        }}
        refetchLabel="Refresh"
        isLoading={query.isFetching}
      >
        <Select
          name="status"
          label="Status"
          clearable
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
        <div className="grid grid-cols-2 gap-3">
          <DatePicker
            name="joined.from"
            label="Joined from"
            valueFormat="yyyy-MM-dd"
          />
          <DatePicker
            name="joined.to"
            label="Joined to"
            valueFormat="yyyy-MM-dd"
          />
        </div>
      </Filter>
      <DataTable
        rows={query.data?.rows ?? []}
        columns={columns}
        totalCount={query.data?.totalCount ?? 0}
        table={table}
        getRowId={(user) => user.id}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        canSelectRow={(user) => user.status === 'active'}
        onRowClick={onView}
        isLoading={!table.isReady || query.isLoading}
        isFetching={query.isFetching}
        error={query.error}
        onRetry={() => {
          void query.refetch()
        }}
        caption="Example users"
      />
      {viewed && (
        <p role="status" className="text-sm">
          Viewing {viewed.name} ({viewed.id})
        </p>
      )}
    </div>
  )
}
