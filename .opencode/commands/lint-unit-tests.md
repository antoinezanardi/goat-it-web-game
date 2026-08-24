# Lint unit tests conventions

## Task

Audit unit test spec files against the repository conventions defined in `docs/unit-testing.md`.

- If the prompt specifies file paths, audit only those specs (accept both spec paths and source paths — for a source path, lint its colocated spec).
- Otherwise, audit every `*.spec.ts` under `app/`, `server/`, and `shared/`.

The audit is **static analysis only** — never execute tests. Deep semantic checks (branch/slot/state coverage) are out of scope; coverage remains delegated to `pnpm run test:unit:cov`.

To protect the main context during the **audit phase**, spec files are NEVER read by the main agent: after classification, audit work is dispatched to parallel `general` subagents that return only structured violation summaries. During the **fix phase**, the main agent may read and edit spec files directly only for mechanical categories touching at most 2 files (step 8, *Direct fix allowance*); all other fixes remain delegated to subagents. The main agent aggregates, reports, asks for approval, then applies fixes.

Report all violations once in-chat, then use the question tool to validate with the user which violations to fix. **Never modify any file before explicit user approval.**

## Instructions

### 1. Load context

1. Load the `unit-testing` skill from `.agents/skills/unit-testing/SKILL.md`.
2. Read `docs/unit-testing.md` in full.

### 2. Determine scope

