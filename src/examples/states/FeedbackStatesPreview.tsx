import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'
import { PendingState } from '@/components/PendingState'
import { LoadingScreen } from '@/components/LoadingScreen'
import { SessionErrorScreen } from '@/features/auth/SessionErrorScreen'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AuditLogs } from '@/pages/AuditLogs'
import { AuditLogsService } from '@/features/audit-logs/audit-logs.service'
import type { AuditLog } from '@/features/audit-logs/audit-logs.types'
import '@/index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
})
const syntheticRows: AuditLog[] = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  actor_id: index % 3 === 0 ? null : 7,
  event: index % 2 === 0 ? 'user.updated' : 'user.created',
  subject_type: index % 3 === 0 ? null : 'App\\Models\\User',
  subject_id: index % 3 === 0 ? null : index + 10,
  changed_fields: [],
  old_values: [],
  new_values: [],
  occurred_at: `2026-11-11T00:${String(index).padStart(2, '0')}:00.000000Z`,
  correlation_id: `preview-${index}`,
}))

// This standalone entry never calls the API or mounts the application's routes.
AuditLogsService.GET_ALL = async ({
  page = 1,
  limit = 10,
  event,
  from,
  to,
} = {}) => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const filtered = syntheticRows.filter(
    (row) =>
      (!event || row.event === event) &&
      (!from || row.occurred_at.slice(0, 10) >= from) &&
      (!to || row.occurred_at.slice(0, 10) <= to),
  )
  return {
    data: filtered.slice((page - 1) * limit, page * limit),
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: page,
      from: filtered.length ? (page - 1) * limit + 1 : null,
      last_page: Math.max(1, Math.ceil(filtered.length / limit)),
      links: [],
      path: '/preview/audit-logs',
      per_page: limit,
      to: filtered.length ? Math.min(page * limit, filtered.length) : null,
      total: filtered.length,
    },
  }
}

function Preview() {
  const [view, setView] = useState('states')
  const [retryCount, setRetryCount] = useState(0)
  const [retrying, setRetrying] = useState(false)
  const retry = () => setRetryCount((count) => count + 1)
  return (
    <>
      <nav
        aria-label="Preview views"
        className="flex flex-wrap gap-2 border-b border-border p-4"
      >
        {['states', 'session loading', 'session error', 'audit logs'].map(
          (item) => (
            <Button
              key={item}
              variant={view === item ? 'default' : 'outline'}
              onClick={() => setView(item)}
            >
              {item}
            </Button>
          ),
        )}
      </nav>
      {view === 'session loading' ? (
        <LoadingScreen />
      ) : view === 'session error' ? (
        <SessionErrorScreen retry={retry} />
      ) : (
        <div className="mx-auto flex max-w-5xl flex-col gap-8 p-4 sm:p-6">
          <h1 className="text-2xl">
            {view === 'audit logs'
              ? 'Audit logs preview'
              : 'Feedback states preview'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Isolated development preview. Audit rows are synthetic. No API
            requests are sent.
          </p>
          {view === 'audit logs' ? (
            <AuditLogs />
          ) : (
            <>
              <section className="flex flex-col gap-4">
                <h2 className="text-xl">Loading</h2>
                <LoadingState
                  title="Loading records with a deliberately longer status label to check wrapping"
                  description="The surrounding content controls the available width."
                />
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-xl">Error</h2>
                <ErrorState
                  onRetry={retry}
                  retrying={retrying}
                  description="Check your connection and try again. This longer explanation checks how supporting text wraps on a narrow screen."
                />
                <Button
                  variant="outline"
                  onClick={() => setRetrying((value) => !value)}
                >
                  Toggle retrying
                </Button>
                <output aria-live="polite">Retry calls: {retryCount}</output>
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-xl">Empty</h2>
                <EmptyState
                  title="No records match these filters"
                  description="Try another event or date range."
                  action={{ label: 'Clear Filters', onClick: retry }}
                />
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-xl">Modal placeholders</h2>
                <Modal
                  title="Loading record details"
                  description="The real dialog owns its title and focus."
                  trigger={
                    <Button variant="outline">Open modal preview</Button>
                  }
                >
                  <PendingState variant="modal" />
                </Modal>
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-xl">Card placeholders</h2>
                <PendingState variant="card" />
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-xl">Modal shape inside a card</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Record details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PendingState variant="modal" />
                  </CardContent>
                </Card>
              </section>
              <section className="flex flex-col gap-4">
                <h2 className="text-xl">Page placeholders</h2>
                <PendingState variant="page" />
              </section>
            </>
          )}
        </div>
      )}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      <Preview />
    </MemoryRouter>
  </QueryClientProvider>,
)
