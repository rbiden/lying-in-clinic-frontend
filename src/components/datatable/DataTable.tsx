import { useEffect, useMemo, useRef } from 'react'
import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  GalleryVerticalEnd,
  Warehouse,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { columnSortField } from '@/helpers/table-query'
import type { DataTableProps } from '@/types/datatable.types'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { DataTablePagination } from './DataTablePagination'

const interactive =
  'a,button,input,select,textarea,[role="button"],[role="checkbox"],[data-table-interactive]'

export function DataTable<TData>({
  rows,
  columns,
  totalCount = 0,
  table: controller,
  clientSide = false,
  search = '',
  filterRow,
  getRowId,
  selectedIds,
  onSelectionChange,
  canSelectRow,
  onRowClick,
  isLoading = false,
  isFetching = false,
  error,
  onRetry,
  emptyContent,
  errorContent,
  caption = 'Data table',
  className,
}: DataTableProps<TData>) {
  const { state, setPage, setSort } = controller
  const filteredRows = useMemo(
    () => (clientSide && filterRow ? rows.filter(filterRow) : rows),
    [clientSide, filterRow, rows],
  )
  const busy = isLoading || isFetching
  const hasError = error !== undefined && error !== null
  const rowClickable = Boolean(onRowClick) && !busy && !hasError

  const selectionEnabled =
    selectedIds !== undefined && onSelectionChange !== undefined

  const rowSelection = useMemo(
    () => Object.fromEntries((selectedIds ?? []).map((id) => [id, true])),
    [selectedIds],
  )

  const tableColumns = useMemo<ColumnDef<TData>[]>(() => {
    if (!selectionEnabled) return columns
    return [
      {
        id: '__selection',
        enableSorting: false,
        header: ({ table: instance }) => {
          const eligible = instance
            .getRowModel()
            .rows.filter((row) => row.getCanSelect())
          const all =
            eligible.length > 0 && eligible.every((row) => row.getIsSelected())
          const some = eligible.some((row) => row.getIsSelected())
          return (
            <Checkbox
              aria-label="Select all selectable rows on this page"
              disabled={busy || eligible.length === 0}
              checked={all}
              indeterminate={some && !all}
              onCheckedChange={(checked) => {
                const ids = new Set(selectedIds)
                for (const row of eligible) {
                  if (checked) ids.add(row.id)
                  else ids.delete(row.id)
                }
                onSelectionChange([...ids])
              }}
            />
          )
        },
        cell: ({ row }) => (
          <Checkbox
            aria-label={`Select row ${row.id}`}
            disabled={busy || !row.getCanSelect()}
            checked={row.getIsSelected()}
            onCheckedChange={(checked) => {
              const ids = new Set(selectedIds)
              if (checked) ids.add(row.id)
              else ids.delete(row.id)
              onSelectionChange([...ids])
            }}
          />
        ),
      },
      ...columns,
    ]
  }, [columns, selectionEnabled, busy, selectedIds, onSelectionChange])

  const sorting: SortingState = useMemo(() => {
    if (!state.sortField || !state.sortType) return []
    const find = (defs: ColumnDef<TData>[]): string | undefined => {
      for (const column of defs) {
        if ('columns' in column && column.columns) {
          const nested = find(column.columns)
          if (nested) return nested
        }
        const id =
          column.id ??
          ('accessorKey' in column
            ? String(column.accessorKey).replace(/\./g, '_')
            : undefined)
        const field = id ? columnSortField(column.meta, id) : undefined
        if (column.enableSorting === true && field === state.sortField)
          return id
      }
    }
    const id = find(columns)
    return id ? [{ id, desc: state.sortType === 'desc' }] : []
  }, [columns, state.sortField, state.sortType])

  const table = useReactTable({
    data: filteredRows,
    columns: tableColumns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    defaultColumn: { enableSorting: false },
    manualPagination: !clientSide,
    manualSorting: !clientSide,
    manualFiltering: !clientSide,
    autoResetPageIndex: false,
    rowCount: clientSide ? undefined : totalCount,
    enableMultiSort: false,
    sortDescFirst: true,
    enableSortingRemoval: true,
    enableRowSelection: (row) =>
      selectionEnabled && (canSelectRow?.(row.original) ?? true),
    state: {
      pagination: { pageIndex: state.page - 1, pageSize: state.limit },
      sorting,
      rowSelection,
      globalFilter: search,
    },
    onSortingChange: (updater) => {
      if (busy) return
      const next = functionalUpdate(updater, sorting).at(0)
      if (!next) return setSort(null, null)
      const column = table.getColumn(next.id)
      if (!column) return
      const field = columnSortField(column.columnDef.meta, column.id)
      setSort(field, next.desc ? 'desc' : 'asc')
    },
  })
  const matchingCount = clientSide
    ? table.getFilteredRowModel().rows.length
    : totalCount
  const visibleRows = table.getRowModel().rows
  const previousFilter = useRef({ search, filterRow, clientSide })
  useEffect(() => {
    const previous = previousFilter.current
    previousFilter.current = { search, filterRow, clientSide }
    if (!clientSide) return
    if (
      previous.search !== search ||
      previous.filterRow !== filterRow ||
      !previous.clientSide
    ) {
      setPage(1)
      return
    }
    const lastPage = Math.max(1, Math.ceil(matchingCount / state.limit))
    if (state.page > lastPage) setPage(lastPage)
  }, [
    clientSide,
    search,
    filterRow,
    matchingCount,
    state.page,
    state.limit,
    setPage,
  ])
  const leafCount = table.getVisibleLeafColumns().length
  const showSkeleton = isLoading && rows.length === 0

  return (
    <section
      className={cn('min-w-0 font-sans', className)}
      aria-label={caption}
      aria-busy={busy}
    >
      <div className={cn('relative', (busy || hasError) && 'min-h-60')}>
        <div className="overflow-x-auto bg-white/20 rounded-2xl p-2 border border-border">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="border-b border-border text-sm font-heading text-muted-foreground">
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const sorted = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        scope="col"
                        aria-sort={
                          header.column.getCanSort()
                            ? sorted === 'desc'
                              ? 'descending'
                              : sorted === 'asc'
                                ? 'ascending'
                                : 'none'
                            : undefined
                        }
                        className={cn(
                          'whitespace-nowrap px-4 py-3 font-medium',
                          header.column.id === '__selection' && 'w-12',
                        )}
                      >
                        {!header.isPlaceholder &&
                          (header.column.getCanSort() ? (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-2 rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}

                              {sorted === 'desc' ? (
                                <ArrowDown
                                  className="size-3.5 text-primary"
                                  aria-hidden="true"
                                />
                              ) : sorted === 'asc' ? (
                                <ArrowUp
                                  className="size-3.5 text-primary"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ArrowUpDown
                                  className="size-3.5 opacity-50"
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          ))}
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/60">
              {showSkeleton
                ? Array.from({ length: state.limit }, (_, index) => (
                    <tr key={index} aria-hidden="true">
                      {Array.from({ length: leafCount }, (_cell, cell) => (
                        <td key={cell} className="px-4 py-4">
                          <div className="h-4 min-w-8 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                : visibleRows.length > 0 &&
                  visibleRows.map((row) => (
                    <tr
                      key={row.id}
                      data-selected={
                        selectionEnabled && row.getIsSelected() ? '' : undefined
                      }
                      tabIndex={rowClickable ? 0 : undefined}
                      className={cn(
                        'transition-colors hover:bg-muted/30 data-selected:bg-primary/5',
                        rowClickable &&
                          'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                      )}
                      onClick={(event) => {
                        if (
                          !rowClickable ||
                          (event.target instanceof Element &&
                            event.target.closest(interactive))
                        )
                          return
                        onRowClick?.(row.original)
                      }}
                      onKeyDown={(event) => {
                        if (
                          !rowClickable ||
                          event.target !== event.currentTarget ||
                          (event.key !== 'Enter' && event.key !== ' ')
                        )
                          return
                        event.preventDefault()
                        onRowClick?.(row.original)
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="whitespace-nowrap px-4 py-3"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}

              {!showSkeleton && visibleRows.length === 0 && (
                <tr>
                  <td
                    colSpan={Math.max(1, leafCount)}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    {emptyContent ?? 'No records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasError && !busy && (
          <div
            role="alert"
            className="absolute inset-1 z-10 flex flex-col items-center justify-center rounded-2xl bg-background/90 p-6 text-center backdrop-blur-[1px]"
          >
            <div className="relative mb-4 flex size-16 shrink-0 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-destructive/15"
                aria-hidden="true"
              />
              <div className="flex size-10 items-center justify-center rounded-xl border border-destructive/20 bg-card text-destructive shadow-sm">
                <GalleryVerticalEnd className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="font-heading text-lg font-semibold text-foreground">
              Unable to load records
            </p>
            <div className="mt-2 text-sm text-muted-foreground">
              {errorContent ?? 'Please try again.'}
            </div>
            {onRetry && (
              <Button className="mt-4" variant="outline" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        )}

        {busy && (
          <div
            className="absolute inset-1 z-10 flex flex-col items-center justify-center rounded-2xl bg-background/90 p-6 text-center backdrop-blur-[1px]"
            role="status"
            aria-live="polite"
          >
            <div className="relative mb-4 flex size-16 shrink-0 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-primary/15 border-t-primary motion-safe:animate-spin"
                aria-hidden="true"
              />
              <div className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-card text-primary shadow-sm">
                <Warehouse className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="font-heading text-lg font-semibold text-foreground">
              {showSkeleton ? 'Loading records' : 'Updating records'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Please wait…</p>
          </div>
        )}
      </div>
      <DataTablePagination
        state={state}
        totalCount={matchingCount}
        rowCount={visibleRows.length}
        disabled={busy}
        setPage={setPage}
      />
    </section>
  )
}
