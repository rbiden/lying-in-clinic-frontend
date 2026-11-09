import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './ui/Button'
import type { ActionProps } from '../types/common.types'
import type { EmptyProps, EmptySize, EmptyVariant } from '../types/empty.types'

const sizeStyles: Record<
  EmptySize,
  {
    container: string
    iconWrapper: string
    iconSize: string
    title: string
    description: string
  }
> = {
  sm: {
    container: 'py-6 px-4 gap-2.5',
    iconWrapper: 'h-10 w-10 ring-4',
    iconSize: 'h-5 w-5',
    title: 'text-sm font-semibold',
    description: 'text-xs max-w-xs',
  },
  md: {
    container: 'py-10 px-6 gap-3.5',
    iconWrapper: 'h-14 w-14 ring-6',
    iconSize: 'h-7 w-7',
    title: 'text-base font-semibold',
    description: 'text-sm max-w-sm',
  },
  lg: {
    container: 'py-16 px-8 gap-4',
    iconWrapper: 'h-18 w-18 ring-8',
    iconSize: 'h-9 w-9',
    title: 'text-lg font-bold',
    description: 'text-base max-w-md',
  },
}

const variantStyles: Record<EmptyVariant, string> = {
  default:
    'border border-border/70 bg-card/60 backdrop-blur-xs rounded-xl shadow-xs',
  dashed: 'border-2 border-dashed border-border/80 bg-muted/20 rounded-xl',
  ghost: 'bg-transparent',
}

function isActionProps(action: unknown): action is ActionProps {
  return typeof action === 'object' && action !== null && 'label' in action
}

function renderAction(
  action: ActionProps | ReactNode,
  defaultVariant: 'default' | 'outline' = 'default',
) {
  if (!action) return null
  if (isActionProps(action)) {
    return (
      <Button
        variant={action.variant ?? defaultVariant}
        onClick={action.onClick}
        disabled={action.disabled}
        type={action.type ?? 'button'}
        className={action.className ?? action.classname}
      >
        {action.label}
      </Button>
    )
  }
  return action
}

export const Empty = ({
  icon,
  title = 'No items found',
  description,
  action,
  secondaryAction,
  size = 'md',
  variant = 'default',
  children,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: EmptyProps) => {
  const currentSize = sizeStyles[size]

  const renderIcon = () => {
    if (icon === null) return null

    let content: ReactNode
    if (typeof icon === 'function') {
      const IconComponent = icon
      content = <IconComponent className={currentSize.iconSize} />
    } else if (icon) {
      content = icon
    } else {
      content = <Inbox className={currentSize.iconSize} />
    }

    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-muted/70 text-muted-foreground ring-muted/30 transition-transform duration-200',
          currentSize.iconWrapper,
          iconClassName,
        )}
      >
        {content}
      </div>
    )
  }

  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-center justify-center text-center transition-all',
        variantStyles[variant],
        currentSize.container,
        className,
      )}
    >
      {renderIcon()}

      {(title || description) && (
        <div className="flex flex-col items-center gap-1">
          {title && (
            <h3
              className={cn(
                'text-foreground tracking-tight',
                currentSize.title,
                titleClassName,
              )}
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              className={cn(
                'text-muted-foreground leading-relaxed',
                currentSize.description,
                descriptionClassName,
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {renderAction(action, 'default')}
          {renderAction(secondaryAction, 'outline')}
        </div>
      )}

      {children}
    </div>
  )
}
