import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import type { BreadcrumbItem } from '#/routes/breadcrumbs'

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  currentPath: string
}

export const Breadcrumbs = ({ items, currentPath }: BreadcrumbsProps) => (
  <nav aria-label="Breadcrumb" className="min-w-0">
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
      {items.map(({ to, label }, index) => (
        <li key={to} className="flex min-w-0 items-center gap-2">
          {index > 0 && (
            <ChevronRight
              className="size-3.5 shrink-0 text-muted-foreground/60"
              aria-hidden="true"
            />
          )}
          {to === currentPath ? (
            <span
              aria-current="page"
              className="truncate font-medium text-foreground"
            >
              {label}
            </span>
          ) : (
            <Link
              to={to}
              className="truncate text-muted-foreground transition-colors hover:text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {label}
            </Link>
          )}
        </li>
      ))}
    </ol>
  </nav>
)
