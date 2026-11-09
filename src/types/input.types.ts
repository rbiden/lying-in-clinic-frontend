import type { ComponentProps, HTMLInputTypeAttribute, ReactNode } from 'react'
import type { BaseFieldProps } from './common.types'
import type { FieldDescriptionPlacement, FieldLabelPosition } from './field-wrapper.types'

export type PrefixSuffixType = 'default' | 'text' | 'dropdown'
export type DescriptionPlacement = FieldDescriptionPlacement

export interface InputProps
  extends Omit<
      ComponentProps<'input'>,
      'prefix' | 'suffix' | 'onChange' | 'onKeyDown'
    >,
    BaseFieldProps {
  name?: string
  type?: HTMLInputTypeAttribute
  placeholder?: string

  inputClassName?: string
  inputGroupClassName?: string

  prefix?: ReactNode
  prefixType?: PrefixSuffixType
  prefixIcon?: ReactNode
  suffix?: ReactNode
  suffixType?: PrefixSuffixType
  suffixIcon?: ReactNode
  items?: ReactNode
  customMessage?: ReactNode
  descriptionPlacement?: DescriptionPlacement
  labelPosition?: FieldLabelPosition

  numbersOnly?: boolean
  asGrade?: boolean

  useForm?: boolean
  showDirty?: boolean

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}
