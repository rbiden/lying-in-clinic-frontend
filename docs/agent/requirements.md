# Requirements

## Backend Auth and Response Alignment (2026-11-10)

- Mandatory, planning only: align auth/session with the actual `lying-in-clinic-backend` contract. Inspect that backend as the source of truth.
- Mandatory: adjust or create `ApiResponse`, `PaginateResponse`, and `MessageResponse`; account for their existing consumers.
- Mandatory: every feature must have its own barrel `index.ts` file. Include structure improvement recommendations in the plan.
- Authorization update (2026-11-10): user approved `docs/plans/backend-auth-session-alignment.md`; implementation, focused regressions, and planned validation are authorized. This supersedes plan-only status above.
- Confirmed: target separate frontend/API origins on the same site; exact hostnames remain deployment configuration values.
- Confirmed: include Audit Logs alignment with backend event/date filters, pagination, actor ID and subject fields.
- Source supplied by user: local API documentation at `http://localhost:8000/docs#/`; cross-check its OpenAPI schema against the backend source.
- Scope extension: add reusable `ErrorState`, `LoadingState` using a spinner, `PendingState` using skeletons with `modal`, `card`, and `page` variants, and `EmptyState`. Maximize existing shadcn components and Tailwind utilities. This extends the proposed plan; it is not implementation approval.
- Follow-up, confirmed direction: redesign loading with a branded vertical status: static clinic icon above the heading, small spinner beside the status text below; remove the rotating logo ring and glows. Retain the current light theme.
- Supersedes the previous broad response-normalization direction below. Preserve existing edits until implementation is approved.

- Session response normalization (2026-11-10, superseded by Backend Auth and Response Alignment): previous implementation accepted multiple auth response envelopes. This was an implementation choice, not a user-confirmed backend contract; the new plan must replace it with the inspected clinic backend contract.

- Session marker cleanup (2026-10-15): user requested simplifying the manual marker validation in readSessionChange. Use existing Zod helpers/schema file and preserve accepted marker shape, reasons and null on invalid input.

- Session query predicate (2026-10-15): user requested Array.includes in the auth.session.ts removeQueries predicate. Apply to both account-change and logout cleanup.

- Auth hook cleanup (2026-10-15): user explicitly requested removal of unused options parameters in auth.query.ts. All four hooks take no arguments; retain internal mutation pausing and startup verification.

- Env helper adoption (2026-10-15): user explicitly requested src/lib/env.ts use the existing src/helpers/zod helpers. Preserve env defaults, coercion, blank rejection, strict true/false strings and unknown Vite-key stripping.

## Session Simplification (2026-10-15)

- Authorization update: user explicitly approved the refined simplification proposal on 2026-10-15. Application refactoring and the confirmed env configuration are now authorized; earlier pending-approval notes are superseded.

- Latest mandatory constraints: optimized, straightforward implementation; maximize reuse of existing files; extract abstractions only when a function is too long. Do not replace removed machinery with new wrappers or speculative frameworks. This is recorded as refinement of the proposal; explicit implementation confirmation remains pending.

- Mandatory, proposal first: user considers the implemented session approach overengineered; propose every affected file and its purpose before refactoring. Preserve existing behavior until a changed contract is explicitly accepted. Prior implementation approval does not authorize this new refactor.
- Confirmed: keep Zustand and simplify session machinery; do not switch to React Query-only session state.
- Confirmed env configuration: existing VITE_API_BASE_URL plus VITE_API_TIMEOUT_MS=15000, VITE_AUTH_STALE_TIME_MS=300000 and VITE_AUTH_SYNC_TABS=true. Implementation awaits approval of docs/plans/session-simplification.md.

## Implementation Plan Review Artifacts (2026-10-15)

- Mandatory: update the repository-local implementation-plan skill at .agents/skills/implementation-plan/SKILL.md to generate visuals and Markdown for reviewing plans. Source: explicit user request; this authorizes the skill edit, not application implementation.
- Follow-up requirement: add visuals to the existing session-layouts plan and require a TL;DR as the last section of future plans. User preference: prioritize visual review over long prose. Apply the closing TL;DR to the revised session plan as well; application implementation remains unapproved.

