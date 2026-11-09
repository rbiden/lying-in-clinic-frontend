import { Select as SelectPrimitive } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Select<
  TValue = string,
  TMultiple extends boolean | undefined = false,
>({ ...props }: SelectPrimitive.Root.Props<TValue, TMultiple>) {
  return <SelectPrimitive.Root {...props} />
}

export function SelectTrigger({
  className,
  children,
  ...props
}: SelectPrimitive.Trigger.Props) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'flex h-10 rounded-xl w-full items-center justify-between gap-2 border border-border bg-transparent px-3 py-2 text-sm transition-colors',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon className="text-muted-foreground shrink-0 transition-transform duration-200 data-open:rotate-180">
        <ChevronDown className="h-4 w-4" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value className={cn('truncate', className)} {...props} />
  )
}

export function SelectPortal({ ...props }: SelectPrimitive.Portal.Props) {
  return <SelectPrimitive.Portal {...props} />
}

export function SelectPositioner({
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...props
}: SelectPrimitive.Positioner.Props) {
  return (
    <SelectPrimitive.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn('z-50 min-w-(--anchor-width)', className)}
      {...props}
    />
  )
}

export function SelectPopup({
  className,
  ...props
}: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Popup
      className={cn(
        'bg-popover text-popover-foreground relative z-50 max-h-72 min-w-32 overflow-y-auto rounded-md border border-border p-1 shadow-md outline-none',
        'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
        'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        className,
      )}
      {...props}
    />
  )
}

export function SelectContent({
  className,
  children,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...popupProps
}: SelectPrimitive.Popup.Props & {
  side?: SelectPrimitive.Positioner.Props['side']
  align?: SelectPrimitive.Positioner.Props['align']
  sideOffset?: number
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPositioner side={side} align={align} sideOffset={sideOffset}>
        <SelectPopup className={className} {...popupProps}>
          {children}
        </SelectPopup>
      </SelectPositioner>
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex w-full cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Item>
  )
}

export function SelectItemText({
  className,
  ...props
}: SelectPrimitive.ItemText.Props) {
  return (
    <SelectPrimitive.ItemText
      className={cn('truncate', className)}
      {...props}
    />
  )
}

export function SelectItemIndicator({
  className,
  children,
  ...props
}: SelectPrimitive.ItemIndicator.Props) {
  return (
    <SelectPrimitive.ItemIndicator
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center',
        className,
      )}
      {...props}
    >
      {children ?? <Check className="h-4 w-4 text-primary" />}
    </SelectPrimitive.ItemIndicator>
  )
}

export function SelectGroup({
  className,
  ...props
}: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group className={cn('p-1', className)} {...props} />
}

export function SelectGroupLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  )
}
