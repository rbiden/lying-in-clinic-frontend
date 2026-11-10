# Decisions

- Session marker cleanup (2026-10-15): replaced manual shape/reason checks with SessionChangeSchema in the existing auth.schema.ts, using shared object/string/enum helpers. SessionChange type derives from the schema; readSessionChange parses JSON/schema in its existing try/catch. Preserved string ID semantics (no trimming/minimum), extra-key tolerance and null for invalid input. Existing query cleanup edits were left as found.

- Session predicate (2026-10-15): both cleanup predicates now use queryKey.includes('auth') and includes('me'). This is membership matching rather than fixed-position matching; keys containing both tokens are retained regardless of order. Existing ME key remains retained.

- Auth hook cleanup (2026-10-15): removed all four auth hook options parameters/spreads and option-type imports. Current-user mutation pausing and refetchOnMount always now live inside the parameterless query hook. Boundary uses native query.isEnabled rather than observing mutation count twice. Updated tests and usage docs; the user's SCOPE_ID constant is preserved. This supersedes earlier hook-options/callback commitments; native mutate/mutateAsync methods remain available.

- Env helper adoption (2026-10-15): replaced native schema construction in src/lib/env.ts with zodObject/zodString/zodNumber/zodEnum. Explicit unknownKeys strip preserves Vite's additional fields; string-to-number pipes retain blank rejection, finite bounds and defaults. Kept exact boolean-string matching. Existing helper implementations unchanged.

## Session Simplification Proposal (2026-10-15)

- Approval/implementation update: user explicitly approved the refined proposal. Reused existing auth files, moved the single stale-response version into Zustand, removed raw store errors and retry context, and replaced custom orchestration with useCurrentUserQuery/useIsMutating and native query invalidation/focus/reconnect.
- Cache choice: preserve the active ME query (response envelope or null), clear other account query data, and let TanStack retain/settle/garbage-collect mutations instead of traversing MutationCache. This removes getMutationCache bookkeeping and keeps queued auth actions working.
- Confirmed settings are parsed once in src/lib/env.ts; updated .env.example and the ignored local .env, preserving the local API URL. Added timeout 15000ms, session freshness 300000ms and tab sync true. Startup/Retry/tab events force checks regardless of freshness; no backend/dependency changes.

- User refinement: prioritize direct control flow and existing files; introduce abstractions only for concrete overly long functions. Optimize redundant requests/listeners/state writes rather than introducing another coordination layer. Proposal updated; no application changes made in this refinement turn.

- Status: user approved docs/plans/session-simplification.md; application implementation and automated validation complete. Prior planning-only status is superseded.
- User confirmed retaining Zustand and four env settings (API base, 15-second timeout, five-minute session freshness, cross-tab toggle). React Query-only state was offered and declined.
- Proposed: native query observer/useIsMutating scheduling, smaller cache/store update helper, store-owned stale-response version, retry through QueryClient, and no internal event bus, global pending counters, deferred-check flags, remote-generation state or retry context. Preserve existing redirects, error recovery and cross-tab behavior.
- Source/consumer/config investigation only. No application files or local env were edited for this proposal; no tests/build repeated for planning documents.

- Final validation (implementation): 147 tests across 11 files, full lint, build, edited-source/plan formatting and diff whitespace checks passed. Typecheck has only the existing /pos route assertion at navigation.test.ts:15; full formatting reports 72 existing files, and the existing chunk-size warning remains. Live backend/browser verification not performed; no dependencies, backend edits or commits added.

## Implementation Plan Review Artifacts (2026-10-15)

- Follow-up implemented: the session plan opens with proposed architecture, redirect flow, and cross-tab sequence diagrams, each with a brief explanation. Both the skill template and session plan now end plans with TL;DR; chat approval requests remain outside the plan summary.
- Implemented the requested local skill update: completed plans are saved under the existing plan convention (fallback docs/plans), include Mermaid diagrams or review tables with prose explanations, and link the Markdown when presented inline. Revisions update both text and visuals.
- Default to self-contained Markdown without extra diagram dependencies. Preserve implementation approval gates and handle no-write requests with saveable chat Markdown. This skill update does not approve the pending session-layout implementation or alter the global skill copy.

## Session Layout Refactor Investigation (2026-10-15)

