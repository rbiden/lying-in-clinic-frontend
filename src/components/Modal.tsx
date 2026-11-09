import type { ReactElement, ReactNode } from 'react'
import type { BaseComponentProps } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog'

export interface ModalProps extends BaseComponentProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  trigger?: ReactNode
  children?: ReactNode
  showCloseButton?: boolean
}

export const Modal = ({
  open,
  onOpenChange,
  defaultOpen,
  trigger,
  title,
  description,
  footer,
  children,
  showCloseButton = true,
  className,
}: ModalProps) => {
  const hasHeader = Boolean(title || description)

  return (
    <Dialog open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      {trigger && <DialogTrigger render={trigger as ReactElement} />}
      <DialogContent showCloseButton={showCloseButton} className={className}>
        {hasHeader && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        {children}

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
