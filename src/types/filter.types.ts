import type { ReactNode } from 'react'
import type { FilterValues } from '@/helpers'
import type { BaseClassNameProps } from './common.types'

export interface FilterProps extends BaseClassNameProps {
  tableKey: string
  children: ReactNode
  mode?: 'auto' | 'popover' | 'inline'
  showSearch?: boolean
  searchPlaceholder?: string
  title?: string
  triggerLabel?: string
  columns?: 1 | 2
  showChips?: boolean
  labels?: Record<string, string>
  formatValue?: (name: string, value: unknown) => string | undefined
  onApply?: (values: FilterValues) => void
  onRefetch?: () => void
  refetchLabel?: string
  isLoading?: boolean
  actionButton?: ReactNode
}
