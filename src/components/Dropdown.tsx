import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { StatusVariant } from '@/types/common.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export type DropdownEntry =
  | { type: 'separator'; hidden?: boolean }
  | { type: 'label'; label: ReactNode; hidden?: boolean }
  | {
      type?: 'item'
      label: string
      icon?: ComponentType<{ className?: string }>
      shortcut?: string
      variant?: 'default' | StatusVariant
      disabled?: boolean
      hidden?: boolean
      onClick?: () => void
      items?: DropdownEntry[] // makes this a submenu
      className?: string
    }

export type DropdownGroup = {
  label?: string
  items: DropdownEntry[]
  separator?: boolean
}

export interface DropdownProps {
  trigger: ReactNode
  header?: ReactNode
  headerClassName?: string
  items?: DropdownEntry[]
  groups?: DropdownGroup[]
  children?: ReactNode
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
  itemClassName?: string
}

const itemClass = 'cursor-pointer py-1.5 font-medium rounded-xl'
// Literal class names so Tailwind can see them.
const toneHover: Record<StatusVariant, string> = {
  destructive: 'hover:bg-destructive/10!',
  success: 'hover:bg-success/10!',
  warning: 'hover:bg-warning/10!',
  info: 'hover:bg-info/10!',
}
const surfaceClass =
  'bg-popover text-popover-foreground border border-border rounded-xl shadow-lg ring-0!'

function renderEntry(
  entry: DropdownEntry,
  index: number,
  itemClassName?: string,
): ReactNode {
  if (entry.hidden) return null

  if (entry.type === 'separator') {
    return <DropdownMenuSeparator key={index} />
  }

  if (entry.type === 'label') {
    return <DropdownMenuLabel key={index}>{entry.label}</DropdownMenuLabel>
  }

  const Icon = entry.icon
  const icon = Icon && <Icon className="size-4" />
  const subItems = entry.items?.filter((sub) => !sub.hidden)

  if (subItems?.length) {
    return (
      <DropdownMenuSub key={entry.label}>
        <DropdownMenuSubTrigger
          disabled={entry.disabled}
          className={cn(
            itemClass,
            'text-foreground! hover:bg-muted!',
            itemClassName,
            entry.className,
          )}
        >
          {icon}
          <span>{entry.label}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className={cn('w-56 p-1.5', surfaceClass)}>
          <DropdownMenuGroup>
            {subItems.map((sub, subIndex) =>
              renderEntry(sub, subIndex, itemClassName),
            )}
          </DropdownMenuGroup>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    )
  }

  const tone =
    entry.variant && entry.variant !== 'default' ? entry.variant : null

  return (
    <DropdownMenuItem
      key={entry.label}
      disabled={entry.disabled}
      variant={entry.variant}
      onClick={entry.onClick}
      className={cn(
        itemClass,
        tone ? toneHover[tone] : 'text-foreground! hover:bg-muted/60!',
        itemClassName,
        entry.className,
      )}
    >
      {icon}
      <span>{entry.label}</span>
      {entry.shortcut && (
        <span className="ml-auto text-xs tracking-widest text-muted-foreground">
          {entry.shortcut}
        </span>
      )}
    </DropdownMenuItem>
  )
}

export function Dropdown({
  trigger,
  header,
  headerClassName,
  items,
  groups,
  children,
  align = 'end',
  side = 'bottom',
  disabled,
  className,
  itemClassName,
  ...props
}: DropdownProps) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger
        disabled={disabled}
        className="outline-none cursor-pointer focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        side={side}
        className={cn('min-w-56 p-1', surfaceClass, className)}
      >
        {header && (
          <div className={headerClassName}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal py-2 px-2">
                {header}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </div>
        )}

        {groups?.map((group, i) => (
          <div key={group.label ?? i}>
            <DropdownMenuGroup>
              {group.label && (
                <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
              )}
              {group.items.map((entry, index) =>
                renderEntry(entry, index, itemClassName),
              )}
            </DropdownMenuGroup>
            {group.separator && <DropdownMenuSeparator />}
          </div>
        ))}

        {items && (
          <DropdownMenuGroup>
            {items.map((entry, index) =>
              renderEntry(entry, index, itemClassName),
            )}
          </DropdownMenuGroup>
        )}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
