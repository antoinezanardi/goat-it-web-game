# Lint unit tests conventions

## Task

Audit unit test spec files against the repository conventions defined in `docs/unit-testing.md`.

- If the prompt specifies file paths, audit only those specs (accept both spec paths and source paths — for a source path, lint its colocated spec).
- Otherwise, audit every `*.spec.ts` under `app/`, `server/`, and `shared/`.

The audit is **static analysis only** — never execute tests. Deep semantic checks (branch/slot/state coverage) are out of scope; coverage remains delegated to `pnpm run test:unit:cov`.

To protect the main context, spec files are NEVER read by the main agent: after classification, audit work is dispatched to parallel `general` subagents that return only structured violation summaries. The main agent aggregates, reports, asks for approval, then applies fixes.

Report all violations once in-chat, then use the question tool to validate with the user which violations to fix. **Never modify any file before explicit user approval.**

## Instructions

### 1. Load context

1. Load the `unit-testing` skill from `.agents/skills/unit-testing/SKILL.md`.
2. Read `docs/unit-testing.md` in full.

### 2. Determine scope

- Paths given in the prompt → resolve each to its spec file.
- No paths → glob all `*.spec.ts` under `app/`, `server/`, `shared/`.

### 3. Classify each spec file

Apply the rules **in order**, first match wins:

| # | Rule                                                                     | Type               | Vitest project |
|---|--------------------------------------------------------------------------|--------------------|----------------|
| 1 | Suffix `.store.spec.ts`                                                  | Store              | `stores`       |
| 2 | Suffix `.repository.spec.ts`                                             | Repository         | `repositories` |
| 3 | Located in `app/i18n/specs/`                                             | i18n translations  | `node`         |
| 4 | Suffix `.mappers.spec.ts`, `.helpers.spec.ts` or `.translations.spec.ts` | Node helper/mapper | `node`         |
| 5 | Located under `app/layouts/**/spec/`                                     | Layout             | `nuxt`         |
| 6 | Located under `app/pages/`                                               | Page               | `nuxt`         |
| 7 | Located under `app/composables/`                                         | Composable         | `composables`  |
| 8 | Under `server/api/**/handlers/` or suffix `.handler.spec.ts`             | Server handler     | `nuxt`         |
| 9 | Anything else (e.g. `App.spec.ts`, `OgImage.takumi.spec.ts`)             | Component          | `nuxt`         |

The type selects which per-type checklist applies alongside the universal checks.

### 4. Checklist reference

Audit subagents apply this checklist verbatim. Violations are recorded with rule tag + line number(s). Multiple occurrences of the same rule in one file collapse into a single entry listing all lines.

#### Universal checks (all types)

- **[U1] Location & naming** — Spec colocated with source as `SourceFile.spec.ts`. Exceptions: layouts → `spec/` subfolder; i18n → `app/i18n/specs/`.
- **[U2] Explicit vitest imports** — `describe`, `it`, `expect`, `vi`, etc. imported from `"vitest"` in every test file. No reliance on globals.
- **[U3] Describe label rule** — Components: string `"<Name> Component"`. Pages: string `"<Name> Page"`. Layouts: string `"<Name> Layout"`. Server handlers: outer string `"Server Goat It API <Resource> <Method> Handler"` + inner `describe(handlerFn, ...)`. Functions/composables/stores/repositories: symbol reference (`describe(myFn, ...)`) or free-form string only when no single symbol applies. Never a direct component/page/layout reference.
- **[U4] Single-call assertions** — No `toHaveBeenCalledTimes(1)` combined with `toHaveBeenCalledWith(...)`. Use `toHaveBeenCalledExactlyOnceWith(...)`.
- **[U5] Error swallowing** — No `.catch(() => null)`. Use try/catch with `void error` when asserting side effects of throwing code.
- **[U6] Translation keys** — Assertions compare translation keys, never translated prose strings.
- **[U7] Type safety** — No `any`; no unsafe assertions without an `// Acceptable as ...` + `// oxlint-disable-next-line ...` comment pair.
- **[U8] Faketory sources** — Fake data from `tests/unit/utils/faketories/` or `@goat-it/schemas/testing/*`. No local DTO faketories.
- **[U9] Global mocks** — No `mockNuxtImport("useFoo", ...)` in component/store specs for composables already globally mocked via setup files (import the MockHolder instead).
- **[U10] `it.each` usage** — Always use `it.each` for parameterized tests. Don't write multiple `it(...)` for the same test with different inputs. `it.each` should always be typed like `it.each<T>([...])`.

