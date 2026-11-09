# Implementation Plan: Reusable Server DataTable

Status: proposed; awaiting explicit approval. Application implementation has not started.
Requirements: R-046 through R-054. Date: 2026-10-13.

## Goal

Build a typed, reusable DataTable using TanStack Table with custom UI. Separate filters/search in Zustand from locally controlled pagination/sorting and caller-controlled selected IDs. Pages own fetching and combine the state into their query parameters.

## Scope

In scope: manual server pagination/sorting, typed columns, URL synchronization, separate existing Filter adaptation, multi-row selection, request states, pagination footer, optional row clicks/action cells, and an unrouted mock-user example with documentation.

Out of scope: backend integration, new routes, Users page replacement, client-side table processing, multi-column sorting, page-size controls, column visibility/resizing/reordering, expandable rows, virtualization, export and bulk-action workflows. No new automated tests, per the selected validation scope. Preserve unrelated working changes.

## Approach

- `useTableState` runs in the page and owns `{ page, limit, sortField, sortType }` in React state. Page is one-based; TanStack's adapter converts it to zero-based pageIndex. No pagination/sort state enters Zustand.
- Adapt `useTableQueryStore` into keyed filter/search state only. Add a narrow filter hook; migrate Filter to it. Adapt `useTableQuery` into the page-facing composition of filter state, local table state and URL lifecycle rather than a second owner. Its params builder accepts both state sources and retains configurable API mapping (current sort_by/sort_order defaults).
- DataTable receives rows, totalCount, controlled state/handlers, request flags/content, typed TanStack columns, required getRowId, optional selected IDs/change callback/eligibility predicate, and optional row callback. It never fetches data or reads filters.
- Use TanStack v8 manualPagination/manualSorting and core row rendering. Configure a single-sort descending/ascending/unsorted cycle; use column ID as server field unless column metadata overrides it. Only explicitly sortable columns enable sort controls; validate URL sort fields against that table's declared sortable columns.
- Selection is caller-owned and opt-in. Page-only header selection merges/removes eligible visible IDs without dropping off-page IDs. Never infer selected records from the current server page alone.
- Query hooks include all applied filter/search and pagination/sort values in their query keys. Keep previous data during refetch. Only use successful non-placeholder totals belonging to the current query to clamp pages.

## State and Behavior Contracts

- Defaults: page 1, limit 10, allowed limits 10/20/50/100; configurable per table. No limit selector. Expose programmatic limit updates; they reset to page 1.
- Initial sorting is absent unless configured. Represent unsorted as null sortField and null sortType; omit both API/URL sort parameters. Sort changes retain page.
- Applied filters/search reset page to 1. Staged popover edits do not reset or fetch. Retain existing inline/auto/popover modes, chips and 300ms debounce behavior.
- Filter schemas and explicit valid default values are supplied per page. Supported values: strings/numbers/booleans, arrays of these values, calendar-date strings, and `{ from?: string, to?: string }` ranges. Dates use YYYY-MM-DD without timezone conversion; arbitrary nested values are excluded. The sample schema validates calendar validity and range ordering.
- Selection persists across page, sort, limit, filter and search changes. Require stable unique string IDs returned by getRowId; per-row predicate determines current eligibility. The caller explicitly removes unavailable/deleted IDs if its domain requires that.
- Disable pagination, sorting and selection during fetching. Disable whole-row callbacks during fetching and after refetch failure until current data succeeds. Interactive cell controls do not also invoke the row callback; action-cell behavior remains caller-controlled.
- Initial loading: skeletons. Refetch: retained rows and updating indicator. Refetch failure: retained rows plus error with optional retry. Provide default empty/error content and React overrides. Keyboard-operable sort/selection/page controls and row activation; aria-sort, selection labels and busy/status announcements.
- Footer: row count on left; Previous, dropdown trigger `Page X of Y`, Next on right. Dropdown lists every page. Zero results use page 1 as the safe state, show zero rows and disable navigation; use `Page 1 of 1` with a disabled picker. No First/Last or page-size controls.
- Theme-aware semantic table with existing fonts, subtle row separators and horizontal overflow on small screens. No added card-style decoration.

## URL Lifecycle

- Namespace keys as `<tableKey>.page`, `.limit`, `.sortField`, `.sortType`, `.search`, `.filters`. Encode filters as one JSON object validated by the page schema; calendar dates remain strings. Preserve unrelated parameters and other table namespaces.
- Decode and validate before enabling the initial page query. Missing values use configured defaults; malformed/invalid table values use validated defaults and replace invalid URL values. An invalid filter resets the entire filter object to its validated defaults; search is separate.
- Restore all state together on mount and browser Back/Forward. Restoration must not be mistaken for a user filter change that resets the URL's page. Applied filter changes and their page reset must produce a consistent query snapshot rather than a request with new filters and the old page.
- Replace history for every committed state change. Synchronize only canonical changes to avoid update loops. Independent instances use distinct tableKey values; only one lifecycle owner manages each key.
- On owner unmount, clear its filter/search memory, cancel pending debounce work and retain its URL parameters. On remount, restore from the URL. Avoid StrictMode cleanup races and stale updates from an old instance.
- Clamp out-of-range pages to max(1, ceil(totalCount / limit)) after a current successful response and request again. Never clamp using initial zero totals or retained data from a previous query.

