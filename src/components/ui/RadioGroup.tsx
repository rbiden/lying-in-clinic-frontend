import * as React from 'react'
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import { cn } from '@/lib/utils'

export type RadioGroupPrimitiveProps<TValue = string> =
  RadioGroupPrimitive.Props<TValue>
export type RadioItemPrimitiveProps<TValue = string> =
  RadioPrimitive.Root.Props<TValue>

export function RadioGroup<TValue = string>({
  className,
  ...props
}: RadioGroupPrimitiveProps<TValue>) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn('grid gap-2', className)}
      {...props}
    />
  )
}

export function RadioItem<TValue = string>({
  className,
  children,
  ...props
}: RadioItemPrimitiveProps<TValue> & { children?: React.ReactNode }) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        'peer flex size-4.5 shrink-0 items-center justify-center rounded-full border border-input shadow-xs outline-none transition-colors select-none cursor-pointer',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground',
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-indicator"
        className="size-2 rounded-full bg-primary-foreground"
      />
      {children}
    </RadioPrimitive.Root>
  )
}
