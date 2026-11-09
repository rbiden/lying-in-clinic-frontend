import type { ComponentProps } from 'react'
import type { QueryKey } from '@tanstack/react-query'
import type { Button } from '@/components'
import type { BaseComponentProps } from './common.types'

export interface ConfirmOptions extends BaseComponentProps {
  variant?: ComponentProps<typeof Button>['variant']
  cancelVariant?: ComponentProps<typeof Button>['variant']
  confirmLabel?: string
  cancelLabel?: string
  size?: 'sm' | 'default' | 'lg'
  cancelClassName?: string
  confirmClassName?: string
}

export interface SafeMutateOptions {
  invalidate?: QueryKey | QueryKey[]
  returnHeader?: boolean
}

export type SafeMutateResult<TResult, TRaw = unknown> =
  | {
      success: true
      message?: string
      result: TResult
      header: TRaw | null
    }
  | {
      success: false
      message: string
      error: unknown
    }