## Steps

1. Install compatible stable `@tanstack/react-table` v8 and update package-lock only for that dependency. Confirm installed API/types before coding adapters.
2. Define shared DataTable state/props/column metadata types; adapt table-query config and keyed filter store. Update exports and all existing consumers of removed combined state, including Filter, useTableQuery and buildTableParams.
3. Implement local table-state hook, typed filter subscription, Zod URL codec and lifecycle composition. Implement atomic filter-reset transitions, URL restoration, independent namespaces and request-readiness gating.
4. Build generic DataTable and footer, with manual TanStack state adapters, custom cells/header rendering, selection checkbox primitive, accessible controls and row-click isolation.
5. Add skeleton/empty/error/updating states and enforce request interaction restrictions. Connect fresh-total page clamping through the page hook, preserving controlled selection.
6. Add unrouted UsersTableExample, typed user columns/schema, deterministic async mock service and React Query hook. Demonstrate name search, status and joined-date range, selection, View action and row callback. The mock service filters/sorts/paginates before returning `{ rows, totalCount }`; DataTable receives only that page. Include cancellation and controls for manually exercising delay/error/empty results in the example.
7. Document composition, state ownership, schema/defaults, sort-field overrides, URL format, selected-ID limitations and mounting the example temporarily for verification without committing a route. Complete checks/manual verification and record evidence.

## Files / Modules Affected

- package.json, package-lock.json: TanStack Table dependency.
- src/types/datatable.types.ts: generic public contracts and TanStack metadata.
- src/components/datatable/{DataTable,DataTablePagination}.tsx: renderer and footer.
- src/components/ui/Checkbox.tsx: styled accessible Base UI checkbox, including indeterminate header state; no existing checkbox primitive found.
- src/hooks/use-table-state.ts, use-table-filters.ts, use-table-query.ts: local state, filter subscriptions and page composition.
- src/stores/table-query-store.ts, src/constants/table-query.ts: remove pagination/sort ownership from store and revise configuration.
- src/helpers/table-query.ts: Zod-backed URL encoding/decoding and API mapping utilities.
- src/components/Filter.tsx, src/types/filter.types.ts: migrate store usage, schema validation and expose validation errors while retaining existing presentation/modes.
- src/components/DatePicker.tsx: narrowly correct date-only parsing if used by the sample; existing new Date('YYYY-MM-DD') parses as UTC and can shift calendar dates. Preserve timestamp behavior for other consumers.
- Relevant components/hooks/stores/types/helpers barrel exports: publish revised APIs without initialization cycles.
- src/examples/datatable/: UsersTableExample, mock service, query, columns and schema; no routing changes.
- docs/datatable.md, docs/agent records: usage, verification and progress.

## Testing & Validation

Run existing npm test, typecheck, lint, formatting check and production build. Format changed files and run git diff --check; distinguish preexisting full-repository formatting failures and build warnings. Add no automated tests.

Manually mount the example temporarily in a local harness and remove that integration afterward. Verify initial load, descending/ascending/clear sort without page reset, filter/search/limit resets, staged Apply/Cancel, chips, footer page picker and count, horizontal overflow, keyboard controls, partial/page-wide selection with disabled rows and off-page IDs, refetch loading/error interaction restrictions, empty states, and fresh-total page clamping. Exercise deep links, invalid queries, reload, Back/Forward, independent table namespaces, unmount/remount clearing/restoration, date/range round trips and StrictMode. Verify that latest query identity wins and no rows are processed twice. Record any checks that cannot be performed.

## Risks & Edge Cases

- URL hydration, filter reset and local pagination can trigger duplicate/wrong requests unless committed together; gate queries until state is ready.
- DatePicker currently uses UTC parsing for date-only strings; calendar-date round trips require local calendar parsing.
- Server-page row models cannot provide off-page selected records; callbacks expose IDs, not a purported complete record list.
- Previous data totals can incorrectly clamp a new query; use current successful response metadata only.
- All-page dropdown is intentionally optimized for small page counts; selection of that scope excludes virtualization.
- Filter values/defaults must satisfy the page schema; avoid silent cleaning that changes valid schema output. Pending debounce must not reintroduce cleared values.
- Changing shared store/hook exports is an intentional internal migration; inspect all consumers before removing old fields.

## Assumptions

Minor proposed implementation choices for approval: TanStack v8; file layout/names above; namespaced JSON filter URL encoding; null/null unsorted state; zero-results page indicator convention; explicit sortable-column opt-in; checkbox primitive built on installed Base UI. These choices do not add product features. Row actions and server parameter mapping stay page-owned.

## Open Questions

None outstanding after clarification. Approval is required before application implementation.

## References

- https://tanstack.com/table/v8/docs/guide/pagination
- https://tanstack.com/table/v8/docs/guide/sorting
- https://tanstack.com/table/v8/docs/guide/row-selection
