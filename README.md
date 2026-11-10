# TypeScript Frontend Template

A React + Vite + Tailwind CSS frontend template with TypeScript and shadcn components.

## Getting Started

To run this application:

```bash
npm install
npm run dev
```

## Building For Production

To build this application for production:

```bash
npm run build
npm run preview
```

## Styling

This project uses [Tailwind CSS v4](https://tailwindcss.com/) for styling and [shadcn](https://ui.shadcn.com/) for components.

## Linting & Formatting

This project uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting.

```bash
npm run lint
npm run format
npm run check
```

## Branding

Copy the public branding variables from `.env.example` into your local environment.
`VITE_APP_NAME` controls the login name, browser title and sidebar home label.
`VITE_APP_SHORT_NAME` controls the sidebar name, and `VITE_BRAND_COPYRIGHT_HOLDER`
controls the footer owner; both fall back to the app name when omitted.
The remaining `VITE_BRAND_*` settings control the welcome heading, login description,
access guidance, multiline tagline, image-panel description and workspace label.
Use a double-quoted `\n` in the tagline for line breaks. Existing clinic branding
is retained when settings are absent. Restart Vite after editing env files and
rebuild for deployment; these values are public build-time configuration.
Logo artwork, favicon and photography remain source assets.

## Backend sessions

Set `VITE_API_BASE_URL` to the complete API prefix, for example
`http://localhost:8000/api/v1` (see `.env.example`). Feature services append
`/login`, `/me`, `/logout`, or `/audit-logs`; do not append another `/v1`.
The client derives `/sanctum/csrf-cookie` from that backend origin, supporting
the backend-root deployment described in the [alignment plan](docs/plans/backend-auth-session-alignment.md).

The frontend and Laravel API must use separate origins on the same site.
Configure Laravel's credentialed CORS origins, Sanctum stateful frontend
host/port, and session/XSRF cookie domain and HTTPS settings for the deployed
hosts. Client credentials and cross-origin XSRF handling are enabled; the
frontend stores no bearer or refresh token.

Login and logout initialize CSRF on each explicit attempt. Successful auth
responses use `{ data: { id, name, email, role, active } }`, with numeric IDs;
logout has no body (204). A protected 401 expires the local session without
request replay. A protected mutation's 419 remains a failed action while the
client initializes CSRF and verifies `/me`; retry the action explicitly after
recovery. Failed CSRF initialization keeps the session Retry screen available.
403 and validation/rate-limit failures preserve the session.

Audit Logs consumes Laravel resource pagination (`data`, `links`, `meta`) and
sends only `page`, `per_page`, `event`, `from`, and `to`. Event matching is exact;
date boundaries are inclusive UTC calendar dates. Legacy audit search/sort and
Action/Model URL filters are removed on restoration.

## Feedback states

`LoadingState`, `ErrorState`, `PendingState`, and `EmptyState` are exported from
`src/components`; callers own fetching and retries. `Empty` remains a compatible
alias. See [state usage](src/components/states.md) and the isolated
[feedback preview](docs/feedback-preview.html), available at
`http://localhost:5173/docs/feedback-preview.html` after `npm run dev`.
The preview uses explicitly synthetic audit rows and makes no backend requests.
It is separate from application routes and the production entry point.
