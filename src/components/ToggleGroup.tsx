import { isValidElement, useState } from 'react'
import { cn } from '@/lib/utils'
import { useFormField } from '@/hooks'
import {
  ToggleGroup as ToggleGroupPrimitive,
  ToggleItem,
} from './ui/ToggleGroup'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import type {
  MultipleToggleGroupProps,
  SingleToggleGroupProps,
  ToggleGroupItemOption,
  ToggleGroupProps,
} from '../types/toggle-group.types'

function renderItemIcon(icon: ToggleGroupItemOption['icon']) {
  if (!icon) return null
  if (typeof icon === 'function') {
    const IconComp = icon
    return <IconComp className="size-4 shrink-0" />
  }
  if (isValidElement(icon)) {
    return icon
  }
  return null
}

export const ToggleGroup = (props: ToggleGroupProps) => {
  if (props.type === 'multiple') {
    return <MultipleToggleGroupField {...props} />
  }

  return <SingleToggleGroupField {...props} />
}

function SingleToggleGroupField({
  name,
  label,
  description,
  items = [],
  disabled = false,
  value: valueProp,
  defaultValue = '',

  variant = 'default',
  size = 'default',
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  toggleGroupClassName,
  itemClassName,

  descriptionPlacement = 'start',
  customMessage = null,

  useForm = true,
  showDirty = false,
  onValueChange,
  onChange,
  ...rest
}: SingleToggleGroupProps) {
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

  const handleGroupValueChange = (nextValues: string[]) => {
    if (disabled) return
    const next = nextValues[0] ?? ''

    if (isFormBound) {
      setValue(next)
    } else if (valueProp === undefined) {
      setUncontrolledValue(next)
    }

    onValueChange?.(next)
    onChange?.(next)
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
      <ToggleGroupPrimitive
        {...rest}
        id={name}
        disabled={disabled}
        variant={variant}
        size={size}
        multiple={false}
        value={currentValue ? [currentValue] : []}
        onValueChange={handleGroupValueChange}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className={cn(
          showDirty &&
            isDirty &&
            'ring-2 ring-amber-400 ring-offset-1 rounded-xl',
          hasError && 'ring-2 ring-destructive ring-offset-1 rounded-xl',
          toggleGroupClassName,
        )}
      >
        {items.map((item) => (
          <ToggleItem
            key={item.value}
            value={item.value}
            disabled={disabled || item.disabled}
            variant={variant}
            size={size}
            aria-label={item.ariaLabel}
            className={itemClassName}
          >
            {renderItemIcon(item.icon)}
            {item.label && <span>{item.label}</span>}
          </ToggleItem>
        ))}
      </ToggleGroupPrimitive>
    </BaseFieldWrapper>
  )
}

function MultipleToggleGroupField({
  name,
  label,
  description,
  items = [],
  disabled = false,
  value: valueProp,
  defaultValue = [],

  variant = 'default',
  size = 'default',
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  toggleGroupClassName,
  itemClassName,

  descriptionPlacement = 'start',
  customMessage = null,

  useForm = true,
  showDirty = false,
  onValueChange,
  onChange,
  ...rest
}: MultipleToggleGroupProps) {
  const [uncontrolledValues, setUncontrolledValues] =
    useState<string[]>(defaultValue)
  const { isConnected, value, setValue, errorMessage, hasError, isDirty } =
    useFormField<string[]>(name, { useForm })

  const isFormBound = isConnected && valueProp === undefined
  const currentValues = isFormBound
    ? Array.isArray(value)
      ? value
      : []
    : valueProp !== undefined
      ? valueProp
      : uncontrolledValues

  const descriptionId = name && description ? `${name}-description` : undefined
  const errorId = name && errorMessage ? `${name}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const handleGroupValueChange = (nextValues: string[]) => {
    if (disabled) return

    if (isFormBound) {
      setValue(nextValues)
    } else if (valueProp === undefined) {
      setUncontrolledValues(nextValues)
    }

    onValueChange?.(nextValues)
    onChange?.(nextValues)
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
      <ToggleGroupPrimitive
        {...rest}
        id={name}
        disabled={disabled}
        variant={variant}
        size={size}
        multiple={true}
        value={currentValues}
        onValueChange={handleGroupValueChange}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className={cn(
          showDirty &&
            isDirty &&
            'ring-2 ring-amber-400 ring-offset-1 rounded-xl',
          hasError && 'ring-2 ring-destructive ring-offset-1 rounded-xl',
          toggleGroupClassName,
        )}
      >
        {items.map((item) => (
          <ToggleItem
            key={item.value}
            value={item.value}
            disabled={disabled || item.disabled}
            variant={variant}
            size={size}
            aria-label={item.ariaLabel}
            className={itemClassName}
          >
            {renderItemIcon(item.icon)}
            {item.label && <span>{item.label}</span>}
          </ToggleItem>
        ))}
      </ToggleGroupPrimitive>
    </BaseFieldWrapper>
  )
}

export { ToggleGroup as ToggleGroupBase }
export type { ToggleGroupProps }
