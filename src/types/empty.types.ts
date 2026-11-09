import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ActionProps, BaseClassNameProps } from './common.types'

export type EmptySize = 'sm' | 'md' | 'lg'
export type EmptyVariant = 'default' | 'dashed' | 'ghost'

/**
 * Props for the props-driven Empty display component.
 */
export interface EmptyProps extends BaseClassNameProps {
  /**
   * Lucide icon component or custom React element.
   */
  icon?: LucideIcon | ReactNode
  /**
   * Primary headline for the empty state.
   */
  title?: ReactNode
  /**
   * Subtitle description explaining why the state is empty or how to proceed.
   */
  description?: ReactNode
  /**
   * Primary call to action configuration or custom node.
   */
  action?: ActionProps | ReactNode
  /**
   * Optional secondary call to action configuration or custom node.
   */
  secondaryAction?: ActionProps | ReactNode
  /**
   * Size scaling for spacing, icon, and typography.
   * @default 'md'
   */
  size?: EmptySize
  /**
   * Surface container treatment (card-like default, dashed border, or borderless ghost).
   * @default 'default'
   */
  variant?: EmptyVariant
  /**
   * Additional custom content rendered beneath actions.
   */
  children?: ReactNode
  /**
   * Additional className for the icon container circle.
   */
  iconClassName?: string
}
