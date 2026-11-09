import { useMemo, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFormField } from '@/hooks'
import { Button } from './ui/Button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover'
import { BaseFieldWrapper } from './common/BaseFieldWrapper'
import type { TimeFormat, TimePickerProps } from '../types/time-picker.types'

function pad(num: number): string {
  return String(num).padStart(2, '0')
}

interface ParsedTime {
  hours24: number
  minutes: number
  seconds: number
}

function parseTimeString(val?: string): ParsedTime | null {
  if (!val || typeof val !== 'string') return null
  const match = val
    .trim()
    .match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(am|pm)?$/i)
  if (!match) return null

  let hours = parseInt(match[1], 10)
  const minutes = Math.min(59, Math.max(0, parseInt(match[2], 10)))
  const seconds = match[3]
    ? Math.min(59, Math.max(0, parseInt(match[3], 10)))
    : 0
  const period = match[4] ? match[4].toUpperCase() : null

  if (period === 'PM' && hours < 12) {
    hours += 12
  } else if (period === 'AM' && hours === 12) {
    hours = 0
  }

  hours = Math.min(23, Math.max(0, hours))
  return { hours24: hours, minutes, seconds }
}

function formatTimeString(
  time: ParsedTime,
  format: TimeFormat,
  showSeconds: boolean,
): string {
  const { hours24, minutes, seconds } = time
  const secPart = showSeconds ? `:${pad(seconds)}` : ''

  if (format === '24h') {
    return `${pad(hours24)}:${pad(minutes)}${secPart}`
  }

  const period = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12
  return `${pad(hours12)}:${pad(minutes)}${secPart} ${period}`
}

function getCurrentTime(): ParsedTime {
  const now = new Date()
  return {
    hours24: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  }
}

