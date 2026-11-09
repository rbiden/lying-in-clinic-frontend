# Dynamic breadcrumbs

## Reuse data already fetched by a page

Call `useBreadcrumb()` in the view with a name from its existing query. It publishes only the display label to Zustand; it does not fetch or store the user/item record. AuthLayout reacts to the label automatically.

```tsx
import { useBreadcrumb } from '#/hooks/use-breadcrumb'

export const UserDetails = () => {
  // Your existing query; keep its usual fetching/cache behavior.
  const { data: user, isPlaceholderData } = useUserQuery()
  useBreadcrumb(isPlaceholderData ? undefined : user?.name)

  return <div>{user?.name}</div>
}
```

Adapt `user?.name` to the actual query response shape. For an item use its name; for a date, pass a formatted string. Call the hook unconditionally, before loading/error returns. Publish one label per view. Undefined/null/empty labels leave route metadata as the fallback while loading. Labels are scoped to the matched URL and removed when the label changes or the view unmounts; they are not persisted. Avoid passing placeholder data from the previous record during parameter navigation.

The view still needs nested route configuration to produce `Home › Users › John Doe`. The parent supplies Users, and the detail route can use a fallback `meta.title: 'User details'` without a loader. The hook supplies John Doe after the existing query resolves. Page-provided labels take precedence over metadata callbacks and static titles.

## Route-loader labels

`meta.breadcrumb` accepts a static string or a synchronous callback receiving the current React Router match. The callback can read `params`, `pathname` and `data` (the route's loader result). Returning `undefined` falls back to `meta.title`; returning an empty string omits that crumb. Existing static titles keep working.

For `Home › Users › John Doe`, put the detail route beneath a `users` parent so both routes appear in `useMatches()`. Put the Users list component on an index child; the parent can use React Router's implicit Outlet. A flat sibling route `users/:userId` does not match the `users` sibling and will not automatically include its breadcrumb.

Example structure for when a detail page and data service are available:

```tsx
import { z } from 'zod'
import type { AppRouteConfig } from '#/routes/types'

// Match this schema to the actual loader result. Names stay out of the URL.
const userDetailData = z.object({
  user: z.object({ name: z.string().min(1) }),
})

// getUser and UserDetails represent your future service and detail page.
const userRoutes: AppRouteConfig[] = [
  {
    path: 'users',
    meta: { title: 'Users' },
    children: [
      { index: true, element: <Users /> },
      {
        path: ':userId',
        element: <UserDetails />,
        loader: async ({ params }) => ({ user: await getUser(params.userId) }),
        meta: {
          title: 'User details',
          sidebar: false,
          breadcrumb: (match) => {
            const result = userDetailData.safeParse(match.data)
            return result.success ? result.data.user.name : undefined
          },
        },
      },
    ],
  },
]
```

The breadcrumb helper uses the resolved match pathname, so Users links to `/users` and the current name belongs to `/users/123`. Loader navigation/revalidation updates `useMatches()` and the breadcrumb label. The callback receives `unknown` data deliberately: narrow or validate it against the loader's actual contract before accessing fields.

Loader data and React Query results are separate sources. Use the page hook above to reuse a page query directly. Existing loader-based callbacks remain available; this feature does not introduce a user endpoint, detail page or additional fetching behavior.
