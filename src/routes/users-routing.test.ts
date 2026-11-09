import { createElement, isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { userRoutes } from '#/features/users/users.routes'
import { ViewUser } from '#/pages/users/ViewUser'
import { getSidebarItems } from './sidebar'

describe('Users list and detail routes', () => {
  it('renders the list only at /users', () => {
    const router = createMemoryRouter(userRoutes, {
      initialEntries: ['/users'],
    })
    try {
      const html = renderToStaticMarkup(
        createElement(RouterProvider, { router }),
      )
      expect(html).toContain('<button')
      expect(html).toContain('John Doe')
      expect(html).not.toContain('<div>View User</div>')
    } finally {
      router.dispose()
    }
  })

  it('renders the detail without list content at /users/123', () => {
    const router = createMemoryRouter(userRoutes, {
      initialEntries: ['/users/123'],
    })
    try {
      const html = renderToStaticMarkup(
        createElement(RouterProvider, { router }),
      )
      const element = router.state.matches.at(-1)?.route.element
      expect(isValidElement(element) && element.type).toBe(ViewUser)
      expect(html).not.toContain('<button')
      expect(html).not.toContain('Hello')
      expect(router.state.matches.map((match) => match.route.path)).toEqual([
        'users',
        ':id',
      ])
    } finally {
      router.dispose()
    }
  })

  it('keeps one enabled Users sidebar link', () => {
    const items = getSidebarItems(userRoutes).filter(
      (item) => item.to === '/users',
    )
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      to: '/users',
      title: 'Users',
      disabled: false,
    })
    expect(userRoutes[0].children[0].meta.headerTitle).toBe('Users')
  })
})
