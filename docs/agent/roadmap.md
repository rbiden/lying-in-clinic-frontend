# Roadmap

- Session marker cleanup (2026-10-15): simplified readSessionChange to one schema parse, with shared-helper schema/type in auth.schema.ts. All 147 tests, lint, build, edited formatting and diff checks pass; existing /pos route-type assertion remains. No runtime validation behavior change intended; no cleanup work remains.

- Session predicate (2026-10-15): updated both removeQueries predicates to Array.includes at the user's request. Keeps keys containing both auth and me, independent of position. All 48 auth tests, focused ESLint, edited-file formatting and diff checks passed. No additional predicate cleanup remains.

- Related hook inspection (2026-10-15): checked all source query/mutation hooks and options usages after the auth cleanup. Audit Logs and example users queries already take only request params/enabled, with enabled used by table readiness. No remaining TanStack options passthrough found. Other shared-hook options configure forms, tables, navigation, confirmation and mutation utilities and are outside the feature-query cleanup. No application edits or runtime checks needed; next action: no additional query-options cleanup remains.

- Auth hook cleanup (2026-10-15): implemented removal of unused options from login/logout/refresh/current-user hooks. Boundary/test callers updated; scheduling/startup checks remain internal and typed Axios errors preserved. All 147 tests, lint, build, edited-source formatting and diff checks passed; typecheck/full formatting retain the existing route assertion/72-file baseline. No runtime behavior change or browser verification claimed. No cleanup work remains.

- Axios comments (2026-10-15): added requested explanations for cancellation/stale-session guards, auth-endpoint exclusions, shared refresh and replay. Comment-only change; runtime behavior unchanged. Validation: edited-file Prettier and diff whitespace checks; no runtime tests repeated.

- Env helper adoption (2026-10-15): completed at the user's request. All 147 tests, lint, build and env.ts formatting passed. Typecheck retains only the existing /pos route assertion; full formatting retains 72 existing issues and build has its existing chunk warning. No helper/config value changes or new tests required; existing env/helper suites cover the migration. Next action: no env helper migration work remains.

## Session Simplification (2026-10-15)

- Current update: refined proposal explicitly approved and implemented. Custom event bus, counters, generic runner, retry context and remote-generation state removed; existing auth files retained, native query/mutation behavior used, env configuration added. All 147 tests, full lint/build, edited formatting and diff checks passed. Typecheck retains only the /pos route assertion; full formatting reports 72 existing files. Live browser/API verification remains unperformed.

- Proposal refinement: recorded the user's straight-line implementation and minimal-abstraction constraints. Existing-file reuse and elimination of redundant requests/listeners/state writes are explicit review criteria. Application code remains unchanged in this turn; next action is direct implementation confirmation for the revised proposal.

- Status: implementation and automated validation complete; docs/plans/session-simplification.md records the approved design and results.
- Confirmed: keep Zustand; env settings are API URL, timeout 15000ms, auth staleTime 300000ms and cross-tab toggle true.
- Completed: traced existing session helper/boundary/query/store, request recovery, layout/guard consumers, env example and tests; prepared visual design and complete runtime/config/test/record file responsibilities.
- Validation: read-only source inspection and proposal formatting/whitespace checks; no application changes or new runtime validation for this planning step.
- Next action: review the simplified changes and smoke-test real login, refresh, logout, Retry and cross-tab account changes with the backend running. Local .env now includes the three approved settings and remains ignored; API URL preserved. No backend/dependency changes or commits.

## Implementation Plan Review Artifacts (2026-10-15)

- Follow-up: added three Mermaid visuals near the top of docs/plans/session-layouts.md and a closing TL;DR. Updated local skill instructions/template to require TL;DR as the final plan section. No behavior or application implementation changed. Validation: skill validator and git diff --check passed; reviewed diagram/text consistency and final TL;DR placement. Mermaid rendering was not previewed. Next action: user reviews the visual plan; application implementation remains pending explicit approval.
- Status: repository-local skill updated at the user's request; saved Markdown, review visuals, revision consistency, and linked inline presentation are now required.
- Scope: skill and task records only; existing application edits and the pending session-layout plan are preserved. No global skill update or application implementation authorized.
- Validation: skill-creator quick_validate.py passed (Skill is valid); reviewed the scoped skill diff and git diff --check passed. Application checks are unnecessary for this instruction-only update. Next action: use the updated skill for the next plan or requested revision; session-layout implementation still awaits approval.

## Session Layout Refactor (2026-10-15)

- Approval update (2026-10-15): user approved the visual plan. Implementation and automated validation are complete; actual two-tab browser/API smoke verification remains unperformed.

- Status: implemented; plan and implementation record at docs/plans/session-layouts.md, integration documentation at src/features/auth/README.md.
- Goal: simple, scalable session handling and automatic redirects in both layouts with cross-tab handling.
- Confirmed: protection/restoration in both layouts, cross-tab login/logout/account changes, layout-owned redirects with safe return URLs and explicit logout behavior, and retry on temporary failures while retaining known sessions.
- Proposed: one auth session boundary, consistent cache, storage event signaling plus focus/reconnect, stale-response protection, account-data clearing, guard compatibility, and targeted auth regression tests. No cross-tab refresh locking or backend changes.
- Completed: shared session lifecycle/boundary, status/error handling, consistent cache, layout redirects and guards, cross-tab signals/reconciliation, account-cache cleanup, request generation checks, and bounded refresh. Existing unrelated working edits preserved. Breadcrumb test fixtures now supply a verified session.
- Validation: all 131 tests (42 auth additions), full lint, production build, edited-source/plan formatting and diff checks passed. Typecheck retains the existing /pos route-union assertion at src/routes/navigation.test.ts:15. Full formatting check reports existing repository issues; build retains its chunk-size warning. No live browser/backend verification, dependencies, backend edits or commits.
- Next action: with the backend running, verify real cookies, login, refresh, logout, offline/retry and two-tab account changes in a browser; automated tests simulate browser events and use mocked services/adapters.

Updated: 2026-10-11 (Asia/Manila).

## Authorized Work

### W-034: Custom DataTable Planning

