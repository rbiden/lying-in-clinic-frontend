import { cn } from '@/lib/utils'
import type { PendingStateProps } from '@/types/state.types'
import { Card, CardContent, CardHeader } from './ui/Card'
import { Skeleton } from './ui/skeleton'

function Fields() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((row) => (
        <div key={row} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}

export function PendingState({
  variant = 'card',
  label = 'Loading content',
  className,
}: PendingStateProps) {
  const heading = (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
  return (
    <div className={cn('min-w-0', className)}>
      <span role="status" aria-live="polite" className="sr-only">
        {label}
      </span>
      <div aria-busy="true" aria-hidden="true">
        {variant === 'card' ? (
          <Card>
            <CardHeader>{heading}</CardHeader>
            <CardContent>
              <Fields />
            </CardContent>
          </Card>
        ) : variant === 'modal' ? (
          <div className="flex flex-col gap-6">
            {heading}
            <Fields />
            <div className="flex flex-wrap justify-end gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">{heading}</div>
              <Skeleton className="h-8 w-28" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((column) => (
                <Skeleton key={column} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        )}
      </div>
    </div>
  )
}
