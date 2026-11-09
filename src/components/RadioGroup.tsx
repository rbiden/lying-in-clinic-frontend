import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useFormField } from '@/hooks'
import { RadioGroup as RadioGroupPrimitive, RadioItem } from './ui/RadioGroup'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import type { RadioGroupProps } from '../types/radio-group.types'

export const RadioGroup = ({
  name,
  label,
  description,
  options = [],
  disabled = false,
  value: valueProp,
  defaultValue = '',

  orientation = 'vertical',
  variant = 'default',
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  radioGroupClassName,
  itemClassName,
  radioClassName,

  descriptionPlacement = 'start',
  customMessage = null,

  useForm = true,
  showDirty = false,
  onValueChange,
  onChange,
  ...rest
}: RadioGroupProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const { isConnected, value, setValue, errorMessage, hasError, isDirty } =
    useFormField<string>(name, { useForm })

  const isFormBound = isConnected && valueProp === undefined
  const currentValue = isFormBound
    ? String(value ?? '')
    : valueProp !== undefined
      ? valueProp
      : uncontrolledValue

  const descriptionId = name && description ? `${name}-description` : undefined
  const errorId = name && errorMessage ? `${name}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const handleValueChange = (nextValue: string) => {
    if (disabled) return

    if (isFormBound) {
      setValue(nextValue)
    } else if (valueProp === undefined) {
      setUncontrolledValue(nextValue)
    }

    onValueChange?.(nextValue)
    onChange?.(nextValue)
  }

  return (
    <BaseFieldWrapper
      id={name}
      name={name}
      label={label}
      description={description}
      disabled={disabled}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      descriptionPlacement={descriptionPlacement}
      labelPosition="top"
      customMessage={customMessage}
      errorMessage={errorMessage}
      hasError={hasError}
      isDirty={isDirty}
      showDirty={showDirty}
      descriptionId={descriptionId}
      errorId={errorId}
    >
      <RadioGroupPrimitive
        {...rest}
        id={name}
        name={name}
        disabled={disabled}
        value={currentValue}
        onValueChange={handleValueChange}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className={cn(
          orientation === 'horizontal'
            ? 'flex flex-wrap gap-4'
            : 'grid gap-2.5',
          showDirty &&
            isDirty &&
            'rounded-xl p-1.5 border border-warning/40 bg-warning/5 ring-1 ring-warning/25',
          radioGroupClassName,
        )}
      >
        {options.map((option) => {
          const isSelected = currentValue === option.value
          const isOptionDisabled = disabled || Boolean(option.disabled)
          const optionId = name ? `${name}-${option.value}` : undefined
          const optionDescId =
            optionId && option.description ? `${optionId}-desc` : undefined

          if (variant === 'card') {
            return (
              <label
                key={option.value}
                htmlFor={optionId}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3 transition-all select-none',
                  isOptionDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:border-muted-foreground/30 hover:bg-muted/40',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                    : 'border-border bg-card',
                  itemClassName,
                )}
              >
                <div className="pt-0.5">
                  <RadioItem
                    id={optionId}
                    value={option.value}
                    disabled={isOptionDisabled}
                    className={radioClassName}
                    aria-describedby={optionDescId}
                  />
                </div>
                <div className="flex flex-col gap-0.5 text-sm">
                  <span
                    className={cn(
                      'font-medium text-foreground',
                      isSelected && 'text-primary font-semibold',
                    )}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <span
                      id={optionDescId}
                      className="text-xs text-muted-foreground"
                    >
                      {option.description}
                    </span>
                  )}
                </div>
              </label>
            )
          }

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(
                'flex items-start gap-2.5 select-none',
                isOptionDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer',
                itemClassName,
              )}
            >
              <div className="pt-0.5">
                <RadioItem
                  id={optionId}
                  value={option.value}
                  disabled={isOptionDisabled}
                  className={radioClassName}
                  aria-describedby={optionDescId}
                />
              </div>
              <div className="flex flex-col gap-0.5 text-sm">
                <span
                  className={cn(
                    'font-medium text-foreground',
                    isSelected && 'text-primary',
                  )}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span
                    id={optionDescId}
                    className="text-xs text-muted-foreground"
                  >
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          )
        })}
      </RadioGroupPrimitive>
    </BaseFieldWrapper>
  )
}

export { RadioGroup as RadioGroupBase }
export type { RadioGroupProps }
