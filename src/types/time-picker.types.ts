import type { ReactNode } from 'react'
import type { BaseFieldProps } from './common.types'
import type {
  FieldDescriptionPlacement,
  FieldLabelPosition,
} from './field-wrapper.types'

export type TimeFormat = '12h' | '24h'

/**
 * Props for the props-driven TimePicker component.
 */
export interface TimePickerProps extends BaseFieldProps {
  /**
   * Field name for form registration.
   */
  name?: string
  /**
   * Whether the field is required.
   * @default false
   */
  required?: boolean
  /**
   * Controlled time string value (e.g. "14:30" or "02:30 PM").
   */
  value?: string
  /**
   * Uncontrolled default time value.
   */
  defaultValue?: string
  /**
   * Callback fired when selected time changes.
   */
  onChange?: (value: string) => void
  /**
   * Alias callback for `onChange`.
   */
  onValueChange?: (value: string) => void
  /**
   * Time display and selection format: 12-hour with AM/PM, or 24-hour.
   * @default '12h'
   */
  format?: TimeFormat
  /**
   * Minute selection interval step (e.g. 1, 5, 15).
   * @default 1
   */
  step?: number
  /**
   * Whether to include seconds selection.
   * @default false
   */
  showSeconds?: boolean
  /**
   * Placeholder text shown when no time is selected.
   * @default 'Select time'
   */
  placeholder?: string
  /**
   * Whether the time can be cleared.
   * @default true
   */
  clearable?: boolean
  /**
   * Whether to bind to react-hook-form context automatically.
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
   * Additional className for the trigger button.
   */
  triggerClassName?: string
  /**
   * Additional className for the popover content card.
   */
  contentClassName?: string
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
   * Popover placement side relative to trigger.
   * @default 'bottom'
   */
  side?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * Popover alignment relative to trigger.
   * @default 'start'
   */
  align?: 'start' | 'end' | 'center'
  /**
   * Popover offset from trigger in pixels.
   * @default 4
   */
  sideOffset?: number
}
