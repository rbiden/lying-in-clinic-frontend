# Repository Guidelines

## Project Structure & Module Organization

This client uses React, TypeScript, Vite, and Tailwind CSS. `src/main.tsx` starts the application; `src/app/` contains providers, and `src/routes/` defines routing and access guards. Keep page components in `src/pages/` and feature logic in `src/features/`. Authentication groups its service, schema, queries, and store under `src/features/auth/`.

Reusable components live in `src/components/`, with UI primitives in `ui/` and layouts in `layouts/`. Shared hooks, stores, helpers, types, and API utilities have corresponding directories under `src/`. Imported assets belong in `src/assets/`; static files belong in `public/`. Build output goes to `dist/`.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev`: start Vite on port 5173.
- `npm run build`: create the production bundle.
- `npm run preview`: serve the production build locally.
- `npm run typecheck`: check TypeScript without emitting files.
- `npm test`: run the consolidated Zod helper suite and route navigation tests with Vitest.
- `npm run lint`: run ESLint with the TanStack configuration.
- `npm run check`: check Prettier formatting.
- `npm run format`: apply Prettier formatting and ESLint fixes; review the resulting diff.

## Coding Style & Naming Conventions

Use TypeScript and two-space indentation. Prettier specifies single quotes, no semicolons, and trailing commas. Use PascalCase for page and component names, `use-*.ts` for hooks, and feature-prefixed files such as `auth.service.ts` and `auth.schema.ts`. Follow neighboring files when extending existing modules.

Both `@/*` and `#/*` resolve to `src/*`. Keep API calls in feature services using the shared Axios client in `src/lib/axios.ts`.

## Testing Guidelines

Vitest runs the consolidated `src/helpers/zod/zod-helpers.spec.ts` suite and `src/routes/*.test.ts` through `npm test`; no coverage threshold is configured. Before submitting changes, run relevant tests, type checking, linting, formatting checks, and the production build. Manually verify affected flows; authentication changes should cover login, refresh, logout, and guarded routes. Keep helper tests in the single consolidated spec; use descriptive `*.test.ts` or `*.test.tsx` filenames for future unrelated suites and update test discovery as needed.

## Commit & Pull Request Guidelines

Recent commits use short plain-language subjects, such as `Update Login.tsx` and `Synced auth`; no enforced prefix convention is evident. Write concise subjects describing the change. Pull requests should explain the behavior, link relevant issues, record validation, and include screenshots for visible UI changes.

## Security & Configuration Tips

Use `.env.example` as the configuration reference. `VITE_API_BASE_URL` overrides the default `/api/v1`. Keep secrets out of client-side environment variables and commits; Vite exposes `VITE_*` values to the browser. Preserve credential handling when modifying the shared API client.

## Planning & Persistent Records

The `planner` custom agent lives globally in `~/.codex/agents/planner.toml` and uses GPT-6.1 Sol with high reasoning. Request it by name for feature planning and refactor management. Plan by default; implement application changes only when requested.

The `code_reviewer` agent lives globally in `~/.codex/agents/code_reviewer.toml` and uses GPT-6.1 Sol with medium reasoning. Request it for a diff, commit, or specified files. It operates read-only, prioritizes actionable defects, and reports evidence and validation gaps. The coordinating agent persists meaningful review updates in the records below; the reviewer returns those updates without claiming to write them.

Before findings, the reviewer must inspect current architecture, trace the affected execution path and consumers, and check neighboring implementations and configured coding practices. Recommendations must fit existing logic and conventions; personal style preferences do not justify redesigns. Demonstrated bugs still warrant findings. Report material ambiguity and the context actually inspected.

The `implementer` agent lives globally in `~/.codex/agents/implementer.toml` and uses GPT-6 Astra with medium reasoning. It implements an identified planner handoff when implementation is authorized. It must ask focused questions about unclear outcomes, scope, requirements, or contracts and wait for answers before dependent work. If confused about the target result, it stops implementation; read-only investigation may continue. Silence is never an answer. It preserves existing architecture and coding practices and records progress and validation evidence.

At session start, read this guide, applicable nested instructions, and `docs/agent/{requirements,decisions,roadmap}.md`. Record explicit requirements promptly. Distinguish mandatory requirements, preferences, assumptions, and proposals; never promote assumptions without agreement. Preserve superseded requirements with references to their replacements.

Before ending, update meaningful decisions, work status, validation evidence, unresolved issues, and the next action. Keep records task-relevant and free of secrets. Follow the environment's instruction hierarchy; resolve material conflicts with a focused question. If records are unavailable, disclose that limitation and provide a compact summary the user can save.
