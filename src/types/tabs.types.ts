import type { ReactNode } from 'react'
import type { BaseClassNameProps } from './common.types'

export type TabsVariant = 'default' | 'underline' | 'pills' | 'segmented'
export type TabsSize = 'sm' | 'md' | 'lg'
export type TabsOrientation = 'horizontal' | 'vertical'

/**
 * Single tab item definition.
 */
export interface TabItem<TValue extends string = string> {
  /**
   * Unique tab value identifier.
   */
  value: TValue
  /**
   * Label displayed on the tab button.
   */
  label: ReactNode
  /**
   * Optional leading icon.
   */
  icon?: ReactNode
  /**
   * Optional trailing badge or counter.
   */
  badge?: ReactNode
  /**
   * Content rendered in the corresponding tab panel.
   */
  content?: ReactNode
  /**
   * Whether this tab item is disabled.
   * @default false
   */
  disabled?: boolean
}

/**
 * Props for the props-driven Tabs component.
 */
export interface TabsProps<
  TValue extends string = string,
> extends BaseClassNameProps {
  /**
   * List of tabs to render.
   */
  items: TabItem<TValue>[]
  /**
   * Active tab value for controlled usage.
   */
  value?: TValue
  /**
   * Default active tab value for uncontrolled usage.
   */
  defaultValue?: TValue
  /**
   * Callback fired when active tab changes.
   */
  onChange?: (value: TValue) => void
  /**
   * Alias callback for `onChange`.
   */
  onValueChange?: (value: TValue) => void
  /**
   * Visual style variant.
   * @default 'default'
   */
  variant?: TabsVariant
  /**
   * Size scale for triggers and fonts.
   * @default 'md'
   */
  size?: TabsSize
  /**
   * Layout flow direction.
   * @default 'horizontal'
   */
  orientation?: TabsOrientation
  /**
   * Additional className for the tab list container.
   */
  listClassName?: string
  /**
   * Additional className for tab trigger buttons.
   */
  triggerClassName?: string
  /**
   * Additional className for tab content panels.
   */
  contentClassName?: string
  /**
   * Custom children rendered alongside or below tabs.
   */
  children?: ReactNode
}
