---
name: implementation-plan
description: >-
  Creates a rigorous implementation plan for a coding task — a feature, refactor, bug fix, migration, or architecture change — BEFORE any code is written. Trigger whenever the user types the literal command "/plan" (with or without a description after it), or asks for a plan/approach/design before implementing something in code, even without the word "plan" (e.g. "figure out how we'd add X", "what's the approach for Y", "think this through before touching the code"). Governs the whole turn: asks every clarifying question needed until no material ambiguity remains, drafts a concrete plan, and requires explicit user approval before any implementation begins. Once approved, also covers executing the plan step by step. Do not jump straight to writing or editing code for a non-trivial coding task when /plan is invoked or a plan is requested first — always clarify, propose, and get approval before implementing.
---

# Implementation Plan (/plan)

## Why this exists

Coding tasks almost always have hidden requirements: which files are actually in scope, what "done" means, what shouldn't change, how errors should be handled, what the user already tried. Writing code before those are pinned down produces work that has to be redone. This skill enforces a strict sequence: **investigate → clarify → propose → get explicit approval → execute.** No step is skipped, and no code changes happen before approval.

## Review Deliverables

Apply these requirements when drafting and presenting a completed plan in Steps 3 and 4:

- Save every completed plan as a Markdown file before requesting approval. Use the repository's existing plan location, or `docs/plans/<descriptive-slug>.md` when none exists. Update the same file during revisions and include its proposed/approved status. If file writing is unavailable or the user forbids edits, provide saveable Markdown in chat and disclose that no file was saved.
- Include review visuals in the saved Markdown and show the key visual inline when presenting the plan. Prefer fenced `mermaid` diagrams for architecture, request/event sequences, state transitions, and decision flows; use Markdown tables for behavior mappings and comparisons. Choose the smallest visual that explains a meaningful part of the change rather than duplicating the numbered steps. A simple change may use a compact before/after table.
- Ground visuals in inspected code and confirmed requirements. Label current versus proposed behavior, use real module names when known, and distinguish assumptions from confirmed behavior. Keep diagrams synchronized with the written plan after revisions. Include a brief prose explanation so the plan remains understandable when Mermaid rendering is unavailable.
- Keep review artifacts self-contained in the Markdown by default. Generate separate images or interactive artifacts only when requested or when they materially improve review; link any local artifacts from the plan. Review visuals do not authorize application implementation, publishing, or adding diagram tooling to the project.
- Present the plan inline with a clickable link to the saved Markdown, its key visual, and the concrete steps and validation needed for review. Saving documents and visuals is planning work; the existing approval gate still applies to application implementation.
- End every completed plan with a `## TL;DR` section as its final section, including after any approval/status notes. Summarize the outcome, main design, material risk or boundary, validation, and next action in a short paragraph or a few bullets. Introduce no new requirements or decisions there. Keep it synchronized when revising the plan. In chat, put any required approval question after the plan rather than adding another plan section after the TL;DR.

## Workflow

### Step 1 — Investigate before asking

Before asking the user anything, find out what you can yourself. If there's a codebase available (an attached repo, uploaded files, a connected project), read the relevant files, search for related code, and note the existing stack, patterns, and conventions. Anything you can determine this way becomes a stated assumption to confirm, not a question to ask — don't make the user re-explain things you can already see.

### Step 2 — Ask every necessary question, and don't stop early

This is the core discipline of the skill. Work through the checklist below. For each category, ask only what's genuinely still unresolved after your own investigation in Step 1 — skip anything already answered, already visible in the code, or clearly irrelevant to this task.

