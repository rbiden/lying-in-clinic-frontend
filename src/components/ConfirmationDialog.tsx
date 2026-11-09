import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Button, Modal } from '@/components'
import { useConfirmationStore, useLoadingStore } from '@/stores'
import { cn } from '@/lib'

export const ConfirmationDialog = () => {
  const isOpen = useConfirmationStore((state) => state.isOpen)
  const dialog = useConfirmationStore((state) => state.dialog)
  const lastDialog = useConfirmationStore((state) => state.lastDialog)
  const confirmAction = useConfirmationStore((state) => state.confirmAction)
  const cancelAction = useConfirmationStore((state) => state.cancelAction)
  const setIsMounted = useConfirmationStore((state) => state.setIsMounted)
  const isLoading = useLoadingStore((state) => state.isLoading)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
      cancelAction()
    }
  }, [setIsMounted, cancelAction])

  const activeDialog = dialog ?? lastDialog
  if (!activeDialog) {
    return null
  }

  const handleConfirm = () => {
    confirmAction()
  }

  const handleCancel = () => {
    cancelAction()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleCancel()
    }
  }

  const Icon = activeDialog.icon || AlertTriangle
  const size = activeDialog.size || 'sm'
  const sizeClass =
    size === 'sm'
      ? 'sm:max-w-sm'
      : size === 'lg'
        ? 'sm:max-w-lg'
        : 'sm:max-w-md'

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      className={cn(
        sizeClass,
        activeDialog.className,
        activeDialog.contentClassName,
      )}
      title={
        <span
          className={cn(
            'flex flex-col items-center justify-center gap-2',
            activeDialog.headerClassName,
          )}
        >
          <span className="p-3 rounded-full bg-red-50 mx-auto">
            <Icon className="text-destructive size-9" />
          </span>
          <span
            className={cn(
              'text-base text-center font-extrabold tracking-wider uppercase',
              activeDialog.titleClassName,
            )}
          >
            {activeDialog.title || 'Are you sure?'}
          </span>
        </span>
      }
      description={
        <span
          className={cn(
            'block text-center! w-full!',
            activeDialog.messageClassName,
          )}
        >
          {activeDialog.message || 'This action cannot be undone easily.'}
        </span>
      }
      footer={
        <div
          className={cn(
            'flex! flex-col! gap-2 mt-2 w-full',
            activeDialog.footerClassName,
          )}
        >
          <Button
            variant={activeDialog.variant || 'default'}
            className={cn(
              'order-first! h-10 w-full',
              activeDialog.confirmClassName,
            )}
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {activeDialog.confirmLabel || 'Confirm'}
          </Button>
          <Button
            variant={activeDialog.cancelVariant || 'outline'}
            className={cn('w-full! h-10!', activeDialog.cancelClassName)}
            disabled={isLoading}
            onClick={handleCancel}
          >
            {activeDialog.cancelLabel || 'Cancel'}
          </Button>
        </div>
      }
    />
  )
}
