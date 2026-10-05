# Lint acceptance tests conventions

## Task

Audit acceptance test files against the repository conventions defined in `docs/acceptance-testing.md`.

- If the prompt specifies file paths, audit only those files.
- Otherwise, audit every file under `tests/acceptance/`.

The audit is **static analysis only** — never execute tests or run shell commands beyond the scoped lint/typecheck/acceptance commands specified in the quality gate (step 9). Deep semantic checks (coverage, mutation, unit tests) are out of scope.

To protect the main context during the **audit phase**, files are NEVER read by the main agent: after classification, audit work is dispatched to parallel `general` subagents that return only structured violation summaries. During the **fix phase**, the main agent may read and edit files directly only for mechanical categories touching at most 2 files (step 8, *Direct fix allowance*); all other fixes remain delegated to subagents. The main agent aggregates, reports, asks for approval, then applies fixes.

Report all violations once in-chat, then use the question tool to validate with the user which violations to fix. **Never modify any file before explicit user approval.**

## Instructions

### 1. Load context

1. Load the `acceptance-testing` skill from `.agents/skills/acceptance-testing/SKILL.md`.
2. Read `docs/acceptance-testing.md` in full (sections 4-9 are the authoritative reference for conventions).

### 2. Determine scope

- Paths given in the prompt → audit only those files.
- No paths → glob all files under `tests/acceptance/`.

### 3. Classify each file

Apply the rules **in order**, first match wins:

| # | Rule                                                                      | Type            |
|---|---------------------------------------------------------------------------|-----------------|
| 1 | Suffix `.feature`                                                         | Feature         |
| 2 | Suffix `.given-steps.ts` / `.when-steps.ts` / `.then-steps.ts`            | Step            |
| 3 | Suffix `.steps.constants.ts`                                              | StepConstants   |
| 4 | Suffix `.steps.helpers.ts`                                                | StepHelper      |
| 5 | Suffix `.datatables.schemas.ts`                                           | DataTableSchema |
| 6 | Path contains `support/constants/` or `support/types/`                    | SupportRegistry |
| 7 | Path contains `support/helpers/` (not step helpers)                       | SupportHelper   |
| 8 | Suffix `.steps.ts` (catch-all for non-step files inside step-definitions) | StepMisc        |
| 9 | Anything else under `tests/acceptance/`                                   | Other           |

The type selects which per-type checklist applies alongside the universal checks.

### 4. Checklist reference

Audit subagents apply this checklist verbatim. Violations are recorded with rule tag + line number (s). Multiple occurrences of the same rule in one file collapse into a single entry listing all lines.

#### Universal checks (all types)

- **[AU1] No switch/case** — Use object maps or conditional chains. The project convention prohibits `switch`/`case` statements (see `AGENTS.md`).
- **[AU2] No agent-generated comments** — Source files in `tests/acceptance/` must not contain explanatory comments, `// TODO`, `// FIXME`, section markers, or inline notes. The only accepted comment forms are (a) the two-line lint-disable pair `// Acceptable as <why>` + `// oxlint-disable-next-line <rule>`, and (b) JSDoc-type documentation on public API surfaces.

#### Established patterns — do NOT flag

These recurring shapes are accepted codebase conventions. Auditors must not report them as violations or warnings:

- `console.info` and `console.error` in step definitions and helpers — `eslint/no-console` is explicitly disabled for `**/tests/acceptance/features/step-definitions/**/*.ts`, `**/tests/acceptance/features/step-definitions/**/helpers/**/*.ts`, `**/tests/acceptance/features/support/hooks.ts`, `**/tests/acceptance/features/support/helpers/**/*.ts` (see `oxlint.config.jsonc`).
- Async Given/When steps using `await this.page.<action>(...)` — Playwright auto-waits; no manual `waitForTimeout` is needed and none is allowed for page interactions.
- Deliberate `waitForTimeout` (e.g. `CSS_ANIMATION_SETTLE_MS`) inside the accessibility scan helper — axe must run after CSS animations settle, which Playwright auto-wait cannot observe. This is the sole accepted manual wait.
- `GoatItWorld` typed as `this: GoatItWorld` on every step function.
- Emoji prefixes on `Feature:` and `Scenario:` titles (🏡, 🎨, 📋, …) — project convention for visual scanning.
- `Scenario Outline:` + `Examples:` tables for accessibility features — required by §5.6 of `docs/acceptance-testing.md` to express the light/dark × desktop/mobile matrix.
- `Background:` blocks when 3 or more scenarios share identical Given/When steps at the start of a feature (see `docs/acceptance-testing.md` §5.4).
- Locator preference order: `getByRole` > `getByTestId` > `getByText` > CSS — deviations are acceptable only when no ARIA role exists.
- `validateDataTableAndGetFirstRow` / `validateDataTableAndGetRows` invoked from `#acceptance/features/support/helpers/datatable.helpers.ts`.
- Toast-only flows exempt from [FT10] — accessibility companions are not required for features whose states are toast notifications only (tutorial invitation, locale suggestion, API-error toasts); these are explicitly out of scan scope in `docs/superpowers/specs/2026-10-03-accessibility-acceptance-coverage-design.md`.
- `generateScreenshotOnScenarioFailure` in `support/helpers/hooks.helpers.ts` accepts `Page` + an `attach` callback instead of `GoatItWorld` — the callback bridge keeps the helper world-free while the caller in `hooks.ts` forwards `this.attach`, which accepts the `Buffer` returned by `page.screenshot()`.

