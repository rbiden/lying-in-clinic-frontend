import { cn } from 'cn'
import type { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
  className?: string
}

export const RootLayout = ({ className, children }: RootLayoutProps) => {
  return (
    <main
      className={cn(
        'space-y-6 p-4 min-h-screen h-screen w-full relative',
        className,
      )}
    >
      {children}
    </main>
  )
}
