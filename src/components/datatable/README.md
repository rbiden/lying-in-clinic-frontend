# DataTable

Row actions accept `hidden: true` or `hidden: (row) => boolean`. Hidden actions
are omitted in both dropdown and inline modes. When all actions for a row are
hidden, no action buttons or empty dropdown trigger render.

```tsx
{ label: 'Edit', onClick: onEdit, hidden: (row) => row.status === 'Closed' }
```

Pass the existing `useTableState` or `useTableQuery` result as `table`. Rows,
columns, request status, and controlled selection remain separate props.

```tsx
<DataTable
  table={table}
  rows={query.data?.rows ?? []}
  totalCount={query.data?.totalCount ?? 0}
  columns={columns}
  getRowId={(row) => row.id}
  isLoading={query.isLoading}
  isFetching={query.isFetching}
  error={query.error}
/>
```

Server processing is the default. All supplied rows render in their supplied
order. The component never searches, filters, sorts, or slices that server page.
`totalCount` is required and must be the server's total matching row count.
The page's TanStack Query hook calls a feature service using shared Axios;
DataTable does not fetch. Only columns explicitly declaring `enableSorting: true`
offer sorting. The hook exposes state and handlers for the request parameters.

Server pagination stays under caller control, including empty responses.
Invalidating a query refetches its current parameters; it does not reset the
table page. A mutation that should return to page 1 must update table state
explicitly as part of its success handling.

To process a complete in-memory dataset, pass `clientSide` and omit `totalCount`:

```tsx
const filterRow = useCallback(
  (row: User) => !status || row.status === status,
  [status],
)

<DataTable
  table={table}
  clientSide
  rows={allUsers}
  columns={columns}
  search={search}
  filterRow={filterRow}
  getRowId={(row) => row.id}
/>
```

Client mode applies the custom predicate, case-insensitive text search over
searchable accessor values, column sorting, then pagination. Use
`enableGlobalFilter: false` to exclude a column from search and TanStack column
`sortingFn` for custom sorting. Counts come from the filtered dataset. Search and
predicate changes reset to page 1; memoize the predicate so unrelated renders do
not reset the page. Dataset shrinkage clamps to the last valid page. Limit changes
reset via the existing hook; sorting preserves the page.

Selected IDs remain caller-controlled across both modes. Select-all affects only
eligible rows on the visible page. `search` and `filterRow` have no effect in
server mode; send server search/filter parameters through the query and service.

Audit Logs demonstrates real pagination through
`useAuditLogsQuery` → `AuditLogsService.GET_ALL` → shared Axios →
`GET /audit-logs?page=1&per_page=10` under the configured complete API prefix.
Its resource response supplies `data` rows and `meta.total` in newest-first
order. Exact `event` and inclusive UTC `from`/`to` calendar-date filters are
supported; general search and sortable headers are disabled. The service maps
shared table `limit` to `per_page` and sends only endpoint-owned parameters.
Legacy audit URL search/sort/Action/Model values are stripped before restoration.
`UsersTableExample` remains an unrouted server-mode example with a mock service.

The audit hook directly returns TanStack Query's result and accepts partial
pagination parameters plus an `enabled` boolean, defaulting to true.
The hook sets `placeholderData: keepPreviousData`; native query
behavior determines loading/error data. A failed request for a new page clears
its placeholder rows. The service accepts optional parameters with `GET_ALL()`
and returns the Axios response body.
