import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Empty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance',
        className,
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn('flex max-w-sm flex-col items-center gap-2', className)}
      {...props}
    />
  )
}

function EmptyMedia({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-icon"
      className={cn(
        'flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="empty-title"
      className={cn(
        'font-heading text-sm font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-description"
      className={cn('text-sm/relaxed text-muted-foreground', className)}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance',
        className,
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
}
