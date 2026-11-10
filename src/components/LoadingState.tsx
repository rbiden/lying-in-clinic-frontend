import { cn } from '@/lib/utils'
import type { LoadingStateProps } from '@/types/state.types'
import { Spinner } from './ui/spinner'

const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

export function LoadingState({
  title = 'Loading',
  description,
  size = 'md',
  className,
  titleClassName,
  descriptionClassName,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex min-w-0 flex-col items-center gap-2 text-center',
        sizes[size],
        className,
      )}
    >
      <div className="flex max-w-full items-center justify-center gap-2">
        <Spinner
          aria-hidden="true"
          role={undefined}
          aria-label={undefined}
          className="shrink-0"
        />
        <span className={cn('min-w-0 break-words', titleClassName)}>
          {title}
        </span>
      </div>
      {description && (
        <div className={cn('text-muted-foreground', descriptionClassName)}>
          {description}
        </div>
      )}
    </div>
  )
}
