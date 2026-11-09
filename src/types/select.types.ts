import type { ReactNode } from 'react'
import type { BaseFieldProps } from './common.types'
import type {
  FieldDescriptionPlacement,
  FieldLabelPosition,
  FormFieldOption,
} from './field-wrapper.types'

/**
 * Standard option item for the Select component.
 */
export interface SelectOption<
  TValue extends string = string,
> extends FormFieldOption<TValue> {
  /**
   * Optional leading icon or element.
   */
  icon?: ReactNode
  /**
   * Optional subtitle or secondary text for the option.
   */
  description?: string
}

/**
 * Group of options with a section heading for Select component.
 */
export interface SelectGroupOption<TValue extends string = string> {
  /**
   * Group header label.
   */
  label: string
  /**
   * Options inside this group.
   */
  options: SelectOption<TValue>[]
}

/**
 * Props for the props-driven Select component.
 */
export interface SelectProps<
  TValue extends string = string,
> extends BaseFieldProps {
  /**
   * Field identifier and form binding name.
   */
  name?: string
  /**
   * Whether the select field is required.
   * @default false
   */
  required?: boolean
  /**
   * Options to display. Can be a flat array of SelectOption or grouped SelectGroupOption.
   */
  options: SelectOption<TValue>[] | SelectGroupOption<TValue>[]
  /**
   * Current controlled value.
   */
  value?: TValue
  /**
   * Uncontrolled default value.
   */
  defaultValue?: TValue
  /**
   * Callback fired when selected value changes.
   */
  onChange?: (value: TValue) => void
  /**
   * Callback alias for `onChange` when value changes.
   */
  onValueChange?: (value: TValue) => void
  /**
   * Placeholder text shown when no option is selected.
   * @default 'Select an option'
   */
  placeholder?: string
  /**
   * Whether the select value can be cleared.
   * @default false
   */
  clearable?: boolean
  /**
   * Whether to automatically bind to react-hook-form context.
   * @default true
   */
  useForm?: boolean
  /**
   * Highlights the field when modified from initial value.
   * @default false
   */
  showDirty?: boolean
  /**
   * Custom banner or help message below the field.
   */
  customMessage?: ReactNode
  /**
   * Class name for the trigger button.
   */
  triggerClassName?: string
  /**
   * Class name for the dropdown popover content.
   */
  contentClassName?: string
  /**
   * Class name for individual option items.
   */
  itemClassName?: string
  /**
   * Class name for the group label heading.
   */
  groupLabelClassName?: string
  /**
   * Placement of the description relative to field.
   * @default 'start'
   */
  descriptionPlacement?: FieldDescriptionPlacement
  /**
   * Label position relative to field.
   * @default 'top'
   */
  labelPosition?: FieldLabelPosition
  /**
   * Side to align dropdown popup relative to trigger.
   * @default 'bottom'
   */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * Alignment of dropdown popup relative to trigger.
   * @default 'start'
   */
  align?: 'start' | 'end' | 'center'
  /**
   * Distance between trigger and popup in pixels.
   * @default 4
   */
  sideOffset?: number
}
