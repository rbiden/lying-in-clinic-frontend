import { Link } from 'react-router'
import { ArrowRight, SearchX } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { AuthAtmosphere } from '../components/background/AuthAtmosphere'

export const NotFound = () => {
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center bg-background px-6 py-16">
      <AuthAtmosphere />
      <div className="relative z-10 w-full max-w-lg text-center">
        <div
          className="relative mx-auto mb-8 flex h-48 max-w-sm items-center justify-center sm:h-56"
          aria-hidden="true"
        >
          <span className="text-[9rem] sm:text-[16rem] leading-none font-bold tracking-tighter text-primary/10 select-none">
            404
          </span>
          <div className="absolute flex size-20 rotate-[-8deg] items-center justify-center rounded-3xl border border-primary/15 bg-card/90 text-primary shadow-xl shadow-primary/10 backdrop-blur-sm sm:size-22">
            <SearchX className="size-12" strokeWidth={1.25} />
          </div>
          <div className="absolute top-8 right-10 size-3 rounded-full bg-muted-foreground/50 sm:right-8" />
          <div className="absolute bottom-6 left-12 size-2 rounded-full bg-primary/40 sm:left-8" />
        </div>

        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Error 404
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          This page is off the shelf.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-muted-foreground sm:text-base">
          We couldn’t find the page you’re looking for. It may have moved, or
          the link might be incorrect.
        </p>
        <div className="mt-8">
          <Button
            render={<Link to="/" />}
            nativeButton={false}
            size="lg"
            className="h-11 gap-2 px-6"
          >
            Go Home
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Your workspace is one click away.
        </p>
      </div>
    </main>
  )
}