## Session Layout Refactor (2026-10-15)

- Authorization update: user explicitly approved docs/plans/session-layouts.md on 2026-10-15. Implement the approved plan, including targeted regression tests; this supersedes earlier planning-only/pending-approval entries for this refactor.

- Mandatory, planning only: prepare an implementation plan for session handling and automatic redirects in GuestLayout and AuthLayout, including cross-tab session handling associated with AuthLayout. Keep the result simple and scalable. Source: user's implementation-plan request and follow-up to start planning.
- Authorization: read-only application investigation and planning records only; application implementation requires approval of the completed plan. The earlier request to wait is superseded only for planning.
- Confirmed by the user's clarification replies: protect all AuthLayout descendants, restore sessions in both layouts with LoadingScreen, synchronize login/logout/account changes with a listener above both layouts, centralize redirects in layouts, restore safe internal return URLs with / fallback, explicit logout to /login without return URL, and retain known sessions with a retry screen for transient failures.
- Implementation details and validation are in docs/plans/session-layouts.md; the later explicit approval supersedes the initial planning-only status. Implementation and automated checks are complete; live browser verification remains pending.
- Preserve existing working edits in GuestLayout.tsx, Login.tsx, and Sidebar.tsx.

Updated: 2026-10-11 (Asia/Manila).
Source: the user's planning agent request in this session.

## Mandatory Requirements

- R-054 (active, planning only): Store/schema dates are YYYY-MM-DD strings and ranges are `{ from?: string, to?: string }`. Invalid URL filter values reset the whole filter object to validated page defaults. Disable row callbacks during refetch and after refetch errors until current data succeeds. Unrouted example uses users, name search, status and joined-date range, selection and View action. Source: user's final clarification batch on 2026-10-13.

- R-046 (active, planning only): Plan a custom reusable DataTable whose responsibilities cover page, limit, sortField and sortType, with filters handled by a separate component through Zustand. Source: user's explicit implementation-plan request on 2026-10-13. Ask all material component questions and resolve confusion without assuming features; implementation requires approval of the completed plan.

- R-047 (active, planning only): Confirmed DataTable foundations from interactive answers: server-only pagination/sorting; page query hook fetches and passes rows/request status; Zustand holds only filters while the table owns pagination/sorting; adapt the existing Filter and store; use sortField/sortType in TypeScript with separate API mapping; TanStack Table engine with custom UI; deliver reusable component and sample-data example. Source: user's selections on 2026-10-13. State-to-query bridge and remaining behavior contracts are not yet decided.

- R-048 (active, planning only): A reusable page-used table-state hook owns pagination/sorting and supplies DataTable state/handlers. Keep search with Filter in Zustand. Applied filter/search changes and limit changes reset page to 1. DataTable receives total matching row count and calculates pages. Defaults: page 1, limit 10, options 10/20/50/100, configurable per table. Source: user's second interactive answer batch on 2026-10-13; resolves R-047's state-to-query bridge.

- R-049 (active, planning only): Single-column sorting cycles descending, ascending, unsorted; initial state unsorted with configurable initial field/direction; sort changes preserve current page. Accept typed TanStack column definitions with custom headers/cells. Provide optional whole-row click callback and custom action cells. Include row selection in the first version; selection behavior remains to be clarified. Source: user's third interactive answer batch on 2026-10-13.

- R-050 (active, planning only): Multiple checkbox selection, header select-all limited to selectable current-page rows; preserve selected IDs across page/filter/search changes. Caller controls selected IDs and receives changes. Require getRowId and support per-row selection eligibility. Show skeletons for initial loading, retain rows with updating indicator during refetch, and display errors with optional retry. Source: user's fourth interactive answer batch on 2026-10-13.

- R-051 (active, planning only): Retain existing Filter modes, Apply behavior, chips and 300ms debounced search; retain tableKey isolation; clear filters/search on unmount; synchronize filters/search and pagination/sort with URL (restoration/serialization to be clarified). Pagination footer: row count left, previous/next and a Page X of Y page-selection dropdown right, no page-size selector in this version. Narrow screens scroll horizontally; use existing theme/fonts/primitives with a simple table and subtle row separators. Source: user's fifth interactive answer batch on 2026-10-13. The no-selector choice supersedes visible limit-option controls while retaining configurable limit.

