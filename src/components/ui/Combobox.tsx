import { Combobox as ComboboxPrimitive } from '@base-ui/react/combobox'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Combobox<
  TValue = string,
  TMultiple extends boolean | undefined = false,
  TItem = TValue,
>({ ...props }: ComboboxPrimitive.Root.Props<TValue, TMultiple, TItem>) {
  return <ComboboxPrimitive.Root {...props} />
}

export function ComboboxInputGroup({
  className,
  ...props
}: ComboboxPrimitive.InputGroup.Props) {
  return (
    <ComboboxPrimitive.InputGroup
      className={cn(
        'flex min-h-9 w-full items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors',
        'focus-within:border-ring focus-within:ring-1 focus-within:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      className={cn(
        'w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      className={cn(
        'flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground cursor-pointer p-1',
        className,
      )}
      {...props}
    >
      {children ?? (
        <ChevronDown className="h-4 w-4 transition-transform duration-200 data-open:rotate-180" />
      )}
    </ComboboxPrimitive.Trigger>
  )
}

export function ComboboxClear({
  className,
  ...props
}: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      className={cn(
        'rounded-xs p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground cursor-pointer',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxPortal({ ...props }: ComboboxPrimitive.Portal.Props) {
  return <ComboboxPrimitive.Portal {...props} />
}

export function ComboboxPositioner({
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...props
}: ComboboxPrimitive.Positioner.Props) {
  return (
    <ComboboxPrimitive.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn('z-50 min-w-(--anchor-width)', className)}
      {...props}
    />
  )
}

export function ComboboxPopup({
  className,
  ...props
}: ComboboxPrimitive.Popup.Props) {
  return (
    <ComboboxPrimitive.Popup
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

export function ComboboxContent({
  className,
  children,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...popupProps
}: ComboboxPrimitive.Popup.Props & {
  side?: ComboboxPrimitive.Positioner.Props['side']
  align?: ComboboxPrimitive.Positioner.Props['align']
  sideOffset?: number
}) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPositioner side={side} align={align} sideOffset={sideOffset}>
        <ComboboxPopup className={className} {...popupProps}>
          {children}
        </ComboboxPopup>
      </ComboboxPositioner>
    </ComboboxPrimitive.Portal>
  )
}

export function ComboboxList({
  className,
  ...props
}: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      className={cn('max-h-60 overflow-y-auto p-1', className)}
      {...props}
    />
  )
}

export function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      className={cn(
        'relative flex w-full cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Item>
  )
}

export function ComboboxItemIndicator({
  className,
  children,
  ...props
}: ComboboxPrimitive.ItemIndicator.Props) {
  return (
    <ComboboxPrimitive.ItemIndicator
      className={cn(
        'flex h-4 w-4 shrink-0 items-center justify-center',
        className,
      )}
      {...props}
    >
      {children ?? <Check className="h-4 w-4 text-primary" />}
    </ComboboxPrimitive.ItemIndicator>
  )
}

export function ComboboxEmpty({
  className,
  ...props
}: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      className={cn(
        'py-6 text-center text-sm text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxGroup({
  className,
  ...props
}: ComboboxPrimitive.Group.Props) {
  return <ComboboxPrimitive.Group className={cn('p-1', className)} {...props} />
}

export function ComboboxGroupLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      className={cn(
        'px-2 py-1.5 text-xs font-semibold text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  )
}

export function ComboboxChips({
  className,
  ...props
}: ComboboxPrimitive.Chips.Props) {
  return (
    <ComboboxPrimitive.Chips
      className={cn(
        'flex flex-1 flex-wrap items-center gap-1.5 min-w-0 py-0.5',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxChip({
  className,
  ...props
}: ComboboxPrimitive.Chip.Props) {
  return (
    <ComboboxPrimitive.Chip
      className={cn(
        'inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground transition-colors',
        'data-highlighted:ring-2 data-highlighted:ring-ring',
        className,
      )}
      {...props}
    />
  )
}

export function ComboboxChipRemove({
  className,
  ...props
}: ComboboxPrimitive.ChipRemove.Props) {
  return (
    <ComboboxPrimitive.ChipRemove
      className={cn(
        'rounded-xs p-0.5 text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground cursor-pointer',
        className,
      )}
      {...props}
    />
  )
}

export const ComboboxValue = ComboboxPrimitive.Value
export const ComboboxCollection = ComboboxPrimitive.Collection