- Paths given in the prompt → resolve each to its spec file (non-colocated cases follow §3/[U1]: a layout source path maps to its `spec/` subfolder spec; an i18n locale JSON maps to its matching `app/i18n/specs/*.translations.spec.ts`).
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
- **[U3] Describe label rule** — Components: string `"<Name> Component"`. Pages: string `"<Name> Page"`. Layouts: string `"<Name> Layout"`. Server handlers: outer string `"Server Goat It API <Resource> <Method> Handler"` + inner `describe(handlerFn, ...)`. Stores: string form `describe("useXxxStore", ...)` or symbol reference (docs §6.5 pattern). Functions/composables/repositories: symbol reference (`describe(myFn, ...)`); free-form string only when no single symbol applies. Never a direct component/page/layout reference, and never a free-form grouping string wrapping symbol describes.
- **[U4] Single-call assertions** — No `toHaveBeenCalledTimes(1)` combined with `toHaveBeenCalledWith(...)`. Use `toHaveBeenCalledExactlyOnceWith(...)`.
- **[U5] Error swallowing** — No `.catch(() => null)`. Use try/catch with `void error` when asserting side effects of throwing code.
- **[U6] Translation keys** — Assertions compare translation keys, never translated prose strings.
- **[U7] Type safety** — No `any`; no unsafe assertions without an `// Acceptable as ...` + `// oxlint-disable-next-line ...` comment pair. Exceptions — bare `as` casts accepted as-is: those mirroring a documented docs example (e.g. store specs' `capturedAction = action as () => Promise<...>` per §6.5), and the following established codebase patterns: DOM element casts (`.element as HTMLElement`), mock-shape casts in tests (`expect.any(Function) as () => void`, `{ matches: true } as MediaQueryList`), runtime-config/error narrowing in server helper specs (`as unknown as ReturnType<typeof useRuntimeConfig>`, `error as H3Error`), and repository shape-test casts (`expect.any(Function) as () => Promise<Entity[]>`).
- **[U8] Faketory sources** — Fake data from `tests/unit/utils/faketories/` or `@goat-it/schemas/testing/*`. No local DTO faketories.
- **[U9] Global mocks** — No `mockNuxtImport("useFoo", ...)` in component/store specs for composables already globally mocked via setup files (import the MockHolder instead).
- **[U10] `it.each` usage** — Always use `it.each` for parameterized tests. Don't write multiple `it(...)` for the same test with different inputs. `it.each` should always be typed like `it.each<T>([...])`. Do NOT flag tests that describe semantically different conditions or edge cases (e.g. zero-delay immediate resolution vs delayed resolution) as mergeable — only pure input duplicates of identical test logic count.
- **[U11] Positional `findAllComponents`** — Never index positionally into `findAllComponents({ name: "..." })` when multiple sibling instances exist (e.g. `icons[0]`, `icons[2]`, `icons[index]`). Address each instance uniquely via its dynamic `data-testid` selector (per docs §7.5), typed as `findComponent<typeof Component>("[data-testid='...']")`; pin sibling order via a single assertion over the ordered testid/slug list. Count-only `findAllComponents(...)` without positional indexing remains exempt (see Established patterns).

#### Established patterns — do NOT flag

These recurring shapes are accepted codebase conventions. Auditors must not report them as violations or warnings:

- Worthiness `.attributes()` fallbacks where `.props()` is impractical (e.g. asserting a `text` prop that falls through to a stub) — covered by the "Dynamically-bound props" worthy-item exception; existing sibling-spec usages confirm the convention.
- Count-only `findAllComponents({ name: "..." })` usage that never indexes positionally into siblings.
- `getWrapperVm<T>` + local `ComponentVm` extension asserting derived computed values when the rendered output itself is not observable in happy-dom (see [C8]).
- Environment-coupled server helper specs stubbing `useRuntimeConfig` / h3 globals (see [N1] exception).

#### Component checks

- **[C1] Import** — Component imported from `#components`. Exceptions: `App.vue` and `OgImage.takumi.vue` imported from direct path.
- **[C2] Describe label** — String form `"<ComponentName> Component"`, not a reference.
- **[C3] Default props const** — Declared as `const defaultXxxProps: XxxProps = { ... } as const` typed to the component props type at the top of `describe`, before the mount helper. When a component has at least one prop, even optional, it must have a default props const. If `as const` genuinely cannot compile (deep-readonly mismatch with mutable arrays/faketory values in the props type), omit `as const` and keep the typed annotation.
- **[C4] Mount helper** — `async function mountXxx(options: MountSuspendedOptions<typeof Xxx> = {})` spreading options after defaults.
- **[C5] No shallow** — `shallow: true` is forbidden in component tests. Exception: `App.vue` (root app shell) keeps `shallow: true`.
- **[C6] Store access order** — When a store is used: `createTestingPinia()` plugin, then `mockStore(useXxxStore)` strictly after `mountSuspended` in `beforeEach`.
- **[C7] Shared wrapper lifecycle** — `let wrapper: VueWrapper` declared at the top of `describe`; `beforeEach` assigns it via the mount helper so every test consumes a freshly-reset wrapper.
- **[C8] VM/setupState access** — Accessing component internals (`setupState`, exposed methods, template refs) must go through `getWrapperVm<T>` from `~~/tests/unit/utils/helpers/vtu.helpers` with a local VM type extending `ComponentVm` (e.g. `type XxxVm = ComponentVm & { toggleOpen: () => void }`). Never cast the wrapper directly (`wrapper as VueWrapper & { setupState: ... }`). Note: the instance proxy unwraps refs — type ref members as their inner value (e.g. `isTransitioning: boolean`) and assign through the proxy instead of mutating `.value`.

#### Page checks

- **[P1] Import** — Direct import: `import XxxPage from "@/pages/....vue"`, never `#components`.
- **[P2] Shallow** — `shallow: true` present in the mount helper defaults.
- **[P3] Describe label** — String form `"<PageName> Page"`.
- **[P4] definePageMeta assertion** — Present when the page defines metadata.
- **[P5] useHead assertion** — Uses the extraction pattern `vi.mocked(useHead).mock.calls[0]?.[0]` + call. Page SEO is asserted through `useHead` even when `useSeoMeta` is also globally mocked — this is the established pattern; do NOT flag it as vacuous.
- **[P6] Mount helper** — Same signature pattern as components.
- **[P7] Shared wrapper lifecycle** — Same rule as [C7]: module-level `let wrapper`, reassigned through the mount helper in every `beforeEach`.

#### Layout checks

- **[L1] Location** — Spec in `app/layouts/<Layout>/spec/<Layout>.spec.ts`.
- **[L2] Import** — Direct path import, not `#components`.
- **[L3] Describe label** — String form `"<LayoutName> Layout"`.
- **[L4] Shallow** — `shallow: true` present.
- **[L5] Shared wrapper lifecycle** — Same rule as [C7]: module-level `let wrapper`, reassigned through the mount helper in every `beforeEach`.

#### Worthiness checks (components, pages, layouts)

A test is **worthy** when it pins behaviour that can vary; it is **unworthy** when it pins markup constants.

Worthy — each item below should be exercised by at least one test in the spec:

- **Branches** — every point where rendering or output can take two or more paths: `v-if` / `v-else-if` / `v-else` / `v-show` (both sides), ternaries and short-circuits inside template expressions (`:class="cond ? a : b"`), function-driven rendered content (`{{ formatX(...) }}`), and state-dependent render states (loading / empty / populated / error).
- **Child component presence** — every child Vue component rendered by the template has its presence asserted at least once in the spec (`findComponent({ name: "X" }).exists()` / `.findComponent(Xxx)` / `.findComponent("[data-testid='…']")` — all three count as presence assertions), even when its rendering is not conditional. Vue components are contract surfaces (props/emits/slots), unlike plain HTML tags, so their presence is always worth pinning.
- **Emits** — every event the component can emit, payload asserted; conditional events also assert absence on the non-emitting path.
- **Dynamically-bound props** — every `:`-bound prop forwarded to children is asserted, preferably via `.props()`. Exception: when `.props()` is genuinely not possible — e.g. the binding falls through to a native DOM element rather than a Vue component, or the receiving component is a third-party stub without accessible source — asserting via `.attributes()` on the rendered element is acceptable.
- **i18n in DOM** — every `$t()` / `$tc()` / `t()` usage rendered by the template is asserted by its key somewhere in the spec, even when the usage is static.
- **Named slots** — every named slot exercised at least once.
- **Reactive updates** — prop mutations via `setProps`, or mock-holder/store mutations followed by `await nextTick()`, with re-render assertions.

Unworthy — asserting any of these in a spec is a violation:

- Static Tailwind/utility classes that no binding ever touches.
- Static props or attributes without `:` binding (e.g. `variant="subtle"`, `color="neutral"`) — implementation constants. Exceptions: static icons ([W5]) and static link targets ([W6]) must still be asserted even though unbound.
- Any markup constant that cannot change with props, watch, computed or emits.

Child component presence is never unworthy — see the "Child component presence" worthy item above.

Checks:

- **[W1] Unworthy assertions** — Spec contains no assertions on unworthy items.
- **[W2] i18n key coverage** — Every i18n usage rendered by the source template is asserted by key in the spec. The auditor reads the paired source `.vue` file to enumerate them.
- **[W3] Wrapper existence** — The first test after the mount helper must be `it("should render <Name> when mounted.", () => { expect(wrapper.exists()).toBeTruthy(); })` where `<Name>` is the component, page or layout display name.
- **[W4] data-testid presence** — Every element with a `data-testid` in the source template must have its presence asserted at least once in the spec, even when not conditionally rendered.
- **[W5] Icons name** – Every icon rendered by the source template must be asserted via its icon prop (`name` on UIcon, or `icon` / `leading-icon` / `trailing-icon` on components like UButton/UBadge), even when the usage is static.
- **[W6] Link to** – Every link to rendered by the source template must be asserted by its `to` prop, even when the usage is static.

Missing branch/slot coverage detection stays out of audit scope — it is enforced by `pnpm run test:unit:cov`.

#### Composable checks

- **[CO1] Dynamic import** — Composable imported via `await import(...)` inside `beforeEach` whenever it has dependencies (Patterns A/B). Static top-level import is only valid for zero-dependency Pattern C — if unsure of eligibility, flag ⚠️ for manual review instead of ❌.
- **[CO2] Typing** — `import type { useFoo as UseFooType }` + module-level `let useFoo: typeof UseFooType`.
- **[CO3] Module-level mocks** — Each mocked dependency declared at module level with `mockNuxtImport(...)` factory referencing it.
- **[CO4] beforeEach order** — Mocks recreated before the dynamic composable import.
- **[CO5] Store access order** — When a composable harness mounts a component that uses a store, apply [C6]: `createTestingPinia()` first, then `mockStore(useXxxStore)` strictly after the mount call.

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

- **[N1] Pure tests** — No mocking infrastructure of the unit under test or its collaborators. Exception: time-control utilities (`vi.useFakeTimers()`, `vi.advanceTimersByTime(...)`, spying on global timers) are allowed to test time-dependent helpers deterministically. Environment-coupled server helpers (`server/utils/goat-it-api/helpers/goat-it-api.helpers.ts`) may stub `useRuntimeConfig` and h3 globals — established exception, never flagged.
- **[N2] Aliases** — Server helper specs import via `#server/utils/...`; shared helper specs via `#shared/utils/...`; app-local helper/mapper specs (e.g. under `app/components/` or `app/composables/`) via `@/`.

#### i18n translation checks

- **[T1] Location** — Specs live in `app/i18n/specs/`, never colocated.
- **[T2] Flattening** — Uses `crush` from `radashi`.
- **[T3] Parity assertion** — `Object.keys(crush(x)).toSorted()` compared against the French reference keys (`fr` is the source-of-truth locale).

### 5. Dispatch audit subagents

During the audit phase the main agent must NOT read spec files itself — that is what overflows context (the fix-phase direct-fix allowance in step 8 is the only exception). Instead:

1. **Batch** — Group the classified specs by type in batches of 4 files per group (single-file input → one group of one; smaller remainders are acceptable).
2. **Dispatch** — Launch one `general` subagent per group via the Task tool, in parallel waves of at most ~6 concurrent tasks. Mark each task as read-only research/audit work.
3. **Prompt** — Use exactly this template per group, filling `<TYPE>` and `<PROJECT>`, listing the file paths:

   ```text
   You are auditing unit test spec files against repository conventions.
   This is a READ-ONLY audit: do NOT modify any file and do NOT run any test or shell command.

   Files to audit — type <TYPE>, Vitest project <PROJECT>:
   - <path1>
   - <path2>

   Steps:
   1. Read `.opencode/commands/lint-unit-tests.md` section 4 IN FULL and apply the
      Universal checks, the "Established patterns — do NOT flag" block, the exact
      "<Type> checks" block named for this group's type — and, when auditing components,
      pages or layouts, the "Worthiness checks" block — to every listed file.
   2. Read each listed spec file completely; for components, pages and layouts also
      read each paired source `.vue` file to enumerate its i18n usages and dynamic
      bindings. Consult `docs/unit-testing.md` only when needed to judge a pattern
      against the conventions.
   3. Record every violation with its tag + line number(s). Multiple occurrences of
      the same rule in one file collapse into a single entry listing all lines.

   Return EXACTLY this structure for each file, in the same order, nothing else:

   FILE: <path>
   STATUS: ✅ PASSED / ❌ FAILED / ⚠️ NEEDS HUMAN JUDGMENT
   VIOLATIONS:
   - [<tag>] :<lines> — <description including the expected pattern>
   WARNINGS:
   - [<tag>] — <what needs human judgment>

   Omit VIOLATIONS/WARNINGS sections when empty. No prose before or after.
   ```

4. **Collect & retry** — If an agent fails or returns truncated/malformed output, re-dispatch ONCE with HALF the files per batch (split into two tasks), preserving the original single-type grouping. If it still fails, mark its files ⚠️ `unaudited — manual review` in the report.

### 6. Report

Emit exactly one report block:

```markdown
# Unit Test Lint Report — <total> files scanned (<passed> passed)

| Status | File                                 | Type       | Violations |
|--------|--------------------------------------|------------|------------|
| ❌     | app/pages/index.spec.ts              | page       | V1, V2     |
| ⚠️     | app/composables/core/useGame.spec.ts | composable | —          |

(✅ pass · ❌ violation · ⚠️ needs human judgment)
```

Table lists **only failing/warning files**, ordered by path — one row per file. Status precedence: a file with both violations and warnings shows ❌ (violations outrank warnings); list its violation IDs in the Violations column and mention the warnings in their entries below. Then list every violation, numbered sequentially:

```markdown
**V1** `app/pages/index.spec.ts:38` — [P2] Missing `shallow: true` in mount helper
**V2** `app/stores/domain/game/game.store.spec.ts:31,45` — [U5] `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith` → use `toHaveBeenCalledExactlyOnceWith(...)`
```

Format per violation: ID → backticked `file:line(s)` → `[rule tag]` → concise description including the expected pattern.

Warnings carry no IDs — list them after the violations as unnumbered bullets, one per finding, in the form `- \`file:line(s)\` — <description>`.

### 7. Category-based fix approval

Immediately after the report, group every reported violation AND actionable warning (skip report-only warnings already accepted as conventions) by rule tag into fix **categories** (e.g. `W3 — wrapper-existence first tests`, `C3 — default props consts`, `U10 — typed it.each`). Present the categories to the user via the question tool so they can approve which to fix, one category at a time (also offer "all categories" and "nothing — report only"; always allow a custom answer with specific categories/violation IDs).

Classify before asking: **mechanical** = unambiguous single-file edits; **judgmental** = requires writing new test logic or removal decisions that may affect coverage. State the split in the question description so the user can decide informedly.

### 8. Fix selected violations

Work through approved categories ONE at a time:

- **Direct fix allowance** — a mechanical category touching at most 2 files may be applied directly by the main agent (read + edit + scoped verification per section 9) instead of dispatching subagents.
- For each remaining category, list every file it touches and dispatch fixes in batches of 4 files per `general` subagent task (smaller remainders fine), in parallel waves of at most ~6 tasks.
- Each batch prompt must contain: exact file paths, the violations to fix with their tags/lines, the expected pattern from `docs/unit-testing.md`, scoped verification (`pnpm run test:unit <spec paths>` plus focused eslint/oxlint fixes must pass; revert a single fix if irrecoverable), and the structured `FILE / STATUS / NOTES` return format. Also declare any known working-tree modifications that predate the batch so the subagent does not misattribute them.
- Apply corrections following the exact patterns from `docs/unit-testing.md` — never invent alternatives.
- Judgmental items may require adding or removing test cases; write them per the file-type pattern.
- **Component finds by `data-testid` must be typed** — when rewriting positional lookups, use `findComponent<typeof Component>("[data-testid='...']")` with the component type imported from `#components`; a bare `findComponent(string)` returns `WrapperLike`, which has no `.props()` access.
- **happy-dom CSS constraint** — when the surface to pin is an inline `style` binding computed with modern CSS functions (`oklch()`, `color-mix()`, …), `.attributes("style")` assertions are impossible: happy-dom silently drops unparseable CSS during serialization. Pin the underlying computed/ref value via the [C8] pattern instead (`getWrapperVm<T>` + local `ComponentVm` extension) and note why in the fix NOTES.
- Respect repo conventions: no comments (except allowed lint-disable/JSDoc forms), correct import grouping/order, no `any`.
- Known linter constraints while editing: at most ONE `expect()` call per test body (`vitest(max-expects)`); hooks must live inside `describe` blocks (`vitest(require-top-level-describe)`).
- When a category is done, run focused lint + tests across its modified files **plus** `pnpm run test:unit:cov` (full coverage gate — fixes may add or reshape tests), and fix forward until green BEFORE moving to the next category.
- After each completed category, report its outcome (files changed, violations fixed, verification results) and ask the user whether to proceed to the next approved/pending category — do not chain categories silently.
- Do NOT touch anything beyond the approved categories' violations.
- Do NOT commit.

### 9. Verify (focused only)

Run scoped checks on modified files only — do NOT run other full suites, except the per-category `pnpm run test:unit:cov` gate mandated by step 8:

```bash
pnpm run test:unit <modified-spec-paths>
pnpm run lint:eslint:fix <modified-paths>
pnpm run lint:oxlint:fix <modified-paths>
```

If a focused test fails because the fix revealed a real convention conflict (e.g. renaming a describe broke a snapshot), fix forward and re-run until green.

Once every approved category is fixed, run the FULL quality gate on the whole repository (AGENTS.md gates, acceptance excluded):

```bash
pnpm run lint:fix
pnpm run typecheck
pnpm run test:unit:cov
```

Fix forward and re-run from the failing command until all three pass.

### 10. Finish

Report concisely:

- Files audited vs files changed.
- Violations fixed by rule tag; violations left untouched (if any).
- Focused test + lint results.
- If fixes were applied: report the per-category `pnpm run test:unit:cov` outcomes and the final full-gate results from step 9.
- If nothing was fixed, keep reminding that deep coverage was not assessed and suggest `pnpm run test:unit:cov`.

### 11. Lessons learned

After the finish report, run a short retrospective and offer to improve **this command**:

1. **Collect findings** from the session:
   - Warnings/violations the user accepted as-is (candidate whitelist entries) and categories they rejected.
   - Checklist rules applied too strictly or too loosely (false positives, missed patterns, ambiguous wording the agent had to interpret).
   - Subagent friction: truncated/malformed output, retries, prescribed fix mechanics that proved impossible, improvised deviations.
   - Any explicit user feedback during approval questions or fix reviews.
2. **Propose improvements** — map each finding to a concrete edit of `.opencode/commands/lint-unit-tests.md` (checklist rule, established-patterns entry, report format, dispatch/retry/fix-phase protocol). Present them as a table: improvement → lessons addressed, then ask via the question tool which to apply (allow multiple selection plus custom answers).
3. **Never modify the command without explicit user approval.**
4. **Apply approved edits** directly, verify each landed by re-reading/grepping the edited sections, and report where each change lives (section + approximate line).

Skip this step only when the user explicitly closes the session first; otherwise always offer it — even a clean audit may yield protocol refinements.
