import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { format, isValid } from 'date-fns'
import {
  Calendar as CalendarIcon,
  ChevronDownIcon,
  Clock,
  X,
} from 'lucide-react'
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
import { ScrollArea } from './ui/scroll-area'

export interface DateTimePickerProps extends BaseFieldProps {
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
  minuteStep?: number

  useForm?: boolean
  showDirty?: boolean
  clearable?: boolean

  wrapperClassName?: string
  buttonClassName?: string
  popoverContentClassName?: string
  labelClassName?: string
  descriptionClassName?: string
  descriptionPlacement?: FieldDescriptionPlacement
  labelPosition?: FieldLabelPosition
  customMessage?: ReactNode

  onChange?: (date: Date | undefined) => void
  onValueChange?: (formattedValue: string | undefined) => void
}

function pad(num: number): string {
  return String(num).padStart(2, '0')
}

const parseDateValue = (val: unknown): Date | undefined => {
  if (!val) return undefined
  if (val instanceof Date) return isValid(val) ? val : undefined
  if (typeof val === 'string') {
    const parsed = new Date(val)
    return isValid(parsed) ? parsed : undefined
  }
  return undefined
}

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export const DateTimePicker = ({
  id,
  name,
  label,
  description,
  placeholder = 'Select date and time',
  displayFormat = 'PPP p',
  valueFormat,

  value: valueProp,
  defaultValue,

  disabled = false,
  disabledDays,
  captionLayout = 'label',
  showOutsideDays = true,
  minuteStep = 5,

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
}: DateTimePickerProps) => {
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

  // Time components derived from selected date or default to current time
  const hours24 = selectedDate ? selectedDate.getHours() : 12
  const currentMinutes = selectedDate ? selectedDate.getMinutes() : 0
  const isPM = hours24 >= 12
  const currentHour12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  const currentPeriod: 'AM' | 'PM' = isPM ? 'PM' : 'AM'

  const minuteOptions = useMemo(() => {
    const list: number[] = []
    const step = Math.max(1, Math.min(30, minuteStep))
    for (let i = 0; i < 60; i += step) {
      list.push(i)
    }
    return list
  }, [minuteStep])

  const handleCommit = (nextDate: Date | undefined) => {
    setUncontrolledDate(nextDate)

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

  const handleDateSelect = (pickedDate: Date | undefined) => {
    if (!pickedDate) {
      handleCommit(undefined)
      return
    }

    const updated = new Date(pickedDate)
    if (selectedDate) {
      updated.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0)
    } else {
      const now = new Date()
      updated.setHours(now.getHours(), now.getMinutes(), 0, 0)
    }
    handleCommit(updated)
  }

  const handleHourSelect = (hour12: number) => {
    const base = selectedDate ? new Date(selectedDate) : new Date()
    let new24 = hour12
    if (currentPeriod === 'PM') {
      new24 = hour12 === 12 ? 12 : hour12 + 12
    } else {
      new24 = hour12 === 12 ? 0 : hour12
    }
    base.setHours(new24, currentMinutes, 0, 0)
    handleCommit(base)
  }

  const handleMinuteSelect = (min: number) => {
    const base = selectedDate ? new Date(selectedDate) : new Date()
    base.setHours(hours24, min, 0, 0)
    handleCommit(base)
  }

  const handlePeriodSelect = (period: 'AM' | 'PM') => {
    const base = selectedDate ? new Date(selectedDate) : new Date()
    let new24 = hours24
    if (period === 'PM' && hours24 < 12) {
      new24 = hours24 + 12
    } else if (period === 'AM' && hours24 >= 12) {
      new24 = hours24 - 12
    }
    base.setHours(new24, currentMinutes, 0, 0)
    handleCommit(base)
  }

  const handleSetNow = () => {
    handleCommit(new Date())
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleCommit(undefined)
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
                    aria-label="Clear date and time"
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
          className={cn(
            'w-auto p-0 shadow-xl border-border/80 bg-popover',
            popoverContentClassName,
          )}
          align="start"
        >
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
            {/* Calendar Column */}
            <div className="p-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                defaultMonth={selectedDate}
                disabled={disabledDays}
                captionLayout={captionLayout}
                showOutsideDays={showOutsideDays}
              />
            </div>

            {/* Time Columns: Hour, Minute, AM/PM */}
            <div className="flex flex-col p-3 gap-2.5 bg-muted/20">
              <div className="flex items-center gap-1.5 pb-1 border-b border-border/60">
                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <Clock className="size-3.5 text-primary" />
                  <span>Time</span>
                </div>
              </div>

              <div className="flex gap-2 text-center">
                {/* Hours column */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Hr
                  </span>
                  <ScrollArea
                    showScrollBar={false}
                    className="flex flex-col max-w-10 max-h-48"
                  >
                    {HOURS_12.map((h) => (
                      <Button
                        key={h}
                        type="button"
                        size="icon"
                        variant={currentHour12 === h ? 'default' : 'ghost'}
                        className={cn(
                          'h-9.5 w-full text-sm font-medium rounded-2xl shrink-0',
                          currentHour12 === h &&
                            'shadow-xs text-primary-foreground',
                        )}
                        onClick={() => handleHourSelect(h)}
                      >
                        {pad(h)}
                      </Button>
                    ))}
                  </ScrollArea>
                </div>

                {/* Minutes column */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Min
                  </span>
                  <ScrollArea
                    showScrollBar={false}
                    className="flex flex-col max-w-10 max-h-48"
                  >
                    {minuteOptions.map((m) => (
                      <Button
                        key={m}
                        type="button"
                        size="icon"
                        variant={
                          Math.abs(currentMinutes - m) <
                            Math.max(1, minuteStep / 2) && selectedDate
                            ? 'default'
                            : 'ghost'
                        }
                        className={cn(
                          'h-9.5 w-full text-sm font-medium rounded-2xl shrink-0',
                          Math.abs(currentMinutes - m) <
                            Math.max(1, minuteStep / 2) &&
                            selectedDate &&
                            'shadow-xs text-primary-foreground',
                        )}
                        onClick={() => handleMinuteSelect(m)}
                      >
                        {pad(m)}
                      </Button>
                    ))}
                  </ScrollArea>
                </div>

                {/* AM/PM column */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Ampm
                  </span>
                  <div className="h-48 w-13 rounded-lg border border-border/50 bg-background/50 p-1 flex flex-col gap-1">
                    {(['AM', 'PM'] as const).map((p) => (
                      <Button
                        key={p}
                        type="button"
                        size="icon"
                        variant={currentPeriod === p ? 'default' : 'ghost'}
                        className={cn(
                          'h-9.5 w-full text-xs font-medium rounded-2xl shrink-0',
                          currentPeriod === p &&
                            'shadow-xs text-primary-foreground',
                        )}
                        onClick={() => handlePeriodSelect(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-3 text-xs"
                  onClick={handleSetNow}
                >
                  Now
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </BaseFieldWrapper>
  )
}
