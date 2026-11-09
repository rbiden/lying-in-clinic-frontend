# Type-safe navigation

Use `useSafeNavigate` for destinations known to the application. It derives absolute path patterns from the actual master route tree; `defineRoutes([...])` preserves the literals in every feature's route definitions while checking AppRouteConfig. Avoid annotating those arrays with `AppRouteConfig[]`, which widens paths to arbitrary strings.

```tsx
import { useSafeNavigate } from '#/hooks/use-safe-navigate'

const navigate = useSafeNavigate()

navigate('/users')
navigate('/users/:id', { params: { id: user.id } })
navigate('/login', { replace: true })
navigate(-1) // History movement, not a user ID.
navigate(
  { pathname: '/users/:id', search: '?tab=profile', hash: '#details' },
  { params: { id: user.id } },
)
```

Unknown paths, missing/wrong parameters and parameters on static routes are TypeScript errors. Dynamic destinations use their registered pattern plus `params`, rather than a prebuilt URL such as `/users/123`. String/number parameter values are encoded as individual URL segments; optional parameters can be omitted. Splat parameters use the `'*'` key and preserve path separators.

Nested and pathless layouts, index routes and absolute child paths contribute their resolved paths. The global catch-all is excluded so it cannot make arbitrary destinations valid. The browser router is imported only as a type when deriving navigation paths, avoiding initialization cycles.

Native React Router `useNavigate` remains available for values that come from outside the registered path union, such as Login's runtime redirect URL. Such destinations need their own validation; this helper does not change redirect policy, link components or history availability. Navigation options and void/Promise return behavior pass through to React Router.

Run `npm test` for route-building tests and `npm run typecheck` for positive/negative navigation assertions. The Users demo now opens `/users/123` through the registered `/users/:id` pattern; Sidebar's login navigation also uses the typed hook.