- R-052 (active, planning only): Clear filter memory on unmount but restore URL values on mount and Back/Forward; replace history entries for all changes; namespace URL parameters by tableKey. Support primitive/array filters plus dates and date ranges, validate invalid URL values with fallback defaults and correct the URL. If total count invalidates the page, navigate to the last valid page and request again. Deliver an unrouted example source/documentation using a local mock async service and page query hook; no backend integration. Source: user's sixth interactive answer batch on 2026-10-13.

- R-053 (active, planning only): URL dates are calendar YYYY-MM-DD without timezone conversion; each page supplies a Zod filter schema. Server sortField defaults to column ID with per-column override. Disable pagination/sorting/selection during requests. Refetch failure retains rows with error/optional retry. Empty/error content has defaults and caller React overrides. Page dropdown lists every page (small expected page counts). Validation uses existing checks and manual verification only, without adding automated tests. Source: user's seventh interactive answer batch on 2026-10-13.

- R-045 (active): Revert the dropdown child-navigation changes. Source: user's follow-up on 2026-10-13. Restore flat sidebar navigation and preserve the earlier collapsed-sidebar fix and unrelated edits.

- R-044 (superseded by R-045): Group sidebar child routes under collapsible parent items with a left-border design, retaining existing route visibility, unavailable-item, navigation and active-state logic. Source: user's direct request on 2026-10-13 referencing Users children.

- R-043 (active): Fix the collapsed sidebar shown in the supplied screenshot: center visible icons and prevent clipped navigation labels/overflow. Source: user's direct UI correction request on 2026-10-13. Preserve expanded navigation and route behavior.

- R-042 (active): Investigate and correct the reported missing John Doe label from useBreadcrumb in ViewUser. Source: user's runtime report on 2026-10-13. Verify client effect/subscription behavior, not only server rendering.

- R-041 (active): Render the user detail page without the Users list component when visiting the child :id route. Source: user's direct correction request on 2026-10-13. Preserve the Users sidebar link and breadcrumb ancestry.

- R-040 (active): Rename useTypedNavigate and its file/consumers to useSafeNavigate. Source: user's follow-up on 2026-10-13 while R-039 implementation was finishing. Keep navigation behavior and types.

- R-039 (active): Make navigation type-safe with valid paths derived from all configured routes. Source: user's direct request on 2026-10-13 referring to Users navigation. Preserve history-delta navigation; validate parameters for dynamic route patterns and avoid router initialization imports in consumers.

- R-038 (active): Create shared constants for HTML entities/codes including hyphen, apostrophe and other common symbols. Source: user's direct implementation request on 2026-10-13.

- R-037 (active): Support dynamic breadcrumbs using Zustand or an equivalent approach that reuses the view's existing getUser/data query without a separate API fetch. Source: user's request on 2026-10-13. Retain generic labels (user/item names or formatted dates) and existing loader/static support.

- R-036 (active): Support dynamic breadcrumb labels such as Home > Users > John Doe. Source: user's request on 2026-10-13. Existing repository has no user-detail page or user service; implement reusable label resolution and document nested-route/data integration without inventing an API contract.

- R-035 (active): Fix and complete the AuthLayout breadcrumb mapping, create simple breadcrumbs and replace the Inventory workspace label. Source: user's direct implementation request on 2026-10-13. Continues pending R-034.
- R-034 (active): Change RouteMeta.header to an optional boolean that defaults to true for display; add headerTitle and rename the route description field to headerDescription. Source: user's request on 2026-10-13 before interruption. Supersedes the string-header/description metadata names in R-031; keeps the global page-header behavior.

- R-033 (active): PageHeader must use an open layout without card-like design. Source: user's rejection of the initial R-032 design on 2026-10-13. Retains R-032's palette/font direction and supersedes its panel-style implementation choice.

- R-032 (active): Redesign PageHeader with primary/secondary colors, matching the existing UI and fonts. Source: user's direct visual implementation request on 2026-10-13. Preserve header/description props and global route integration.

