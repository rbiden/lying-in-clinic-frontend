import { ViewUser } from '#/pages/users/ViewUser'
import { Users } from '#/pages/users'
import { defineRoutes } from '#/routes/define-routes'
import { User2 } from 'lucide-react'
import { Outlet } from 'react-router'

export const userRoutes = defineRoutes([
  {
    path: 'users',
    element: <Outlet />,
    meta: {
      title: 'Users',
      icon: User2,
    },
    children: [
      {
        index: true,
        element: <Users />,
        meta: {
          headerTitle: 'Users',
          headerDescription:
            'Keep track of your users and what they can access.',
        },
      },
      {
        path: ':id',
        element: <ViewUser />,
        meta: {
          title: 'View User',
        },
      },
    ],
  },
])
