import {
  Children,
  Fragment,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  Filter as FilterIcon,
  RefreshCw,
  RotateCcw,
  Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TABLE_QUERY_CONFIG } from '@/constants'
import { blankFilterValues, cleanFilters, filtersKey } from '@/helpers'
import type { FilterValues } from '@/helpers'
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import { useTableFilters } from '@/hooks/use-table-filters'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover'
import { Input } from './Input'
import { FilterChips } from './FilterChips'
import type { FilterProps } from '../types/filter.types'

function flattenChildren(node: ReactNode): ReactNode[] {
  return Children.toArray(node).flatMap((child) => {
    if (isValidElement(child) && child.type === Fragment) {
      const fragmentChildren = (child.props as Record<string, unknown>)[
        'children'
      ] as ReactNode
      return flattenChildren(fragmentChildren)
    }
    return [child]
  })
}

export const Filter = ({
  tableKey,
  children,
  mode = 'auto',
  showSearch = true,
  searchPlaceholder = 'Search...',
  title = 'Filter Options',
  triggerLabel = 'Filters',
  columns = 2,
  showChips = true,
  labels,
  formatValue,
  onApply,
  onRefetch,
  refetchLabel = '',
  isLoading,
  actionButton,
  wrapperClassName,
  containerClassName,
  contentClassName,
}: FilterProps) => {
  const { state, activeCount, setFilters, setFilter, setSearch, resetFilters } =
    useTableFilters(tableKey)
  const [isOpen, setIsOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null,
  )

  const devWarnedRef = useRef(false)
  if (process.env.NODE_ENV !== 'production') {
    const leafCount = flattenChildren(children).length
    if (leafCount === 0 && !devWarnedRef.current) {
      devWarnedRef.current = true
      console.warn(
        `[Filter] tableKey="${tableKey}": Filter has no children. ` +
          'Add at least one field component so users can filter.',
      )
    }
  }

  const form = useForm<FilterValues>({ defaultValues: state.filters })

  const leafCount = flattenChildren(children).length
  const resolvedMode =
    mode === 'auto' ? (leafCount > 1 ? 'popover' : 'inline') : mode

  const lastApplied = useRef(filtersKey(state.filters))
  const syncing = useRef(false)

  const syncForm = useCallback(
    (applied: FilterValues) => {
      syncing.current = true
      form.reset({ ...blankFilterValues(form.getValues()), ...applied })
      syncing.current = false
    },
    [form],
  )

  const onApplyRef = useRef(onApply)
  useEffect(() => {
    onApplyRef.current = onApply
  })

  const apply = useCallback(
    (values: FilterValues) => {
      const cleaned = cleanFilters(values)
      const result = setFilters(cleaned)
      setValidationMessage(result.success ? null : result.message)
      if (!result.success) return false
      lastApplied.current = filtersKey(result.filters)
      onApplyRef.current?.(result.filters)
      return true
    },
    [setFilters],
  )

  const debouncedApply = useDebouncedCallback(
    apply,
    TABLE_QUERY_CONFIG.searchDebounceMs,
  )

  useEffect(() => {
    if (resolvedMode !== 'inline') return
    const subscription = form.watch((values) => {
      if (!syncing.current) debouncedApply(values)
    })
    return () => subscription.unsubscribe()
  }, [form, resolvedMode, debouncedApply])

  useEffect(() => {
    const key = filtersKey(state.filters)
    if (key === lastApplied.current) return
    debouncedApply.cancel()
    lastApplied.current = key
    setValidationMessage(null)
    syncForm(state.filters)
  }, [state.filters, syncForm, debouncedApply])

  const [searchText, setSearchText] = useState(state.search)
  const lastSentSearch = useRef(state.search)

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    lastSentSearch.current = value
    setSearch(value)
  }, TABLE_QUERY_CONFIG.searchDebounceMs)

  useEffect(() => {
    if (state.search === lastSentSearch.current) return
    debouncedSetSearch.cancel()
    lastSentSearch.current = state.search
    setSearchText(state.search)
  }, [state.search, debouncedSetSearch])

  useLayoutEffect(() => {
    debouncedApply.cancel()
    debouncedSetSearch.cancel()
    lastApplied.current = filtersKey(state.filters)
    lastSentSearch.current = state.search
    syncForm(state.filters)
    setSearchText(state.search)
    setValidationMessage(null)
    // Only restoration/reset should forcibly discard pending local edits.
  }, [tableKey, state.epoch])

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    debouncedSetSearch(e.target.value)
  }

  const handleOpenChange = (open: boolean) => {
    if (open) syncForm(state.filters)
    setIsOpen(open)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (apply(form.getValues())) setIsOpen(false)
  }

  const handleResetStaged = () =>
    form.reset(blankFilterValues(form.getValues()))

  const triggerAriaLabel =
    activeCount > 0 ? `${triggerLabel}, ${activeCount} active` : triggerLabel

  return (
    <FormProvider {...form}>
      <section className={cn('mb-3 flex flex-col gap-2.5', wrapperClassName)}>
        <div
          className={cn(
            'flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3',
            containerClassName,
          )}
        >
          {showSearch && (
            <Input
              useForm={false}
              prefix={<Search className="size-4" />}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              value={searchText}
              onChange={handleSearchChange}
              inputClassName="min-w-xs"
            />
          )}

          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            {onRefetch && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9"
                onClick={onRefetch}
                disabled={isLoading}
              >
                <RefreshCw
                  className={cn(
                    'size-4',
                    isLoading && 'animate-spin',
                    Boolean(refetchLabel) && 'mr-1',
                  )}
                />
                {refetchLabel}
              </Button>
            )}

            {resolvedMode === 'popover' ? (
              <Popover open={isOpen} onOpenChange={handleOpenChange}>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      aria-label={triggerAriaLabel}
                      className={cn(
                        'h-10 shrink-0 gap-1.5 px-3 font-semibold',
                        activeCount > 0 &&
                          'border-primary/30 bg-primary/10 text-primary hover:bg-primary/15',
                      )}
                    >
                      <FilterIcon className="size-3.5" />
                      <span>{triggerLabel}</span>
                      {activeCount > 0 && (
                        <Badge className="ml-1 flex size-5 items-center justify-center rounded-full text-[11px] font-bold">
                          <span className="m-auto">{activeCount}</span>
                        </Badge>
                      )}
                    </Button>
                  }
                />
                <PopoverContent
                  className="flex w-[calc(100vw-2rem)] max-w-[95vw] flex-col gap-4 overflow-hidden p-0 sm:w-140"
                  aria-label={title}
                  side="bottom"
                  align="end"
                >
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between border-b p-3">
                      <div className="flex items-center gap-2">
                        <FilterIcon className="size-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold">{title}</h3>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResetStaged}
                      >
                        <RotateCcw className="size-4" /> Reset
                      </Button>
                    </div>

                    <div
                      className={cn(
                        'grid max-h-[60vh] grid-cols-1 gap-3.5 overflow-y-auto px-3 pb-2',
                        columns === 2 && 'sm:grid-cols-2',
                        contentClassName,
                      )}
                    >
                      {children}
                    </div>

                    <div className="flex items-center justify-end gap-2 border-t bg-muted/30 p-3">
                      {validationMessage && (
                        <p
                          role="alert"
                          className="mr-auto text-sm text-destructive"
                        >
                          {validationMessage}
                        </p>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 px-4 text-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        className="h-9 px-4 text-sm"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </form>
                </PopoverContent>
              </Popover>
            ) : (
              <div className={cn('min-w-35 max-w-50', contentClassName)}>
                {children}
              </div>
            )}

            {Boolean(actionButton) && actionButton}
          </div>
        </div>

        {validationMessage && resolvedMode === 'inline' && (
          <p role="alert" className="text-sm text-destructive">
            {validationMessage}
          </p>
        )}

        {showChips && resolvedMode === 'popover' && (
          <FilterChips
            filters={state.filters}
            labels={labels}
            formatValue={formatValue}
            onRemove={(name) => {
              debouncedApply.cancel()
              const result = setFilter(name, null)
              setValidationMessage(result.success ? null : result.message)
            }}
            onClearAll={() => {
              debouncedApply.cancel()
              const result = resetFilters()
              setValidationMessage(result.success ? null : result.message)
            }}
          />
        )}
      </section>
    </FormProvider>
  )
}

export type { FilterProps }