- R-031 (active): Make route `meta.header` and `meta.description` accessible to AuthLayout for a globally reusable page header. Source: user's direct implementation request on 2026-10-13 referring to users.routes.tsx. Active-route metadata must update with navigation.

- R-030 (active): Fix `Cannot access 'Users' before initialization` when registering the Users route. Source: user's runtime error report on 2026-10-13. Preserve route paths, page content and navigation behavior.

- R-029 (active): Implement the 11 synchronous, framework-independent Zod helpers described in the user's pasted request under `src/helpers/zod`, with shared typed configuration, deterministic validation, validated defaults, message/refinement policy, public exports, one consolidated test file, concise documentation, equivalent existing-schema adoption and full verification. Source: pasted request on 2026-10-13. Preserve form behavior and existing exports; no unrelated dependency upgrades.

- R-028 (active): Add more lines or increase existing line visibility in `AuthAtmosphere.tsx`. Source: user's direct visual adjustment request on 2026-10-13.

- R-027 (active): Rename `Atmosphere.tsx` and its component to `GuestAtmosphere`, updating consumers. Source: user's direct request on 2026-10-13.

- R-026 (active): Redesign `NotFound.tsx` and create a background for `AuthLayout` inspired by `src/components/background/Atmosphere.tsx`. Source: user's direct implementation request on 2026-10-13. Exact visual composition is an implementation choice.

- R-025 (active): Replace the application Sidebar with shadcn sidebar composition, reuse existing components, derive navigation items from `src/features/auth/auth.routes.tsx`, and support excluding routes such as resource detail pages from navigation. Source: user's implementation request on 2026-10-12.

- R-024 (active): Explain why `useCurrentUserQuery()` in `AuthLayout` does not fetch immediately after login. Source: user's diagnostic question on 2026-10-12. Scope: investigate and explain; no application implementation requested.

- R-023 (active): Make the user's project-defined agents and subagents available globally. Source: user's direct request on 2026-10-11. Applies to the three custom agent definitions in this repository; repository-specific instructions remain here.

- R-022 (active): Install the user-supplied `implementation-plan.skill` globally for Codex. Source: user's direct request on 2026-10-11. The packaged skill content is treated as data for installation, not as instructions for this task.

- R-021 (active): `useCurrentUser()` starts with a null user and fetches the current user from the API when that store value is null. Source: user's explicit follow-up on 2026-10-11. Extends R-020.

- R-020 (active): Continue the incomplete `src/hooks/use-user.ts` implementation. Source: user's direct follow-up on 2026-10-11. The current user should come from the established authentication state.

- R-018 (active): Download the application's fonts, serve them locally through `@font-face`, and include all available weights and normal/italic styles. Source: user's direct implementation request on 2026-10-11.

- R-017 (active): Add a blurred gradient background to `LoadingScreen`. Source: user's direct visual change request on 2026-10-11.

- R-016 (active): Improve the loader shown by `AuthLayout` while the current-user request is pending. Source: user's direct implementation request on 2026-10-11. Acceptance: a readable loading component appears during loading and the page renders after loading.

- R-015 (active): Add a simple configuration to `src/lib/query-client.ts`. Source: user's direct implementation request on 2026-10-11. Exact default values are implementation choices.

