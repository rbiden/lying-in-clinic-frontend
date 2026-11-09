import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import type { BaseFieldProps } from './common.types'
import type { FieldDescriptionPlacement } from './field-wrapper.types'

export type ToggleGroupVariant = 'default' | 'outline'
export type ToggleGroupSize = 'default' | 'sm' | 'lg'

export interface ToggleGroupItemOption<TValue = string> {
  value: TValue
  label?: ReactNode
  icon?: LucideIcon | ReactNode
  disabled?: boolean
  ariaLabel?: string
}

interface CommonToggleGroupProps extends BaseFieldProps {
  /**
   * Field identifier and form binding name
   */
  name?: string

  /**
   * Options/items to render inside the toggle group
   */
  items: ToggleGroupItemOption<string>[]

  /**
   * Visual style variant
   * @default 'default'
   */
  variant?: ToggleGroupVariant

  /**
   * Size of the toggle items
   * @default 'default'
   */
  size?: ToggleGroupSize

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
   * Placement of the description relative to controls
   * @default 'start'
   */
  descriptionPlacement?: FieldDescriptionPlacement

  /**
   * Optional custom status/hint message rendered under control
   */
  customMessage?: ReactNode

  /**
   * Optional class name override for the toggle group container
   */
  toggleGroupClassName?: string

  /**
   * Optional class name override for each toggle button item
   */
  itemClassName?: string
}

export interface SingleToggleGroupProps extends CommonToggleGroupProps {
  /**
   * Selection mode (single button pressed at a time)
   */
  type?: 'single'

  /**
   * Controlled selected value
   */
  value?: string

  /**
   * Default selected value when uncontrolled
   */
  defaultValue?: string

  /**
   * Callback fired when selected value changes
   */
  onValueChange?: (value: string) => void

  /**
   * Change callback for compatibility
   */
  onChange?: (value: string) => void
}

export interface MultipleToggleGroupProps extends CommonToggleGroupProps {
  /**
   * Selection mode (multiple buttons can be pressed simultaneously)
   */
  type: 'multiple'

  /**
   * Controlled selected values
   */
  value?: string[]

  /**
   * Default selected values when uncontrolled
   */
  defaultValue?: string[]

  /**
   * Callback fired when selected values change
   */
  onValueChange?: (values: string[]) => void

  /**
   * Change callback for compatibility
   */
  onChange?: (values: string[]) => void
}

export type ToggleGroupProps = SingleToggleGroupProps | MultipleToggleGroupProps
