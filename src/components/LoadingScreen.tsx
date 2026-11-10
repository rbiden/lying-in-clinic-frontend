import { Baby } from 'lucide-react'
import { LoadingState } from './LoadingState'

export const LoadingScreen = () => (
  <main className="flex min-h-dvh w-full items-center justify-center bg-background px-6 py-8">
    <div className="flex flex-col items-center gap-6 text-center">
      <Baby className="size-11 text-primary" aria-hidden="true" />
      <h1 className="font-heading text-xl font-semibold text-foreground">
        Loading your workspace
      </h1>
      <LoadingState
        title="Checking your session"
        className="text-muted-foreground"
      />
    </div>
  </main>
)
