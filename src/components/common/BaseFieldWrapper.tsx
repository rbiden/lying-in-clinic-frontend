import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/Field'
import type { BaseFieldWrapperProps } from '../../types/field-wrapper.types'

export const FieldDescriptionText = ({
  id,
  description,
  className,
}: {
  id?: string
  description?: ReactNode
  className?: string
}) => {
  if (!description) return null
  return (
    <FieldDescription
      id={id}
      className={cn('text-xs text-muted-foreground', className)}
    >
      {description}
    </FieldDescription>
  )
}

export const BaseFieldWrapper = ({
  id,
  name,
  label,
  description,
  disabled,
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  descriptionPlacement = 'start',
  labelPosition = 'top',
  customMessage,
  errorMessage,
  hasError,
  isDirty,
  showDirty,
  descriptionId,
  errorId,
  children,
}: BaseFieldWrapperProps) => {
  const targetId = id || name

  if (labelPosition === 'left' || labelPosition === 'right') {
    return (
      <Field
        data-invalid={hasError || undefined}
        className={cn(
          'gap-1.5 p-1',
          showDirty &&
            isDirty &&
            'rounded-lg bg-warning/5 p-2 border-warning/40 ring-1 ring-warning/25',
          wrapperClassName,
        )}
      >
        <div className="flex items-center justify-between gap-3">
          {labelPosition === 'left' ? (
            <>
              <div className="flex flex-col gap-0.5">
                {label && (
                  <FieldLabel
                    htmlFor={targetId}
                    className={cn(
                      'text-sm font-medium cursor-pointer',
                      disabled && 'opacity-60 cursor-not-allowed',
                      labelClassName,
                    )}
                  >
                    {label}
                  </FieldLabel>
                )}
                {descriptionPlacement !== 'end' && (
                  <FieldDescriptionText
                    id={descriptionId}
                    description={description}
                    className={descriptionClassName}
                  />
                )}
              </div>
              <div className="shrink-0">{children}</div>
            </>
          ) : (
            <>
              <div className="shrink-0">{children}</div>
              <div className="flex flex-col gap-0.5">
                {label && (
                  <FieldLabel
                    htmlFor={targetId}
                    className={cn(
                      'text-sm font-medium cursor-pointer',
                      disabled && 'opacity-60 cursor-not-allowed',
                      labelClassName,
                    )}
                  >
                    {label}
                  </FieldLabel>
                )}
                {descriptionPlacement !== 'end' && (
                  <FieldDescriptionText
                    id={descriptionId}
                    description={description}
                    className={descriptionClassName}
                  />
                )}
              </div>
            </>
          )}
        </div>

        {descriptionPlacement === 'end' && (
          <FieldDescriptionText
            id={descriptionId}
            description={description}
            className={descriptionClassName}
          />
        )}

        {customMessage ? <div>{customMessage}</div> : null}

        <FieldError id={errorId} className="text-xs">
          {errorMessage}
        </FieldError>
      </Field>
    )
  }

  return (
    <Field
      data-invalid={hasError || undefined}
      className={cn(
        'gap-1 p-0',
        showDirty &&
          isDirty &&
          'rounded-lg bg-warning/5 p-2 border-warning/40 ring-1 ring-warning/25',
        wrapperClassName,
      )}
    >
      {label && (
        <FieldLabel
          htmlFor={targetId}
          className={cn(
            'text-sm font-medium',
            disabled && 'opacity-60 cursor-not-allowed',
            labelClassName,
          )}
        >
          {label}
        </FieldLabel>
      )}

      {descriptionPlacement !== 'end' && (
        <FieldDescriptionText
          id={descriptionId}
          description={description}
          className={descriptionClassName}
        />
      )}

      {children}

      {customMessage ? <div>{customMessage}</div> : null}

      <FieldError id={errorId} className="text-xs">
        {errorMessage}
      </FieldError>

      {descriptionPlacement === 'end' && (
        <FieldDescriptionText
          id={descriptionId}
          description={description}
          className={descriptionClassName}
        />
      )}
    </Field>
  )
}
