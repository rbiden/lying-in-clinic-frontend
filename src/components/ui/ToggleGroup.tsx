import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group'
import { Toggle as TogglePrimitive } from '@base-ui/react/toggle'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const toggleGroupVariants = cva(
  'inline-flex items-center justify-center rounded-xl p-1 text-muted-foreground select-none',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        outline: 'border border-border bg-transparent gap-1',
      },
      size: {
        default: 'h-9',
        sm: 'h-8',
        lg: 'h-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export const toggleItemVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'hover:bg-background/50 hover:text-foreground data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-xs data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs',
        outline:
          'border border-transparent hover:bg-muted hover:text-foreground data-[pressed]:border-border data-[pressed]:bg-background data-[pressed]:text-foreground data-[pressed]:shadow-xs data-pressed:border-border data-pressed:bg-background data-pressed:text-foreground data-pressed:shadow-xs',
      },
      size: {
        default: 'h-7 px-3 text-sm',
        sm: 'h-6 px-2 text-xs',
        lg: 'h-8 px-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ToggleGroupProps<TValue extends string = string>
  extends
    ToggleGroupPrimitive.Props<TValue>,
    VariantProps<typeof toggleGroupVariants> {}

export function ToggleGroup<TValue extends string = string>({
  className,
  variant,
  size,
  children,
  ...props
}: ToggleGroupProps<TValue>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn(toggleGroupVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive>
  )
}

export interface ToggleItemProps<TValue extends string = string>
  extends
    TogglePrimitive.Props<TValue>,
    VariantProps<typeof toggleItemVariants> {}

export function ToggleItem<TValue extends string = string>({
  className,
  variant,
  size,
  ...props
}: ToggleItemProps<TValue>) {
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      className={cn(toggleItemVariants({ variant, size, className }))}
      {...props}
    />
  )
}
