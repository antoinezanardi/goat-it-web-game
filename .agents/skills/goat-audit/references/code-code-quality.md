# CODE — Code quality & conventions

How the TypeScript and Vue source of the web game is written, linted and kept clean: compiler strictness across the four
Nuxt type contexts (app, server, shared, node) and the Node-run `scripts/`, the escape-hatch audit (`any`, `as`, `!`,
`@ts-*`), the health of the dual ESLint + Oxlint setup and its two-line `// Acceptable as` disable format, dead code,
duplication, complexity, naming and magic values, the JSDoc policy of `docs/jsdoc.md`, SFC/composable/store coding
conventions (`<script setup lang="ts">` first, typed contracts, aliases only, no barrels) and consistent error handling.

**Decision doc:** `docs/architecture.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** file placement, companions, dependency direction, store layering and mutation boundaries, duplicated domain rules, cycles and orphan files → ARCH · framework API misuse (Nuxt, Vue reactivity/SSR, Pinia runtime rules, Zod pitfalls) → STACK · test code conventions → TEST · docs drift → DOCS · unused or undeclared dependencies → SUP · stray `console` calls and server logging → OPS · superseded-result handling → REL · upstream fetch helpers → SEC · CI job wiring → CICD

## Contents

- [1. TypeScript strictness](#1-typescript-strictness)
- [2. Lint health](#2-lint-health)
- [3. Dead code](#3-dead-code)
- [4. Duplication](#4-duplication)
- [5. Complexity](#5-complexity)
- [6. Naming & magic values](#6-naming--magic-values)
- [7. JSDoc policy & comments](#7-jsdoc-policy--comments)
- [8. SFC, composable & store conventions](#8-sfc-composable--store-conventions)
- [9. Error-handling consistency](#9-error-handling-consistency)
- [Sources](#sources)

## 1. TypeScript strictness

- **[CODE-01] TypeScript strictness in every context** — `nuxt.config.ts` keeps `typescript.strict: true`; no `compilerOptions` in `nuxt.config.ts`, `tsconfig.json` or `scripts/tsconfig.json` disables the strict family (`strict`, `strictNullChecks`, `noImplicitAny`, `useUnknownInCatchVariables`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`); after `pnpm exec nuxt prepare`, the four generated `.nuxt/tsconfig.{app,server,shared,node}.json` resolve `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `noImplicitAny`, `verbatimModuleSyntax` and `isolatedModules` to `true`; and the project enables `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` and `noImplicitOverride`, recording any deliberate omission as a decision note.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `nuxt.config.ts`, `tsconfig.json`, `scripts/tsconfig.json` · Src: [7], [8]
- **[CODE-02] Erasable syntax in Node-run scripts** — `scripts/tsconfig.json` keeps `erasableSyntaxOnly: true` and `verbatimModuleSyntax: true`, and no `.ts` file under `scripts/` declares an `enum`, a `namespace` or a constructor parameter property, because the scripts run directly through Node type stripping (`node scripts/check-oxlint-rules.ts`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `scripts/tsconfig.json`, `scripts/**/*.ts` · Src: [7], [8]
- **[CODE-03] TypeScript 7 readiness** — No tsconfig and no `typescript.tsConfig` block of `nuxt.config.ts` sets an option deprecated in TS 6.0 and removed in 7.0 (`baseUrl`, `moduleResolution` `node`/`node10`/`classic`, `target: es5`, `downlevelIteration`, `outFile`, `module` `amd`/`umd`/`systemjs`/`none`, `esModuleInterop: false`, `allowSyntheticDefaultImports: false`, `alwaysStrict: false`) or `ignoreDeprecations: "6.0"`, and every hand-written tsconfig lists its ambient packages in an explicit `types` array because `types` defaults to `[]` (verified: typescript 6.0.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tsconfig.json`, `scripts/tsconfig.json`, `nuxt.config.ts` · Src: [8], [9]
- **[CODE-04] No type escape hatches** — No `.ts` or `.vue` file under `app/`, `server/`, `shared/`, `scripts/` or `configs/` uses `any` (annotation, `as any`, `any[]`, generic argument or default), an `as unknown as T` double cast, or a non-null assertion; every remaining narrowing `as T` is replaced by a Zod `.parse()`, a type guard or `satisfies`, or carries the two-line `// Acceptable as …` + `oxlint-disable-next-line typescript/no-unsafe-type-assertion` pair; source contains zero `@ts-ignore`/`@ts-nocheck`, any `@ts-expect-error` states its reason, and `no-explicit-any`, `no-unsafe-*`, `no-non-null-assertion` and `ban-ts-comment` stay at `error` (untrusted values are typed `unknown` and narrowed).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` · Src: [11], project: AGENTS.md

## 2. Lint health

- **[CODE-05] Lint and typecheck gates green** — `pnpm run lint` (Oxlint, then ESLint) exits 0 with zero errors and zero warnings, and `pnpm run typecheck` (`nuxt typecheck`, vue-tsc) exits 0 with zero diagnostics; neither linter reports an unknown or missing rule, and the typecheck script is the project type gate because `typescript.typeCheck` is `false`.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [10], project: AGENTS.md
- **[CODE-06] Type-aware lint tier** — ESLint TypeScript rules run with type information (`eslint.config.typescript.tsconfigPath` in `nuxt.config.ts`), Oxlint runs with `options.typeAware: true` backed by the `oxlint-tsgolint` dev dependency, and every rule of typescript-eslint's `strict-type-checked` and `stylistic-type-checked` configs is at `error` (or `off` only because Oxlint enforces it), together with `strict-boolean-expressions`, `switch-exhaustiveness-check` and `no-unsafe-type-assertion`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `nuxt.config.ts`, `oxlint.config.jsonc`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts`, `package.json` · Src: [10], [11]
- **[CODE-07] Oxlint rule inventory complete** — `pnpm run lint:oxlint:check-rules` exits 0: every rule exposed by the installed Oxlint (plugins `jest`, `jsdoc`, `jsx_a11y`, `nextjs`, `react`, `react_perf` excluded) is configured explicitly, on or off, in `oxlint.config.jsonc`.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: project: scripts/check-oxlint-rules.ts
- **[CODE-08] No cross-linter drift** — `eslint.config.ts` spreads `oxlint.buildFromOxlintConfigFile("./oxlint.config.jsonc")` as the last config passed to `withNuxt(...)`, project rule sets are applied through `.override()` on named Nuxt configs, and the `lint` scripts run Oxlint before ESLint; a rule configured in both places has the same severity and options (notably the `no-magic-numbers` ignore lists, `id-length` exceptions, `max-params`, `max-lines-per-function`, `max-nested-callbacks` and `no-underscore-dangle` allow lists), ESLint thresholds come from `configs/eslint/eslint.constants.ts`, and `MAX_LENGTH` equals the `.editorconfig` `max_line_length` of 150 (verified: eslint-plugin-oxlint 1.89.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/**`, `oxlint.config.jsonc` · Src: [10], [12]
- **[CODE-09] Disable-directive policy** — Every `eslint-disable*`/`oxlint-disable*` directive is a `-next-line` directive naming specific rules, immediately preceded by a line starting `// Acceptable as`, then one space and a concise reason with no trailing period (no inline `-- reason`, no other wording); production code has zero file-level or block-level directives and zero rule-less disables unless a decision note approves the instance; the number of directives per 1,000 non-spec lines is recorded in the audit report and never increases from the previous audit, and a diff adds one only when no code change can satisfy the rule.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`, `scripts/**/*.ts` · Src: project: AGENTS.md
- **[CODE-10] Lint scope complete** — `ESLINT_IGNORES` and Oxlint `ignorePatterns` list only generated, vendored or agent output (`.output`, `node_modules`, `dist`, `packages`, unit coverage, acceptance reports, `.agents`, `.opencode`); no directory of `app/`, `server/`, `shared/`, `scripts/`, `configs/` or `tests/` is ignored by either linter.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/eslint.constants.ts`, `oxlint.config.jsonc` · Src: [10]

## 3. Dead code

- **[CODE-11] No dead code or dead lint configuration** — `pnpm dlx knip --include files,exports,types,enumMembers,duplicates` reports zero unused files, exports, exported types, enum members and duplicate exports in `app/`, `server/`, `shared/` and `scripts/` (framework-discovered entries justified in the report); every flat config under `configs/eslint/flat-configs/` is imported by `eslint.config.ts`, every exported constant of `configs/eslint/eslint.constants.ts` is consumed, and every Oxlint `overrides[].files` glob matches at least one tracked file.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [18]
- **[CODE-12] No commented-out or unreachable code** — Source contains no run of three or more consecutive comment lines that parse as code, no disabled statement kept just in case (git history is the archive), and no `if (false)`, dead branch after an exhaustive narrowing, or statement after `return`/`throw`; no tsconfig sets `allowUnreachableCode: true`, and `no-unreachable`, `no-constant-condition` and `@typescript-eslint/no-unnecessary-condition` stay at `error`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [1]
- **[CODE-13] No unused component CSS** — No selector in an SFC `<style>` block lacks a matching class, attribute or element in that component's template, and no global class in `app/assets/css/**` is unreferenced.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/assets/css/**` · Src: [13]

## 4. Duplication

- **[CODE-14] Duplication gates** — SonarQube Cloud reports duplicated-lines density ≤ 3.0 % on new code (Sonar way gate, `sonar.cpd.exclusions` limited to `**/*.constants.ts`, `**/*.json` and `**/*.config.ts`); `pnpm dlx jscpd` over `app/`, `server/` and `shared/` (specs excluded, `minTokens` 50, `minLines` 5, `--baseline-from-ref` to the PR base, `--fail-on-new-clones 0`) exits 0; and no two SFCs share ≥ 80 % of their script + template token sequence (similarity mode over `app/components/**/*.vue`), a match being merged into one component with props or a shared composable.
  Evidence: `command` · Diff: ✗ · Severity: medium · Look: `sonar-project.properties` · Src: [2], [5], [19], [20]
- **[CODE-15] No duplicated literals or config** — An identical literal array, object, regular expression or default value appearing in two or more production files is defined once in a `*.constants.ts` or `*.enums.ts` and imported.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `server/**/*.ts`, `shared/constants/**` · Src: [1]
- **[CODE-16] One implementation per concern** — A change never re-implements existing behaviour: async lanes use `useAsyncAction`, toasts use `useAppToast`, time/string/object/locale helpers come from `shared/utils/helpers/**`, and generic collection/equality utilities come from `radashi` instead of a hand-written copy.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/core/useAsyncAction/**`, `app/composables/ui/useAppToast/**`, `shared/utils/helpers/**` · Src: [1], project: docs/architecture.md §4.2

## 5. Complexity

- **[CODE-17] Complexity budgets** — SonarQube Cloud reports no open S3776 issue (cognitive complexity ≤ 15) on `app/`, `server/` or `shared/`, and the `complexity` rule is configured with an explicit `max` of 10 in both ESLint and Oxlint so no function exceeds 10 decision points (`if`, `&&`, `||`, `?:`, loops, `case`, `catch`).
  Evidence: `command` · Diff: ✗ · Severity: medium · Look: `sonar-project.properties` · Src: [3], [4], [6]
- **[CODE-18] Function size and parameter caps** — `max-lines-per-function` stays at `error` with `max: 30`, `skipBlankLines` and `skipComments` in both linters for production code (overrides limited to spec, setup and store files), and no production function takes more than 4 positional parameters — 5 or more related parameters become a named, typed options object (the lint ceiling `MAX_PARAMS` = 8 is a hard stop, not the target).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `configs/eslint/eslint.constants.ts`, `configs/eslint/flat-configs/**`, `oxlint.config.jsonc` · Src: [1], project: configs/eslint/eslint.constants.ts
- **[CODE-19] Bounded nesting** — No function body nests more than 4 control structures (`max-depth` enabled at 4 in both linters) and no template nests more than 3 levels of `v-if`/`v-for`; deeper logic moves to early returns, helpers or child components.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/**/*.ts`, `server/**/*.ts`, `shared/**/*.ts` · Src: [1], [4]
- **[CODE-20] Typed lookup maps for discriminants** — Because `switch` is banned by `no-restricted-syntax`, a mapping over a union (enum or literal union, e.g. `AsyncResult` variants, question categories) uses a `Record<Union, T>` object that fails to compile when a member is added, and no `if`/`else if` chain has more than 5 branches on one discriminant.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/utils/**`, `shared/utils/**`, `configs/eslint/flat-configs/eslint-global.flat-config.ts` · Src: [1], [11], project: configs/eslint/flat-configs/eslint-global.flat-config.ts

## 6. Naming & magic values

- **[CODE-21] No magic numbers or inline domain literals** — `no-magic-numbers` stays at `error` in both linters with only `0`, `1` and `-1` ignored (plus array indexes and default values), disabled only for spec, fixture, constants and config overrides, and numeric limits, durations and sizes live in `*.constants.ts` with unit-suffixed names (`…_IN_MS`); cookie names, store ids, route paths, locale codes, error codes, log event names and API paths come from `*.constants.ts`, `*.enums.ts` or `@goat-it/schemas` constant arrays, never an inline domain string.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `oxlint.config.jsonc`, `configs/eslint/flat-configs/eslint-global.flat-config.ts`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` · Src: [11]
- **[CODE-22] Naming enforced and self-explanatory** — `@typescript-eslint/naming-convention` stays at `error` with `NAMING_CONVENTION_DEFAULT_CONFIG` (enum members `UPPER_CASE`; types, enums and type parameters `PascalCase`; functions `camelCase`; booleans prefixed `is`/`has`/`should`/`can`/…; exported variables `UPPER_CASE`) and no per-file override relaxes it for production code; project symbol forms hold (composables `use*`, stores `use<Entity>Store`, repository factories `<resource>Repository`, mappers `create<Entity>From<Dto>`, schemas and constants `UPPER_SNAKE_CASE`, types `PascalCase` aliases declared with `type`), and exported names state their domain meaning without abbreviations beyond the `id-length` exceptions or generic placeholders (`data`, `info`, `tmp`, `handle`, `manager`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/eslint.constants.ts`, `configs/eslint/flat-configs/**` · Src: [11], project: configs/eslint/eslint.constants.ts

## 7. JSDoc policy & comments

- **[CODE-23] Comment and marker policy** — `.ts` and `.vue` files under `app/`, `server/`, `shared/` and `scripts/` contain no plain `//` or `/* */` comment except JSDoc on the surfaces of `docs/jsdoc.md` §1, the two-line lint-disable pair, and inline comments inside an `@example` sample; source contains zero `TODO`, `FIXME`, `XXX` or `HACK` markers (`no-warning-comments` is off, so grep is the proof) and open work is tracked as a GitHub issue.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`, `scripts/**/*.ts` · Src: [21], project: docs/jsdoc.md §4
- **[CODE-24] JSDoc on public APIs, in the documented style, adding semantics** — Every surface in the `docs/jsdoc.md` §1 table has its required block (composable function block and return-type summary, store block plus every action and exposed state/getter, repository factory and method signatures, every exported helper and mapper, and the type block of shared, server-domain and app logic types); blocks open with a one-sentence present-tense summary ending with a period, use no `{Type}` in tags, no `@author`/`@since`/`@file`/`@type`, put `@throws` on throwing functions, state composable option/return members once in the colocated `use-*.types.ts`, stay within 150 characters per line, and document what TypeScript cannot express (side effects, lifecycle, invariants, failure behaviour, units, fallbacks) rather than restating the symbol name or types.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `app/stores/**`, `app/repositories/**`, `server/utils/**`, `shared/utils/**`, `shared/types/**` · Src: [21], project: docs/jsdoc.md §1

## 8. SFC, composable & store conventions

- **[CODE-25] SFC structure and component identity** — Every `.vue` file uses `<script lang="ts" setup>` (no Options API, no plain-JS `<script>`) and orders blocks `<script>`, `<template>`, `<style>` (`vue/component-api-style`, `vue/block-order`); every component name is multi-word except the root `App` and the `error` page, and matches its filename; and every component `<style>` block is `scoped`, global styles living only in `app/assets/css/**`, `app/App.vue` and `app/layouts/**`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `configs/eslint/flat-configs/eslint-vue.flat-config.ts` · Src: project: docs/architecture.md §4.1, project: AGENTS.md
- **[CODE-26] Typed component contract and simple templates** — Props, emits and slots are declared type-based (`defineProps<…>()`, `defineEmits<…>()`, `defineSlots<…>()`) from the component contract types, never in array form; props are not destructured, every emitted event is declared, exposed members go through a typed `defineExpose`; and templates contain no chained calls, multi-step expressions or inline business logic — such expressions become a `computed` or a function, and a `computed` performs one derivation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue`, `app/components/**/*.types.ts` · Src: [13], [14], [15], project: docs/architecture.md §4.1
- **[CODE-27] Stable `v-for` keys, no `v-if` with `v-for`** — Every `v-for` binds `:key` to a stable domain identity (id, code) — an array index, a composite built from the index or `Math.random()` is a finding — and `v-if` and `v-for` never sit on the same element (filtering uses a computed list, conditional rendering a wrapper or `<template>`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [13]
- **[CODE-28] Composable return contract** — Every composable is a named `use*` function with an explicit return annotation referencing a named `Use<Thing>` type from its colocated `use-*.types.ts`, and it returns a plain object of refs, computed refs and functions, never a `reactive()` object.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**/use*.ts`, `app/composables/**/use-*.types.ts` · Src: [16], project: docs/architecture.md §4.2
- **[CODE-29] Store definition shape** — Each `*.store.ts` declares exactly one setup store as `export const use<Entity>Store = defineStore(StoreNames.<ENTITY>, () => { … })`; no option-syntax store, no string-literal id and no second `defineStore` in the file.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/stores/**/*.store.ts`, `app/stores/store.enums.ts` · Src: [17], project: AGENTS.md
- **[CODE-30] Explicit imports, aliases, no barrels, named exports** — Imports in `app/`, `server/`, `shared/` and `tests/` use the project aliases (`@/`, `#shared/`, `#server/` inside `server/` only, `~~/`, `~/` only for Nuxt resources) and never `./` or `../`, with project utilities imported explicitly even where Nuxt or Nitro would auto-import them; no file re-exports another module or exists only to alias a symbol (`oxc/no-barrel-file` at `error`), and utilities, composables, stores, repositories, helpers, mappers, schemas, constants and types use named exports — default exports appear only in framework entrypoints and config files that require them.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: project: docs/architecture.md §7, project: AGENTS.md

## 9. Error-handling consistency

- **[CODE-31] No silent catch, caught values narrowed** — Every `catch` block and `.catch()` callback re-throws with context, returns a typed failure, or logs and surfaces an i18n message — none is empty or returns a fallback value without recording the error — and every caught value is typed `unknown` and narrowed (`instanceof`, Zod, a type guard) before property access, with `use-unknown-in-catch-callback-variable` at `error` and no catch clause annotating its variable with a concrete type.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [1], project: AGENTS.md
- **[CODE-32] One failure contract per module** — Each repository, store action, server helper and handler either always throws or always returns a typed result (`AsyncResult` for store actions); no module mixes ad-hoc try/catch swallowing with typed failures.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/repositories/**`, `app/stores/**`, `server/utils/**`, `server/api/**`, `shared/types/async-result.types.ts` · Src: [1], project: docs/architecture.md §4.3
- **[CODE-33] Validation errors propagate** — No `try/catch` wraps a Zod `.parse()` unless the caller can recover, and every `.safeParse()` result branches on `success` before reading `data`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/repositories/**`, `server/**/*.ts`, `shared/schemas/**` · Src: project: AGENTS.md
- **[CODE-34] No floating promises** — Every promise is awaited, returned, or explicitly discarded with `void`; `no-floating-promises` and `no-misused-promises` stay at `error`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` · Src: [11]

## Sources

[1] Refactoring Guru — Code Smells catalog — https://refactoring.guru/refactoring/smells — fetched 2026-10-31 (catalog 2014–2026)
[2] SonarQube Cloud — Understanding measures and metrics — https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/metric-definitions/ — fetched 2026-10-31 (current 2026)
[3] SonarSource SonarJS — rule S3776 metadata (JSON) — https://raw.githubusercontent.com/SonarSource/SonarJS/master/sonar-plugin/javascript-checks/src/main/resources/org/sonar/l10n/javascript/rules/javascript/S3776.json — fetched 2026-10-31 (master 2026)
[4] SonarSource eslint-plugin-sonarjs — cognitive-complexity rule source — https://raw.githubusercontent.com/SonarSource/eslint-plugin-sonarjs/master/src/rules/cognitive-complexity.ts — fetched 2026-10-31 (master 2026)
[5] SonarQube Cloud — Understanding quality gates — https://docs.sonarsource.com/sonarqube-cloud/standards/managing-quality-gates/introduction-to-quality-gates.md — fetched 2026-10-31 (current 2026)
[6] Sonar — Cognitive Complexity white paper — https://www.sonarsource.com/resources/cognitive-complexity/ — fetched 2026-10-31 (2021-04-05)
[7] TypeScript — TSConfig Reference — https://www.typescriptlang.org/tsconfig/ — fetched 2026-10-31 (current 2026; typescript 6.0.3 installed)
[8] TypeScript blog — Announcing TypeScript 6.0 — https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/ — fetched 2026-10-31 (2026-03-23; typescript 6.0.3 installed)
[9] TypeScript blog index — https://devblogs.microsoft.com/typescript/ — fetched 2026-10-31 (TS 7.0 2026-07-08, TS 7.1 beta 2026-10-20)
[10] typescript-eslint — Shared Configs — https://typescript-eslint.io/users/configs/ — fetched 2026-10-31 (docs v8.72.1; library 8.66.0 installed)
[11] typescript-eslint — Rules overview — https://typescript-eslint.io/rules/ — fetched 2026-10-31 (docs v8.72.1; library 8.66.0 installed)
[12] eslint-plugin-oxlint — README — https://github.com/oxc-project/eslint-plugin-oxlint — fetched 2026-10-31 (library 1.89.0)
[13] Vue.js Style Guide — Priority A: Essential — https://vuejs.org/style-guide/rules-essential — fetched 2026-10-31 (current 2026; vue 3.5.44)
[14] Vue.js Style Guide — Priority B: Strongly Recommended — https://vuejs.org/style-guide/rules-strongly-recommended — fetched 2026-10-31 (current 2026; vue 3.5.44)
[15] Vue.js Style Guide — Priority D: Use with Caution — https://vuejs.org/style-guide/rules-use-with-caution — fetched 2026-10-31 (current 2026; vue 3.5.44)
[16] Vue.js — Composables — https://vuejs.org/guide/reusability/composables.html — fetched 2026-10-31 (current 2026; vue 3.5.44)
[17] Pinia — Defining a Store — https://pinia.vuejs.org/core-concepts/ — fetched 2026-10-31 (docs v3.x; pinia 4.1.0 installed)
[18] Knip — Issue Types — https://knip.dev/reference/issue-types — fetched 2026-10-31 (knip v6)
[19] jscpd — README — https://github.com/kucherenko/jscpd — fetched 2026-10-31 (jscpd v5)
[20] jscpd — The config file — https://jscpd.dev/reference/config-file — fetched 2026-10-31 (jscpd v5)
[21] Google eng-practices — What to look for in a code review — https://google.github.io/eng-practices/review/reviewer/looking-for.html — fetched 2026-10-31 (current 2026)