#### Component checks

- **[C1] Import** — Component imported from `#components`. Exceptions: `App.vue` and `OgImage.takumi.vue` imported from direct path.
- **[C2] Describe label** — String form `"<ComponentName> Component"`, not a reference.
- **[C3] Default props const** — Declared as `const defaultXxxProps: XxxProps = { ... } as const` typed to the component props type at the top of `describe`, before the mount helper. When a component has at least one prop, even optional, it must have a default props const.
- **[C4] Mount helper** — `async function mountXxx(options: MountSuspendedOptions<typeof Xxx> = {})` spreading options after defaults.
- **[C5] No shallow** — `shallow: true` is forbidden in component tests.
- **[C6] Store access order** — When a store is used: `createTestingPinia()` plugin, then `mockStore(useXxxStore)` strictly after `mountSuspended` in `beforeEach`.

#### Page checks

- **[P1] Import** — Direct import: `import XxxPage from "@/pages/....vue"`, never `#components`.
- **[P2] Shallow** — `shallow: true` present in the mount helper defaults.
- **[P3] Describe label** — String form `"<PageName> Page"`.
- **[P4] definePageMeta assertion** — Present when the page defines metadata.
- **[P5] useHead assertion** — Uses the extraction pattern `vi.mocked(useHead).mock.calls[0]?.[0]` + call.
- **[P6] Mount helper** — Same signature pattern as components.

#### Layout checks

- **[L1] Location** — Spec in `app/layouts/<Layout>/spec/<Layout>.spec.ts`.
- **[L2] Import** — Direct path import, not `#components`.
- **[L3] Describe label** — String form `"<LayoutName> Layout"`.
- **[L4] Shallow** — `shallow: true` present.

#### Worthiness checks (components, pages, layouts)

A test is **worthy** when it pins behaviour that can vary; it is **unworthy** when it pins markup constants.

Worthy — each item below should be exercised by at least one test in the spec:

- **Branches** — every point where rendering or output can take two or more paths: `v-if` / `v-else-if` / `v-else` / `v-show` (both sides), ternaries and short-circuits inside template expressions (`:class="cond ? a : b"`), function-driven rendered content (`{{ formatX(...) }}`), and state-dependent render states (loading / empty / populated / error).
- **Emits** — every event the component can emit, payload asserted; conditional events also assert absence on the non-emitting path.
- **Dynamically-bound props** — every `:`-bound prop forwarded to children, asserted via `.props()`.
- **i18n in DOM** — every `$t()` / `$tc()` / `t()` usage rendered by the template is asserted by its key somewhere in the spec, even when the usage is static.
- **Named slots** — every named slot exercised at least once.
- **Reactive updates** — prop mutations via `setProps`, or mock-holder/store mutations followed by `await nextTick()`, with re-render assertions.

Unworthy — asserting any of these in a spec is a violation:

- Static Tailwind/utility classes that no binding ever touches.
- Static props or attributes without `:` binding (e.g. `variant="subtle"`, `color="neutral"`) — implementation constants.
- Any markup constant that cannot change with props, watch, computed or emits.
- Unconditional component presence (`findComponent({ name: "X" }).exists()`) when the component has no `v-if`/`v-else`/`v-show` — only the wrapper existence test is allowed unconditionally.

Checks:

- **[W1] Unworthy assertions** — Spec contains no assertions on unworthy items.
- **[W2] i18n key coverage** — Every i18n usage rendered by the source template is asserted by key in the spec. The auditor reads the paired source `.vue` file to enumerate them.
- **[W3] Wrapper existence** — The first test after the mount helper must be `it("should render <ComponentName> when mounted.", () => { expect(wrapper.exists()).toBeTruthy(); })`.
- **[W4] data-testid presence** — Every element with a `data-testid` in the source template must have its presence asserted at least once in the spec, even when not conditionally rendered.
- **[W5] Icons name** – Every icon name rendered by the source template must be asserted by its `name` prop, even when the usage is static.
- **[W6] Link to** – Every link to rendered by the source template must be asserted by its `to` prop, even when the usage is static.

