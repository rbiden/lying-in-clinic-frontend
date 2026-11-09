import type { ReactNode } from 'react'
import type { BaseFieldProps } from './common.types'
import type {
  FieldDescriptionPlacement,
  FieldLabelPosition,
  FormFieldOption,
} from './field-wrapper.types'

/**
 * Standard option item for the Combobox component.
 */
export interface ComboboxOption<
  TValue extends string = string,
> extends FormFieldOption<TValue> {
  /**
   * Optional leading icon or element.
   */
  icon?: ReactNode
  /**
   * Optional secondary subtitle description for the option.
   */
  description?: string
}

/**
 * Group of options with a section heading for the Combobox component.
 */
export interface ComboboxGroupOption<TValue extends string = string> {
  /**
   * Section heading label.
   */
  label: string
  /**
   * List of options within this group.
   */
  options: ComboboxOption<TValue>[]
}

/**
 * Base props shared by both single and multi select Comboboxes.
 */
export interface BaseComboboxProps<
  TValue extends string = string,
> extends BaseFieldProps {
  /**
   * Form field name for react-hook-form registration.
   */
  name?: string
  /**
   * Whether the field is required.
   * @default false
   */
  required?: boolean
  /**
   * Flat array of options or grouped options.
   */
  options: ComboboxOption<TValue>[] | ComboboxGroupOption<TValue>[]
  /**
   * Placeholder shown when no items are selected.
   * @default 'Select an option'
   */
  placeholder?: string
  /**
   * Search input placeholder inside the multiselect chips container.
   */
  searchPlaceholder?: string
  /**
   * Message shown when no matching options are found.
   * @default 'No results found'
   */
  emptyMessage?: string
  /**
   * Whether the selection can be cleared.
   * @default true
   */
  clearable?: boolean
  /**
   * Whether the first matching item is highlighted automatically while typing.
   * @default true
   */
  autoHighlight?: boolean
  /**
   * Whether to automatically integrate with react-hook-form.
   * @default true
   */
  useForm?: boolean
  /**
   * Highlights the field with warning tones if modified from default.
   * @default false
   */
  showDirty?: boolean
  /**
   * Custom message or helper element rendered below field.
   */
  customMessage?: ReactNode
  /**
   * Additional className for the input group container.
   */
  inputGroupClassName?: string
  /**
   * Additional className for the search input.
   */
  inputClassName?: string
  /**
   * Additional className for the dropdown popup content.
   */
  contentClassName?: string
  /**
   * Additional className for individual item options.
   */
  itemClassName?: string
  /**
   * Additional className for group labels.
   */
  groupLabelClassName?: string
  /**
   * Additional className for multiselect chips.
   */
  chipClassName?: string
  /**
   * Placement of the description text relative to field.
   * @default 'start'
   */
  descriptionPlacement?: FieldDescriptionPlacement
  /**
   * Position of the field label relative to input.
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
   * Offset between trigger and popup in pixels.
   * @default 4
   */
  sideOffset?: number
}

/**
 * Single-select Combobox props.
 */
export interface SingleComboboxProps<
  TValue extends string = string,
> extends BaseComboboxProps<TValue> {
  /**
   * Explicitly single selection mode.
   */
  multiple?: false
  /**
   * Controlled single selected value.
   */
  value?: TValue
  /**
   * Uncontrolled default single value.
   */
  defaultValue?: TValue
  /**
   * Callback fired when single selected value changes.
   */
  onChange?: (value: TValue) => void
  /**
   * Alias callback for `onChange`.
   */
  onValueChange?: (value: TValue) => void
}

/**
 * Multi-select Combobox props.
 */
export interface MultiComboboxProps<
  TValue extends string = string,
> extends BaseComboboxProps<TValue> {
  /**
   * Enables multi-selection mode with interactive chips and checkmarks.
   */
  multiple: true
  /**
   * Controlled array of selected values.
   */
  value?: TValue[]
  /**
   * Uncontrolled default array of selected values.
   */
  defaultValue?: TValue[]
  /**
   * Callback fired when array of selected values changes.
   */
  onChange?: (value: TValue[]) => void
  /**
   * Alias callback for `onChange`.
   */
  onValueChange?: (value: TValue[]) => void
}

/**
 * Discriminated union for Single and Multi Combobox configurations.
 */
export type ComboboxProps<TValue extends string = string> =
  SingleComboboxProps<TValue> | MultiComboboxProps<TValue>