- Status: user approved docs/plans/session-layouts.md on 2026-10-15; implementation and automated validation complete, live browser verification pending. This supersedes the earlier proposed/pending status.
- Implemented: auth-feature lifecycle and one boundary in Providers; explicit resolution state, response-envelope ME cache, layout-owned redirects, safe internal return URLs, retry screens for temporary failures, storage markers plus focus/reconnect, generation-protected responses and bounded shared refresh. Login/Sidebar no longer navigate on success. AuthLayout remounts the shell by user ID after account change.
- Cache/queue choice: clear all query data and settled mutations at account transitions, while preserving pending mutations so the serialized auth scope can settle and resume queued actions. Late HTTP responses are canceled before cache commits. Tests cover queued login/logout and new-session refresh while an obsolete refresh is pending.
- Validation: all 131 tests, full lint, build, edited-source/plan formatting and diff whitespace checks passed. Existing navigation.test.ts:15 /pos type assertion and repository formatting issues remain. No actual browser/backend smoke test performed; no backend edits or new dependencies.
- Observed: GuestLayout has debug toast/log only; AuthLayout queries ME but does not block on failed authentication. Login and Sidebar navigate explicitly; Axios hard-navigates on every refresh failure. No cross-tab listener exists. Login/refresh seed a bare user while ME caches a response envelope.
- Confirmed direction: protect all AuthLayout children; both layouts restore cookies and gate loading; shared listener covers both layouts and login/logout/account changes; redirects live in layouts with internal return URLs and a distinct explicit logout destination; transient failures retain known sessions and offer Retry.
- Approved implementation: shared auth-feature lifecycle/boundary with consistent ME cache, storage change markers and focus/reconnect verification, generation guards/cancellation, and account-cache clearing. User approval supersedes the original proposal state.
- Additional evidence: app composition, existing happy-dom test conventions, and nearby backend cookie/login/refresh/ME/logout contracts inspected read-only. No backend changes planned. Historical use-user.ts is absent in the current source and is not a migration target.
- Evidence: inspected layouts, auth query/store/service/exports, Axios refresh queue, route transform/guard/types/configuration, login/logout consumers, providers/query defaults, and test discovery. No runtime validation performed.

Updated: 2026-10-11 (Asia/Manila).

## D-001: Persistent Records

- Status: accepted; explicitly requested by the user.
- Decision: Keep stable project guidance in `AGENTS.md`, explicit requirements in `requirements.md`, decisions and reasons here, and work status in `roadmap.md`.
- Reason: Inspection found no existing planning or memory convention. These files implement the user's specified fallback.
- Related: R-003, R-004, R-005.

## D-002: Repository-Local Agent

- Status: implementation choice for R-001; not a new user requirement.
- Decision: Define `planner` in `.codex/agents/planner.toml`, with `gpt-6.1-sol` and medium reasoning.
- Reason: The official Codex custom-agent documentation supports standalone TOML definitions in `.codex/agents/`. The local installed CLI is available; account access and a live model invocation remain unverified.
- Source: https://learn.chatgpt.com/docs/agent-configuration/subagents

## D-003: Code Review Agent Defaults

- Status: implementation choice for R-009; not a fixed user model requirement.
- Decision: Configure `code_reviewer` with `gpt-6.1-sol`, medium reasoning, and a read-only sandbox. Review targeted changes and callers; return concise, evidenced findings. The coordinator persists meaningful updates because the reviewer cannot write records.
- Reason: Sol is positioned for complex coding at lower cost than Astra. Medium is a practical review-depth/token-use compromise; no repository-specific benchmark establishes an optimal setting. Narrow scope and concise output reduce avoidable context and response use. Recommend a separate high-reasoning pass only for concrete unresolved complexity.
- Alternatives: Luna is cheaper per API token and may suit simple reviews, but cheapest tokens do not establish fewer total tokens or equivalent defect detection. Astra may suit demanding reviews when capability takes priority over cost.
- Limitation: API pricing is not a promise about this account's Codex subscription usage. No numeric token cap or savings is inferred. Live discovery and model access remain unverified.
- Sources: https://developers.openai.com/api/docs/models ; https://developers.openai.com/api/docs/guides/reasoning ; https://learn.chatgpt.com/docs/agent-configuration/subagents

## D-004: Review Against Existing Architecture

