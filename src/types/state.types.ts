import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { BaseClassNameProps } from './common.types'
import type { EmptyProps } from './empty.types'

export interface LoadingStateProps extends BaseClassNameProps {
  title?: ReactNode
  description?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export interface ErrorStateProps extends BaseClassNameProps {
  title?: ReactNode
  description?: ReactNode
  onRetry?: () => void
  retryLabel?: string
  retrying?: boolean
  icon?: LucideIcon
  headingLevel?: 1 | 2 | 3
}

export interface PendingStateProps {
  variant?: 'modal' | 'card' | 'page'
  label?: string
  className?: string
}

export type EmptyStateProps = EmptyProps
