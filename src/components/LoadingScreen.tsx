import { Warehouse } from 'lucide-react'

export const LoadingScreen = () => (
  <main className="relative flex min-h-dvh w-full items-center justify-center bg-background px-6">
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute left-24 top-1/2 size-80 -translate-x-1/2 -translate-y-2/3 rounded-full bg-primary/20 blur-3xl dark:bg-primary/15 sm:size-112" />
      <div className="absolute right-1/4 top-1/2 size-48 -translate-y-1/4 rounded-full bg-amber-400/15 blur-3xl dark:bg-amber-400/10 sm:size-72" />
    </div>

    <div
      role="status"
      aria-live="polite"
      className="relative flex flex-col items-center text-center"
    >
      <div className="relative mb-6 flex size-20 items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border-2 border-primary/15 border-t-primary motion-safe:animate-spin"
          aria-hidden="true"
        />
        <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-card text-primary shadow-sm">
          <Warehouse className="size-5" aria-hidden="true" />
        </div>
      </div>
      <p className="font-heading text-xl font-semibold text-foreground">
        Loading your workspace
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Checking your session…
      </p>
    </div>
  </main>
)
