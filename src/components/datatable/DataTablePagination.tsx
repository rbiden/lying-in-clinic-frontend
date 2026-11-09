import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useId } from 'react'
import type { TableState } from '@/types/datatable.types'
import { Button } from '../ui/Button'
import { Select } from '../Select'
import { Input } from '../Input'

interface DataTablePaginationProps {
  state: TableState
  totalCount: number
  rowCount: number
  disabled: boolean
  setPage: (page: number) => void
}

export function DataTablePagination({
  state,
  totalCount,
  rowCount,
  disabled,
  setPage,
}: DataTablePaginationProps) {
  const pageId = useId()
  const pageCount = Math.max(1, Math.ceil(totalCount / state.limit))
  const start =
    totalCount === 0 || rowCount === 0 ? 0 : (state.page - 1) * state.limit + 1
  const end = start === 0 ? 0 : Math.min(start + rowCount - 1, totalCount)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 text-sm">
      <p className="text-muted-foreground font-medium" aria-live="polite">
        Showing {start}–{end} of {totalCount.toLocaleString()} rows
      </p>

      <nav
        className="ml-auto flex items-center gap-2"
        aria-label="Table pagination"
      >
        <Button
          variant="ghost"
          disabled={disabled || state.page <= 1}
          onClick={() => setPage(state.page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {pageCount > 1000 ? (
          <div className="flex items-center gap-2">
            <Input
              numbersOnly
              key={state.page}
              useForm={false}
              name={`table-page-${pageId}`}
              label="Page number"
              labelClassName="sr-only"
              id={pageId}
              min={1}
              max={pageCount}
              defaultValue={state.page}
              disabled={disabled}
              wrapperClassName="w-20"
              inputGroupClassName="h-8 rounded-xl bg-background text-center"
              inputClassName="px-2 text-sm text-center"
              onBlur={(event) => {
                const parsed = Number(event.currentTarget.value)
                const page = Number.isFinite(parsed)
                  ? Math.min(pageCount, Math.max(1, Math.trunc(parsed)))
                  : state.page

                event.currentTarget.value = String(page)
                if (page !== state.page) setPage(page)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  event.currentTarget.blur()
                }
              }}
            />
            <span className="whitespace-nowrap text-muted-foreground">
              of {pageCount.toLocaleString()}
            </span>
          </div>
        ) : (
          <Select
            useForm={false}
            label="Page"
            labelClassName="sr-only"
            name={`table-page-${pageId}`}
            value={String(state.page)}
            disabled={disabled || pageCount <= 1}
            options={Array.from({ length: pageCount }, (_, index) => ({
              value: String(index + 1),
              label: `Page ${index + 1}`,
            }))}
            onValueChange={(value) => {
              if (value) setPage(Number(value))
            }}
            wrapperClassName="min-w-16"
            triggerClassName="h-8! rounded-xl p-2! text-sm bg-background"
          />
        )}

        <Button
          variant="ghost"
          disabled={disabled || state.page >= pageCount}
          onClick={() => setPage(state.page + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight aria-hidden="true" />
        </Button>
      </nav>
    </div>
  )
}
