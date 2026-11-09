import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib'
import { ConfirmationDialog } from '@/components'
import { TooltipProvider } from '#/components/ui/Tooltip'
import { AuthSessionBoundary } from '#/features/auth/AuthSessionBoundary'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionBoundary>
        <TooltipProvider>{children}</TooltipProvider>
      </AuthSessionBoundary>
      <ConfirmationDialog />
    </QueryClientProvider>
  )
}
