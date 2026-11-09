import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface BaseClassNameProps {
  className?: string
  wrapperClassName?: string
  containerClassName?: string
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  titleClassName?: string
  descriptionClassName?: string
  labelClassName?: string
  messageClassName?: string
}

export interface BaseFieldProps extends BaseClassNameProps {
  label?: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export type ActionVariant =
  'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'

export interface ActionProps {
  label: ReactNode
  className?: string
  classname?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>, ...args: unknown[]) => void
  disabled?: boolean
  variant?: ActionVariant
  type?: 'button' | 'submit' | 'reset'
}

export interface BaseComponentProps<
  TFooter = ReactNode,
> extends BaseFieldProps {
  message?: ReactNode
  title?: ReactNode
  action?: ReactNode
  footer?: TFooter
  icon?: LucideIcon
}
