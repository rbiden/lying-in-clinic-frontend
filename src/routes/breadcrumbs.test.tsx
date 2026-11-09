// @vitest-environment happy-dom
import { act, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createMemoryRouter, Outlet, RouterProvider } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthLayout } from '#/components/layouts/AuthLayout'
import { ViewUser } from '#/pages/users/ViewUser'
import { useBreadcrumb } from '#/hooks/use-breadcrumb'
import { useBreadcrumbStore } from '#/stores/breadcrumb-store'
import { useAuthStore } from '#/features/auth/auth.store'

vi.mock('#/components/Sidebar', () => ({ Sidebar: () => null }))

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  useBreadcrumbStore.setState({ labels: {}, owners: {} })
  useAuthStore
    .getState()
    .setAuth({ id: 'breadcrumb-test', email: 'test@example.com' })
})
afterEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState())
  vi.unstubAllGlobals()
})

describe('page-provided breadcrumb labels', () => {
  it.each(['/users/123', '/users/123/'])(
    'shows John Doe at %s and clears it on navigation',
    async (path) => {
      const router = createMemoryRouter(
        [
          {
            path: '/',
            element: <AuthLayout />,
            children: [
              {
                path: 'users',
                element: <Outlet />,
                handle: { meta: { title: 'Users' } },
                children: [
                  { index: true, element: <div>Users list</div> },
                  {
                    path: ':id',
                    element: <ViewUser />,
                    handle: { meta: { title: 'View User' } },
                  },
                ],
              },
            ],
          },
        ],
        { initialEntries: [path] },
      )
      const container = document.createElement('div')
      document.body.append(container)
      const root = createRoot(container)
      try {
        await act(async () => {
          root.render(
            <StrictMode>
              <RouterProvider router={router} />
            </StrictMode>,
          )
        })
        expect(
          container.querySelector('[aria-current="page"]')?.textContent,
        ).toBe('John Doe')
        expect(useBreadcrumbStore.getState().labels['/users/123']).toBe(
          'John Doe',
        )
        await act(async () => {
          await router.navigate('/users')
        })
        expect(
          container.querySelector('[aria-current="page"]')?.textContent,
        ).toBe('Users')
        expect(useBreadcrumbStore.getState().labels).toEqual({})
      } finally {
        await act(async () => {
          root.unmount()
        })
        router.dispose()
        container.remove()
      }
    },
  )

  it('reacts to asynchronously supplied and changed labels', async () => {
    const Detail = ({ name }: { name?: string }) => {
      useBreadcrumb(name)
      return <div>Details</div>
    }
    const container = document.createElement('div')
    document.body.append(container)
    const root = createRoot(container)
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AuthLayout />,
          children: [
            {
              path: 'users/:id',
              element: <Detail />,
              handle: { meta: { title: 'View User' } },
            },
          ],
        },
      ],
      { initialEntries: ['/users/123'] },
    )
    try {
      await act(async () => {
        root.render(<RouterProvider router={router} />)
      })
      expect(
        container.querySelector('[aria-current="page"]')?.textContent,
      ).toBe('View User')
      // Update route element data without starting another fetch.
      const detail = router.routes[0].children![0]
      detail.element = <Detail name="John Doe" />
      await act(async () => {
        await router.navigate('/users/123')
      })
      expect(
        container.querySelector('[aria-current="page"]')?.textContent,
      ).toBe('John Doe')
      detail.element = <Detail name="Jane Doe" />
      await act(async () => {
        await router.navigate('/users/456')
      })
      expect(
        container.querySelector('[aria-current="page"]')?.textContent,
      ).toBe('Jane Doe')
      expect(useBreadcrumbStore.getState().labels['/users/123']).toBeUndefined()
    } finally {
      await act(async () => {
        root.unmount()
      })
      router.dispose()
      container.remove()
    }
  })
})
