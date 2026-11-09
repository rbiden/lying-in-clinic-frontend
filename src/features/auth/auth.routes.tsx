import { AuditLogs } from '#/pages/AuditLogs'
import { Home } from '#/pages/Home'
import { defineRoutes } from '#/routes/define-routes'
import { House, RotateCcwClock } from 'lucide-react'

export const authRoutes = defineRoutes([
  {
    index: true,
    element: <Home />,
    meta: { title: 'Dashboard', icon: House },
  },
  {
    path: 'audit-logs',
    element: <AuditLogs />,
    meta: {
      title: 'Audit Logs',
      icon: RotateCcwClock,
      headerTitle: 'Audit Logs',
      headerDescription: 'Review user activity and changes across the system.',
    },
  },
])
