import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useId } from 'react'
import type { TableState } from '@/types/datatable.types'
import { Button } from '../ui/Button'
import { Select } from '../Select'

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
        Showing {start}–{end} of {totalCount} rows
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
        <Select
          useForm={false}
          label="Page"
          labelClassName="sr-only"
          name={`table-page-${pageId}`}
          value={String(state.page)}
          disabled={disabled || pageCount <= 1}
          options={Array.from({ length: pageCount }, (_, index) => ({
            value: String(index + 1),
            label: `Page ${index + 1} of ${pageCount}`,
          }))}
          onValueChange={(value) => {
            if (value) setPage(Number(value))
          }}
          wrapperClassName="min-w-32"
          triggerClassName="h-8 rounded-xl text-sm bg-white"
        />
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
