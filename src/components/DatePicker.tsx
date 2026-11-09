import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { format, isValid } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDownIcon, X } from 'lucide-react'
import type { Matcher } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { useFormField } from '@/hooks'
import type { BaseFieldProps } from '@/types'
import type {
  FieldDescriptionPlacement,
  FieldLabelPosition,
} from '@/types/field-wrapper.types'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import { Button } from './ui/Button'
import { Calendar } from './ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover'

export interface DatePickerProps extends BaseFieldProps {
  id?: string
  name?: string
  value?: Date | string | null
  defaultValue?: Date | string | null
  placeholder?: string
  displayFormat?: string
  valueFormat?: string

  disabled?: boolean
  disabledDays?: Matcher | Matcher[]
  captionLayout?: 'label' | 'dropdown'
  showOutsideDays?: boolean

  useForm?: boolean
  showDirty?: boolean
  clearable?: boolean

  buttonClassName?: string
  popoverContentClassName?: string
  descriptionPlacement?: FieldDescriptionPlacement
  labelPosition?: FieldLabelPosition
  customMessage?: ReactNode

  onChange?: (date: Date | undefined) => void
  onValueChange?: (formattedValue: string | undefined) => void
}

const parseDateValue = (val: unknown): Date | undefined => {
  if (!val) return undefined
  if (val instanceof Date) return isValid(val) ? val : undefined
  if (typeof val === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
      const [year, month, day] = val.split('-').map(Number)
      const parsed = new Date(0)
      parsed.setFullYear(year, month - 1, day)
      parsed.setHours(0, 0, 0, 0)
      return parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day
        ? parsed
        : undefined
    }
    const parsed = new Date(val)
    return isValid(parsed) ? parsed : undefined
  }
  return undefined
}

export const DatePicker = ({
  id,
  name,
  label,
  description,
  placeholder = 'Pick a date',
  displayFormat = 'PPP',
  valueFormat,

  value: valueProp,
  defaultValue,

  disabled = false,
  disabledDays,
  captionLayout = 'label',
  showOutsideDays = true,

  useForm = true,
  showDirty = false,
  clearable = true,

  wrapperClassName,
  labelClassName,
  descriptionClassName,
  buttonClassName,
  popoverContentClassName,
  descriptionPlacement = 'start',
  labelPosition = 'top',
  customMessage = null,

  onChange,
  onValueChange,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)
  const [uncontrolledDate, setUncontrolledDate] = useState<Date | undefined>(
    () => parseDateValue(defaultValue),
  )

  const { isConnected, value, setValue, errorMessage, hasError, isDirty } =
    useFormField<unknown>(name, { useForm })

  const isFormBound = isConnected && valueProp === undefined

  const selectedDate = useMemo(() => {
    if (isFormBound) {
      return parseDateValue(value)
    }
    if (valueProp !== undefined) {
      return parseDateValue(valueProp)
    }
    return uncontrolledDate
  }, [isFormBound, value, valueProp, uncontrolledDate])

  const targetId = id || name
  const descriptionId =
    targetId && description ? `${targetId}-description` : undefined
  const errorId = targetId && errorMessage ? `${targetId}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const handleSelect = (nextDate: Date | undefined) => {
    setUncontrolledDate(nextDate)
    setOpen(false)

    const formatted = nextDate
      ? valueFormat
        ? format(nextDate, valueFormat)
        : nextDate.toISOString()
      : undefined

    if (isFormBound) {
      setValue(
        nextDate
          ? valueFormat
            ? format(nextDate, valueFormat)
            : nextDate
          : undefined,
      )
    }

    onChange?.(nextDate)
    onValueChange?.(formatted)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleSelect(undefined)
  }

  return (
    <BaseFieldWrapper
      id={targetId}
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
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              id={targetId}
              variant="outline"
              disabled={disabled}
              data-empty={!selectedDate}
              aria-invalid={hasError}
              aria-describedby={ariaDescribedBy}
              className={cn(
                'w-full h-9.5 rounded-xl border border-gray-300 justify-between text-left font-normal data-[empty=true]:text-muted-foreground',
                showDirty &&
                  isDirty &&
                  'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300/40 dark:bg-amber-950/20',
                buttonClassName,
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <CalendarIcon className="size-4 shrink-0 text-muted-foreground" />
                {selectedDate && isValid(selectedDate) ? (
                  format(selectedDate, displayFormat)
                ) : (
                  <span>{placeholder}</span>
                )}
              </span>
              <div className="flex items-center gap-1">
                {clearable && selectedDate && !disabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={handleClear}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleClear(e as unknown as React.MouseEvent)
                      }
                    }}
                    className="hover:bg-muted/80 rounded-full p-0.5 transition-colors"
                    aria-label="Clear date"
                  >
                    <X className="size-3.5 text-muted-foreground hover:text-foreground" />
                  </span>
                )}
                <ChevronDownIcon
                  data-icon="inline-end"
                  className={cn(
                    'size-4 text-muted-foreground transition-transform duration-200',
                    open && 'rotate-180',
                  )}
                />
              </div>
            </Button>
          }
        />
        <PopoverContent
          className={cn('w-auto p-0', popoverContentClassName)}
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            defaultMonth={selectedDate}
            disabled={disabledDays}
            captionLayout={captionLayout}
            showOutsideDays={showOutsideDays}
          />
        </PopoverContent>
      </Popover>
    </BaseFieldWrapper>
  )
}
