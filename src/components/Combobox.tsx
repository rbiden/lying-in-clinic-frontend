import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormField } from '@/hooks'
import {
  Combobox as ComboboxPrimitive,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxClear,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from './ui/Combobox'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import type {
  ComboboxGroupOption,
  ComboboxOption,
  ComboboxProps,
  MultiComboboxProps,
  SingleComboboxProps,
} from '../types/combobox.types'

function isGroupedOptions<TValue extends string>(
  opts: ComboboxOption<TValue>[] | ComboboxGroupOption<TValue>[],
): opts is ComboboxGroupOption<TValue>[] {
  return opts.length > 0 && 'options' in opts[0]
}

export const Combobox = <TValue extends string = string>(
  props: ComboboxProps<TValue>,
) => {
  const {
    name,
    label,
    description,
    disabled = false,
    required = false,
    options = [],
    placeholder = 'Select an option',
    searchPlaceholder = '',
    emptyMessage = 'No results found',
    clearable = true,
    autoHighlight = true,
    useForm = true,
    showDirty = false,
    customMessage = null,

    wrapperClassName,
    labelClassName,
    descriptionClassName,
    inputGroupClassName,
    inputClassName,
    contentClassName,
    itemClassName,
    groupLabelClassName,
    chipClassName,

    descriptionPlacement = 'start',
    labelPosition = 'top',

    side = 'bottom',
    align = 'start',
    sideOffset = 4,
  } = props

  const {
    isConnected,
    value: formValue,
    setValue,
    errorMessage,
    hasError,
    isDirty,
  } = useFormField<unknown>(name, { useForm })

  const isFormBound = isConnected && props.value === undefined

  const flatOptions = useMemo<ComboboxOption<TValue>[]>(() => {
    if (isGroupedOptions(options)) {
      return options.flatMap((g) => g.options)
    }
    return options
  }, [options])

  const rootItems = useMemo(() => {
    if (isGroupedOptions(options)) {
      return options.map((g) => ({
        label: g.label,
        items: g.options,
      }))
    }
    return options
  }, [options])

  const descriptionId = name && description ? `${name}-description` : undefined
  const errorId = name && errorMessage ? `${name}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const itemToStringLabel = (item: unknown) => {
    if (typeof item === 'object' && item !== null && 'label' in item) {
      return String((item as { label: ReactNode }).label)
    }
    return String(item ?? '')
  }

  const itemToStringValue = (item: unknown) => {
    if (typeof item === 'object' && item !== null && 'value' in item) {
      return String((item as { value: string }).value)
    }
    return String(item ?? '')
  }

  const renderItem = (item: ComboboxOption<TValue>) => (
    <ComboboxItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      className={cn(
        'relative flex w-full cursor-default select-none items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
        'data-highlighted:bg-accent data-highlighted:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        itemClassName,
      )}
    >
      <div className="flex flex-1 items-center gap-2 truncate">
        {item.icon && <span className="shrink-0">{item.icon}</span>}
        <div className="flex flex-col truncate">
          <span className="truncate">{item.label}</span>
          {item.description && (
            <span className="text-xs text-muted-foreground">
              {item.description}
            </span>
          )}
        </div>
      </div>
      <ComboboxItemIndicator>
        <Check className="h-4 w-4 text-primary shrink-0" />
      </ComboboxItemIndicator>
    </ComboboxItem>
  )

  const renderDropdownList = () => (
    <ComboboxContent
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={contentClassName}
    >
      <ComboboxList className="p-1 max-h-60 overflow-y-auto">
        <ComboboxEmpty className="py-6 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </ComboboxEmpty>
        {isGroupedOptions(options) ? (
          options.map((group, groupIdx) => (
            <div key={group.label || groupIdx}>
              {groupIdx > 0 && <ComboboxSeparator />}
              <ComboboxGroup items={group.options}>
                <ComboboxGroupLabel className={groupLabelClassName}>
                  {group.label}
                </ComboboxGroupLabel>
                <ComboboxCollection>
                  {(item: ComboboxOption<TValue>) => renderItem(item)}
                </ComboboxCollection>
              </ComboboxGroup>
            </div>
          ))
        ) : (
          <ComboboxCollection>
            {(item: ComboboxOption<TValue>) => renderItem(item)}
          </ComboboxCollection>
        )}
      </ComboboxList>
    </ComboboxContent>
  )

  // -------------------------------------------------------------
  // MULTI-SELECT BRANCH
  // -------------------------------------------------------------
  if (props.multiple) {
    const multiProps = props
    return (
      <MultiComboboxRenderer<TValue>
        name={name}
        label={label}
        description={description}
        disabled={disabled}
        required={required}
        clearable={clearable}
        autoHighlight={autoHighlight}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        flatOptions={flatOptions}
        rootItems={rootItems}
        isFormBound={isFormBound}
        formValue={formValue}
        multiProps={multiProps}
        setValue={setValue}
        hasError={hasError}
        errorMessage={errorMessage}
        isDirty={isDirty}
        showDirty={showDirty}
        customMessage={customMessage}
        wrapperClassName={wrapperClassName}
        labelClassName={labelClassName}
        descriptionClassName={descriptionClassName}
        inputGroupClassName={inputGroupClassName}
        inputClassName={inputClassName}
        chipClassName={chipClassName}
        descriptionPlacement={descriptionPlacement}
        labelPosition={labelPosition}
        descriptionId={descriptionId}
        errorId={errorId}
        ariaDescribedBy={ariaDescribedBy}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        renderDropdownList={renderDropdownList}
      />
    )
  }

  // -------------------------------------------------------------
  // SINGLE-SELECT BRANCH
  // -------------------------------------------------------------
  const singleProps = props
  return (
    <SingleComboboxRenderer<TValue>
      name={name}
      label={label}
      description={description}
      disabled={disabled}
      required={required}
      clearable={clearable}
      autoHighlight={autoHighlight}
      placeholder={placeholder}
      flatOptions={flatOptions}
      rootItems={rootItems}
      isFormBound={isFormBound}
      formValue={formValue}
      singleProps={singleProps}
      setValue={setValue}
      hasError={hasError}
      errorMessage={errorMessage}
      isDirty={isDirty}
      showDirty={showDirty}
      customMessage={customMessage}
      wrapperClassName={wrapperClassName}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      inputGroupClassName={inputGroupClassName}
      inputClassName={inputClassName}
      descriptionPlacement={descriptionPlacement}
      labelPosition={labelPosition}
      descriptionId={descriptionId}
      errorId={errorId}
      ariaDescribedBy={ariaDescribedBy}
      itemToStringLabel={itemToStringLabel}
      itemToStringValue={itemToStringValue}
      renderDropdownList={renderDropdownList}
    />
  )
}

// -------------------------------------------------------------
// INTERNAL SUB-RENDERERS (Keeps parent component clean and modular)
// -------------------------------------------------------------

interface MultiComboboxRendererProps<TValue extends string> {
  name?: string
  label?: ReactNode
  description?: ReactNode
  disabled: boolean
  required: boolean
  clearable: boolean
  autoHighlight: boolean
  placeholder: string
  searchPlaceholder: string
  flatOptions: ComboboxOption<TValue>[]
  rootItems: unknown[]
  isFormBound: boolean
  formValue: unknown
  multiProps: MultiComboboxProps<TValue>
  setValue: (next: unknown) => void
  hasError: boolean
  errorMessage?: string
  isDirty: boolean
  showDirty: boolean
  customMessage: ReactNode
  wrapperClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  inputGroupClassName?: string
  inputClassName?: string
  chipClassName?: string
  descriptionPlacement: 'start' | 'end'
  labelPosition: 'top' | 'left' | 'right'
  descriptionId?: string
  errorId?: string
  ariaDescribedBy?: string
  itemToStringLabel: (item: unknown) => string
  itemToStringValue: (item: unknown) => string
  renderDropdownList: () => ReactNode
}

function MultiComboboxRenderer<TValue extends string>({
  name,
  label,
  description,
  disabled,
  required,
  clearable,
  autoHighlight,
  placeholder,
  searchPlaceholder,
  flatOptions,
  rootItems,
  isFormBound,
  formValue,
  multiProps,
  setValue,
  hasError,
  errorMessage,
  isDirty,
  showDirty,
  customMessage,
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  inputGroupClassName,
  inputClassName,
  chipClassName,
  descriptionPlacement,
  labelPosition,
  descriptionId,
  errorId,
  ariaDescribedBy,
  itemToStringLabel,
  itemToStringValue,
  renderDropdownList,
}: MultiComboboxRendererProps<TValue>) {
  const [uncontrolled, setUncontrolled] = useState<TValue[]>(
    multiProps.defaultValue ?? [],
  )

  const currentValues: TValue[] = isFormBound
    ? ((Array.isArray(formValue) ? formValue : []) as TValue[])
    : (multiProps.value ?? uncontrolled)

  const handleValueChange = (nextValues: string[]) => {
    if (disabled) return
    const values = nextValues as TValue[]

    if (isFormBound) {
      setValue(values)
    } else if (multiProps.value === undefined) {
      setUncontrolled(values)
    }

    multiProps.onChange?.(values)
    multiProps.onValueChange?.(values)
  }

  const hasValues = currentValues.length > 0

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
      <ComboboxPrimitive<string, true, unknown>
        multiple
        items={rootItems}
        value={currentValues}
        onValueChange={handleValueChange}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        disabled={disabled}
        name={name}
        required={required}
        autoHighlight={autoHighlight}
      >
        <ComboboxInputGroup
          className={cn(
            'flex min-h-9 w-full items-center justify-between gap-1.5 rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs transition-colors',
            'focus-within:border-ring focus-within:ring-1 focus-within:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            inputGroupClassName,
          )}
        >
          <ComboboxChips className="flex flex-1 flex-wrap items-center gap-1.5 min-w-0 py-0.5">
            <ComboboxValue>
              {(values: string[]) =>
                values.map((val) => {
                  const opt = flatOptions.find((o) => o.value === val)
                  return (
                    <ComboboxChip
                      key={val}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground transition-colors',
                        'data-highlighted:ring-2 data-highlighted:ring-ring',
                        chipClassName,
                      )}
                    >
                      {opt?.icon && (
                        <span className="shrink-0">{opt.icon}</span>
                      )}
                      <span className="truncate max-w-36">
                        {opt?.label ?? val}
                      </span>
                      <ComboboxChipRemove
                        aria-label={`Remove ${opt?.label ?? val}`}
                        className="rounded-xs p-0.5 text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                      </ComboboxChipRemove>
                    </ComboboxChip>
                  )
                })
              }
            </ComboboxValue>
            <ComboboxInput
              id={name}
              placeholder={hasValues ? searchPlaceholder : placeholder}
              disabled={disabled}
              className={cn(
                'flex-1 min-w-24 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
                inputClassName,
              )}
              aria-invalid={hasError}
              aria-describedby={ariaDescribedBy}
              aria-required={required}
            />
          </ComboboxChips>
          <div className="flex items-center gap-1 shrink-0 self-center">
            {clearable && hasValues && !disabled && (
              <ComboboxClear
                aria-label="Clear all selections"
                className="rounded-xs p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </ComboboxClear>
            )}
            <ComboboxTrigger
              aria-label="Toggle options"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
            >
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-open:rotate-180" />
            </ComboboxTrigger>
          </div>
        </ComboboxInputGroup>

        {renderDropdownList()}
      </ComboboxPrimitive>
    </BaseFieldWrapper>
  )
}

interface SingleComboboxRendererProps<TValue extends string> {
  name?: string
  label?: ReactNode
  description?: ReactNode
  disabled: boolean
  required: boolean
  clearable: boolean
  autoHighlight: boolean
  placeholder: string
  flatOptions: ComboboxOption<TValue>[]
  rootItems: unknown[]
  isFormBound: boolean
  formValue: unknown
  singleProps: SingleComboboxProps<TValue>
  setValue: (next: unknown) => void
  hasError: boolean
  errorMessage?: string
  isDirty: boolean
  showDirty: boolean
  customMessage: ReactNode
  wrapperClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  inputGroupClassName?: string
  inputClassName?: string
  descriptionPlacement: 'start' | 'end'
  labelPosition: 'top' | 'left' | 'right'
  descriptionId?: string
  errorId?: string
  ariaDescribedBy?: string
  itemToStringLabel: (item: unknown) => string
  itemToStringValue: (item: unknown) => string
  renderDropdownList: () => ReactNode
}

function SingleComboboxRenderer<TValue extends string>({
  name,
  label,
  description,
  disabled,
  required,
  clearable,
  autoHighlight,
  placeholder,
  flatOptions,
  rootItems,
  isFormBound,
  formValue,
  singleProps,
  setValue,
  hasError,
  errorMessage,
  isDirty,
  showDirty,
  customMessage,
  wrapperClassName,
  labelClassName,
  descriptionClassName,
  inputGroupClassName,
  inputClassName,
  descriptionPlacement,
  labelPosition,
  descriptionId,
  errorId,
  ariaDescribedBy,
  itemToStringLabel,
  itemToStringValue,
  renderDropdownList,
}: SingleComboboxRendererProps<TValue>) {
  const [uncontrolled, setUncontrolled] = useState<TValue>(
    singleProps.defaultValue ?? ('' as TValue),
  )

  const currentValue: TValue = isFormBound
    ? ((formValue != null ? String(formValue) : '') as TValue)
    : (singleProps.value ?? uncontrolled)

  const selectedOption = useMemo(() => {
    return flatOptions.find((opt) => opt.value === currentValue)
  }, [flatOptions, currentValue])

  const handleValueChange = (nextValue: string | null) => {
    if (disabled) return
    const resolved = (nextValue ?? '') as TValue

    if (isFormBound) {
      setValue(resolved)
    } else if (singleProps.value === undefined) {
      setUncontrolled(resolved)
    }

    singleProps.onChange?.(resolved)
    singleProps.onValueChange?.(resolved)
  }

  const hasValue = Boolean(currentValue)

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
      <ComboboxPrimitive<string, false, unknown>
        multiple={false}
        items={rootItems}
        value={currentValue || null}
        onValueChange={handleValueChange}
        itemToStringLabel={itemToStringLabel}
        itemToStringValue={itemToStringValue}
        disabled={disabled}
        name={name}
        required={required}
        autoHighlight={autoHighlight}
      >
        <ComboboxInputGroup
          className={cn(
            'flex min-h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors',
            'focus-within:border-ring focus-within:ring-1 focus-within:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            inputGroupClassName,
          )}
        >
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {selectedOption?.icon && (
              <span className="shrink-0">{selectedOption.icon}</span>
            )}
            <ComboboxInput
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'w-full bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
                inputClassName,
              )}
              aria-invalid={hasError}
              aria-describedby={ariaDescribedBy}
              aria-required={required}
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {clearable && hasValue && !disabled && (
              <ComboboxClear
                aria-label="Clear selection"
                className="rounded-xs p-1 text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </ComboboxClear>
            )}
            <ComboboxTrigger
              aria-label="Toggle options"
              className="text-muted-foreground hover:text-foreground transition-colors p-1 cursor-pointer"
            >
              <ChevronDown className="h-4 w-4 transition-transform duration-200 data-open:rotate-180" />
            </ComboboxTrigger>
          </div>
        </ComboboxInputGroup>

        {renderDropdownList()}
      </ComboboxPrimitive>
    </BaseFieldWrapper>
  )
}
