import type { ComponentProps, ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import type { ActionProps, BaseComponentProps } from '@/types'
import type { cardSizes } from './Card'
import { Card } from './Card'
import type { FormProps } from './Form'
import { Form } from './Form'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils'

export interface FormCardAction<
  TFieldValues extends FieldValues = FieldValues,
> extends Omit<ActionProps, 'onClick' | 'variant'> {
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    form: UseFormReturn<TFieldValues>,
  ) => void
  variant?: ComponentProps<typeof Button>['variant']
}

export interface FormCardProps<TFieldValues extends FieldValues = FieldValues>
  extends
    Omit<FormProps<TFieldValues>, 'children' | 'title' | 'action'>,
    BaseComponentProps<
      ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode)
    > {
  cardClassName?: string
  primaryAction?: FormCardAction<TFieldValues> | string
  secondaryAction?: FormCardAction<TFieldValues> | string
  submitClassName?: string
  submitText?: string
  size?: keyof typeof cardSizes
  children?: ReactNode | ((form: UseFormReturn<TFieldValues>) => ReactNode)
}

export const FormCard = <TFieldValues extends FieldValues = FieldValues>({
  title,
  description,
  action,
  footer,

  wrapperClassName,
  cardClassName,
  headerClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
  footerClassName,
  primaryAction,
  secondaryAction,
  submitClassName,
  submitText,
  size,
  children,
  ...formProps
}: FormCardProps<TFieldValues>) => {
  return (
    <Form<TFieldValues> {...formProps}>
      {(form) => {
        const renderAction = (
          actionConfig?: FormCardAction<TFieldValues> | string,
          defaultVariant: ComponentProps<typeof Button>['variant'] = 'default',
          defaultType: 'submit' | 'button' = 'submit',
        ) => {
          if (!actionConfig) return null

          if (typeof actionConfig === 'string') {
            return (
              <Button
                type={defaultType}
                variant={defaultVariant}
                className={submitClassName}
              >
                {actionConfig}
              </Button>
            )
          }

          const {
            label,
            className: actionClassName,
            classname,
            onClick,
            variant = defaultVariant,
            type = defaultType,
            disabled,
          } = actionConfig

          return (
            <Button
              type={type}
              variant={variant}
              disabled={disabled}
              className={actionClassName || classname}
              onClick={(e) => onClick?.(e, form)}
            >
              {label}
            </Button>
          )
        }

        const resolvedPrimary =
          primaryAction ??
          (submitText
            ? { label: submitText, className: submitClassName }
            : undefined)

        const hasPrimary = Boolean(resolvedPrimary)
        const hasSecondary = Boolean(secondaryAction)

        let actionsFooter: ReactNode = undefined

        if (hasPrimary && hasSecondary) {
          const primaryClass =
            typeof resolvedPrimary === 'object'
              ? resolvedPrimary.className || resolvedPrimary.classname
              : submitClassName
          const secondaryClass =
            typeof secondaryAction === 'object'
              ? secondaryAction.className || secondaryAction.classname
              : undefined
          const isFullWidth =
            primaryClass?.includes('w-full') ||
            secondaryClass?.includes('w-full')

          actionsFooter = (
            <div
              className={cn(
                'flex items-center gap-2 w-full',
                isFullWidth ? 'flex-col' : 'justify-end',
              )}
            >
              {isFullWidth ? (
                <>
                  {renderAction(resolvedPrimary, 'default', 'submit')}
                  {renderAction(secondaryAction, 'outline', 'button')}
                </>
              ) : (
                <>
                  {renderAction(secondaryAction, 'outline', 'button')}
                  {renderAction(resolvedPrimary, 'default', 'submit')}
                </>
              )}
            </div>
          )
        } else if (hasPrimary) {
          actionsFooter = renderAction(resolvedPrimary, 'default', 'submit')
        } else if (hasSecondary) {
          actionsFooter = renderAction(secondaryAction, 'outline', 'button')
        }

        const renderedFooter =
          typeof footer === 'function'
            ? footer(form)
            : (footer ?? actionsFooter)

        return (
          <Card
            title={title}
            description={description}
            action={action}
            size={size}
            titleClassName={titleClassName}
            descriptionClassName={descriptionClassName}
            wrapperClassName={cn(wrapperClassName, cardClassName)}
            headerClassName={headerClassName}
            contentClassName={contentClassName}
            footerClassName={footerClassName}
            footer={renderedFooter}
          >
            {typeof children === 'function' ? children(form) : children}
          </Card>
        )
      }}
    </Form>
  )
}