- Status: accepted direction from R-010; inspection procedure is an implementation choice.
- Decision: Require architecture and local-practice inspection before findings. Verify the relevant execution path, consumers, contracts, and analogous implementations. Favor corrections within existing layers and report inspected context.
- Reason: A diff alone can obscure shared helpers, API contracts, side effects, and the user's intended patterns. Token discipline must not override context required for correctness. Preserve existing conventions while continuing to flag demonstrated defects.
- Evidence inspected: application composition, auth service/query patterns, `ApiResponse<T>`, shared `Form`, `useMutationTools`, `useSafeMutate`, barrel exports, and TypeScript/ESLint/Prettier configuration. These are observations to recheck, not new universal requirements.

## D-005: Planner-to-Implementation Handoff

- Status: clarification policy explicitly requested in R-011/R-012; agent name and model defaults are implementation choices.
- Decision: Create `implementer` with Sol medium and workspace-write permissions, matching the planner's model defaults. Require an identified planner handoff and existing implementation authorization. Missing or materially conflicting outcomes require user questions and answers before implementation.
- Reason: The user wants implementation grounded in their plan, without guessed target results. Preserve clarity by recording questions and answers. Read-only investigation can continue while target confusion stops implementation; independent implementation can continue only for isolated questions that do not obscure the overall target.
- Handoff: Keep requirements/decisions/roadmap current and provide scope plus validation evidence for review. No automatic delegation or application work is authorized by creating this definition.
- Limitation: Static definition checks do not verify live discovery, model access, or runtime adherence.

## D-006: Short Agent Names

- Status: accepted; explicitly requested in R-013.
- Decision: Rename agent definitions and their `name` fields to `planner` and `implementer`; update descriptions and project references.
- Supersedes: only the original prefixed naming choices in D-002 and D-005. Their model settings and behavioral policies remain in effect. Earlier entries above use the current names for navigation.

## D-007: Updated Planner and Implementer Models

- Status: accepted; explicitly requested in R-014.
- Decision: `planner` uses `gpt-6.1-sol` with high reasoning; `implementer` uses `gpt-6-astra` with medium reasoning.
- Supersedes: planner reasoning in D-002 and implementer model in D-005. Earlier entries describe historical settings. D-006 naming remains current; reviewer settings and all behavioral instructions remain unchanged.
- Validation boundary: configured values can be checked locally; account access and live invocation are not established by these edits.

## D-008: Simple QueryClient Defaults

- Status: implementation choice for R-015.
- Decision: Set query freshness to one minute, retry failed queries once, and explicitly disable mutation retries. Retain other library defaults and existing per-query overrides.
- Reason: Keep the shared configuration small while reducing repeated fetches and limiting retry delays. The current-user query keeps its existing five-minute freshness override.

## D-009: Auth Layout Loading State

- Status: implementation choice for R-016.
- Decision: Use a reusable `LoadingScreen` component with the existing Atmosphere and primary color, a visible session message, status semantics, and reduced-motion support. Show it only while `useCurrentUserQuery` is loading.
- Reason: The prior condition was reversed, so the page displayed while the request was pending and the loading message displayed afterward.

## D-010: Loader Background

- Status: implementation choice for R-017.
- Decision: Place soft primary and amber blurred color fields behind the loading content, using the app's existing palette. Remove the loader's Atmosphere instance because its negative stacking position sat behind the opaque page background.

## D-011: Self-Hosted Application Fonts

- Status: implementation choice for R-018.
- Decision: Bundle Geist, IBM Plex Sans, and Merriweather WOFF2 variable fonts with normal and italic `@font-face` declarations for every subset provided by their Fontsource packages. Use Geist for `font-sans`, Merriweather for `font-heading`, and expose IBM Plex Sans as `font-plex`. Remove the two unused Fontsource runtime dependencies.
- Reason: The stylesheet already named Geist but did not load it. Variable weight files cover each family's supported range without separate downloads for each numeric weight. The bundled font licenses accompany the files.

## D-012: Current User Hook

- Status: implementation choice for R-020.
- Decision: Expose `useCurrentUser` as a selector over the existing auth Zustand store and export it from the hooks barrel.
- Reason: A second store initialized to `null` would not receive the existing login, refresh, and logout updates.

## D-013: Fetch Missing Current User

- Status: implementation choice for R-021.
- Decision: Have `useCurrentUser()` enable the existing current-user query only when auth store user is null, and always refetch on mount in that case. The query updates the store when the API responds.
- Reason: Reuses the current auth service and query key; forced refetch prevents a fresh cached response with an unsynchronized store from leaving the hook at null.

## D-014: Global Implementation Plan Skill