export const TimePicker = ({
  name,
  label,
  description,
  disabled = false,
  required = false,
  value: valueProp,
  defaultValue = '',
  onChange,
  onValueChange,
  format = '12h',
  step = 1,
  showSeconds = false,
  placeholder = 'Select time',
  clearable = true,
  useForm = true,
  showDirty = false,
  customMessage = null,

  wrapperClassName,
  labelClassName,
  descriptionClassName,
  triggerClassName,
  contentClassName,

  descriptionPlacement = 'start',
  labelPosition = 'top',
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
}: TimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)

  const { isConnected, value, setValue, errorMessage, hasError, isDirty } =
    useFormField<string>(name, { useForm })

  const isFormBound = isConnected && valueProp === undefined
  const currentValue: string = isFormBound
    ? (value ?? '')
    : valueProp !== undefined
      ? valueProp
      : uncontrolledValue

  const parsedTime = useMemo(
    () => parseTimeString(currentValue) ?? getCurrentTime(),
    [currentValue],
  )

  const hasValidValue = Boolean(parseTimeString(currentValue))

  const descriptionId = name && description ? `${name}-description` : undefined
  const errorId = name && errorMessage ? `${name}-error` : undefined
  const ariaDescribedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined

  const updateTime = (newTime: ParsedTime) => {
    const formatted = formatTimeString(newTime, format, showSeconds)

    if (isFormBound) {
      setValue(formatted)
    } else if (valueProp === undefined) {
      setUncontrolledValue(formatted)
    }

    onChange?.(formatted)
    onValueChange?.(formatted)
  }

  const handleHourSelect = (selectedHour: number) => {
    let newH24 = selectedHour
    if (format === '12h') {
      const isPm = parsedTime.hours24 >= 12
      if (isPm) {
        newH24 = selectedHour === 12 ? 12 : selectedHour + 12
      } else {
        newH24 = selectedHour === 12 ? 0 : selectedHour
      }
    }
    updateTime({ ...parsedTime, hours24: newH24 })
  }

  const handleMinuteSelect = (m: number) => {
    updateTime({ ...parsedTime, minutes: m })
  }

  const handleSecondSelect = (s: number) => {
    updateTime({ ...parsedTime, seconds: s })
  }

  const handlePeriodToggle = (period: 'AM' | 'PM') => {
    const currentH12 =
      parsedTime.hours24 % 12 === 0 ? 12 : parsedTime.hours24 % 12
    let newH24: number
    if (period === 'PM') {
      newH24 = currentH12 === 12 ? 12 : currentH12 + 12
    } else {
      newH24 = currentH12 === 12 ? 0 : currentH12
    }
    updateTime({ ...parsedTime, hours24: newH24 })
  }

  const handleSetNow = () => {
    const now = getCurrentTime()
    updateTime(now)
  }

  const handleClear = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (disabled) return

    if (isFormBound) {
      setValue('')
    } else if (valueProp === undefined) {
      setUncontrolledValue('')
    }

    onChange?.('')
    onValueChange?.('')
  }

  // Lists for selection columns
  const hoursList = useMemo(() => {
    if (format === '24h') {
      return Array.from({ length: 24 }, (_, i) => i)
    }
    return [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  }, [format])

  const minutesList = useMemo(() => {
    const validStep = Math.max(1, Math.min(30, step))
    const list: number[] = []
    for (let m = 0; m < 60; m += validStep) {
      list.push(m)
    }
    return list
  }, [step])

  const secondsList = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => i)
  }, [])

  const currentH12 =
    parsedTime.hours24 % 12 === 0 ? 12 : parsedTime.hours24 % 12
  const currentPeriod = parsedTime.hours24 >= 12 ? 'PM' : 'AM'

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
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger
          id={name}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
            !hasValidValue && 'text-muted-foreground',
            triggerClassName,
          )}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          aria-required={required}
        >
          <div className="flex flex-1 items-center gap-2 truncate text-left">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {hasValidValue ? currentValue : placeholder}
            </span>
          </div>
          {clearable && hasValidValue && !disabled && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Clear time"
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
        </PopoverTrigger>

        <PopoverContent
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'w-auto p-0 shadow-lg border border-border bg-popover text-popover-foreground rounded-xl overflow-hidden',
            contentClassName,
          )}
        >
          {/* Header Preview */}
          <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/30">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>
                {hasValidValue
                  ? currentValue
                  : formatTimeString(parsedTime, format, showSeconds)}
              </span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              {format === '12h' ? '12-Hour' : '24-Hour'}
            </span>
          </div>

          {/* Time Columns */}
          <div className="flex divide-x divide-border">
            {/* Hours Column */}
            <div className="flex flex-col items-center">
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Hour
              </div>
              <div className="h-44 w-14 overflow-y-auto p-1 flex flex-col gap-0.5 scrollbar-thin">
                {hoursList.map((h) => {
                  const isSelected =
                    hasValidValue &&
                    (format === '24h'
                      ? parsedTime.hours24 === h
                      : currentH12 === h)
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleHourSelect(h)}
                      className={cn(
                        'flex h-7 w-full items-center justify-center rounded-sm text-xs transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'hover:bg-accent hover:text-accent-foreground text-foreground',
                      )}
                    >
                      {format === '24h' ? pad(h) : h}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex flex-col items-center">
              <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Min
              </div>
              <div className="h-44 w-14 overflow-y-auto p-1 flex flex-col gap-0.5 scrollbar-thin">
                {minutesList.map((m) => {
                  const isSelected = hasValidValue && parsedTime.minutes === m
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleMinuteSelect(m)}
                      className={cn(
                        'flex h-7 w-full items-center justify-center rounded-sm text-xs transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'hover:bg-accent hover:text-accent-foreground text-foreground',
                      )}
                    >
                      {pad(m)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Seconds Column (Optional) */}
            {showSeconds && (
              <div className="flex flex-col items-center">
                <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Sec
                </div>
                <div className="h-44 w-14 overflow-y-auto p-1 flex flex-col gap-0.5 scrollbar-thin">
                  {secondsList.map((s) => {
                    const isSelected = hasValidValue && parsedTime.seconds === s
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSecondSelect(s)}
                        className={cn(
                          'flex h-7 w-full items-center justify-center rounded-sm text-xs transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                            : 'hover:bg-accent hover:text-accent-foreground text-foreground',
                        )}
                      >
                        {pad(s)}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Period Column (12h Mode) */}
            {format === '12h' && (
              <div className="flex flex-col items-center">
                <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Period
                </div>
                <div className="h-44 w-14 p-1 flex flex-col gap-1">
                  {(['AM', 'PM'] as const).map((p) => {
                    const isSelected = hasValidValue && currentPeriod === p
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handlePeriodToggle(p)}
                        className={cn(
                          'flex h-8 w-full items-center justify-center rounded-sm text-xs font-medium transition-colors cursor-pointer',
                          isSelected
                            ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                            : 'hover:bg-accent hover:text-accent-foreground text-foreground',
                        )}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between border-t border-border p-2 bg-muted/20">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleSetNow}
              className="h-7 text-xs px-2"
            >
              Now
            </Button>
            <div className="flex items-center gap-1">
              {clearable && hasValidValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-7 text-xs px-2.5"
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </BaseFieldWrapper>
  )
}