- Status: plan drafted at docs/plans/datatable.md; awaiting explicit approval; no application implementation authorized.
- Related: R-046.
- Inspected: existing Filter/FilterChips, keyed Zustand table-query store, useTableQuery, query configuration, filter types/helpers, Users page and test discovery. Existing state combines search/filters/page/limit/sortBy/sortOrder; API parameter mapping currently emits sort_by/sort_order. No reusable table renderer or installed table-engine dependency found.
- Confirmed: server-only processing, page-owned fetching, local table pagination/sorting, filter-only Zustand, adapting existing filter/store, TypeScript sortField/sortType with API mapping, TanStack Table and sample-data example (R-047).
- Confirmed state contract (R-048): page-used reusable table-state hook, search retained in filter store, filter/search/limit changes reset page 1, total row count drives pages, configurable page 1/limit 10/options 10/20/50/100.
- Confirmed interaction contract (R-049): single sorting descending/ascending/unsorted, configurable initial sort, no page reset on sort, typed TanStack columns, optional row clicks/action cells and row selection.
- Confirmed selection/request contract (R-050): caller-controlled multi-select IDs preserved across pages/filters, page-only header checkbox, getRowId and eligibility predicate, initial skeletons, retained refetch rows/updating indicator, errors with optional retry.
- Confirmed filter/presentation contract (R-051): retain Filter behavior/key isolation, clear filter/search on unmount, sync query state to URL, row count left and previous/page-dropdown/next right without limit selector, horizontal scrolling and simple themed table.
- Confirmed URL/example contract (R-052): restore on mount/Back/Forward, clear filter memory on unmount, replace history, tableKey namespacing, primitive/array/date/range codecs and invalid-value correction, clamp out-of-range page, unrouted documented mock async example.
- Final contracts: R-053/R-054 confirm calendar-date strings, page Zod schema/whole-object fallback, sort-field override, request interaction locks, error retention, small-page dropdown, manual/existing-check verification and user sample fields. No material questions remain.
- Validation: inspected shared Select and DatePicker, query client, barrels and Vitest discovery; verified TanStack v8 manual pagination/sorting/selection documentation. DatePicker's date-only UTC parsing requires a narrow compatibility correction if reused. No application checks run for planning-only records.
- Next action: obtain explicit approval of the saved plan before implementation; proposed low-impact API/URL conventions are included for review.

### W-033: Sidebar Collapse Fix and Child Dropdown Reversal

- Status: completed; related R-043 and R-045; R-044 superseded at the user's request.
- Completed: removed child dropdown controls, recursive entry component and grouping-specific tests; restored flat route discovery. Kept collapsed icon centering and label hiding, removed nested button content wrappers and fixed TooltipTrigger class forwarding. Existing Users routes and AuthLayout edits preserved. Updated stale route tests to identify ViewUser and count only the Users link when other static routes exist.
- Validation: 80 tests, typecheck, lint and production build passed. Focused formatting and git diff checks passed. Prior Chrome static previews of real sidebar components verified centered collapsed icons and styled links; no live authenticated/backend flow was exercised. Full formatting previously reported 61 existing issues; build retains its large-chunk warning.
- Next action: no requested dropdown-reversal work remains.

### W-032: Client Breadcrumb Verification and Usage Walkthrough

- Status: client verification and URL normalization completed; current workflow explained at the user's request.
- Related: R-042 and existing R-034 through R-041.
- Completed: added happy-dom client regression coverage for actual ViewUser hook updates and AuthLayout subscriptions, including StrictMode, changed names, cleanup and trailing-slash URLs. Normalized breadcrumb URLs across publishing, lookup and current-page comparison. User subsequently changed ViewUser to display userFullName as a heading; inspected and preserved that change for the walkthrough.
- Validation: before that subsequent content edit, 80 tests, typecheck, lint and build passed; full formatting retained 61 existing issues. Client tests reproduced a missing current-page marker on the Users index and passed after normalization. The reported missing John Doe label did not reproduce with the inspected app components. No interactive browser/backend session was inspected.
- Limitations: user's latest ViewUser content edit was inspected but not revalidated by rerunning the suite during the explanation-only turn; older server-rendering tests contain content-specific expectations that may need updating. Any continuing runtime difference requires the actual URL/displayed breadcrumb.
- Next action: follow the supplied workflow, replace the hardcoded name with an existing query result when user fetching is implemented, and adapt content-specific regression assertions alongside future page edits.

### W-031: Separate Users List and Detail Rendering

- Status: completed; related R-041; resolves the parent-composition limitation recorded in W-030.
- Completed: replaced the parent Users page element with Outlet, moved the list page and its header metadata to an index child, and retained ViewUser under :id. Parent metadata still supplies Users breadcrumb/navigation; existing sidebar link remains enabled.
- Validation: 77 tests passed, including three route-rendering regressions verifying the list at `/users`, detail without list content at `/users/123`, and one enabled Users sidebar link. Typecheck, lint, production build and `git diff --check` passed; edited files formatted. Full formatting retains 61 existing issues; build retains its large-chunk warning.
- Limitations: server-rendered route assertions were used; no interactive browser verification performed. Dynamic name fetching remains the view's responsibility.
- Next action: visually visit `/users` and `/users/123`; no implementation work remains for page isolation.

### W-030: Type-Safe Navigation and Hook Rename

- Status: completed; related R-039 and R-040.
- Completed: defineRoutes preserves literal paths in master/auth/users route arrays; navigation types derive absolute patterns, nested/absolute/index/pathless paths and parameters. Added useSafeNavigate with typed path/params/options and numeric history navigation; excluded global catch-all from destinations. Users now navigates via `/users/:id` with id=123; Sidebar uses the same hook. Updated all initial useTypedNavigate references to the requested name/file. Added navigation documentation, route tests and Vitest discovery; updated contributor test guidance. Preserved the user's live changes including nesting the detail route and adding Hello content.
- Validation: typecheck, lint, 74 tests (63 Zod + 11 navigation), build and focused formatting passed. Compile assertions reject unknown paths, omitted/wrong params, boolean values, static-route params and invalid object destinations. Runtime tests cover encoding, optional parameters, splats and missing/empty required IDs. Vite SSR confirmed Users/ViewUser component identities initialize through the pages barrel. Full formatting check reported 61 existing issues; build retains its large-chunk warning.
- Limitations: no interactive navigation/browser verification. Login's runtime redirect remains native navigation. Current user-edited Users route nests ViewUser under the Users component, but Users has no Outlet; displaying that child requires an Outlet or moving the list to an index route. This existing page-composition issue is outside the navigation typing/rename work and was preserved.
- Next action: import useSafeNavigate for new internal navigation; visually verify `/users/123` and address the parent Outlet/index composition when requested. No requested typing/rename implementation remains.

### W-029: HTML Entity and Character Constants

- Status: completed; related R-038.
- Completed: added src/constants/html-entities.ts with 28 symbols, including hyphen/dashes, apostrophes/quotes, ellipsis, bullets, spacing, HTML-sensitive characters, math/currency and copyright/trademark. Exported TEXT_SYMBOLS, HTML_ENTITIES and HtmlSymbol through the existing constants barrel; included usage semantics in JSDoc. Existing UI unchanged.
- Validation: typecheck, lint, production build and focused formatting passed. Full formatting retains 62 existing issues; build retains its large-chunk warning. No additional runtime tests for these static constants.
- Next action: import TEXT_SYMBOLS for JSX display and HTML_ENTITIES when generating encoded HTML source. No requested work remains.

### W-028: Reuse Existing Page Data for Breadcrumbs