- Status: user-requested installation for R-022.
- Decision: Install the supplied archive's `implementation-plan/SKILL.md` unchanged at `C:/Users/rabie/.codex/skills/implementation-plan/SKILL.md`.
- Reason: The archive contains a single valid skill entrypoint and no additional resources; the requested scope is global rather than repository-local.

## D-015: Global Custom Agents

- Status: accepted migration for R-023.
- Decision: Move `planner`, `implementer`, and `code_reviewer` definitions to `~/.codex/agents/`, preserving names, models, reasoning, and sandbox settings. Generalize their instructions for other projects, remove duplicate project definitions, and keep this repository's conventions in `AGENTS.md` and its records.
- Supersedes: the repository-local placement in D-002, D-003, D-005, and D-006; their role and model decisions remain in force unless revised above.
- Reason: Codex loads personal custom agents from the global agents directory. Project-specific paths and React assumptions would misdirect them in other repositories.

## Observed Architecture

- Reversal (2026-10-13, R-045 superseding R-044): restore the original flat getSidebarItems utility and inline sidebar links; delete the recursive dropdown component and group-specific tests. Preserve the prior collapsed-sidebar fixes, including direct icon/label button children, centered icons, hidden collapsed labels and TooltipTrigger class forwarding. Preserve user-edited routes/layout and adapt older route assertions to the current ViewUser and added static child route.

- Breadcrumb investigation (2026-10-13, R-042): client-rendered tests with the actual AuthLayout, ViewUser and hook (session lookup and Sidebar isolated) showed John Doe correctly, including StrictMode, name changes and navigation cleanup. Found a separate trailing-slash mismatch at index routes that prevented the current breadcrumb from being marked. Normalize paths consistently in the hook, breadcrumb builder and AuthLayout; added happy-dom for client-effect regression coverage. The reported missing-name failure was not reproduced at `/users/123`; no unsupported cause is inferred.

- Implementation choice (2026-10-13, R-041): make the `users` route render only Outlet, with Users as its index child and ViewUser as the :id child. Keep navigation/breadcrumb metadata on the parent and list header metadata on the index child. This isolates page rendering while preserving the parent sidebar link as enabled under the current element-based navigation policy.

- Implementation choice (2026-10-13, R-039/R-040): preserve route path literals via defineRoutes and derive AppRoutePath recursively from the master route tree using a type-only import. Add useSafeNavigate (renamed from the initial useTypedNavigate implementation), with required typed dynamic params, object destinations for search/hash, native options/return behavior and numeric history deltas. Use installed React Router generatePath's own normal-param encoding; explicitly encode splat segments while retaining separators. Migrate Users and Sidebar; retain native navigation for Login's runtime redirect. Use direct Users/Button and ViewUser imports to avoid page/component barrel initialization cycles.

- Implementation choice (2026-10-13, R-038): expose TEXT_SYMBOLS for actual Unicode characters used in JSX and HTML_ENTITIES for corresponding encoded HTML representations, with a shared HtmlSymbol key type enforcing matching keys. Include common punctuation, spacing, math, currency and attribution symbols; document that React renders entity string constants literally.

- Implementation choice (2026-10-13, R-037): add a non-persisted Zustand store for URL-scoped display labels and a useBreadcrumb(label) hook that publishes the current view's existing query value in an effect. Track an effect ownership token so outdated cleanup cannot delete a newer label. AuthLayout subscribes to labels; page labels override loader/static metadata. Fetching and record caching stay with the existing page query. Document unconditional hook use, metadata fallbacks while loading and avoiding previous-record placeholder labels.

- Implementation choice (2026-10-13, R-036): allow meta.breadcrumb to be a string or synchronous BreadcrumbResolver receiving the full matched route (including unknown loader data, resolved pathname and params). Resolve callback labels on each updated matches array; undefined falls back to title. Keep navigation titles/static breadcrumbs unchanged. Document nested Users/detail routes and runtime narrowing of loader results; no user API contract or detail page exists to wire yet.

- Revised metadata contract (2026-10-13, R-034): `meta.header` is now an optional visibility boolean, interpreted as true when omitted. `headerTitle` supplies text with `title` fallback; `headerDescription` replaces the former route description field. PageHeader retains its presentation-only string props; AuthLayout maps metadata and conditionally renders it. Supersedes R-031's string header/description names.
- Breadcrumb choice (2026-10-13, R-035): derive links from useMatches through a typed route utility, prefer breadcrumb overrides to navigation titles, skip unlabeled layouts, collapse identical layout/index URLs, and prepend Home only when no root breadcrumb exists. Use matched pathnames for nested/parameter links. Reusable Breadcrumbs shows muted ancestor links, chevron separators and an unlinked current page with aria-current, replacing the workspace label. Remove the debugging log and keep the user's latest open, typography-only PageHeader design (R-033).

