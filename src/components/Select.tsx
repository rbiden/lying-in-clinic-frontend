import { useMemo, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormField } from '@/hooks'
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './ui/Select'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import type {
  SelectGroupOption,
  SelectOption,
  SelectProps,
} from '../types/select.types'

function isGroupedOptions<TValue extends string>(
  opts: SelectOption<TValue>[] | SelectGroupOption<TValue>[],
): opts is SelectGroupOption<TValue>[] {
  return opts.length > 0 && 'options' in opts[0]
}

export const Select = <TValue extends string = string>({
  name,
  label,
  description,
  options = [],
  disabled = false,
  required = false,
  value: valueProp,
  defaultValue = '' as TValue,
  placeholder = 'Select an option',
  clearable = false,

  wrapperClassName,
  labelClassName,
  descriptionClassName,
  triggerClassName,
  contentClassName,
  itemClassName,
  groupLabelClassName,

  descriptionPlacement = 'start',
  labelPosition = 'top',
  customMessage = null,

  side = 'bottom',
  align = 'start',
  sideOffset = 4,

  useForm = true,
  showDirty = false,
  onChange,
  onValueChange,
}: SelectProps<TValue>) => {
  const [uncontrolledValue, setUncontrolledValue] =
    useState<TValue>(defaultValue)
  const { isConnected, value, setValue, errorMessage, hasError, isDirty } =
    useFormField<TValue>(name, { useForm })

  const isFormBound = isConnected && valueProp === undefined
  const currentValue: TValue = isFormBound
    ? (value ?? ('' as TValue))
    : valueProp !== undefined
      ? valueProp
      : uncontrolledValue

  const flatOptions = useMemo<SelectOption<TValue>[]>(() => {
    if (isGroupedOptions(options)) {
      return options.flatMap((g) => g.options)
    }
    return options
  }, [options])

  const selectedOption = useMemo(() => {
    return flatOptions.find((opt) => opt.value === currentValue)
  }, [flatOptions, currentValue])

  const itemsMap = useMemo(() => {
    const map: Record<string, React.ReactNode> = {}
    for (const opt of flatOptions) {
      map[opt.value] = opt.label
    }
    return map
  }, [flatOptions])

  const descriptionId = name && description ? `${name}-description` : undefined
  const errorId = name && errorMessage ? `${name}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const handleValueChange = (nextValue: string | null) => {
    if (disabled) return
    const resolved = (nextValue ?? '') as TValue

    if (isFormBound) {
      setValue(resolved)
    } else if (valueProp === undefined) {
      setUncontrolledValue(resolved)
    }

    onChange?.(resolved)
    onValueChange?.(resolved)
  }

  const handleClear = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (disabled) return

    const empty = '' as TValue
    if (isFormBound) {
      setValue(empty)
    } else if (valueProp === undefined) {
      setUncontrolledValue(empty)
    }

    onChange?.(empty)
    onValueChange?.(empty)
  }

  const renderItem = (opt: SelectOption<TValue>) => (
    <SelectItem
      key={opt.value}
      value={opt.value}
      disabled={opt.disabled}
      className={itemClassName}
    >
      <div className="flex flex-1 items-center gap-2 truncate">
        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
        <div className="flex flex-col truncate">
          <SelectItemText>{opt.label}</SelectItemText>
          {opt.description && (
            <span className="text-xs text-muted-foreground">
              {opt.description}
            </span>
          )}
        </div>
      </div>
      <SelectItemIndicator />
    </SelectItem>
  )

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
      <SelectPrimitive<string>
        value={currentValue || null}
        items={itemsMap}
        onValueChange={handleValueChange}
        disabled={disabled}
        name={name}
        required={required}
      >
        <SelectTrigger
          id={name}
          disabled={disabled}
          className={cn(
            !currentValue && 'text-muted-foreground',
            triggerClassName,
          )}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
        >
          <div className="flex flex-1 items-center gap-2 truncate text-left">
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
            <SelectValue placeholder={placeholder} />
          </div>
          {clearable && currentValue && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear selection"
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleClear(e)
                }
              }}
              className="rounded-xs p-0.5 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground cursor-pointer shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </SelectTrigger>

        <SelectContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={contentClassName}

        >
          {isGroupedOptions(options)
            ? options.map((group, groupIdx) => (
                <div key={group.label || groupIdx}>
                  {groupIdx > 0 && <SelectSeparator />}
                  <SelectGroup>
                    <SelectGroupLabel className={groupLabelClassName}>
                      {group.label}
                    </SelectGroupLabel>
                    {group.options.map(renderItem)}
                  </SelectGroup>
                </div>
              ))
            : options.map(renderItem)}
        </SelectContent>
      </SelectPrimitive>
    </BaseFieldWrapper>
  )
}