- Status: completed; related R-037.
- Completed: added temporary URL-scoped breadcrumb labels in Zustand and useBreadcrumb(label), with update/unmount cleanup protected by ownership tokens. AuthLayout subscribes to labels and passes them to getBreadcrumbItems as overrides; existing loader/static fallbacks remain. Exported store/hook and updated docs/breadcrumbs.md with page-query reuse, generic item/date labels and lifecycle guidance. No API calls or new dependencies introduced.
- Validation: typecheck, lint, production build and focused formatting passed. One-off Vite SSR assertions verified reactive store updates, label precedence, fallback, separation between user URLs, name updates, stale cleanup protection and final removal of labels/owners. Full formatting retains 61 existing issues; build retains its large-chunk warning.
- Limitations: current Users page remains a placeholder; no live getUser query or detail view exists for end-to-end integration. Hook effect lifecycle was inspected; store/helper behavior was exercised without an interactive browser.
- Next action: in a real view, call useBreadcrumb with a name/date from the existing query before loading/error returns; no loader or extra breadcrumb fetch is required. No requested implementation work remains.

### W-027: Dynamic Breadcrumb Labels

- Status: reusable support completed; related R-036.
- Completed: exported typed BreadcrumbResolver, extended RouteMeta.breadcrumb to accept a callback, and updated getBreadcrumbItems to resolve it from matches with title fallback. Added docs/breadcrumbs.md covering nested users/detail routes, loader data validation, parameter labels and React Query integration. Existing route/page/fetching behavior unchanged.
- Validation: typecheck, lint and production build passed; changed files formatted. One-off Vite SSR/memory-router assertions verified Home > Users > John Doe, updated name/resolved URL after navigating to another user, loader revalidation changing the label, missing-data title fallback and parameter-based labels. Full formatting retains 63 existing issues; build retains its large-chunk warning.
- Limitations: the current Users page is a placeholder and no user-detail route, service or name-fetching contract exists. Dynamic name support was exercised with an in-memory loader, not an actual user endpoint or interactive browser.
- Next action: when a real detail page/service is added, nest it under Users and return the user from its loader using the documented breadcrumb callback. No remaining implementation work for generic dynamic support.

### W-026: Header Visibility and Workspace Breadcrumbs

- Status: completed; related R-033, R-034 and R-035. Continues the interrupted metadata request.
- Completed: changed RouteMeta.header to a boolean with default-visible interpretation; added headerTitle/headerDescription and migrated Users route metadata and AuthLayout. Preserved PageHeader's current user-edited typography-only design. Fixed untyped match.handle access via AppRouteHandle; replaced the unused breadcrumb strings/debugging log with a reusable Breadcrumbs component and matched-route link utility. Workspace top bar now shows breadcrumbs, with wrapping, accessible current-page semantics and focusable ancestor links.
- Validation: typecheck, lint, build and focused changed-file formatting passed; full formatting retains 63 existing issues and build retains its large-chunk warning. One-off Vite SSR/memory-router checks verified Users ancestor/current links, root Dashboard without duplicate Home, nested resolved paths and breadcrumb overrides, default-visible header metadata and explicit header=false. Temporary validation file removed. No interactive browser/screenshot verification performed.
- Next action: visually check `/users` and `/`; set meta.header=false on routes where the global page header should be hidden. No requested implementation work remains.

### W-025: Theme-Matched Page Header

- Status: completed; related R-032.
- Completed: redesigned PageHeader with rounded corners, translucent secondary/card-to-primary gradient, primary accent rail, subtle circular line decoration, responsive Merriweather heading and Geist description. Preserved props, optional-content behavior and route metadata integration; long text wraps and decoration is hidden from assistive technology.
- Validation: typecheck, lint and production build passed; edited component formatted. Full formatting check retains 63 existing issues and build retains its large-chunk warning. No browser visual/screenshot verification performed.
- Next action: inspect the header in the running workspace at mobile/desktop sizes and light/dark themes; no implementation work remains.

### W-024: Route-Based Global Page Header

- Status: completed; related R-031.
- Completed: added typed header/description route metadata and AppRouteHandle; exposed metadata through transformed route handles while retaining other handle properties. AuthLayout reads the deepest active route with useMatches and renders reusable PageHeader above Outlet. Added component/type barrel exports. Header falls back to meta.title; empty descriptions/headers are omitted.
- Validation: typecheck, lint and production build passed. A one-off Vite SSR/memory-router check using a temporary copy of the current transformer (omitting browser-router initialization) verified Users metadata/rendered header, navigation to Dashboard without stale description, nested metadata, preservation of custom handle properties and empty-header omission. Temporary file removed. Full formatting check retains 63 existing issues; edited files formatted. Build retains its large-chunk warning.
- Limitations: no interactive browser/screenshot verification performed. Existing page content was preserved, including its current headings.
- Next action: set meta.header and meta.description on additional feature routes and visually inspect `/users`; no implementation work remains.

### W-023: Users Route Initialization Error

- Status: completed; related R-030.
- Evidence: traced `users.routes -> pages/index -> Login -> components/index -> Sidebar -> users.routes`. A one-off Vite SSR module evaluation with the pages barrel loaded first confirmed the Users route element had an undefined component before the fix; its identity did not match the initialized Users export.
- Completed: changed users/auth route page imports to direct Users/Home modules and master router Login/NotFound imports to direct modules. Preserved existing user changes, route paths/metadata, page barrel exports and sidebar behavior. Formatted edited route files.
- Validation: the same runtime evaluation now confirms Users and Home route elements match their initialized function exports. Typecheck, lint, production build and `git diff --check` passed; full formatting check reported 64 existing issues before formatting the edited router. Build retains its large-chunk warning. No browser navigation or backend verification performed.
- Next action: reload the browser and open `/users`; no implementation work remains for this error.

### W-022: Generic Zod Validation Helpers

- Status: completed; related R-029.
- Inspection: React/TypeScript/Vite, strict root TypeScript configuration and existing aliases, npm lockfile, installed Zod 3.25.76, the sole feature schema (LoginSchema), Form/Zod resolver integration and absence of an existing test runner. Preserved unrelated working-tree edits.
- Completed: all 11 helpers in separate files under `src/helpers/zod`; shared public types and private configuration/message/refinement utilities; public barrel without internal exports; deterministic regex parsing, safe integers/finite numbers, explicit boolean parsing, calendar dates, datetime precision, container policies and validated defaults. Added adjacent usage documentation and one consolidated Vitest spec, dedicated Node test config and `npm test`. Updated repository testing guidance. Adopted compatible helpers in LoginSchema with explicit legacy behaviors and unchanged LoginDto export.
- Validation: 63 tests passed; typecheck passed including output inference and compile-time negative assertions; lint, production build, focused changed-file formatting and `git diff --check` passed. Tests verify previous login parsed values/messages/paths, existing resolver output/errors, shared presence/default behavior, helper constraints/configuration failures, repeated regex parsing, refinement precedence/codes/paths and fatal/type-error execution behavior. Build retains the large-chunk warning. Full formatting check reports 63 existing issues, including records and contributor guidance; edited implementation/configuration files pass focused formatting.
- Compatibility: generic wrong-type text/email errors intentionally use helper messages, documented in the helper README. Existing business messages, password whitespace, email trim/case, unknown-key stripping, field names, form rendering and submission flow are preserved. No Zod or unrelated package upgrade.
- Limitations: no browser/backend login, refresh, logout or guard exercise performed; validation covered schema and resolver behavior, not live API flows. Configured callbacks remain synchronous; async business validation stays outside helpers.
- Next action: use `#/helpers/zod` for new validators with explicit deviations from helper defaults. No requested implementation work remains.