- Revised implementation choice (2026-10-13, R-033): replace R-032's rounded panel, gradient surface, shadow and circular decoration with an open typographic PageHeader. Retain theme-aware Merriweather title and Geist description; use a thin secondary divider with a short primary segment. Supersedes the earlier panel design below.

- Implementation choice (2026-10-13, R-032): style PageHeader as a rounded translucent secondary/card surface blending into primary, with a primary accent rail and circular outlines matching AuthAtmosphere. Retain Merriweather via font-heading for the bold responsive title and Geist via font-sans for the description. Use theme tokens, primary-foreground for dark-mode title contrast, and wrapping for long text; decorative elements are aria-hidden and do not capture pointer input.

- Implementation choice (2026-10-13, R-031): explicitly type `RouteMeta.header` and `description`, carry metadata through `transformRoute` into a typed React Router handle, and preserve other handle properties. AuthLayout uses `useMatches()` to read the deepest active match without importing router configuration, avoiding the previous module cycle. Render a reusable PageHeader above Outlet, falling back from `header` to navigation `title`; omit absent descriptions and empty headers. Leaf metadata is used without inheriting an unrelated parent description.

- Implementation choice (2026-10-13, R-030): import pages directly in users/auth feature route definitions and the master router rather than through `pages/index`. The pages barrel loads Login, which loads the components barrel and Sidebar, which imports feature routes; this cycle read Users before initialization. Direct Users/Home imports break that evaluation path while retaining page barrel exports and existing routes/navigation.

- Implementation choice (2026-10-13, R-029): retain installed Zod 3.25.76 and npm; implement typed helpers in `src/helpers/zod` using private shared construction/validation utilities and scoped error mapping. Wrap presence/default handling around normalized value schemas, validate defaults at construction and reparse them for each use. Reject unsupported configuration and async configured refinements. Enforce datetime seconds/precision explicitly because installed Zod 3 permits omitted seconds by default. Preserve object input structure for direct React Hook Form resolver compatibility and infer output optionality/nullability/defaults independently.
- Testing/integration choice (2026-10-13, R-029): add Vitest as a dev dependency and a separate Node config, with exactly one consolidated helper spec and `npm test`. Adopt helpers in the sole existing feature validator, LoginSchema, with explicit unknown-key stripping, preserved password whitespace and existing missing/empty/email messages. Generic wrong-type messages intentionally follow helper wording; rendering, submission and exports stay unchanged. Usage documentation lives beside the helpers. Installed source inspection and https://v3.zod.dev/ informed compatibility checks.

- Implementation choice (2026-10-13, R-028): increase the auth grid opacity and extend its fade, strengthen existing circular outlines, and add three circular outlines across the top-right and bottom-left corners. Use emerald-400 line colors in dark mode for visibility against the dark background.

- Implementation choice (2026-10-13, R-027): rename the guest background file, named export, component barrel export and Login consumer to `GuestAtmosphere`. Retain its existing visual behavior.

- Implementation choice (2026-10-13, R-026): add a separate `AuthAtmosphere` with static primary/emerald/amber glows, a fading grid and circular outlines. Scope its absolute decoration to isolated layout containers, above the opaque page background and below content. Use it in AuthLayout and the standalone 404 page. The 404 uses existing Lucide icons and Button link composition, with responsive typography and theme tokens. Preserve the user's existing SidebarTrigger edit and current authentication/routing behavior.

- Implementation choice (2026-10-12, R-025): use the official shadcn Base Rhea sidebar primitives with the existing Button/Tooltip and Lucide icons. AuthLayout owns SidebarProvider and the toggle. Navigation comes from `authRoutes`: titled static routes are included by default, `meta.sidebar: false` hides an individual route, `meta.icon` supplies an optional Lucide icon, and parameter/optional/wildcard paths are skipped. Nested paths are resolved recursively and duplicate URLs are omitted. Hidden parent routes do not implicitly hide their children. Sidebar visibility is navigation metadata, not an authorization rule.

