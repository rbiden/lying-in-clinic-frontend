import { Navigate, useLocation } from 'react-router'
import { DataTable } from '@/components/datatable/DataTable'
import { Filter } from '@/components/Filter'
import { Input } from '@/components/Input'
import { useTableQuery } from '@/hooks/use-table-query'
import { useAuditLogsQuery } from '@/features/audit-logs'
import type { AuditLog } from '@/features/audit-logs'
import {
  auditLogsFilterSchema,
  cleanAuditLogsSearch,
} from '@/features/audit-logs/audit-logs.schema'
import type { DataTableColumn } from '@/types/datatable.types'

const defaultFilters = {}
const sortFields: string[] = []

const columns: DataTableColumn<AuditLog>[] = [
  {
    accessorKey: 'occurred_at',
    header: 'Time',
    cell: ({ row }) =>
      new Date(row.original.occurred_at).toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
      }),
  },
  {
    accessorKey: 'actor_id',
    header: 'Actor ID',
    cell: ({ row }) => row.original.actor_id ?? 'Not recorded',
  },
  { accessorKey: 'event', header: 'Event' },
  {
    accessorKey: 'subject_type',
    header: 'Subject type',
    cell: ({ row }) => row.original.subject_type ?? 'Not recorded',
  },
  {
    accessorKey: 'subject_id',
    header: 'Subject ID',
    cell: ({ row }) => row.original.subject_id ?? 'Not recorded',
  },
]

const AuditLogsTable = () => {
  const table = useTableQuery({
    tableKey: 'audit-logs',
    filterSchema: auditLogsFilterSchema,
    defaultFilters,
    sortFields,
  })

  const { data, isLoading, isFetching, refetch, error } = useAuditLogsQuery(
    { page: table.state.page, limit: table.state.limit, ...table.filters },
    table.isReady,
  )

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        From and To include the whole UTC calendar date. Times are shown in
        Asia/Manila.
      </p>
      <Filter
        tableKey="audit-logs"
        showSearch={false}
        labels={{ event: 'Exact event', from: 'From', to: 'To' }}
        onRefetch={() => {
          void refetch()
        }}
        refetchLabel="Refresh"
        isLoading={isFetching}
      >
        <Input name="event" label="Exact event" maxLength={100} />
        <Input name="from" label="From" type="date" />
        <Input name="to" label="To" type="date" />
      </Filter>

      <DataTable
        caption="Audit logs"
        table={table}
        rows={data?.data ?? []}
        columns={columns}
        totalCount={data?.meta.total ?? 0}
        getRowId={(log) => String(log.id)}
        isLoading={!table.isReady || isLoading}
        isFetching={isFetching}
        error={error}
        onRetry={() => {
          void refetch()
        }}
      />
    </div>
  )
}

export const AuditLogs = () => {
  const location = useLocation()
  const search = cleanAuditLogsSearch(location.search)

  if (search !== location.search) {
    return <Navigate replace to={{ ...location, search }} />
  }

  return <AuditLogsTable />
}