### W-021: More Visible Auth Background Lines

- Status: completed; related R-028.
- Completed: strengthened the grid and extended its fade, increased circular outline contrast, and added three circles, including bottom-left arcs. Dark mode uses brighter emerald line colors. Affects both AuthLayout and NotFound through their shared background.
- Validation: typecheck, lint, production build and edited-file formatting passed. Full formatting check retains 64 existing issues; build retains its large-chunk warning. Browser visual verification not performed.
- Next action: visually inspect line intensity in light/dark mode on the workspace and 404 page.

### W-020: Rename Guest Background

- Status: completed; related R-027.
- Completed: renamed `Atmosphere.tsx` and its component to `GuestAtmosphere`; updated the components barrel and Login consumer. Formatted edited source files.
- Validation: typecheck, lint and production build passed. Full formatting check reports 64 existing issues; build retains its large-chunk warning. Source search confirms all consumers use the new name. No visual behavior change; browser verification not performed.
- Next action: no rename work remains.

### W-019: 404 Redesign and Auth Background

- Status: implementation completed; related R-026.
- Completed: redesigned the standalone 404 page with a large decorative error code, inventory search icon, responsive centered content and a single semantic Go Home link using the existing Button. Added `AuthAtmosphere`, inspired by Atmosphere, and integrated it behind AuthLayout content with a translucent header. Uses existing theme colors for light/dark styling; decoration is static, hidden from assistive technology and ignores pointer input.
- Validation: typecheck, lint, production build, focused edited-source Prettier checks and `git diff --check` passed; build retains its large-chunk warning. Full formatting check reports 65 existing formatting issues, including previously unformatted records.
- Limitations: no browser tooling available for visual desktop/mobile/light/dark verification; no screenshot or live authentication verification performed. Authentication logic and route definitions were not changed.
- Next action: visually inspect the workspace and an unknown URL in the browser at desktop/mobile sizes in light/dark mode.

### W-018: Shadcn Route-Based Sidebar

- Status: implementation completed; related R-025.
- Completed: added official Base Rhea sidebar primitives and missing dependencies without replacing existing Button/Tooltip or adding packages; rebuilt application Sidebar with route links, active styling, branding, login/logout, icon collapse, and mobile link dismissal; wired provider/toggle in AuthLayout. Added typed `meta.sidebar` and `meta.icon`, plus recursive concrete-route link generation from authRoutes.
- Validation: typecheck, lint, production build, focused edited-source formatting checks, and `git diff --check` passed. One-off Node assertions verified index/home, nested/absolute paths, hidden routes, parameter routes, pathless layouts and duplicate URLs. Full formatting check reports 66 preexisting/record/config formatting issues; production build reports its large-chunk warning.
- Limitations: no browser/backend session was available for manual navigation/login/logout, desktop collapse or mobile drawer verification; no screenshot captured.
- Next action: visually verify desktop/mobile navigation and authentication flows against the running API. Configure a future route with `meta: { title: 'View resource', sidebar: false }` to exclude it.

### W-017: Explain Current-User Fetch After Login

- Status: diagnosis completed; related R-024.
- Evidence: traced Login submission/mutation/navigation, query cache writes and current-user query, AuthLayout mount, provider, route/store and Axios handling. Confirmed freshness behavior against official TanStack Query documentation.
- Finding: `setQueryData` seeds the same query key before layout mount; five-minute `staleTime` prevents the immediate mount fetch. Login/refresh also seed a different cache shape from the current-user query result.
- Validation: source inspection and official documentation; no browser/backend reproduction or application checks performed. Application code unchanged.
- Next action: if a fresh request on each AuthLayout mount is desired, propose `refetchOnMount: 'always'`; separately align cache shapes. Implementation awaits a user request.

### W-016: Global Custom Agents

- Status: completed; related R-023 and D-015.
- Completed: installed portable global definitions for `planner`, `implementer`, and `code_reviewer`; removed their project copies; updated `AGENTS.md` references.
- Validation: checked required TOML fields, name/filename match, model/reasoning/sandbox settings, paired instruction delimiters, absence of local duplicates, and `git diff --check`. Live discovery remains unverified until a new Codex session.
- Next action: start a new Codex session and invoke each agent once to confirm discovery and access.

### W-015: Global Implementation Plan Skill

- Status: completed; related R-022 and D-014.
- Completed: extracted the user-supplied `.skill` archive into the global Codex skills directory without changing its content.
- Validation: inspected archive entries and frontmatter; installed file exists and its SHA-256 matches the packaged entry. Codex skill discovery will take effect in a new session.
- Next action: start a new Codex session to use `$implementation-plan` or `/plan`.

### W-014: Fetch Missing Current User

- Status: completed; related R-021 and D-013.
- Completed: `useCurrentUser()` now triggers the existing current-user query when auth store user is null and returns the reactive store value.
- Validation: build, lint, edited-file Prettier check, and `git diff --check` passed. Typecheck remains blocked by existing filename casing conflicts and current `Home.tsx` route-prop errors.
- Next action: no hook work remains for this request. A failed API lookup leaves the user null until a later query retry or remount.

### W-013: Current User Hook

- Status: completed; related R-020 and D-012.
- Completed: replaced the incomplete `use-user.ts` draft with an auth-store selector and exported the hook.
- Validation: lint, build, edited-file Prettier check, and `git diff --check` passed. Typecheck remains blocked by case-only filename conflicts and current `Home.tsx` route-prop errors. Full formatting check reports unrelated existing files.
- Next action: use `useCurrentUser()` in components that need the auth user; resolve the separate `Home.tsx` errors and filename conflicts when requested.

### W-011: Self-Hosted Fonts

- Status: completed; related R-018 and D-011.
- Completed: bundled 32 WOFF2 subset files and normal/italic face declarations for Geist, IBM Plex Sans, and Merriweather; updated font tokens and removed package CSS dependencies.
- Validation: all 32 face file references resolve; build, lint, edited-file Prettier check, and `git diff --check` passed. Typecheck still fails on preexisting case-only filename conflicts in Card, Button, Dialog, and Guard. Full formatting check still reports unrelated existing files.
- Next action: no font work remains for this request.

### W-010: Loader Gradient Background

- Status: completed; related R-017 and D-010.
- Completed: added two soft blurred color fields behind `LoadingScreen` content and removed the hidden Atmosphere layer.
- Validation: build, lint, edited-file Prettier check, and `git diff --check` passed. No browser review was performed.
- Next action: no work remains for this request.

### W-009: Auth Layout Loader