#### Feature file checks (`*.feature`)

- **[FT1] Tags placement** — Tags must be on the line (s) immediately before `Feature:` (no blank lines between the tag block and `Feature:`).
- **[FT2] Tags format** — All tags must be lowercase kebab-case (no uppercase characters). Tags begin with `@` and contain only letters, digits, hyphens.
- **[FT3] Background usage** — `Background:` is permitted **only** when 3 or more `Scenario:` blocks within the same feature share the same Given/And steps at the start (see `docs/acceptance-testing.md` §5.4). Features with fewer than 3 scenarios must inline the setup steps in each scenario instead.
- **[FT4] No But keyword** — Use `And` to continue the most recent block type, never `But`.
- **[FT5] Scenario Outline usage** — `Scenario Outline:` + `Examples:` is permitted **only** in `*-accessibility.feature` files (to express the light/dark × desktop/mobile matrix per `docs/acceptance-testing.md` §5.6). Non-accessibility features must use separate `Scenario:` blocks.
- **[FT6] Step ordering** — Scenario steps must follow `Given` → `And` → `When` → `And` → `Then` → `And` sequence. `Given` sets up preconditions. `When` performs the user action. `Then` asserts the post-condition. Two consecutive same-keyword steps on adjacent step lines (ignoring DataTable rows between them) is a violation — e.g., `Given ...` followed immediately by `Given ...`, `When ...` followed by `When ...`, or `Then ...` followed by `Then ...` — the second must use `And`. A `When` after a `Then` (or vice versa) is valid — only same-keyword on adjacent step lines is a violation.
- **[FT7] Scenario assertion** — Each scenario must have at least one `Then` step (or an `And` after a `Then` that implies assertion).
- **[FT8] Feature path** — Feature files must live under `tests/acceptance/features/<domain>/`. Sub-domain directories (`<action>/` such as `archive`, `creation`, `filter`, `modification`, `translation`) are permitted one level deep. Flags if path does not match these patterns.
- **[FT9] Feature file naming** — Feature file names follow `<domain>-<action>.feature` for action-specific features, `<domain>.feature` for top-level page features, `<domain>-<action>-accessibility.feature` for accessibility companions. The `Feature:` title should mirror the file purpose with an emoji prefix.
- **[FT10] Accessibility companion** — Every non-accessibility `*.feature` that exercises UI must have a matching `<domain>-<action>-accessibility.feature` (or `<domain>-accessibility.feature`) in the same directory, containing at least the light/dark × desktop/mobile matrix.

#### Step definition checks (`*-steps.ts`)

These checks apply to actual step definition files (`*-steps.ts`), not to helper files.

