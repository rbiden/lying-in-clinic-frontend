import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useFormField } from '@/hooks'
import { Switch as SwitchPrimitive } from './ui/Switch'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import type { SwitchProps } from '../types/switch.types'

export const Switch = ({
  name,
  label,
  description,
  disabled = false,
  checked: checkedProp,
  defaultChecked = false,

  wrapperClassName,
  labelClassName,
  descriptionClassName,
  switchClassName,

  labelPosition = 'left',
  descriptionPlacement = 'start',
  customMessage = null,

  useForm = true,
  showDirty = false,
  onCheckedChange,
  onChange,
  ...rest
}: SwitchProps) => {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked)
  const { isConnected, value, setValue, errorMessage, hasError, isDirty } =
    useFormField<boolean>(name, { useForm })

  const isFormBound = isConnected && checkedProp === undefined
  const currentChecked = isFormBound
    ? Boolean(value)
    : checkedProp !== undefined
      ? checkedProp
      : uncontrolledChecked

  const descriptionId = name && description ? `${name}-description` : undefined
  const errorId = name && errorMessage ? `${name}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const handleCheckedChange = (nextChecked: boolean) => {
    if (disabled) return

    if (isFormBound) {
      setValue(nextChecked)
    } else if (checkedProp === undefined) {
      setUncontrolledChecked(nextChecked)
    }

    onCheckedChange?.(nextChecked)
    onChange?.(nextChecked)
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
      labelPosition={labelPosition}
      customMessage={customMessage}
      errorMessage={errorMessage}
      hasError={hasError}
      isDirty={isDirty}
      showDirty={showDirty}
      descriptionId={descriptionId}
      errorId={errorId}
    >
      <SwitchPrimitive
        {...rest}
        id={name}
        name={name}
        disabled={disabled}
        checked={currentChecked}
        onCheckedChange={handleCheckedChange}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className={cn(
          showDirty && isDirty && 'ring-2 ring-warning/60 ring-offset-1',
          hasError && 'ring-2 ring-destructive ring-offset-1',
          switchClassName,
        )}
      />
    </BaseFieldWrapper>
  )
}

export { Switch as SwitchBase }
export type { SwitchProps }