- Status: completed; related R-016 and D-009.
- Completed: added `LoadingScreen`, corrected the loading branch in `AuthLayout`, and removed the unused debug log/import.
- Validation: production build, lint, edited-file Prettier check, and `git diff --check` passed. Typecheck remains blocked by preexisting case-only filename conflicts in Card, Button, Dialog, and Guard. Browser verification was not run because the loading state depends on the current-user API.
- Next action: no loader work remains; separately address the existing filename casing errors when authorized.

### W-008: Simple QueryClient Configuration

- Status: completed; related R-015 and D-008.
- Completed: added one-minute query freshness, one query retry, and explicit no-retry mutation defaults in `src/lib/query-client.ts`.
- Validation: lint and production build passed; edited-file Prettier check and `git diff --check` passed. Build reports a large-chunk warning. Full typecheck fails on existing Card/Button/Dialog/Guard filename casing conflicts; full formatting check reports widespread existing issues (edited file subsequently formatted and checked). Browser flows were not manually exercised.
- Next action: no configuration work remains. Existing casing/formatting issues are outside this request.

### W-001: Planning Agent

- Status: completed; definition installed and persistent records established.
- Priority: current user request.
- Outcome: reusable planning/refactoring agent with persistent requirements and decisions.
- Related: R-001 through R-008; D-001, D-002.
- Completed: inspected contributor instructions, scripts, recent commits, auth services/queries/store/schema, shared Axios handling, routes, layouts, and providers. Created the persistent records, updated `AGENTS.md`, and installed `.codex/agents/planner.toml`.
- Remaining: no setup edits remain. Live discovery and model invocation have not been verified.
- Dependencies: Codex custom-agent discovery and access to the requested model.
- Validation: PowerShell verified the expected TOML structure, required fields, exact model/reasoning values, and record-file existence; `git diff --check` passed. A full TOML parser was unavailable (Python launcher has no installed interpreter); the CLI rejected strict configuration validation for `features`. No application checks ran because application code was unchanged and `node_modules` is absent.
- Next action: start a new Codex session in this repository and request `planner` for the next feature or refactor. Confirm discovery and model access on first invocation; no product task is assumed.

### W-002: Code Review Agent

- Status: completed; definition installed and structure verified.
- Outcome: separate reviewer configured for useful review depth with efficient token use.
- Related: R-009, A-001, D-003.
- Completed: inspected project records, current agent format, auth query/HTTP code, and current official model/reasoning guidance. Added `.codex/agents/code_reviewer.toml` with Sol medium and read-only permissions; documented discovery and persistence handoff in `AGENTS.md`.
- Validation: PowerShell verified the expected TOML structure, required fields, exact model/reasoning, read-only sandbox, and record-file existence; `git diff --check` passed. This was structural validation, not a full TOML parser or live agent invocation. No application code changed; no application review or tests were requested.
- Next action: in a new Codex session, request `code_reviewer` with the desired diff or files. Live discovery/model access remains unverified.

No application feature or refactor is currently authorized or recorded as active. Recent auth-related commits describe past work, not a confirmed current backlog.

### W-003: Architecture-Aware Review Instructions

- Status: completed; structural verification passed.
- Related: R-010, D-004.
- Completed: inspected application entry/composition, auth service/query usage, shared form/mutation helpers, API types, exports, and coding configuration. Added mandatory architecture and local-practice inspection to `code_reviewer` and documented the requirement in `AGENTS.md`.
- Compatibility: reviewer retains Sol medium and read-only permissions. No application code changed.
- Validation: PowerShell verified expected TOML structure, unchanged model/reasoning/read-only settings, and required architecture/practice instructions; `git diff --check` passed. No application checks were needed for these instruction-only changes.
- Next action: invoke `code_reviewer` on a specified change and check its architecture/context note. Live adherence remains unverified until a review is invoked.

### W-004: Planner Implementation Agent

- Status: completed; definition installed and structure verified.
- Related: R-011, R-012, D-005.
- Completed: added `.codex/agents/implementer.toml` with Sol medium, workspace-write permissions, planner handoff inspection, existing-practice preservation, validation, and mandatory clarification/waiting rules. Updated `AGENTS.md` and persistent requirements/decisions.
- Validation: PowerShell verified expected TOML structure, model/reasoning/permissions, and mandatory clarification/authorization instructions; `git diff --check` passed. No application code changed and no application checks ran. Live discovery and behavior remain unverified.
- Next action: invoke `implementer` with an identified planner handoff when implementation is requested. No application plan is currently authorized by this setup task.

### W-005: Short Agent Names

- Status: completed; definitions and references renamed.
- Related: R-013, D-006.
- Completed: renamed files to `planner.toml` and `implementer.toml`, matched their agent names, removed the prefix from role descriptions, and updated project records.
- Validation: checked file/name matching, retained model/reasoning settings, and absence of obsolete references. No application code changed.
- Next action: request `planner` or `implementer` by their new names in the next session. Live discovery remains unverified.

### W-006: Reviewer Architecture Walkthrough

- Status: completed; explanation prepared from source inspection by the user-requested `code_reviewer` agent using GPT-6.1 Sol medium.
- Completed: inspected startup/providers/routing, auth service/query/store/HTTP flows, shared forms/fields/mutation helpers, component layers, table utilities, and coding/style configuration. Recorded observed architecture and distinguished wired flows from unused capabilities.
- Validation: read-only source/caller inspection; no runtime checks or application tests. Reviewer reports `node_modules` absent. No application code changed.
- Open questions: intended authentication policy for home/future inventory screens; expected restoration of an existing session after reload. User answers are not inferred.
- Next action: user confirms/corrects the architecture explanation and answers those product questions before any related implementation is planned.

### W-007: Update Agent Models

- Status: completed; configured settings updated.
- Related: R-014, D-007.
- Completed: set planner to Sol high and implementer to Astra medium; updated current guidance and retained superseded requirements/decisions as history.
- Validation: exact model/reasoning values checked in both definitions. No application code changed. Live model access remains unverified.
- Next action: use `planner` and `implementer` with these settings on their next invocation.

### W-008: Install Implementation Planning Skill

- Status: installed on `main` in both repositories; live discovery remains unverified.
- Related: R-015, D-008.
- Completed: extracted the attached manifest unchanged into `.agents/skills/implementation-plan/SKILL.md` in `inventory-client` and `inventory-server` using GitHub commits.
- Validation: confirmed the archive contains only `SKILL.md`; decoded UTF-8 and parsed required YAML metadata. GitHub confirmed installation commits `2f06511e56fc4da42c9ee08e7020add75854b410` (client) and `293b12a74bc221dcb93191c3cf67e70e0f8518e8` (server). Application checks were not run for this instruction-only installation.
- Next action: pull `main` in each local checkout, start a new Codex session, and request `$implementation-plan` with a coding task to verify live discovery.

## Unapproved Review Candidates

These observations are not implementation commitments or accepted product requirements:

- O-001: `auth.query.ts` writes an `AuthUser` to `authKeys.me()` after login/refresh, while `useCurrentUserQuery` returns `ApiResponse<AuthUser>`. Review cache consumers and establish a consistent shape before proposing a change.
- O-002: `src/routes/index.tsx` imports `./Guard`, while the tracked file is `guard.tsx`. Check compatibility on case-sensitive systems.
- O-003: The home route uses `AuthLayout` but does not set `requireAuth`; the layout itself has no auth check. Confirm intended route access before recommending a guard.

## Future Work Entries

For authorized work, record outcome, status, priority, requirement/decision links, scope and compatibility boundaries, relevant files, acceptance criteria, dependencies/risks, small steps, validation evidence, unresolved questions, and next action. Use only the fields useful to the task.

### Audit Logs Description (2026-10-14)

- Status: completed. Added route header description using existing metadata.
- Validation: 80 tests, lint and production build passed. Typecheck fails on existing filename casing conflicts and route-path assertion; full formatting check reports widespread existing issues. Route file formatted with Prettier. No browser verification performed.
- Next action: no description work remains.

### Audit Logs Sample Table (2026-10-14)

- Status: completed. Added 15 sample events with time, user, action, resource and description; sorting and pagination use existing table state and local rows.
- Validation: all 80 tests, lint, build, edited-source formatting and diff whitespace checks passed. Typecheck remains blocked by existing casing conflicts and route-path assertion. Full formatting check from this session reports existing issues. Browser interactions were not verified.
- Next action: no sample table work remains; live API integration requires a separate request.

### DataTable Instance and Processing Modes (2026-10-14)

- Status: investigating/planning; no application changes made for this refactor.
- Inspected: DataTable props/implementation, useTableState/useTableQuery, AuditLogs and user example/query/mock service, existing DataTable plan.
- Current behavior: shared DataTable already uses manual pagination/sorting; AuditLogs performs local sorting/slicing. Existing user mock simulates server processing locally.
- Next action: clarify instance meaning, client-mode filtering and audit sample source, then present a concrete plan for explicit approval.

- Planning update (2026-10-14): instance and processing choices confirmed. AuditLogs requires real API integration; endpoint, request/response contracts and field mapping are pending. Next action: obtain API contract before completing plan.

- Investigation update (2026-10-14): nearby inventory-server audit controller accepts page/limit only; response helper/interceptor yields data.items and data.pagination.total. Service selects user fields absent from AuditLog schema (which contains id/userId/model/action/payload/createdAt). Backend scope clarification requested before plan completion. No backend edits made.

- Plan ready (2026-10-14): replace individual table state/handler props with table instance; server pass-through default; explicit clientSide processing and predicate; migrate both consumers; fix backend audit projection and integrate real pagination response. Await explicit approval. Existing filename casing, route type assertion and widespread formatting failures are separate validation limitations.

- Implementation update (2026-10-14, approved): completed the table-instance API, explicit client processing, user example migration, live AuditLogs query/service integration and inventory-server audit projection fix. Documentation: src/components/datatable/README.md. New focused tests cover server pass-through, client processing/reset/clamp, visible-page selection, Axios contract, audit request errors/retry/URL page correction, and backend projection/pagination.
- Validation: client tests passed (84 initial, plus 2 new AuditLogs integration tests separately); client lint/build passed. Backend all 92 tests, lint and build passed. Client typecheck reports only existing Card/Button/Dialog/Guard casing and navigation route-union assertion errors. Final full suite/format checks pending below.
- Limitations: real browser/live database API execution was not performed; component interaction tests exercise the flows with mocked services. Backend docs/agent records do not exist, so cross-repository progress is recorded here. No schema migration or shared Axios change.
- Review handoff: inspect DataTable/types, both consumers, new audit feature service/query, backend audit service and focused tests against the approved requirements above. Public prop change is intentional: replace state/setPage/setLimit/setSort with table; client mode requires complete rows and omits totalCount. Preserve unrelated working edits in both repositories.
- Final validation (2026-10-14): all 86 client tests passed; full client lint and build passed, and focused lint after the last tests passed. Backend 92 tests, lint, build and edited-file formatting passed. Edited client source/documentation formatting and both repositories' diff whitespace checks passed. Final client typecheck still has only the five baseline errors; full formatting reports 168 existing/record formatting issues. Build retains the existing large-chunk warning.
- Status: implementation and automated validation complete; live browser/API smoke verification remains unperformed. Next action: review the scoped changes and, with the backend/database running, verify Audit Logs loading and pagination in the browser. No commits or unrelated cleanup performed.

### Audit Query and Service Simplification (2026-10-14)

- Status: completed at the user's direct request. Replaced the custom retained-data query wrapper with direct useQuery, AUDIT_LOGS_QUERY_KEYS.all(params), typed caller options and GET_ALL(params = {}). AuditLogs destructures the returned result and chooses enabled/keepPreviousData through options. The service remains shared Axios and returns response.data. Page correction remains outside the query.
- Compatibility: custom last-success retention after new-page failures and explicit cancellation forwarding are superseded. Native TanStack errors clear placeholder rows; retry and server page correction remain covered. No DataTable or backend edits in this follow-up.
- Validation: all 86 tests passed; final audit-focused tests (3), lint, build, edited-file formatting and diff whitespace checks passed. Typecheck retains the same five baseline casing/route-union errors. No live browser/API smoke test performed.
- Next action: review the simplified feature query/service and page integration; no implementation work remains for this follow-up.

### Shared Query Types (2026-10-14)

- Status: implemented at the user's request. Added exported QueryParams and migrated audit key/hook/service. Removed audit-specific options/response type aliases and used TanStack UseQueryOptions inline with Partial to permit {}. Kept required response pagination and generic select inference; no runtime changes or auth migration.
- Validation: audit service/page integration tests (3), focused ESLint and typecheck run. Tests/lint pass; typecheck reports only the same five existing casing/navigation assertion errors. Final formatting/build results follow.
- Final validation: edited-source Prettier, git diff --check and production build passed (existing chunk-size warning). Type-only follow-up preserves prior runtime behavior; live UI verification not repeated. Next action: review shared type exports and audit type migration; no implementation work remains.

- Cleanup (2026-10-14): useAuditLogsQuery now takes params and enabled=true. Removed options generics/imports and caller options object; retained pagination placeholder behavior inside hook and updated usage docs. Validation: all 86 tests, lint, build, edited-source formatting and diff checks passed. Typecheck retains baseline errors. No broader cleanup or live browser verification.

- Demo Filter (2026-10-14): Added Action/Model controls using existing Filter/Select, table schema and key, refresh and demo limitation copy. Kept server rows unchanged. Restored fresh-response checks/dependencies for total acceptance and fetching indicators after lint flagged the current loading condition. Validation: 86 tests, lint and build passed; typecheck retains known baseline failures. Browser verification not performed. Demo filters intentionally do not affect endpoint results; backend filter support is future work.

### Audit Filter Parameters (2026-10-14)

