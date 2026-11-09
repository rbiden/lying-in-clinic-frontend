import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export function Field({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('flex flex-col gap-1 p-1', className)} {...props} />
}

export function FieldLabel({ className, ...props }: ComponentPropsWithoutRef<'label'>) {
  return <label className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

export function FieldDescription({ className, ...props }: ComponentPropsWithoutRef<'p'>) {
  return <p className={cn('text-xs text-muted-foreground', className)} {...props} />
}

export function FieldError({ className, children, ...props }: ComponentPropsWithoutRef<'p'>) {
  if (!children) return null
  return <p className={cn('text-xs text-destructive', className)} {...props}>{children}</p>
}
