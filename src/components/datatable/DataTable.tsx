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
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { columnSortField } from '@/helpers/table-query'
import type { DataTableColumn, DataTableProps } from '@/types/datatable.types'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { Skeleton } from '../ui/skeleton'
import { LoadingState } from '../LoadingState'
import { ErrorState } from '../ErrorState'
import { EmptyState } from '../EmptyState'
import { DataTablePagination } from './DataTablePagination'
import { DataTableActions } from './DataTableActions'

const interactive =
  'a,button,input,select,textarea,[role="button"],[role="checkbox"],[data-table-interactive]'

export function DataTable<TData>({
  rows,
  columns,
  actions,
  actionType = 'dropdown',
  totalCount = 0,
  table: controller,
  clientSide = false,
  search = '',
  filterRow,
  getRowId,
  getRowClassName,
  selectedIds,
  onSelectionChange,
  canSelectRow,
  canBulkSelectRow,
  selectionDisabled = false,
  onRowClick,
  isLoading = false,
  isFetching = false,
  showPagination = true,
  error,
  onRetry,
  emptyContent,
  errorContent,
  caption = 'Data table',
  className,
  cellClassName,
}: DataTableProps<TData>) {
  const { state, setPage, setSort, resetFilters } = controller
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
    const displayColumns: ColumnDef<TData>[] = actions?.length
      ? [
          ...columns,
          {
            id: '__actions',
            header: 'Actions',
            enableSorting: false,
            enableGlobalFilter: false,
            cell: ({ row }) => (
              <DataTableActions
                row={row.original}
                rowId={row.id}
                actions={actions}
                actionType={actionType}
                disabled={busy || hasError}
              />
            ),
          },
        ]
      : columns

    if (!selectionEnabled) return displayColumns

    return [
      {
        id: '__selection',
        enableSorting: false,
        header: ({ table: instance }) => {
          const eligible = instance
            .getRowModel()
            .rows.filter(
              (row) =>
                row.getCanSelect() &&
                (canBulkSelectRow?.(row.original) ?? true),
            )
          const all =
            eligible.length > 0 && eligible.every((row) => row.getIsSelected())
          const some = eligible.some((row) => row.getIsSelected())
          return (
            <Checkbox
              aria-label="Select all selectable rows on this page"
              disabled={busy || selectionDisabled || eligible.length === 0}
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
        cell: ({ row }) =>
          row.getCanSelect() ? (
            <Checkbox
              aria-label={`Select row ${row.id}`}
              disabled={busy || selectionDisabled}
              checked={row.getIsSelected()}
              className="border-input"
              onCheckedChange={(checked) => {
                const ids = new Set(selectedIds)
                if (checked) ids.add(row.id)
                else ids.delete(row.id)
                onSelectionChange([...ids])
              }}
            />
          ) : null,
      },
      ...displayColumns,
    ]
  }, [
    columns,
    actions,
    actionType,
    selectionEnabled,
    busy,
    hasError,
    selectedIds,
    onSelectionChange,
    canBulkSelectRow,
    selectionDisabled,
  ])

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
      pagination: {
        pageIndex: showPagination ? state.page - 1 : 0,
        pageSize: showPagination
          ? state.limit
          : Math.max(filteredRows.length, 1),
      },
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
  const showFetchingShimmer = busy && rows.length > 0

  return (
    <section
      className={cn('min-w-0 font-sans', className)}
      aria-label={caption}
    >
      <div className={cn('relative')}>
        <div
          aria-busy={busy}
          className={cn(
            'overflow-x-auto bg-card h-full rounded-2xl p-1 border border-border',
            hasError && !busy && 'min-h-70',
            busy && rows.length === 0 && 'min-h-70',
          )}
        >
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{caption}</caption>
            <thead className="border-b border-border text-sm font-heading text-foreground">
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
                          'whitespace-nowrap p-3 text-center font-medium first:text-start last:text-end only:text-start',
                          header.column.id === '__selection' && 'w-12',
                          (header.column.columnDef as DataTableColumn<TData>)
                            .headerClassName,
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
                          <Skeleton className="h-4 min-w-8" />
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
                        getRowClassName?.(row.original),
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
                      {row.getVisibleCells().map((cell) => {
                        const columnCellClassName = (
                          cell.column.columnDef as DataTableColumn<TData>
                        ).cellClassName

                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              'whitespace-nowrap px-3 py-1.5 text-center first:text-start last:text-end only:text-start',
                              typeof cellClassName === 'function'
                                ? cellClassName(row.original)
                                : cellClassName,
                              typeof columnCellClassName === 'function'
                                ? columnCellClassName(row.original)
                                : columnCellClassName,
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}

              {!busy && !hasError && visibleRows.length === 0 && (
                <tr>
                  <td
                    colSpan={Math.max(1, leafCount)}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col w-full items-center justify-center gap-2">
                      {emptyContent ?? (
                        <EmptyState
                          title="No records found."
                          icon={null}
                          variant="ghost"
                          size="sm"
                        />
                      )}
                      {resetFilters && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetFilters}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {hasError && !busy && (
          <div className="absolute inset-1 z-10 flex flex-col items-center justify-center rounded-2xl bg-background/50 p-6 text-center backdrop-blur-[1px]">
            <ErrorState
              title="Unable to load records"
              description={errorContent ?? 'Please try again.'}
              onRetry={onRetry}
            />
          </div>
        )}

        {showFetchingShimmer && (
          <div
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-2xl backdrop-blur-[1px] bg-muted/30 motion-safe:animate-pulse"
            aria-hidden="true"
          >
            <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-primary/15">
              <div className="h-full w-1/3 rounded-full bg-primary/70 motion-safe:animate-[datatable-loading_1.5s_ease-in-out_infinite] motion-reduce:w-full" />
            </div>
          </div>
        )}

        {busy && rows.length === 0 && (
          <div className="absolute inset-1 z-10 flex flex-col items-center justify-center rounded-2xl bg-background/50 p-6 text-center backdrop-blur-[1px]">
            <LoadingState title="Loading records" description="Please wait…" />
          </div>
        )}
      </div>
      {showFetchingShimmer && (
        <span role="status" aria-live="polite" className="sr-only">
          Updating records
        </span>
      )}
      {showPagination && (
        <DataTablePagination
          state={state}
          totalCount={matchingCount}
          rowCount={visibleRows.length}
          disabled={busy}
          setPage={setPage}
        />
      )}
    </section>
  )
}
