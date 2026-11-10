import { CircleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ErrorStateProps } from '@/types/state.types'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Button } from './ui/Button'
import { Spinner } from './ui/spinner'

export function ErrorState({
  title = 'Unable to load content',
  description = 'Please try again.',
  onRetry,
  retryLabel = 'Retry',
  retrying = false,
  icon: Icon = CircleAlert,
  className,
  titleClassName,
  descriptionClassName,
  headingLevel = 2,
}: ErrorStateProps) {
  const Heading = headingLevel === 1 ? 'h1' : headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Alert
      className={cn(
        'flex flex-col items-center gap-4 border-0 bg-transparent p-0 text-center',
        className,
      )}
    >
      <Icon className="size-10 text-primary" aria-hidden="true" />
      <AlertTitle>
        <Heading
          className={cn(
            'font-heading text-lg font-semibold text-foreground',
            titleClassName,
          )}
        >
          {title}
        </Heading>
      </AlertTitle>
      {description && (
        <AlertDescription className={descriptionClassName}>
          {description}
        </AlertDescription>
      )}
      {onRetry && (
        <Button type="button" onClick={onRetry} disabled={retrying}>
          {retrying && (
            <Spinner
              data-icon="inline-start"
              aria-hidden="true"
              role={undefined}
              aria-label={undefined}
            />
          )}
          {retryLabel}
        </Button>
      )}
    </Alert>
  )
}
