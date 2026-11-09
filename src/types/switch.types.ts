import type { ReactNode } from 'react'
import type { BaseFieldProps } from './common.types'
import type {
  FieldDescriptionPlacement,
  FieldLabelPosition,
} from './field-wrapper.types'

export interface SwitchProps extends BaseFieldProps {
  /**
   * Field identifier and form binding name
   */
  name?: string

  /**
   * Controlled checked state (when useForm is false or externally controlled)
   */
  checked?: boolean

  /**
   * Initial checked state when uncontrolled
   */
  defaultChecked?: boolean

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
   * Position of the label relative to the switch toggle
   * @default 'left'
   */
  labelPosition?: FieldLabelPosition

  /**
   * Placement of the description relative to control
   * @default 'start'
   */
  descriptionPlacement?: FieldDescriptionPlacement

  /**
   * Optional custom status/hint message rendered under control
   */
  customMessage?: ReactNode

  /**
   * Optional class name override for the switch toggle primitive itself
   */
  switchClassName?: string

  /**
   * Callback fired when checked state changes
   */
  onCheckedChange?: (checked: boolean) => void

  /**
   * Standard change event callback for compatibility
   */
  onChange?: (checked: boolean) => void
}