- **[ST1] World declaration** — All step functions must declare `this: GoatItWorld` as first parameter (the type is imported from `#acceptance/features/support/types/world.types.ts`).
- **[ST2] Regex `/u` flag** — Step regex patterns must end with the `/u` flag.
- **[ST3] Regex anchors** — Step regex patterns must use `^` and `$` anchors. Verify by reading the exact regex line — do not assume from partial context.
- **[ST4] Named capture groups** — Regex must use named capture groups `(?<name>...)` for parameters.
- **[ST5] When steps pattern** — When steps that interact with UI elements via Playwright locators (`getByRole`, `getByTestId`, `getByText`) must assert visibility/existence with `expect(...)` before performing the action. Exempt: viewport resize (`setViewportSize`), keyboard press, page navigation, and other non-locator `this.page` methods.
- **[ST6] Then steps pattern** — Then steps must use `expect(...)` for assertions (never raw `assert`). Synchronous assertions do not require `async`.
- **[ST7] No async noise** — When steps should not wrap a single sync action in `async`/`await`. Use `async function(...)` only when at least one `await` is needed.
- **[ST8] File naming** — Step files must follow `<domain>.{given|when|then}-steps.ts` naming pattern (e.g. `question-theme.given-steps.ts`).
- **[ST9] DataTable Zod validation** — Every step function that receives a `DataTable` parameter MUST call `validateDataTableAndGetFirstRow(dataTable, SCHEMA)` or `validateDataTableAndGetRows(dataTable, SCHEMA)` from `#acceptance/features/support/helpers/datatable.helpers.ts` before using the data. Flags any step that receives `dataTable: DataTable` (or `queryDataTable`, `errorDataTable`, etc.) without validating it through a Zod schema.
- **[ST10] Step helper extraction** — If the same logic pattern appears in 3+ different step functions across the codebase (e.g. navigation to a page, table row click, toast assertion), it must be extracted to a dedicated step helper file under `step-definitions/<domain>/helpers/` named `<domain>.<step-type>-steps.helpers.ts`, **never shared across step types** (a `when-steps.helpers.ts` file is for `when` steps only; do not mix `given` helpers into it).

#### StepConstants checks (`*.steps.constants.ts`)

- **[SC1] Constant naming** — Exported constants must use `UPPER_SNAKE_CASE`.
- **[SC2] No step registration** — Constants files must NOT call `Given()`, `When()`, or `Then()` from `@cucumber/cucumber`.

#### StepHelper checks (`*.steps.helpers.ts`)

These checks apply to step helper files only.

- **[SH1] No step registration** — Helper files (`*.steps.helpers.ts`) must NOT call `Given()`, `When()`, or `Then()` from `@cucumber/cucumber`.
- **[SH2] Single step-type scope** — Each helper file targets ONE step type only: a `when-steps.helpers.ts` contains helpers for `When` steps; a `given-steps.helpers.ts` contains helpers for `Given` steps. Never mix helpers for different step types in the same file.
- **[SH3] Pure functions preferred** — Helpers should be pure functions that accept Playwright types (`Page`, `Locator`) and return values. Avoid helpers that capture `this` or rely on closed-over world state.

#### DataTable schema checks (`*.datatables.schemas.ts`)

- **[DS1] Strict object** — Must use `z.strictObject({...})`, not `z.object({...})`.
- **[DS2] Schema naming** — Constants must end with `_ROW_SCHEMA` suffix (e.g. `QUESTION_FORM_ROW_SCHEMA`).
- **[DS3] Optional coercion** — Optional columns must use `zCoerceOptionalString()` (or related `zCoerceOptional*` helpers) from `#acceptance/features/support/helpers/datatable.helpers.ts`, not raw `z.coerce.string()`.

#### Support helper checks (`support/helpers/*.ts`, not step helpers)

- **[SU1] No step registration** — Must NOT call `Given()`, `When()`, or `Then()`.
- **[SU2] Pure utility** — Helpers are stateless utilities (data table validation, format strings, table parsing, navigation text constants, hook helpers). They should not depend on `GoatItWorld` directly.

### 5. Dispatch audit subagents

During the audit phase the main agent must NOT read acceptance test files itself. Instead:

