import type { ReactNode } from 'react'
import type { BaseClassNameProps } from './common.types'

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right'
export type TooltipAlign = 'start' | 'end' | 'center'

/**
 * Props for the props-driven Tooltip component.
 */
export interface TooltipProps extends BaseClassNameProps {
  /**
   * The trigger element to attach the tooltip to.
   */
  children: ReactNode
  /**
   * Content displayed within the tooltip popover.
   */
  content: ReactNode
  /**
   * Placement side relative to trigger.
   * @default 'top'
   */
  side?: TooltipSide
  /**
   * Alignment relative to trigger.
   * @default 'center'
   */
  align?: TooltipAlign
  /**
   * Distance between trigger and tooltip in pixels.
   * @default 4
   */
  sideOffset?: number
  /**
   * Whether to display a pointer arrow towards trigger.
   * @default false
   */
  showArrow?: boolean
  /**
   * Delay in milliseconds before opening the tooltip.
   * @default 200
   */
  delay?: number
  /**
   * Controlled open state.
   */
  open?: boolean
  /**
   * Default uncontrolled open state.
   * @default false
   */
  defaultOpen?: boolean
  /**
   * Callback fired when open state changes.
   */
  onOpenChange?: (open: boolean) => void
  /**
   * Disables the tooltip from appearing.
   * @default false
   */
  disabled?: boolean
  /**
   * Additional className for the trigger wrapper.
   */
  triggerClassName?: string
}
