import type { ReactNode } from 'react'
import type { BaseFieldProps } from './common.types'

export type FieldDescriptionPlacement = 'start' | 'end'
export type FieldLabelPosition = 'top' | 'left' | 'right'

export interface FormFieldOption<TValue = string> {
  value: TValue
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
}

export interface BaseFieldWrapperProps extends BaseFieldProps {
  id?: string
  name?: string
  descriptionPlacement?: FieldDescriptionPlacement
  labelPosition?: FieldLabelPosition
  customMessage?: ReactNode
  errorMessage?: ReactNode
  hasError?: boolean
  isDirty?: boolean
  showDirty?: boolean
  descriptionId?: string
  errorId?: string
  children?: ReactNode
}
