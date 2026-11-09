import { useState } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import { Eye, EyeOff, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sanitize } from '@/helpers'
import { useFormField } from '@/hooks'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import { Button } from './ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from './ui/DropdownMenu'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from './ui/InputGroup'
import {
  cleanGradeValue,
  cleanNumbersOnlyValue,
  isAllowedInputKey,
  shouldBlockGradeDot,
} from '../helpers/input-helpers'
import type { InputProps } from '../types/input.types'

export const Input = ({
  name,
  label,
  description,
  type,
  placeholder,

  wrapperClassName,
  inputClassName,
  labelClassName,
  descriptionClassName,
  inputGroupClassName,

  prefix,
  prefixType = 'default',
  prefixIcon,
  suffix,
  suffixType = 'default',
  suffixIcon,
  items,
  customMessage = null,
  descriptionPlacement = 'start',
  labelPosition = 'top',

  numbersOnly = false,
  asGrade = false,

  useForm = true,
  showDirty = false,
  onChange,
  onKeyDown,
  ...rest
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const { registeredProps, errorMessage, hasError, isDirty } = useFormField(
    name,
    { useForm },
  )

  const targetId = rest.id || name
  const descriptionId =
    targetId && description ? `${targetId}-description` : undefined
  const errorId = targetId && errorMessage ? `${targetId}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (asGrade) {
      if (!isAllowedInputKey(e.key, e.ctrlKey || e.metaKey)) {
        e.preventDefault()
      }
      if (shouldBlockGradeDot(e.key, e.currentTarget.value)) {
        e.preventDefault()
      }
    } else if (numbersOnly) {
      if (!isAllowedInputKey(e.key, e.ctrlKey || e.metaKey)) {
        e.preventDefault()
      }
    }
    onKeyDown?.(e)
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (asGrade) {
      e.target.value = cleanGradeValue(e.target.value)
    } else if (numbersOnly) {
      e.target.value = cleanNumbersOnlyValue(e.target.value)
    }

    e.target.value = sanitize(e.target.value)

    if (registeredProps.onChange) {
      await registeredProps.onChange(e)
    }

    onChange?.(e)
  }

  return (
    <BaseFieldWrapper
      id={targetId}
      name={name}
      label={label}
      description={description}
      disabled={rest.disabled}
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
      <InputGroup
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'overflow-hidden',
          inputGroupClassName,
          showDirty &&
            isDirty &&
            'bg-warning/5 border-warning/40 ring-1 ring-warning/25',
        )}
      >
        {Boolean(prefix) && (
          <InputGroupAddon>
            {prefixType === 'dropdown' ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button variant="ghost" type="button" />}
                >
                  {prefixIcon || <MoreHorizontal className="size-4" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {items || prefix}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : prefixType === 'text' ? (
              <InputGroupText>{prefix}</InputGroupText>
            ) : (
              prefix
            )}
          </InputGroupAddon>
        )}

        <InputGroupInput
          {...registeredProps}
          {...rest}
          id={targetId}
          name={name}
          type={
            type === 'password' ? (showPassword ? 'text' : 'password') : type
          }
          placeholder={placeholder}
          className={cn(inputClassName, (!!prefix || !!suffix) && 'px-0')}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />

        {(Boolean(suffix) || type === 'password') && (
          <InputGroupAddon align="inline-end">
            {type === 'password' ? (
              <InputGroupButton
                variant="ghost"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </InputGroupButton>
            ) : suffixType === 'dropdown' ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<InputGroupButton variant="ghost" type="button" />}
                >
                  {suffixIcon || <MoreHorizontal className="size-4" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {items || suffix}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : suffixType === 'text' ? (
              <InputGroupText>{suffix}</InputGroupText>
            ) : (
              suffix
            )}
          </InputGroupAddon>
        )}
      </InputGroup>
    </BaseFieldWrapper>
  )
}

export { Input as InputBase }
export type { InputProps }
