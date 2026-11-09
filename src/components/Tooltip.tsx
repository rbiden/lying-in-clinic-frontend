import type { TooltipProps } from '../types/tooltip.types'
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/Tooltip'

export const Tooltip = ({
  children,
  content,
  side = 'top',
  align = 'center',
  sideOffset = 4,
  showArrow = false,
  delay = 200,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  triggerClassName,
}: TooltipProps) => {
  if (disabled || !content) {
    return <>{children}</>
  }

  const tooltipElement = (
    <TooltipPrimitive
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <TooltipTrigger className={triggerClassName}>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        showArrow={showArrow}
        className={className}
      >
        {content}
      </TooltipContent>
    </TooltipPrimitive>
  )

  return <TooltipProvider delay={delay}>{tooltipElement}</TooltipProvider>
}