Missing branch/slot coverage detection stays out of audit scope — it is enforced by `pnpm run test:unit:cov`. Only W1 and W2 are audited.

#### Composable checks

- **[CO1] Dynamic import** — Composable imported via `await import(...)` inside `beforeEach` whenever it has dependencies (Patterns A/B). Static top-level import is only valid for zero-dependency Pattern C — if unsure of eligibility, flag ⚠️ for manual review instead of ❌.
- **[CO2] Typing** — `import type { useFoo as UseFooType }` + module-level `let useFoo: typeof UseFooType`.
- **[CO3] Module-level mocks** — Each mocked dependency declared at module level with `mockNuxtImport(...)` factory referencing it.
- **[CO4] beforeEach order** — Mocks recreated before the dynamic composable import.

#### Store checks

- **[S1] Capture wiring** — `capturedAction` / `capturedOnError` captured through `mockNuxtImport("useAsyncAction", ...)`.
- **[S2] Reset captured vars** — Set to `undefined` at the top of each `beforeEach`; multi-action stores also reset their call counter to `0`.
- **[S3] Dynamic import** — Store dynamically imported inside `beforeEach`.
- **[S4] Pinia setup** — No manual `setActivePinia(createPinia())` (runs automatically).
- **[S5] Multi-action counter** — Stores calling `useAsyncAction` more than once use a call counter returning distinct mock instances.

#### Repository checks

- **[R1] No Nuxt mocks** — No `mockNuxtImport`; plain Node patterns only.
- **[R2] Describe label** — `describe(myRepository, ...)` symbol form.
- **[R3] Fetch mock** — `fetchMock = vi.fn<$Fetch>()` in `beforeEach`; passed to the factory cast as `$Fetch`.
- **[R4] Shape test** — Top-level test asserting the repository shape with `toStrictEqual({ method: expect.any(Function), ... })`.
- **[R5] Method coverage** — Each repository method tests endpoint, HTTP options and return value; parametrized methods test interpolated URLs.

#### Server handler checks

- **[H1] Helpers mock syntax** — `vi.mock(import("#server/utils/..."))` using the `import()` expression form at module level.
- **[H2] Two-level describe** — Outer string label `"Server Goat It API <Resource> <Method> Handler"`, inner `describe(handlerFn, ...)`.
- **[H3] $fetch usage** — `vi.mocked($fetch).mockResolvedValue(...)` / `mockRejectedValue(...)`, never re-mocked from scratch.
- **[H4] Zod path** — A test asserting `ZodError` is thrown for invalid API data.
- **[H5] Throw side-effects** — try/catch with `void error` around the awaited handler call.
- **[H6] Status codes** — Values from the `HttpStatusCode` enum (`#server/utils/http/http.enums`), not raw numbers.
- **[H7] Param/body assertions** — Routes with params assert `getRouterParam(event, "id")`; routes with body assert `readBody(event)`.

#### Node helper/mapper checks

- **[N1] Pure tests** — No mocking infrastructure.
- **[N2] Aliases** — Imports use `#server/utils/...` or `#shared/utils/...`.

#### i18n translation checks

- **[T1] Location** — Specs live in `app/i18n/specs/`, never colocated.
- **[T2] Flattening** — Uses `crush` from `radashi`.
- **[T3] Parity assertion** — `Object.keys(crush(x)).toSorted()` compared against English keys.

### 5. Dispatch audit subagents

The main agent must NOT read spec files itself — that is what overflows context. Instead:

1. **Batch** — Group the classified specs by type, up to ~8 files per group (single-file input → one group of one).
2. **Dispatch** — Launch one `general` subagent per group via the Task tool, in parallel waves of at most ~6 concurrent tasks. Mark each task as read-only research/audit work.
3. **Prompt** — Use exactly this template per group, filling `<TYPE>` and `<PROJECT>`, listing the file paths:

   ```text
   You are auditing unit test spec files against repository conventions.
   This is a READ-ONLY audit: do NOT modify any file and do NOT run any test or shell command.

   Files to audit — type <TYPE>, Vitest project <PROJECT>:
   - <path1>
   - <path2>

   Steps:
   1. Read `.opencode/commands/lint-unit-tests.md` section 4 and apply the Universal
      checks plus the "<Type> checks" block — and, when auditing components, pages or
      layouts, the "Worthiness checks" block — to every listed file.
   2. Read each listed spec file completely; for components, pages and layouts also
      read each paired source `.vue` file to enumerate its i18n usages and dynamic
      bindings. Consult `docs/unit-testing.md` only when needed to judge a pattern
      against the conventions.
   3. Count applicable checks passed vs applied per file, and record every violation
      with its tag + line number(s). Multiple occurrences of the same rule in one file
      collapse into a single entry listing all lines.

   Return EXACTLY this structure for each file, in the same order, nothing else:

   FILE: <path>
   CHECKS: <passed>/<applied>
   VIOLATIONS:
   - [<tag>] :<lines> — <description including the expected pattern>
   WARNINGS:
   - [<tag>] — <what needs human judgment>

   Omit VIOLATIONS/WARNINGS sections when empty. No prose before or after.
   ```

4. **Collect & retry** — If an agent fails or returns malformed output, retry once; if it still fails, mark its files ⚠️ `unaudited — manual review` in the report.

### 6. Report

Emit exactly one report block:

```markdown
# Unit Test Lint Report — <total> files scanned (<passed> passed)

| Status | File                                 | Type       | Checks | Violations |
|--------|--------------------------------------|------------|--------|------------|
| ❌     | app/pages/index.spec.ts              | page       | 10/12  | V1, V2     |
| ⚠️     | app/composables/core/useGame.spec.ts | composable | 9/10   | V3         |

(✅ pass · ❌ violation · ⚠️ needs human judgment)
```

Table lists **only failing/warning files**, ordered by path. Then list every violation, numbered sequentially:

```markdown
**V1** `app/pages/index.spec.ts:38` — [P2] Missing `shallow: true` in mount helper **V2** `app/stores/domain/game/game.store.spec.ts:31,45` — [U5] `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith` → use `toHaveBeenCalledExactlyOnceWith(...)`
```

Format per violation: ID → backticked `file:line(s)` → `[rule tag]` → concise description including the expected pattern.

### 7. Interactive fix approval

Immediately after the report, ask the user what to fix using the question tool with options such as:

1. All violations
2. Only mechanical fixes (label renames, missing periods/shallow flags, assertion rewrites, import fixes)
3. Per-file groups (one option per failing file)
4. Nothing — report only

Always allow a custom answer (specific violation IDs).

Classify before asking: **mechanical** = unambiguous single-file edits; **judgmental** = requires writing new test logic (missing ZodError path, uncovered methods, Pattern A/B/C choice). State the split in the question description so the user can decide informedly.

### 8. Fix selected violations

For every approved violation:

- Apply corrections following the exact patterns from `docs/unit-testing.md` — never invent alternatives.
- Judgmental items may require adding new test cases; write them per the file-type pattern.
- Respect repo conventions: no comments (except allowed lint-disable/JSDoc forms), correct import grouping/order, no `any`.
- Do NOT touch anything beyond the approved violations.
- Do NOT commit.

### 9. Verify (focused only)

Run scoped checks on modified files only — do NOT run full suites:

```bash
pnpm run test:unit <modified-spec-paths>
pnpm run lint:eslint:fix <modified-paths>
pnpm run lint:oxlint:fix <modified-paths>
```

If a focused test fails because the fix revealed a real convention conflict (e.g. renaming a describe broke a snapshot), fix forward and re-run until green.

### 10. Finish

Report concisely:

- Files audited vs files changed.
- Violations fixed by rule tag; violations left untouched (if any).
- Focused test + lint results.
- Reminder that deep coverage was not assessed here — suggest `pnpm run test:unit:cov` if new tests were added.