- Diagnostic observation (2026-10-12, R-024): login seeds `authKeys.me()` with `data.data.user` before navigation; `useCurrentUserQuery()` uses that key with five-minute freshness, so mounting AuthLayout immediately reuses fresh cached data. Login/refresh cache bare `AuthUser`, whereas the query returns `ApiResponse<{ user: AuthUser }>`; cache shape consistency is a separate unimplemented correction. No change to fetching policy has been approved.

These are code observations, not newly approved architecture decisions:

- React Query manages server requests/cache; Zustand stores local auth state (`src/features/auth/auth.query.ts`, `auth.store.ts`).
- The Axios client sends credentials and coordinates retries after a 401 with a refresh queue (`src/lib/axios.ts`).
- Route configuration is transformed into React Router objects; guards use auth state (`src/routes/index.tsx`, `guard.tsx`).
- No automated test runner or coverage threshold is configured in `package.json`.
- Architecture walkthrough (2026-10-11, `code_reviewer`, source inspection): `main.tsx` mounts `App`, which composes `Providers`, the router, and Sonner. Providers mount QueryClient context and the global confirmation dialog.
- Login composes shared FormCard/Form/Input with RHF/Zod, calls `safeMutate` around the auth mutation, and then displays a toast/navigates. Feature services own endpoints; query hooks update server cache and auth state. Shared mutation helpers handle loading and normalized results.
- Current routes register login, home, and NotFound. AuthLayout supplies navigation/presentation; current route definitions do not enable the available auth/custom guards.
- Auth state is memory-only. Current-user/refresh hooks exist but no source callers or mounted session bootstrap were found. Axios refresh/retry is separate from the feature refresh mutation.
- Filter/table-query state helpers and a component showcase exist, but no routed page currently connects them to inventory feature queries. Authentication is the only inspected feature directory; Home is a placeholder.
- Open product questions: should home/all future inventory screens require authentication, and should reload restore an existing session? These observations do not authorize fixes or establish acceptance criteria.

- Implementation choice (2026-10-14): Set Audit Logs headerDescription to 'Review user activity and changes across the system.' Follow the existing route metadata pattern.

- Implementation choice (2026-10-14): Audit Logs uses the existing DataTable and useTableState with 15 labeled sample records. Local sorting and slicing satisfy manual sorting/pagination; initial order is newest first. No API contract is introduced.

- Approved implementation (2026-10-14): DataTable takes a structural TableInstance compatible with both existing hooks. Server props require totalCount; clientSide opts into native TanStack search/sort/pagination with optional memoized filterRow. Client mode derives totals and resets/clamps pages. Existing filters, URL synchronization and selection ownership remain intact.
- Audit Logs integration (2026-10-14): pagination-only useTableQuery feeds useAuditLogsQuery, which calls AuditLogsService.LIST using shared Axios. Keep previous successful rows on page errors, pass cancellation signals, and accept only current successful non-placeholder totals. Backend projection returns id/userId/model/action/createdAt plus user id/username/fullName; payload and credentials are excluded. This supersedes the sample implementation decision above. Shared Axios base URL and credential/refresh handling are unchanged.

- Superseding audit query decision (2026-10-14): useAuditLogsQuery directly returns useQuery, spreads caller options, and delegates GET_ALL to shared Axios. Keep previous data is selected at the page through options; no duplicate retained-data ref exists. Preserve external acceptTotal logic and typed generic select support. Earlier custom error-retention/cancellation choices are superseded by the user's requested simpler structure.

- Shared query typing (2026-10-14): src/types/query.types.ts exports optional page/limit/search/sortField/sortType parameters using the existing SortOrder. Audit service/query/key reuse this type; response page/limit remain required. The hook annotates options inline as Partial<UseQueryOptions<...>> because native queryKey is required but supplied by the hook, while callers may pass {}. Generic select typing is preserved. No new filter API contract or runtime defaults were introduced; Audit Logs still sends pagination only.

- Implementation choice (2026-10-14): Keep keepPreviousData inside the paginated audit hook while exposing only params/enabled; do not change global QueryClient behavior.

- Demo choice (2026-10-14): Action and Model selects share audit-logs tableKey/schema for apply/reset/chips/URL state. Disable search and label controls demo-only; no local row processing or unsupported API parameters introduced.

