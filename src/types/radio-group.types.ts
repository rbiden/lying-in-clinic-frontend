import type { ReactNode } from 'react'
import type { BaseFieldProps } from './common.types'
import type {
  FieldDescriptionPlacement,
  FormFieldOption,
} from './field-wrapper.types'

export type RadioGroupOption<TValue = string> = FormFieldOption<TValue>
export type RadioGroupOrientation = 'vertical' | 'horizontal'
export type RadioGroupVariant = 'default' | 'card'

export interface RadioGroupProps extends BaseFieldProps {
  /**
   * Field identifier and form binding name
   */
  name?: string

  /**
   * List of selectable radio options
   */
  options: RadioGroupOption<string>[]

  /**
   * Controlled selected value
   */
  value?: string

  /**
   * Default selected value when uncontrolled
   */
  defaultValue?: string

  /**
   * Layout direction for options
   * @default 'vertical'
   */
  orientation?: RadioGroupOrientation

  /**
   * Visual style variant (simple list or elevated selectable cards)
   * @default 'default'
   */
  variant?: RadioGroupVariant

  /**
   * Whether to automatically bind to react-hook-form context
   * @default true
   */
  useForm?: boolean

  /**
   * Highlights the field with warning tones if value has been modified from default
   * @default false
   */
  showDirty?: boolean

  /**
   * Placement of the group description relative to controls
   * @default 'start'
   */
  descriptionPlacement?: FieldDescriptionPlacement

  /**
   * Optional custom status/hint message rendered under control
   */
  customMessage?: ReactNode

  /**
   * Optional class name override for the radio group container
   */
  radioGroupClassName?: string

  /**
   * Optional class name override for each radio option row/card
   */
  itemClassName?: string

  /**
   * Optional class name override for the radio circle primitive
   */
  radioClassName?: string

  /**
   * Callback fired when selected option value changes
   */
  onValueChange?: (value: string) => void

  /**
   * Standard change event callback for compatibility
   */
  onChange?: (value: string) => void
}