- Status: client wiring complete; backend support explicitly deferred by the user's latest correction. AuditLogs passes table.params to the existing query hook. Filter already writes applied values to Zustand; useTableQuery already resets pagination and combines filters into params. No new Filter/store/hook behavior or client-side row processing was added.
- Reverted only this follow-up's backend controller/schema/service filter edits; prior projection work and unrelated backend edits preserved. Shared QueryParams additions for action/model were also removed because table.params already carries endpoint filters.
- Validation so far: 4 audit tests pass, including applied filter changes -> request/query key, page reset, clear filters, and unchanged rendering of server-supplied rows. Typecheck retains five baseline errors. Final checks follow.
- Final validation: all 87 client tests, lint, production build, edited formatting and diff whitespace checks passed. Existing chunk-size warning and five typecheck errors remain. No live backend/browser filter verification claimed; backend filtering remains deferred. Next action: implement backend predicates when requested, resolving stored controller-model values at that time.

### Empty Audit Page Reset (2026-10-14)

- Status: implemented. Removed AuditLogs acceptTotal effect and delegated empty-page reset to DataTable using confirmed current response success. Server empty pages return to page 1, including deletion/refetch; loading, fetching, errors and placeholder data do not trigger resets. Client processing/clamp and existing user example remain unchanged.
- Validation: all 89 tests passed, including explicit reset guards, out-of-range server page returning to page 1 and deletion emptying a page on refetch. Final lint/typecheck/build/format results follow.
- Final validation: 89 tests, full lint, build, edited formatting and diff whitespace checks passed. Typecheck retains the same five baseline errors; build retains its existing chunk warning. No live browser/deletion flow was run; mocked query integration verifies empty response after refetch. Next action: review the reusable success-status contract; no page-reset implementation work remains.

### Remove Automatic Server Page Reset (2026-10-14)

- Status: cleanup implemented as requested; specific successful-mutation integration awaits identification of the mutation. No audit delete mutation exists in the current client. Removed server reset and success-only prop/status wiring; updated docs and tests to reflect unchanged server pagination on empty responses and invalidation.
- Validation so far: all 89 tests pass, including query invalidation refetching the same page and preserving URL state. Client-only clamp remains covered. Final checks follow.
- Next action: user identifies the mutation to invalidate from; if it must also return to page 1, explicitly update that table state in mutation success handling.
- Final cleanup validation: all 89 tests, full lint, production build, edited formatting and diff whitespace checks pass. Typecheck retains the five baseline errors; no live browser/mutation verification performed. No new mutation or API was added; integration remains pending the user's identification of its target.

- Table overlay (2026-10-14): completed replacement of above-table status with centered busy overlay over table viewport. Tests 89/89, lint, build, edited formatting and diff checks pass. Typecheck retains baseline errors. No browser visual verification performed; no overlay work remains.

- Error overlay (2026-10-14): completed; custom error content and retry preserved. All 89 tests, lint/build passed; edited formatting and diff checks run. Existing typecheck baseline unchanged; browser visual verification not performed.

- Overlay redesign (2026-10-14): completed matching loading/error presentation to LoadingScreen. 89 tests, lint/build passed; edited format/diff checks run. No browser visual verification; existing typecheck baseline remains.

### Impeccable Init (2026-11-09)

- Status: awaiting product interview answers. Read-only inspection found inventory/POS branding, working auth/audit integration, and placeholder dashboard/user pages; clinic purpose is unconfirmed.
- Validation: context launcher succeeded; repository/source inspection only. No application code changed or application tests run.
- Next action: use confirmed answers to write PRODUCT.md and record the selected workflow; configure live entry when applicable.

### Impeccable Init: Completion (2026-11-09)

- Supersedes the waiting status above: product interview answers are confirmed and recorded in PRODUCT.md. Created shared code-first workflow configuration and live-entry configuration for index.html; preserved the local configuration and existing working changes.
- Scope: documentation/configuration only. No application code, backend, CSP source, or visual-world record changed; no server was launched.
- Validation passed: both JSON files parse; the selected workflow and live-config values match the confirmed choices; PRODUCT.md has schema 1 and platform `web`; the workflow setting is absent from PRODUCT.md; index.html contains the insertion anchor; scoped `git diff --check` is clean. Git ignore checks confirm the new shared records remain trackable and config.local.json remains ignored. Application tests are not applicable to this documentation/configuration change and were not run.
- Unresolved: detailed role permissions, clinical catalogs/API contracts, and Hostinger compatibility. The current frontend has auth/audit integration and placeholder dashboard/user pages, not verified clinic workflows or verified Sanctum/backend behavior.
- Next action: choose a scoped dashboard or user-management task, resolve its contracts and permissions, then plan before application implementation. Live visual iteration can be started separately when requested.

### DataTable Sync From faculty-evaluation-frontend (2026-11-09)

- Status: implemented. Updated DataTable, DataTablePagination, datatable types, table-query helpers, useTableQuery/useTableState and the README; added DataTableActions, Dropdown, ui/dropdown-menu, helpers/list-return, the `datatable-loading` keyframe in index.css, and barrel exports.
- Validation: `npm test` 147/147 passed; ESLint and Prettier clean on changed files. Typecheck shows no errors in changed files; remaining errors are pre-existing from the in-progress shadcn UI changes (lowercase `ui/button`/`ui/tooltip` imports, `scroll-area`, `DateTimePicker`, `Tooltip`) and `routes/navigation.test.ts`. Production build passes (existing chunk-size warning only). Browser verification not run.
- Next action: fix the casing conflicts in `ui/sheet`, `ui/sidebar`, `ui/toast`, `ui/calendar` imports, then check row actions, the Clear Filters button and the loading shimmer in the Audit Logs page.

### Light Theme, Fonts, Icon and Status Colours (2026-11-09)

- Status: implemented.
- Validation: `npm test` 147/147; production build passes and the bundle contains the new status utilities, Nunito and Fraunces, with no `dark:` rules. ESLint clean on changed files; Prettier applied. Typecheck shows only the same pre-existing errors (ui/button and ui/tooltip casing, scroll-area, DateTimePicker, Tooltip, navigation.test). No in-browser visual check was possible in this session.
- Unresolved: Login page still contains POS/inventory copy; the 404 page has an uppercase eyebrow label; the brand icon choice (Baby) needs user confirmation.
- Next action: check the screens in a browser (sidebar, login, a form with showDirty, dropdown menus, toasts), then run `/impeccable clarify src/pages/Login.tsx`.

### Auth Response Envelope Normalization (2026-11-10)

- Status: implemented in `src/features/auth/auth.service.ts`. Login, refresh and ME now normalize supported user response envelopes before session application; malformed payloads throw into the existing retryable query error path.
- Validation: source and documentation diff inspected; tests and build were not run.
- Next action: retry the affected page against the configured API. If the service returns a different user shape, inspect its response and add that explicit contract.

### Clinic Backend Alignment Plan (2026-11-10)