- Audit filter forwarding (2026-10-14): reused the existing table.params builder instead of duplicating filter merging or rewriting Filter/store/hooks. The query key and Axios service receive the same composed parameters. Removed demo-only explanatory copy. Backend edits started in this follow-up were fully reverted to their captured pre-follow-up contents; the previously approved audit projection remains. Current filter choices remain unchanged while backend implementation is deferred.

- Empty server page handling (2026-10-14): move reset ownership into DataTable. An optional isSuccess prop confirms current non-placeholder data; AuditLogs supplies isSuccess && !isPlaceholderData. DataTable resets to page 1 only when server mode is settled, error-free, empty and currently past page 1. Defaults remain conservative (isSuccess false). Removed the page effect; existing useTableQuery.acceptTotal remains available to unrelated consumers.

- Superseding server pagination decision (2026-10-14): removed DataTable server empty-page effect and its isSuccess prop. AuditLogs remains free of page-level correction effects. Native invalidateQueries refetches current parameters, leaving page state unchanged; a future mutation that also needs page 1 must explicitly set it in success handling. No mutation contract or helper was invented. Client-side clamping remains unchanged.

- Implementation choice (2026-10-14): Anchor busy overlay to relative wrapper outside horizontal scroller; preserve table dimensions, skeletons, aria-busy and live status. Remove stale no-sort-header assertion because user has enabled sorting on AuditLogs.

- Error overlay choice (2026-10-14): Center alert and optional Retry over the table; busy overlay takes precedence during retry. Correct busy condition from !busy to busy so successful tables are not obscured; retain user shimmer styling.

- Overlay design (2026-10-14): Reuse LoadingScreen circular ring, inset Warehouse icon, heading/supporting typography, theme colors and reduced-motion spin. Error uses matching static destructive ring and retry; reserve minimum overlay height. Correct current inverted error visibility condition.

### Impeccable Init (2026-11-09)

- Context loader completed; no PRODUCT.md or DESIGN.md exists. Preserve current application and existing working changes.
- Follow init interview before writing PRODUCT.md. Build workflow preference remains pending; no default saved.

### Impeccable Init: Confirmed Record and Configuration (2026-11-09)

- Supersedes the pending interview/workflow note above: confirmed product requirements are captured in root PRODUCT.md with product schema 1 and bare platform value `web`. It separates intended clinic capabilities from inspected frontend functionality and explicitly retains unresolved contracts and hosting compatibility.
- User selected code-first for future landing/showcase surfaces. Store `buildPath: "code"` only in `.impeccable/config.json`; it is a workflow setting, not PRODUCT.md content. Preserve `.impeccable/config.local.json`.
- Configure live mode for the Vite SPA shell using `files: ["index.html"]`, `insertBefore: "</body>"`, `commentSyntax: "html"`, and `cspChecked: true`. The completed detect-csp result was `shape: null`, `signals: []`; no CSP source modification is needed.
- Init completes with documentation/configuration only. No DESIGN.md, application changes, live-server launch, backend verification, or deployment is part of this work.

### DataTable Sync From faculty-evaluation-frontend (2026-11-09)

- User request: port the DataTable and its hooks/helpers from the local `faculty-evaluation-frontend` project. Upgraded the existing port in place rather than adding a parallel copy; kept this repo's file names (`helpers/table-query.ts`, `helpers/filters.ts`, `helpers/list-return.ts`) instead of the source's `*.helpers.ts` names.
- Added from source: row `actions`/`actionType` (`DataTableActions`), `getRowClassName`, `cellClassName` (table and column level), `headerClassName`, `canBulkSelectRow`, `selectionDisabled`, `showPagination`, a "Clear Filters" empty-state button driven by `useTableQuery().resetFilters`, a page-number input when there are more than 1000 pages, optional `filterSchema`/`defaultFilters`/`sortFields`, `tableFilterSearch`, and list-return memory (`rememberListSearch`, `listReturnTo`, `listReturnHref`). Non-selectable rows now render no checkbox instead of a disabled one.
- New supporting components: `components/Dropdown.tsx` and the shadcn base-ui `components/ui/dropdown-menu.tsx` (copied from source; `cn` import switched to `@/lib/utils`). The older minimal `ui/DropdownMenu.tsx` stays because `Input` uses it.
- Kept this repo's `types/query.types.ts` (source widened `page`/`limit` to `number | null`, which broke an existing audit-logs test and is not needed by DataTable). Kept this repo's Audit Logs README paragraph. Source busy-overlay icon is `CalendarDays` (replaced `Warehouse`).
- No new npm packages were needed; `@tanstack/react-table`, `zustand`, `zod`, `react-router`, `@base-ui/react`, `lucide-react` and `@hugeicons/*` were already installed.

