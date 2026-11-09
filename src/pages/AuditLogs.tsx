import { z } from 'zod'
import { DataTable } from '@/components/datatable/DataTable'
import { Filter } from '@/components/Filter'
import { Select } from '@/components/Select'
import { useTableQuery } from '@/hooks/use-table-query'
import { useAuditLogsQuery } from '@/features/audit-logs/audit-logs.query'
import type { AuditLog } from '@/features/audit-logs/audit-logs.service'
import type { DataTableColumn } from '@/types/datatable.types'
import { getTableSortFields } from '#/helpers'

const filterSchema = z.object({
  action: z.enum(['POST', 'PATCH', 'DELETE']).optional(),
  model: z.enum(['User', 'Product', 'Inventory']).optional(),
})
const defaultFilters = {}

const columns: DataTableColumn<AuditLog>[] = [
  {
    accessorKey: 'createdAt',
    enableSorting: true,
    header: 'Time',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
  {
    id: 'user',
    header: 'User',
    enableSorting: true,
    accessorFn: (log) =>
      log.user?.fullName || log.user?.username || 'Unknown user',
  },
  { accessorKey: 'action', enableSorting: true, header: 'Action' },
  { accessorKey: 'model', enableSorting: true, header: 'Model' },
]

export const AuditLogs = () => {
  const sortFields = getTableSortFields(columns)

  const table = useTableQuery({
    tableKey: 'audit-logs',
    filterSchema,
    defaultFilters,
    sortFields,
  })

  const { data, isLoading, isFetching, refetch, error } = useAuditLogsQuery(
    table.params,
    table.isReady,
  )

  return (
    <div>
      <Filter
        tableKey="audit-logs"
        labels={{ action: 'Action', model: 'Model' }}
        onRefetch={() => {
          void refetch()
        }}
        refetchLabel="Refresh"
        isLoading={isFetching}
      >
        <Select
          name="action"
          label="Action"
          options={[
            { value: 'POST', label: 'Create' },
            { value: 'PATCH', label: 'Update' },
            { value: 'DELETE', label: 'Delete' },
          ]}
        />
        <Select
          name="model"
          label="Model"
          options={[
            { value: 'User', label: 'User' },
            { value: 'Product', label: 'Product' },
            { value: 'Inventory', label: 'Inventory' },
          ]}
        />
      </Filter>

      <DataTable
        caption="Audit logs"
        table={table}
        rows={data?.data.items ?? []}
        columns={columns}
        totalCount={data?.data.pagination.total ?? 0}
        getRowId={(log) => log.id}
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