- R-002 (active): Inspect relevant code and instructions before recommendations; turn requests into actionable plans. Plan by default and implement application changes only when requested.
- R-003 (active): Track requirements, acceptance criteria, active refactors, feature plans, priorities, dependencies, decisions, unfinished work, and scope changes using existing conventions or the four requested records.
- R-004 (active): Read persistent records and relevant instructions at session start. Update meaningful changes, completed work, and the next action before ending. Disclose inaccessible storage and provide a saveable summary; never claim unretrievable memory.
- R-005 (active): Record explicit rules promptly. Distinguish requirements, preferences, assumptions, and proposals. Apply requirements throughout; do not promote assumptions without agreement. Mark replaced requirements superseded and link replacements. Respect instruction hierarchy and latest explicit user revisions; ask about unresolved material conflicts. Never store secrets.
- R-006 (active): Feature plans cover the problem/outcome, acceptance criteria, existing behavior/code, approach, meaningful alternatives, dependencies, risks, compatibility, implementation steps, and validation. Scale detail to the task.
- R-007 (active): Refactors define the problem, scope, and compatibility boundaries; use small reviewable changes, separate behavioral changes where practical, consider callers/tests/migrations/interfaces, and validate affected behavior. Avoid unrelated cleanup and speculative abstractions.
- R-008 (active): Proceed within authorized reversible scope; ask only about material missing information or irreversible actions. Explain concrete technical concerns. Never silently drop requirements, expand scope, or claim success without evidence. Report changes, verification, unresolved work, and next steps.
- R-009 (active): Create a separate code review agent and recommend its model and reasoning level with token efficiency in mind. Source: user's subsequent code review agent request on 2026-10-11. Acceptance: repository-local reviewer definition and an explained model/reasoning recommendation.
- R-010 (active): The code reviewer must read and understand the current project architecture/structure and follow existing logic and coding practices. Source: user's reviewer clarification on 2026-10-11. Acceptance: instructions require architecture/configuration inspection, affected execution-path and consumer tracing, and comparison with neighboring implementations before findings; recommendations preserve established conventions unless requirements or a demonstrated defect justify changing them.
- R-011 (active): Create a separate implementation agent for plans produced by the planner. Source: user's implementation agent request on 2026-10-11. Acceptance: repository-local implementer reads an identified plan, follows existing requirements/practices, implements only authorized work, validates the intended outcome, and maintains progress records.
- R-012 (active): The implementer must ask questions instead of assuming answers, never proceed while confused about target results, and always ask when clarification is necessary. Source: same request. Acceptance: instructions require focused questions and waiting for answers before dependent implementation; target-result confusion stops implementation. Silence or elapsed time cannot substitute for an answer.

- R-013 (active): Use `planner` and `implementer` as the agent names and filenames, removing the previous prefix. Source: user's rename request on 2026-10-11. Acceptance: `planner.toml`/`implementer.toml` contain matching names and project records reference the new names. This supersedes the earlier naming choices; behavioral requirements remain active.

- R-014 (active): Configure `planner` with `gpt-6.1-sol` and high reasoning, and `implementer` with `gpt-6-astra` and medium reasoning. Source: user's model update on 2026-10-11 using the former prefixed agent mentions. Supersedes R-001 and the implementer's earlier model default; the current short agent names and behavioral requirements remain in effect.

- R-015 (active): Install the attached `implementation-plan.skill` in `rbiden/inventory-client` and `rbiden/inventory-server` and push to `main`. Source: user's GitHub request and scope extension on 2026-10-11. Acceptance: both repositories contain the unchanged archive manifest at `.agents/skills/implementation-plan/SKILL.md` on `main`.

## Working Preferences

- P-001 (active): Lead with the outcome or recommendation; keep communication concise, direct, and specific.

## Assumptions & Proposals

No additional product requirements or implementation scope are inferred from the open auth file. Code observations in the roadmap are unapproved review candidates.

- A-001: Interpret the reviewer's token objective as useful review quality per token, rather than maximizing output length or the context window. This is an implementation assumption, not a user-approved budget or benchmark.

## Superseded Requirements

- R-001 (superseded by R-014): Provide a planning and refactoring agent using GPT-6.1 with medium reasoning. Original acceptance: a repository-local custom agent specifies `gpt-6.1-sol` and `model_reasoning_effort = "medium"`. Replaced by the user's explicit high-reasoning update.

- Mandatory requirement (2026-10-14): Add a description to the Audit Logs route in src/features/auth/auth.routes.tsx. Source: explicit user request.

- Mandatory requirement (2026-10-14): Add a sample DataTable to src/pages/AuditLogs.tsx. Source: explicit user request.

- Mandatory requirement (2026-10-14, planning): Refactor DataTable to accept a table instance instead of repeated state/handler props. Server processing is the default; client filtering, sorting and related processing require explicit opt-in. User invoked implementation-plan; implementation awaits an approved plan. Instance contract, client filtering contract and audit sample behavior require clarification.

