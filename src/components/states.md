# Feedback states

`LoadingState`, `ErrorState`, `PendingState`, and `EmptyState` are presentation
components. Callers own requests, retry behavior, dialogs, and page layout. Import
them from `@/components`; their prop types are also exported from `@/types`.

```tsx
<LoadingState title="Loading records" description="Please wait…" size="md" />
<ErrorState title="Unable to load records" onRetry={refetch} retrying={isFetching} />
<EmptyState title="No records found" action={{ label: 'Clear Filters', onClick: resetFilters }} />
```

Loading defaults to `Loading`, medium text, and no description. Error defaults to
`Unable to load content`, `Please try again.`, an h2, and a decorative alert icon.
Retry appears only with a handler and disables while `retrying` is true. Use safe
display text for descriptions. `headingLevel` and title/description class slots
allow the surrounding screen to preserve its hierarchy.

`Empty` is a compatibility export of `EmptyState`. Existing size, variant, icon,
action, secondary action, children, and class slots remain available.

```tsx
<Modal title="Loading record details" open={open}>
  <PendingState variant="modal" />
</Modal>
<PendingState variant="card" label="Loading record summary" />
<PendingState variant="page" label="Loading records" />
```

The modal shape supplies compact heading, field, and footer placeholders; it does
not create a dialog or focus trap. Keep a real title on the caller's dialog. Card
renders one Card with a header and content rows; avoid nesting it inside another
Card. Page supplies a responsive heading/toolbar and content placeholders without
creating a main landmark, navigation, or route. The default variant is `card` and
default label is `Loading content`. All widths follow the parent.

Loading and Pending each expose one polite status. Spinner artwork and skeleton
geometry are hidden from assistive technology. Keep a loading status outside any
caller-owned `aria-busy` content region so its announcement is not deferred.
Pending owns its decorative busy region. Error exposes one alert; do not wrap it
in another alert. Empty describes a successful empty result, so avoid displaying
it while data is busy or failed. Spinner and Skeleton animate only when reduced
motion is not requested.

Session wrappers preserve their existing APIs. LoadingScreen owns the static Baby
clinic mark and heading; the inline loading state has no brand shell. DataTable
keeps its row-shaped skeleton cells, retained rows, shimmer, custom feedback
content, retry callback, and Clear Filters behavior.

## Isolated render preview

Run `npm run dev`, then open
`http://localhost:5173/docs/feedback-preview.html`. This standalone Vite entry is
not registered in the application router or imported by the production app. It
shows all Pending variants, a real dialog, existing Card composition, long copy,
retry controls, session wrappers, and Audit Logs with explicitly synthetic rows.
Only the preview entry replaces the audit service, without making API requests.

Check at 375px, 768px, and desktop width; at 200% text zoom; and with reduced motion
enabled. Tab to Retry and press Enter, toggle retrying to verify disabled behavior,
open/close the modal with keyboard and Escape, and check focus returns to its
trigger. In Audit Logs, apply an exact event/date filter, move between pages, and
refresh. Confirm no page-level horizontal overflow (the table itself can scroll),
no nested alert/status announcements, and no empty message beneath loading/error.

Automated regressions live in `states.test.tsx` and `datatable/DataTable.test.tsx`.
They verify interactions and semantics; they do not replace rendered browser or
screen-reader verification.
