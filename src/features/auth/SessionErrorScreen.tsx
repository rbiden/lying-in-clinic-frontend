import { ShieldAlert } from 'lucide-react'
import { ErrorState } from '#/components/ErrorState'

export function SessionErrorScreen({ retry }: { retry: () => void }) {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-24 top-1/2 size-80 -translate-x-1/2 -translate-y-2/3 rounded-full bg-primary/20 blur-3xl sm:size-112" />
        <div className="absolute right-1/4 top-1/2 size-48 -translate-y-1/4 rounded-full bg-muted-foreground/15 blur-3xl sm:size-72" />
      </div>

      <ErrorState
        className="max-w-sm"
        icon={ShieldAlert}
        headingLevel={1}
        title="Unable to check your session"
        titleClassName="text-5xl"
        description="Check your connection and try again. Your session has been kept while we reconnect."
        onRetry={retry}
      />
    </main>
  )
}
