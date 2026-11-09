import type { DataTableColumn } from '@/types/datatable.types'
import { Button } from '@/components/ui/Button'
import type { ExampleUser } from './users.schema'

export function createUserColumns(
  onView: (user: ExampleUser) => void,
): DataTableColumn<ExampleUser>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className={
            row.original.status === 'active'
              ? 'text-primary'
              : 'text-muted-foreground'
          }
        >
          {row.original.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      accessorKey: 'joinedDate',
      header: 'Joined',
      enableSorting: true,
      meta: { sortField: 'joined_date' },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onView(row.original)}>
          View<span className="sr-only"> {row.original.name}</span>
        </Button>
      ),
    },
  ]
}