- Status: approved and in implementation per `docs/plans/backend-auth-session-alignment.md`. Earlier generic response normalization is superseded as the intended design.
- Confirmed scope: Sanctum auth/session alignment with `lying-in-clinic-backend`, shared `ApiResponse`/`PaginateResponse`/`MessageResponse`, Audit Logs migration, feature barrels and structural recommendations. Deployment uses separate frontend/API origins on the same site.
- Evidence: backend source and live `http://localhost:8000/docs/openapi.yaml` inspected. Auth uses numeric user IDs, resource envelopes, CSRF bootstrap and 204 logout; no refresh endpoint exists. Audit source permits null subject types and empty-array change values beyond the documented schema.
- Validation: planning/source and API documentation inspection only; application tests and browser auth flows not run in this planning turn.
- No material scope questions remain. Plan includes exact response contracts, bounded 419 reconciliation without mutation replay, numeric user IDs, feature-owned auth types, explicit barrels and regression/browser validation.
- Revision: added the four reusable feedback states, PendingState modal/card/page variants, bounded auth/DataTable adoption, accessibility and responsive visual validation. User selected branded vertical loading with static clinic icon and separate small spinner; rotating logo ring/glows will be removed during approved implementation.
- Next action: user reviews `docs/plans/backend-auth-session-alignment.md` and approves or requests revisions. Application source was not changed in this planning turn.

### Backend Alignment Execution (2026-11-11)

- Authorized: user explicitly requested implementation of the saved backend alignment plan and Impeccable for UI.
- In progress: exact resource contracts, Sanctum session transport and audit migration; bounded feedback-state UI in parallel.
- Baseline: all 147 tests pass. Typecheck already fails on casing, DateTimePicker/Tooltip/scroll-area and navigation assertions; full formatting check reports widespread existing drift. Preserve unrelated files.
- Next action: complete scoped implementation, regression checks and browser verification.

### Backend Alignment Delivery (2026-11-11)

- Implementation finished for the authorized plan: Sanctum CSRF/direct auth endpoints, strict numeric UserResource schema/cache, void logout, no refresh or replay, guarded 419 recovery, backend Audit Logs filters/resource pagination, explicit feature barrels and reusable feedback states with bounded auth/DataTable adoption.
- Added regression for an in-flight focus ME after CSRF recovery fails; ME is canceled while the CSRF prerequisite remains unresolved, so Retry cannot disappear. Independent auth concurrency review confirmed the fix and found no further issues in its scope.
- Automated evidence: all 179 tests pass; production build passes with the existing chunk-size warning; changed-source ESLint and changed-file Prettier pass. Full typecheck retains only baseline casing, DateTimePicker/Tooltip/scroll-area and navigation assertion errors. Full lint retains baseline skill parser and calendar/sidebar import errors; full formatting has existing repository drift.
- Preview evidence: isolated docs/feedback-preview.html and TSX entry return HTTP 200 through Vite. DOM tests cover feedback semantics, retry/disabled behavior, compatibility, table slots/retained rows and real Login backend 422 field messages. No rendered screenshot/accessibility claim.
- Unverified: CUA browser/native host unavailable; fallback browser packages/cache absent in inspected common paths. Responsive/contrast/reduced-motion/keyboard rendering checks remain pending. Authenticated cookie/CORS, two-tab and live admin/staff checks explicitly deferred by user steering.
- Next action: review the saved isolated preview when browser access is available; resume live auth validation when requested. No backend/env/dependency changes, commits or pushes.
- Configuration check: ignored local `.env` has an obsolete API prefix. It was not edited. Set `VITE_API_BASE_URL=http://localhost:8000/api/v1` and restart Vite before live backend verification.

### Login Reference Recreation (2026-11-11)

- Status: implemented in Login.tsx and scoped Login.css, using the supplied login-baby.png. CLINIC sits above the existing floating form on a white canvas; large baby cutout anchors the right edge. Narrow screens reserve image space below the form.
- Validation: all 179 tests pass, production build passes with existing chunk warning, Login.tsx ESLint and scoped Prettier pass, and diff whitespace check passes. Typecheck retains existing casing/component/route errors; full lint retains 15 existing errors and full formatting reports 236 existing files.
- Browser verification: browser host unavailable; native browser preview was stopped because Computer Use could not verify the current browser URL. No rendered desktop/mobile or keyboard claim is made.
- Removed the unused generated clinic-room copy from public/images; its original remains in the generated-images folder. The user-supplied baby asset is preserved.
- Next action: inspect /login at desktop/mobile widths when browser access works; no auth, backend, or unrelated application edits are required for this layout.
- Follow-up: moved all login styling into responsive Tailwind classes directly in Login.tsx and removed Login.css/import, as requested. Preserved current image height and form behavior. Production build, Login.tsx lint/format and scoped diff checks pass; existing chunk-size warning remains. No runtime logic changed; prior 179-test result was not rerun for this styling-only conversion. Rendered browser verification remains pending.

### Split Login Redesign (2026-11-11)

- Implemented latest reference with user-directed form on the left and supplied login-background.png on the right. Restored full clinic brand, welcome heading, compact Sign in action and administrator-access guidance. All styling stays in Tailwind; responsive layout stacks the image below the form.
- Validation: production build, Login.tsx ESLint/Prettier and 21 auth/layout tests pass; existing bundle-size warning remains. No new runtime authentication logic. Rendered browser checks remain unverified because the prior browser access attempt was blocked by URL verification.
- Next action: inspect /login at desktop/tablet/mobile widths when browser access is available. No commit or backend change.
- Fullscreen revision: photograph covers the entire login screen behind an inset, rounded and bordered white form section on the left. All styling is inline Tailwind. Production build, scoped ESLint/Prettier and diff checks pass; existing bundle warning remains. Styling-only change; auth tests were not repeated. Browser rendering remains unverified.
- Flexbox correction: replaced the page grid with responsive flex-col/md:flex-row, a 47.5% desktop form basis and a flexible image-copy region. Preserved current user edits to overlay opacity, form width and padding. Build and scoped lint/format pass; no auth logic changed or tests repeated.

### Configurable Branding (2026-11-11)

- Implemented validated env-backed app name, optional short name, welcome/login/access copy, multiline tagline, image-panel description, copyright owner and workspace label. Login, sidebar/accessibility labels and browser title consume configuration. Defaults are centralized; .env.example and README document rebranding.
- Validation: 15 env/branding tests pass. Full suite: 183 pass, 1 fails because the pre-existing user-edited Login handler no longer maps backend 422 errors into fieldErrors; that handler is preserved. Scoped ESLint passes after fixing Vite config typing; scoped formatting passes. Typecheck retains existing casing/component/navigation errors.
- Custom-brand production build passed and generated Northside &amp; Care as the escaped HTML title. Default production build restored afterward. Existing chunk warning remains; browser rendering is unverified.
- Next action: set desired branding variables in local/deployment env, then restart Vite or rebuild. Resolve the unrelated Login 422 regression separately. No local secrets/env files, backend, dependencies, commits or pushes changed.
