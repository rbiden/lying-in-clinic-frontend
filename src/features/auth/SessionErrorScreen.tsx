import { ShieldAlert } from 'lucide-react'
import { Button } from '#/components/ui/Button'

export function SessionErrorScreen({ retry }: { retry: () => void }) {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-6">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-24 top-1/2 size-80 -translate-x-1/2 -translate-y-2/3 rounded-full bg-primary/20 blur-3xl dark:bg-primary/15 sm:size-112" />
        <div className="absolute right-1/4 top-1/2 size-48 -translate-y-1/4 rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-400/10 sm:size-72" />
      </div>

      <div role="alert" className="max-w-sm space-y-4 text-center">
        <ShieldAlert
          className="mx-auto size-10 text-primary"
          aria-hidden="true"
        />
        <h1 className="font-heading text-xl font-semibold">
          Unable to check your session
        </h1>
        <p className="text-sm text-muted-foreground">
          Check your connection and try again. Your session has been kept while
          we reconnect.
        </p>
        <Button onClick={retry}>Retry</Button>
      </div>
    </main>
  )
}
