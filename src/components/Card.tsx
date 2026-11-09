import type { ComponentPropsWithoutRef } from 'react'
import type { BaseComponentProps } from '@/types'
import {
  Card as CardPrimitive,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/Card'
import { cn } from 'cn'

export const cardSizes = {

  xs: 'min-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
}

export interface CardProps
  extends Omit<
      ComponentPropsWithoutRef<typeof CardPrimitive>,
      'title' | 'size'
    >,
    BaseComponentProps {
  size?: keyof typeof cardSizes
}

export const Card = ({
  title,
  description,
  action,
  footer,
  children,
  size = 'md',

  wrapperClassName,
  contentClassName,
  headerClassName,
  footerClassName,
  titleClassName,
  descriptionClassName,
  ...props
}: CardProps) => {
  const hasHeader = Boolean(title || description || action)

  return (
    <CardPrimitive {...props} className={cn('w-full', cardSizes[size], wrapperClassName)}>
      <CardHeader className={cn(headerClassName, !hasHeader && 'hidden')}>
        {title && <CardTitle className={titleClassName}>{title}</CardTitle>}
        {description && <CardDescription className={descriptionClassName}>{description}</CardDescription>}
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>

      <CardContent className={contentClassName}>{children}</CardContent>

      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </CardPrimitive>
  )
}