1. **Batch** — Group the classified files by type in batches of 4-8 files per group (single-file input → one group of one; smaller remainders are acceptable). **Exception for Step files**: when batching `*-steps.ts` files, include any co-located `*.steps.helpers.ts` and `*.steps.constants.ts` files from the same directory in the same batch. **Exception for ST10**: the [ST10] step helper extraction check requires cross-referencing ALL step files and ALL step helpers across the entire codebase. Dispatch a dedicated ST10-only batch containing every `*-steps.ts` and `*.steps.helpers.ts` file (all directories, all domains). This batch applies ONLY [ST10] — all other step checks are covered by the per-directory batches.
2. **Dispatch** — Launch one `general` subagent per group via the Task tool, in parallel waves of at most ~6 concurrent tasks. Mark each task as read-only research/audit work.
3. **Prompt** — Use exactly this template per group, filling `<TYPE>`, listing the file paths:

   ```text
   You are auditing acceptance test files against repository conventions.
   This is a READ-ONLY audit: do NOT modify any file and do NOT run any test or shell command.
   NEVER run acceptance tests (`pnpm run test:acceptance`).

   Files to audit — type <TYPE>:
   - <path1>
   - <path2>

   Steps:
   1. Read `.opencode/commands/lint-acceptance-tests.md` section 4 IN FULL and apply the
      Universal check, the "Established patterns — do NOT flag" block, the exact
      "<Type> checks" block named for this group's type — to every listed file.
   2. Read each listed file completely. Consult `docs/acceptance-testing.md` only when
      needed to judge a pattern against the conventions.
   3. Record every violation with its tag + line number(s). Multiple occurrences of
      the same rule in one file collapse into a single entry listing all lines.
   4. Before returning, verify that every reported line number exists in its file
      (line number ≤ total lines). Remove any violation with an out-of-range line number
      — it is a hallucination.

   Return EXACTLY this structure for each file, in the same order, nothing else. Do NOT return markdown tables, summary blocks, or any prose before or after — ONLY the structure below. Non-compliant output will be rejected and the task re-dispatched.

   FILE: <path>
   STATUS: ✅ PASSED / ❌ FAILED / ⚠️ NEEDS HUMAN JUDGMENT
   VIOLATIONS:
   - [<tag>] :<lines> — <description including the expected pattern>
   WARNINGS:
   - [<tag>] — <what needs human judgment>

   Omit VIOLATIONS/WARNINGS sections when empty. No prose before or after.
   ```

   **ST10-only batch template** (for the dedicated cross-codebase ST10 batch):

   ```text
   You are auditing acceptance test step definitions for step helper extraction patterns.
   This is a READ-ONLY audit: do NOT modify any file and do NOT run any test or shell command.
   NEVER run acceptance tests (`pnpm run test:acceptance`).

   This batch checks [ST10] ONLY — all other checks are handled by per-directory batches.

   Files to audit — all Step and StepHelper files:
   - <path1>
   - <path2>
   - ... (every *-steps.ts and *.steps.helpers.ts file in the codebase)

   Steps:
   1. Read `.opencode/commands/lint-acceptance-tests.md` section 4 IN FULL and apply ONLY
      [ST10] Step helper extraction — to every listed file.
   2. Read each listed file completely.
   3. Identify logic patterns that appear in 3+ different step functions ACROSS the entire
      codebase (not just within this batch). Patterns include: page navigation wrappers,
      table row interaction, toast assertion, modal open/close, form fill by field name, etc.
   4. For each repeated pattern, list the specific files and line numbers where it appears,
      and recommend extraction to a dedicated helper file under
      `step-definitions/<domain>/helpers/<domain>.<step-type>-steps.helpers.ts`.

   Return EXACTLY this structure, nothing else:

   PATTERN: <description of the repeated logic>
   OCCURRENCES:
   - <file>:<line> — <brief context>
   - <file>:<line> — <brief context>
   RECOMMENDATION: <where to extract and what to name the helper>

   If no repeated patterns are found, return: NO ST10 VIOLATIONS FOUND

   Do NOT return markdown tables, summary blocks, or any prose before or after.
   ```

4. **Collect & retry** — If an agent fails or returns truncated/malformed output, re-dispatch ONCE with HALF the files per batch (split into two tasks), preserving the original single-type grouping. If it still fails, mark its files ⚠️ `unaudited — manual review` in the report. **Hallucination guard**: before returning, the subagent MUST verify that every reported line number exists in the file (line number ≤ total lines in that file). If a line number exceeds the file length, remove that violation from the output — it is a hallucination. The main agent should also spot-check a sample of reported line numbers against file contents.

### 6. Report

Emit exactly one report block:

```markdown
# Acceptance Test Lint Report — <total> files scanned (<passed> passed)

| Status | File                                                     | Type        | Violations |
|--------|----------------------------------------------------------|-------------|------------|
| ❌     | tests/acceptance/features/.../foo.feature                | feature     | V1, V2     |
| ⚠️     | tests/acceptance/features/.../bar.then-steps.ts          | step        | —          |

(✅ pass · ❌ violation · ⚠️ needs human judgment)
```

Table lists **only failing/warning files**, ordered by path — one row per file. Status precedence: a file with both violations and warnings shows ❌ (violations outrank warnings); list its violation IDs in the Violations column and mention the warnings in their entries below. Then list every violation, numbered sequentially:

