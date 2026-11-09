import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/lib/utils'

export function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root {...props} />
}

export function TooltipTrigger({
  className,
  children,
  ...props
}: TooltipPrimitive.Trigger.Props) {
  return (
    <TooltipPrimitive.Trigger
      render={<span />}
      className={cn('inline-flex items-center cursor-pointer', className)}
      {...props}
    >
      {children}
    </TooltipPrimitive.Trigger>
  )
}

export function TooltipPortal({ ...props }: TooltipPrimitive.Portal.Props) {
  return <TooltipPrimitive.Portal {...props} />
}

export function TooltipPositioner({
  className,
  side = 'top',
  align = 'center',
  sideOffset = 4,
  ...props
}: TooltipPrimitive.Positioner.Props) {
  return (
    <TooltipPrimitive.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn('z-50', className)}
      {...props}
    />
  )
}

export function TooltipPopup({
  className,
  ...props
}: TooltipPrimitive.Popup.Props) {
  return (
    <TooltipPrimitive.Popup
      className={cn(
        'z-50 max-w-xs rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md outline-none',
        'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
        'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
        className,
      )}
      {...props}
    />
  )
}

export function TooltipArrow({
  className,
  ...props
}: TooltipPrimitive.Arrow.Props) {
  return (
    <TooltipPrimitive.Arrow
      className={cn('fill-primary', className)}
      {...props}
    />
  )
}

export function TooltipProvider({ ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider {...props} />
}

export function TooltipContent({
  className,
  children,
  side = 'top',
  align = 'center',
  sideOffset = 4,
  showArrow = false,
  ...props
}: TooltipPrimitive.Popup.Props & {
  side?: TooltipPrimitive.Positioner.Props['side']
  align?: TooltipPrimitive.Positioner.Props['align']
  sideOffset?: number
  showArrow?: boolean
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPositioner side={side} align={align} sideOffset={sideOffset}>
        <TooltipPopup className={className} {...props}>
          {children}
          {showArrow && <TooltipArrow />}
        </TooltipPopup>
      </TooltipPositioner>
    </TooltipPrimitive.Portal>
  )
}
