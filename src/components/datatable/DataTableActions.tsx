import { Ellipsis } from 'lucide-react'
import type { DataTableAction } from '@/types/datatable.types'
import { Dropdown } from '../Dropdown'
import { Button, buttonVariants } from '../ui/Button'

interface DataTableActionsProps<TData> {
  row: TData
  rowId: string
  actions: readonly DataTableAction<TData>[]
  actionType: 'dropdown' | 'inline'
  disabled: boolean
}

export function DataTableActions<TData>({
  row,
  rowId,
  actions,
  actionType,
  disabled,
}: DataTableActionsProps<TData>) {
  const visibleActions = actions.filter((action) =>
    typeof action.hidden === 'function' ? !action.hidden(row) : !action.hidden,
  )

  if (!visibleActions.length) return null

  return (
    <div
      className="inline-flex items-center gap-1"
      data-table-interactive
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      {actionType === 'dropdown' ? (
        <Dropdown
          disabled={disabled}
          itemClassName="py-1 px-1.5"
          className="min-w-50"
          trigger={
            <span
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            >
              <Ellipsis aria-hidden="true" />
              <span className="sr-only">Actions for row {rowId}</span>
            </span>
          }
          items={visibleActions.map(
            ({
              label,
              icon,
              variant,
              disabled: actionDisabled,
              onClick,
              className,
            }) => ({
              label,
              className,
              icon,
              variant,
              disabled: disabled || actionDisabled,
              onClick: () => onClick(row),
            }),
          )}
        />
      ) : (
        visibleActions.map(
          ({
            label,
            icon: Icon,
            onClick,
            variant,
            disabled: actionDisabled,
            className,
          }) => (
            <Button
              key={label}
              variant={variant && variant !== 'default' ? variant : 'ghost'}
              size="sm"
              className={className}
              disabled={disabled || actionDisabled}
              onClick={() => onClick(row)}
            >
              {Icon && <Icon className="size-4" />}
              {label}
            </Button>
          ),
        )
      )}
    </div>
  )
}