**Question checklist:**
- **Objective & success criteria** — What does "done" look like? How will the user check that it worked?
- **Scope boundaries** — What's explicitly in scope? What's explicitly out of scope / must not be touched?
- **Technical context** — Language/framework/stack, which files, modules, or services are involved. Confirm what you found in Step 1; ask about what you couldn't find.
- **Constraints** — Required or forbidden libraries/patterns, performance/security/compatibility requirements, style or lint conventions to follow.
- **Data & edge cases** — What inputs or states need handling, expected error-handling behavior, backward-compatibility requirements.
- **Testing & validation** — Expected test coverage, how the user wants to verify correctness, existing test conventions.
- **Dependencies & sequencing** — Does this depend on other in-flight work, external APIs, other people, or feature flags? Any required ordering?
- **Rollout considerations** — Migrations, feature flags, deploy steps, docs that need updating (skip for small internal changes where this is obviously irrelevant).

**How to ask:**
- Ask in focused batches rather than one wall of text — a handful of questions at a time, grouped by theme, not fifteen at once.
- After each round of answers, re-check: did the answers introduce a new contradiction or open a new question (e.g. the user wants X, but that conflicts with the existing pattern you found in Step 1)? If so, ask a follow-up round.
- Keep going until you could write the plan without guessing at anything that would materially change it. A genuinely minor implementation detail with no real trade-off doesn't need a question — make the sensible default call and record it under **Assumptions** in the plan instead. But if guessing wrong would mean redoing a meaningful chunk of the plan, ask.
- Don't pad this for trivial requests. If the user invokes /plan for something genuinely small, a couple of quick questions (or none, if truly self-evident) is correct — the discipline scales with the size and risk of the change, not a fixed question count.

### Step 3 — Draft the plan

Use this structure. Keep it concrete and scannable — a small task gets a short plan, a complex one gets a longer one; don't pad either way.

```
# Implementation Plan: [Title]

## Goal
[1-3 sentences: what this accomplishes and why]

## Scope
**In scope:** ...
**Out of scope:** ...

## Approach
[The high-level strategy or design decision, 2-5 sentences — the "how", not just the "what"]

## Review visuals
[Embed a relevant diagram or comparison table showing the proposed behavior, responsibilities, or sequence, followed by a brief explanation.]

## Steps
1. [Concrete, ordered unit of work — reference real files/modules where known]
2. ...

## Files / modules affected
- path/to/file — what changes and why

## Testing & validation
[How correctness will be verified — new tests, existing suite, manual checks]

## Risks & edge cases
[What could go wrong, tricky inputs, things to watch for]

## Assumptions
[Defaults you chose instead of asking about — small, low-stakes calls only]

## Open questions
[Should be empty. If it isn't, Step 2 isn't finished yet.]

## TL;DR
[Brief outcome, main approach, material boundary or risk, validation, and next action. Keep this the final section of the completed plan.]
```

### Step 4 — Present for approval (hard gate)

Present the plan inline in the chat as text. End with a direct, unambiguous approval request — for example: *"Does this plan look right? Reply **approved** to proceed, or tell me what to change."*

Then stop. Do not write, edit, or run any code in the same turn as presenting the plan — approval and execution are always separate turns.

- **Approved** (yes / approved / looks good / go ahead / ship it, etc.) → move to Step 5.
- **Changes requested** → revise the plan and present the revised version with the same approval gate. Repeat as many times as needed — there's no cap on revision rounds.
- **New questions raised** → go back to Step 2 for those specific points, then re-present the plan.

Don't treat silence, a topic change, or a vague "ok" as approval. If it's not clearly a green light on the plan itself, ask for direct confirmation before touching any code.

### Step 5 — Execute

Once approved, implement the plan step by step, in the order laid out under **Steps**. Give brief progress notes as you complete meaningful chunks of work — not after every line changed.

If reality doesn't match the plan mid-implementation (a step turns out to be infeasible, a referenced file doesn't exist, an assumption was wrong), stop, explain what changed, and check with the user before continuing down a materially different path. Don't silently improvise something the user never approved.

## Scope of this skill

This skill is for coding and software work: features, refactors, bug fixes, migrations, architecture changes. It is not meant to turn every tiny fix into a ceremony — proportion the rigor of Steps 1-2 to the size and risk of the change. For non-coding planning requests (e.g. project or event planning), use normal judgment instead of this template.
