import type { ComponentProps, ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

export function InputGroup({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'relative flex w-full items-center rounded-xl h-10 border border-input bg-background transition-[color,box-shadow]',
        'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30',
        'aria-invalid:focus-within:ring-3 aria-invalid:border aria-invalid:border-destructive/70 aria-invalid:ring-2 aria-invalid:ring-destructive/30',
        className,
      )}
      {...props}
    />
  )
}

export interface InputGroupAddonProps extends ComponentPropsWithoutRef<'div'> {
  align?: 'inline-start' | 'inline-end'
}

export function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: InputGroupAddonProps) {
  return (
    <div
      className={cn(
        'flex items-center shrink-0 px-2 text-muted-foreground text-sm',
        align === 'inline-end' ? 'order-last pr-2.5' : 'order-first pl-2.5',
        className,
      )}
      {...props}
    />
  )
}

export function InputGroupInput({
  className,
  ...props
}: ComponentPropsWithoutRef<'input'>) {
  return (
    <input
      className={cn(
        'flex h-9 w-full min-w-0 bg-transparent px-3 py-1 text-sm text-foreground outline-none',
        'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export type InputGroupButtonProps = ComponentProps<typeof Button>

export function InputGroupButton({
  className,
  ...props
}: InputGroupButtonProps) {
  return (
    <Button
      size="icon-xs"
      variant="ghost"
      className={cn('size-7', className)}
      {...props}
    />
  )
}

export function InputGroupText({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}