- Confirmed requirement (2026-10-14, planning): table={table} accepts the existing hook result bundling state/handlers. clientSide explicitly enables local pagination, sorting and search plus a caller-supplied custom filter predicate. AuditLogs must connect to a real endpoint; user will supply its contract. Supersedes the sample-source alternatives for this refactor.

- Confirmed endpoint (2026-10-14, planning): GET /v1/audit-logs. Additional contract derived from nearby backend is observational until mismatch is resolved.

- Confirmed scope (2026-10-14, planning): Include inventory-server audit-log field-selection fix. Keep Audit Logs pagination-only with fixed newest-first ordering; no server search/filter/sort expansion in this task.

## Approved DataTable and Audit Logs implementation (2026-10-14)

- Authorization: user approved the presented instance/processing/API plan, including the backend projection fix and focused tests. This supersedes the pending-approval status above, R-047's server-only restriction, R-052's no-backend scope, and R-053's no-new-tests restriction only for this approved refactor.
- Mandatory: DataTable receives the existing table hook result; server processing is the default. Explicit clientSide enables local search, custom row predicate, sorting and pagination. Preserve request states and page-scoped selection.
- Mandatory: AuditLogs uses GET /v1/audit-logs, page/limit only and newest-first ordering. Replace the sample dataset (superseding the sample-table requirement above) with actual audit fields and user display relation; fix the backend projection without a migration.
- Mandatory: page -> TanStack Query hook -> feature service -> shared Axios -> API. Source: user's explicit architecture clarification followed by approval.

- User correction (2026-10-14): simplify the audit query/service to the direct TanStack useQuery options pattern, AUDIT_LOGS_QUERY_KEYS.all(params), GET_ALL(params = {}), and destructured results at the page. Partial params and normal typed query options are supported. This supersedes custom ref/effect retention and explicit cancellation-signal plumbing for this feature; native placeholder/error behavior applies.

- User correction (2026-10-14): use a global reusable QueryParams and native TanStack UseQueryOptions directly instead of feature-specific parameter/options wrappers. Keep empty-object defaults and existing runtime behavior; do not add runtime default parameters or migrate authentication in this task. Supersedes the audit-local request/options aliases above.

- Confirmed requirement (2026-10-14): Simplify useAuditLogsQuery to params and enabled=true; clean up superseded options typing and caller code. Supersedes the audit hook's exposed options contract.

- Mandatory requirement (2026-10-14): Add basic demo Filter controls to AuditLogs showing integration with DataTable. Existing API remains pagination-only.

- Latest scope correction (2026-10-14): backend filter support is deferred; only connect the existing Filter -> Zustand -> useTableQuery flow to the audit query parameters. This supersedes the intervening instruction to implement backend action/model predicates. No local row filtering is permitted. Existing table.params already combines applied filters, pagination and search, so AuditLogs passes it directly to useAuditLogsQuery.

- User correction (2026-10-14): remove the AuditLogs page-level acceptTotal effect. When a successful server response empties the current page after deletion, navigate to page 1 rather than the last valid page. Do not reset on loading, refetch, errors or placeholder data. This supersedes AuditLogs' prior last-page correction; unrelated example acceptTotal behavior and client-mode clamping remain unchanged.

- Latest correction (2026-10-14): remove automatic server empty-page reset and use successful mutation query invalidation for refresh. Supersedes the immediately preceding server-reset requirement. No audit delete mutation/endpoint currently exists in the client; specific mutation integration remains unresolved. Query invalidation alone does not reset pagination state.

- Mandatory requirement (2026-10-14): Replace DataTable loading/updating status above table with an overlay on the table.

- Mandatory requirement (2026-10-14): Display DataTable errors as a table overlay, like loading.

- Mandatory requirement (2026-10-14): Redesign DataTable overlays to match LoadingScreen.

### Impeccable Init (2026-11-09)

- Explicit request: run Impeccable init to capture durable product context in PRODUCT.md.
- Product identity, intended users, and workflows await confirmation; existing inventory/POS copy is not accepted as clinic product truth.

### Impeccable Init: Confirmed Product Requirements (2026-11-09)