```markdown
**V1** `tests/acceptance/features/.../foo.feature:12` — [FT1] Tags must be on the line immediately before `Feature:` — found blank line between tags and Feature **V2** `tests/acceptance/features/.../foo.feature:25` — [FT6] Step ordering violated — `Then` appears before `When`
```

Format per violation: ID → backticked `file:line(s)` → `[rule tag]` → concise description including the expected pattern.

Warnings carry no IDs — list them after the violations as unnumbered bullets, one per finding, in the form `- \`file:line (s)\` — <description>`.

### 7. Category-based fix approval

Immediately after the report, group every reported violation AND actionable warning (skip report-only warnings already accepted as conventions) by rule tag into fix **categories** (e.g. `FT1 — tags-placement`, `ST1 — world-declaration`, `DS2 — schema-naming`). Present the categories to the user via the question tool so they can approve which to fix, one category at a time (also offer "all categories" and "nothing — report only"; always allow a custom answer with specific categories/violation IDs).

Classify before asking: **mechanical** = unambiguous single-file edits; **judgmental** = requires writing new test logic or removal decisions that may affect coverage. State the split in the question description so the user can decide informedly.

### 8. Fix selected violations

Work through approved categories ONE at a time. **NO parallel work across categories** — complete each category fully (fix + verify) before starting the next.

- **Direct fix allowance** — a mechanical category touching at most 2 files may be applied directly by the main agent (read + edit + scoped verification per section 9) instead of dispatching subagents.
- For each remaining category, dispatch ONE `general` subagent per category via the Task tool. The subagent receives ALL files for that category in a single prompt and fixes them sequentially. **NEVER split a category into parallel batches**. The subagent must NOT run `pnpm run test:acceptance` — verification is done by the main agent after the subagent returns. **NEVER run acceptance tests in subagents.**
- Each subagent prompt must contain: exact file paths, the violations to fix with their tags/lines, the expected pattern from `docs/acceptance-testing.md`, the current working-tree state, and the structured `FILE / STATUS / NOTES` return format.
- Apply corrections following the exact patterns from `docs/acceptance-testing.md` — never invent alternatives.
- When a category is done, run focused lint across its modified files, and fix forward until green BEFORE moving to the next category.
- After each completed category, report its outcome (files changed, violations fixed, verification results) and ask the user whether to proceed to the next approved/pending category.
- Do NOT touch anything beyond the approved categories' violations.
- Do NOT commit.

### 9. Verify (focused only)

Run scoped checks on modified files only:

```bash
pnpm run lint:eslint:fix <modified-paths>
pnpm run lint:oxlint:fix <modified-paths>
```

If a focused lint fails because the fix revealed a real convention conflict, fix forward and re-run until green.

Once every approved category is fixed, run the FULL quality gate on the whole repository:

```bash
pnpm run lint:fix
pnpm run typecheck
pnpm run test:acceptance
```

> `pnpm run test:acceptance` requires Docker services (MongoDB + the goat-it-api sandbox) to be running. If Docker is unavailable, skip the acceptance gate and note it in the finish report.

Fix forward and re-run from the failing command until all three pass.

> **Do NOT run `pnpm run test:unit:cov` or `pnpm run test:unit` at any point during this process.** Unit tests and coverage are out of scope for acceptance test linting.

### 10. Finish

Report concisely:

- Files audited vs files changed.
- Violations fixed by rule tag; violations left untouched (if any).
- Focused lint results.
- If fixes were applied: report the final full-gate results from step 9.
- If nothing was fixed, keep reminding that deep coverage was not assessed and suggest `pnpm run test:acceptance`.

### 11. Lessons learned

After the finish report, run a short retrospective and offer to improve **this command**:

1. **Collect findings** from the session:
  - Warnings/violations the user accepted as-is (candidate whitelist entries) and categories they rejected.
  - Checklist rules applied too strictly or too loosely (false positives, missed patterns, ambiguous wording).
  - Subagent friction: truncated/malformed output, retries, prescribed fix mechanics that proved impossible.
  - Any explicit user feedback during approval questions or fix reviews.
2. **Propose improvements** — map each finding to a concrete edit of `.opencode/commands/lint-acceptance-tests.md`. Present them as a table: improvement → lessons addressed, then ask via the question tool which to apply.
3. **Never modify the command without explicit user approval.**
4. **Apply approved edits** directly, verify each landed by re-reading/grepping the edited sections, and report where each change lives.

Skip this step only when the user explicitly closes the session first; otherwise always offer it.
