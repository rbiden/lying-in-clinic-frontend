import type { ReactElement, ReactNode } from 'react'
import { useState } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { BaseComponentProps } from '@/types'
import { cn } from '@/lib/utils'
import type { FormProps } from './Form'
import { Form } from './Form'
import { Button } from './ui/Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/Dialog'

export interface FormModalProps<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<FormProps<TFieldValues>, 'children' | 'title' | 'action'>,
    BaseComponentProps<
      ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode)
    > {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  trigger?: ReactNode
  modalClassName?: string
  showCloseButton?: boolean
  submitText?: string
  cancelText?: string
  closeOnSuccess?: boolean
  children?: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode)
}

export const FormModal = <TFieldValues extends FieldValues = FieldValues>({
  open,
  onOpenChange,
  defaultOpen,
  trigger,
  title,
  description,
  footer,
  action,
  className,
  modalClassName,
  showCloseButton = true,
  submitText = 'Submit',
  cancelText = 'Cancel',
  closeOnSuccess = true,
  children,
  onSuccess,
  ...formProps
}: FormModalProps<TFieldValues>) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : uncontrolledOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const hasHeader = Boolean(title || description)

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger render={trigger as ReactElement} />}
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(className, modalClassName)}
      >
        <Form<TFieldValues>
          {...formProps}
          onSuccess={(form) => {
            onSuccess?.(form)
            if (closeOnSuccess) {
              handleOpenChange(false)
            }
          }}
        >
          {(form) => {
            const renderedFooter =
              typeof footer === 'function'
                ? footer(form)
                : (footer ?? (
                    <>
                      {cancelText && (
                        <DialogClose
                          render={
                            <Button variant="outline" type="button">
                              {cancelText}
                            </Button>
                          }
                        />
                      )}
                      {submitText && (
                        <Button type="submit">{submitText}</Button>
                      )}
                    </>
                  ))

            return (
              <div className="flex flex-col gap-6">
                {hasHeader && (
                  <DialogHeader>
                    {title && <DialogTitle>{title}</DialogTitle>}
                    {description && (
                      <DialogDescription>{description}</DialogDescription>
                    )}
                  </DialogHeader>
                )}

                <div>
                  {typeof children === 'function' ? children(form) : children}
                </div>

                <DialogFooter>{renderedFooter}</DialogFooter>
              </div>
            )
          }}
        </Form>
      </DialogContent>
    </Dialog>
  )
}