- Confirmation supersedes the waiting note above. The product is Lying In Clinic, a web application for the clinic administrator and authorized staff, including midwives and clinicians. Staff assist patients; the initial version has no patient portal or public registration.
- Mandatory administration: manage staff and permissions, clinical catalogs, rooms/beds, facility availability, clinic settings, and audit logs.
- Mandatory clinical work: find/register patients, review history/allergies, create encounters, assess priority, record vitals/diagnoses/clinical notes, and provide pregnancy-related care. Authorized staff admit patients, assign/transfer beds, record facility usage, discharge/refer patients, and confirm cleaning according to permissions.
- Mandatory workflows: search before registration; returning patients review history before a new encounter; outpatient care without admission/bed; admission -> available bed -> care -> discharge/transfer -> cleaning -> available.
- Mandatory integrity: preserve visits, pregnancy episodes, bed assignments, priority reassessments, and finalized notes. Prevent duplicate active admissions and double allocation. Automatically audit mutations; all application mutations must use database transactions.
- Mandatory technical constraints: React, TypeScript, shadcn/ui, Laravel REST API without Inertia, MySQL, Hostinger Premium target, and Asia/Manila display dates/times. Preserve existing login/audit functionality. Require Laravel Sanctum HttpOnly session cookies with CSRF protection; implementation and hosting compatibility are not verified by init.
- Confirmed usability requirements: desktop/laptop primary, responsive tablet and usable mobile, keyboard operation, visible focus, readable text/contrast, explicit labels/validation, status beyond color, and loading/empty/error/success states. No hardware or further language requirement is confirmed; use plain English and clinic-friendly wording.
- Confirmed experience priorities: minimal task-focused dashboard, patient search, quick check-in, admission on one screen, and clear room/bed availability. Preserve login/audit, then replace dashboard/user placeholders with functional screens.
- Documentation/config scope only: capture confirmed truth in PRODUCT.md, save the chosen workflow setting in shared Impeccable config, and configure the Vite live entry. No application implementation is authorized by this init completion.
- Open decisions: detailed permissions, clinical catalogs/API contracts, and hosting compatibility. Legacy POS/inventory copy and placeholder clinic data are not product evidence.

### DataTable Port (2026-11-09)

- Explicitly authorized: locate local faculty-evaluation-frontend and implement its DataTable, hooks, helpers, and necessary supporting files here; install required libraries if missing.
- Preserve unrelated working edits and existing login/audit functionality. Source repository is read-only for this port.


### Impeccable Init: Product Update (2026-11-09)

- Supersedes the "Open decisions" line under the earlier init record for permissions, catalogs and hosting:
  - Mandatory role model: two roles. Admin manages staff/permissions, catalogs, rooms/beds, facility availability, settings and audit logs. Clinical is one shared role for all other staff (midwives, clinicians) covering registration, care, admission, bed assignment/transfer, discharge/referral and cleaning confirmation.
  - Mandatory catalogs, maintained by Admin: diagnoses; services and procedures; room and bed types.
  - Hosting: Hostinger Premium confirmed compatible by the user (not verified from the repository).
- Confirmed positioning: small-clinic simplicity (fewer screens, direct workflows, low training burden).
- Mandatory brand requirement: all user-facing copy, including the login page and the browser title, uses the Lying In Clinic name; remove the leftover inventory/POS wording.
- Still open: catalog and workflow API contracts; diagnosis code set (standard vs clinic-defined); whether a medicines catalog is needed.
- Scope: PRODUCT.md and records only. No application code changed.

### Theme, Fonts, Icon and Status Colours (2026-11-09)

- Mandatory: the product has no dark theme or dark mode. Supersedes the `.dark` theme recorded in the first DESIGN.md.
- Mandatory: restyle components whose theme does not match, without changing their expected behaviour or output.
- Mandatory fonts: Fraunces for titles and headers; Nunito as the primary app font. Remove the unused Geist, IBM Plex Sans and Merriweather fonts (Inter, the previous primary, is replaced too).
- Requested: update the legacy icon. Assumption (not confirmed by the user): the brand mark is the Lucide `Baby` icon, also used for the favicon.
- Requested: add the status colour scheme to all components with colour variants.