### Impeccable Document (2026-11-09)

- User chose to document the uncommitted working-tree theme (shadcn base-nova, neutral greys, Inter, 0.625rem radius), not the committed emerald/Merriweather base-rhea theme. DESIGN.md and `.impeccable/design.json` record it.
- Confirmed language: North Star "The Quiet Ward"; mood calm, precise, neutral, warm/reassuring, with warmth carried by tone (wording, corners, spacing), not by tinting tokens; primary named Graphite; flat, lines-first elevation; soft and restrained components.
- Recorded drift (not fixed): raw greys/bg-white in InputGroup, Sidebar, AuthLayout, DataTable, Dropdown; the ported dropdown-menu's dark translucent popup; unused Geist/Plex/Merriweather imports; legacy Warehouse icon in Sidebar; no success/warning/info tokens yet. Documentation only; no application code changed.

### Light Theme, Fonts, Icon and Status Colours (2026-11-09)

- Removed the `.dark` block, `@custom-variant dark` and every `dark:` class (Tailwind v4 would otherwise fall back to the OS setting). Declared `color-scheme: light` in CSS and index.html. Limited Tailwind scanning to `src/` (`@import 'tailwindcss' source('.')`) because `.agents/skills` docs were adding stray classes, including a `dark:` rule, to the bundle (CSS 149 kB to 123 kB).
- Fonts: self-hosted fontsource Nunito (wght + italic) and Fraunces (opsz + italic) under `src/assets/fonts`, matching the old layout; removed the geist/ibm-plex-sans/merriweather folders and the `@fontsource-variable/inter` package. `h1`–`h4` default to Fraunces.
- New tokens: `--success`, `--warning`, `--info` (+ foregrounds); `--destructive` darkened slightly to 0.545 for text contrast on tints; `--input` raised to 0.872 to keep the previous gray-300 field outline while making it token-based.
- Status variants added to Button, Badge, dropdown-menu items, Dropdown entries, DataTable actions and ActionVariant (shared `StatusVariant` type); toast icons coloured; ConfirmationDialog icon follows the confirm variant (default stays red).
- Theme mismatches mapped to tokens: amber "dirty" field state to `warning`; raw greys/white/black to input/muted/border/card/foreground; decorative amber/emerald glows to neutral tints; dropdown popups made solid (no glass, no forced dark); dropdown icons switched from Hugeicons to Lucide.
- Icon: Warehouse to Lucide `Baby` (Sidebar, LoadingScreen, Login); 404 PackageSearch to SearchX; new favicon linked in index.html; page title set to Lying In Clinic.
- DESIGN.md and `.impeccable/design.json` rewritten to match.

### Auth Response Envelope Normalization (2026-11-10)

- Normalize login, refresh and current-user responses in `auth.service.ts` to the shared `ApiResponse<{ user: AuthUser }>` contract. Accept the backend's common `data.user`, `data` resource, `user`, and direct-user forms. Reject missing/invalid users so the existing query error path displays the retry screen rather than allowing `applySession` to crash the boundary.

### Clinic Backend Alignment Plan (2026-11-10)

- The user identified `lying-in-clinic-backend` as the source of truth and requested a plan. The earlier generic response normalizer is superseded as a design direction; application replacement awaits plan approval.
- Confirmed deployment topology: separate frontend/API origins on the same site. Exact domains are configuration values to supply at deployment.
- Confirmed scope includes Audit Logs alignment: use the backend's event/date filters, pagination, actor ID and subject fields alongside auth, shared response types and feature barrels.
- User approved `docs/plans/backend-auth-session-alignment.md` on 2026-11-10. Implement exact Laravel resource and error envelopes, no refresh endpoint, 204 logout, CSRF/session reconciliation on protected 419 without replaying mutations, numeric feature-owned users and cycle-safe explicit feature barrels.
- Scope includes ErrorState, spinner LoadingState, skeleton PendingState (modal/card/page), and EmptyState, using shadcn and Tailwind. Bounded adoption is auth wrappers and DataTable defaults, preserving table override slots and the existing Empty API.
- Confirmed loading direction: branded vertical status with a static clinic icon above the heading and a small spinner beside status text below, removing the rotating logo ring and glows. Compact table/inline loading remains spinner-and-text without forced branding.
