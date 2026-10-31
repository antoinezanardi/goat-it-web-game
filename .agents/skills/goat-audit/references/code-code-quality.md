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

- **[CODE-01] Strict family never disabled** — `nuxt.config.ts` keeps `typescript.strict: true`, and no `compilerOptions` in `nuxt.config.ts`, `tsconfig.json` or `scripts/tsconfig.json` sets `strict`, `strictNullChecks`, `noImplicitAny`, `useUnknownInCatchVariables`, `noUncheckedIndexedAccess`, `noImplicitOverride` or `noImplicitReturns` to `false`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `tsconfig.json`, `scripts/tsconfig.json` · Src: [7], [8]
- **[CODE-02] Effective strict flags in every context** — After `pnpm exec nuxt prepare`, each generated `.nuxt/tsconfig.app.json`, `.nuxt/tsconfig.server.json`, `.nuxt/tsconfig.shared.json` and `.nuxt/tsconfig.node.json` resolves `strict`, `noUncheckedIndexedAccess`, `noImplicitReturns` and `noImplicitAny` to `true`.
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [7]
- **[CODE-03] Module-syntax flags in every context** — `verbatimModuleSyntax` and `isolatedModules` are `true` in all four generated `.nuxt/tsconfig.*.json` contexts, including the Nitro server context, so type-only imports must be written `import type`.
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [7], [11]
- **[CODE-04] Extra strictness flags** — The project's TypeScript options enable `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature` and `noImplicitOverride` for all four contexts (app, server, shared, node); a flag deliberately left off is recorded as a decision note in `docs/architecture.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [7]
- **[CODE-05] Erasable syntax in Node-run scripts** — `scripts/tsconfig.json` keeps `erasableSyntaxOnly: true` and `verbatimModuleSyntax: true`, and no `.ts` file under `scripts/` declares an `enum`, a `namespace` or a constructor parameter property, because the scripts run directly through Node type stripping (`node scripts/check-oxlint-rules.ts`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `scripts/tsconfig.json`, `scripts/**/*.ts` · Src: [7], [8]
- **[CODE-06] TypeScript 7 readiness** — No tsconfig and no `typescript.tsConfig` block of `nuxt.config.ts` sets an option deprecated in TS 6.0 and removed in 7.0 (`baseUrl`, `moduleResolution` `node`/`node10`/`classic`, `target: es5`, `downlevelIteration`, `outFile`, `module` `amd`/`umd`/`systemjs`/`none`, `esModuleInterop: false`, `allowSyntheticDefaultImports: false`, `alwaysStrict: false`) or `ignoreDeprecations: "6.0"`, and every hand-written tsconfig lists its ambient packages in an explicit `types` array because `types` defaults to `[]` (verified: typescript 6.0.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tsconfig.json`, `scripts/tsconfig.json`, `nuxt.config.ts` · Src: [8], [9]
- **[CODE-07] Zero `any`** — No `.ts` or `.vue` file under `app/`, `server/`, `shared/`, `scripts/` or `configs/` uses `any` (annotation, `as any`, `any[]`, generic argument or default); `no-explicit-any` and `no-unsafe-argument`, `no-unsafe-assignment`, `no-unsafe-call`, `no-unsafe-member-access`, `no-unsafe-return` stay at `error`, and untrusted values are typed `unknown` and narrowed.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` · Src: [11], project: AGENTS.md
- **[CODE-08] Justified type assertions** — No `as unknown as T` double cast exists, and every remaining narrowing `as T` (anything but `as const`) is either replaced by a Zod `.parse()`, a type guard or `satisfies`, or carries the two-line `// Acceptable as …` + `oxlint-disable-next-line typescript/no-unsafe-type-assertion` pair.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [11], project: AGENTS.md
- **[CODE-09] No non-null assertions** — Production code contains zero non-null assertions (`value!`, `value!.member`); `no-non-null-assertion` stays at `error`, and reads typed `T | undefined` by `noUncheckedIndexedAccess` are narrowed with guards, `?.` or `??`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [7], [11]
- **[CODE-10] No compiler suppression directives** — Source contains zero `@ts-ignore` and `@ts-nocheck`; any `@ts-expect-error` states its reason after the directive; `ban-ts-comment` stays at `error` in both linters.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `server/**/*.ts`, `shared/**/*.ts`, `oxlint.config.jsonc` · Src: [10], [11]

## 2. Lint health

- **[CODE-11] Lint gate green** — `pnpm run lint` (Oxlint, then ESLint) exits 0 with zero errors and zero warnings, and neither linter reports an unknown rule or a missing rule definition.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [10], project: AGENTS.md
- **[CODE-12] Typecheck gate green** — `pnpm run typecheck` (`nuxt typecheck`, vue-tsc) exits 0 with zero diagnostics; it is the project's type gate because `nuxt.config.ts` sets `typescript.typeCheck: false`.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [7], project: AGENTS.md
- **[CODE-13] Type-aware lint tier** — ESLint TypeScript rules run with type information (`eslint.config.typescript.tsconfigPath` in `nuxt.config.ts`), Oxlint runs with `options.typeAware: true` backed by the `oxlint-tsgolint` dev dependency, and every rule of typescript-eslint's `strict-type-checked` and `stylistic-type-checked` configs is at `error` (or `off` only because Oxlint enforces it), together with `strict-boolean-expressions`, `switch-exhaustiveness-check` and `no-unsafe-type-assertion`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `oxlint.config.jsonc`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts`, `package.json` · Src: [10], [11]
- **[CODE-14] Oxlint rule inventory complete** — `pnpm run lint:oxlint:check-rules` exits 0: every rule exposed by the installed Oxlint (plugins `jest`, `jsdoc`, `jsx_a11y`, `nextjs`, `react`, `react_perf` excluded) is configured explicitly, on or off, in `oxlint.config.jsonc`.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: project: scripts/check-oxlint-rules.ts
- **[CODE-15] ESLint defers to Oxlint** — `eslint.config.ts` spreads `oxlint.buildFromOxlintConfigFile("./oxlint.config.jsonc")` as the last config passed to `withNuxt(...)`, project rule sets are applied through `.override()` on named Nuxt configs rather than appended after it, and the `lint` scripts run Oxlint before ESLint, so rules Oxlint supports are turned off in ESLint (verified: eslint-plugin-oxlint 1.89.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `eslint.config.ts`, `package.json` · Src: [12]
- **[CODE-16] No cross-linter drift** — A rule configured both in `configs/eslint/flat-configs/**` and in `oxlint.config.jsonc` has the same severity and options in both — notably the `no-magic-numbers` ignore lists, `id-length` exceptions, `max-params`, `max-lines-per-function`, `max-nested-callbacks` and `no-underscore-dangle` allow lists — and ESLint thresholds come from `configs/eslint/eslint.constants.ts`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/**`, `oxlint.config.jsonc` · Src: [10]
- **[CODE-17] Line-length parity** — `MAX_LENGTH` in `configs/eslint/eslint.constants.ts` equals the `.editorconfig` `max_line_length` of 150 that `AGENTS.md` documents, so the linter and the editor enforce one limit.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `configs/eslint/eslint.constants.ts`, `.editorconfig` · Src: [10], project: AGENTS.md
- **[CODE-18] Disable-comment format** — Every `eslint-disable*` or `oxlint-disable*` directive in a `.ts` or `.vue` file is a `-next-line` directive naming specific rules, immediately preceded by a line starting `// Acceptable as ` with a concise reason and no trailing period; no inline `-- reason` suffix and no other wording is used.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`, `scripts/**/*.ts` · Src: project: AGENTS.md
- **[CODE-19] No broad disables** — Production code has zero file-level or block-level lint directives (`/* eslint-disable */`, `// oxlint-disable <rule>` outside a `-next-line` form, `eslint-disable`/`eslint-enable` pairs) and zero rule-less disables unless a decision note approves the instance; `unicorn/no-abusive-eslint-disable` stays at `error`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`, `oxlint.config.jsonc` · Src: project: AGENTS.md
- **[CODE-20] Disable-directive budget** — The number of lint-disable directives per 1,000 non-spec lines in `app/`, `server/` and `shared/` is recorded in the audit report and does not increase from the previous GOAT audit; a diff adds a directive only when no code change can satisfy the rule.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [10], project: AGENTS.md
- **[CODE-21] Lint scope complete** — `ESLINT_IGNORES` and Oxlint `ignorePatterns` list only generated, vendored or agent output (`.output`, `node_modules`, `dist`, `packages`, unit coverage, acceptance reports, `.agents`, `.opencode`); no directory of `app/`, `server/`, `shared/`, `scripts/`, `configs/` or `tests/` is ignored by either linter.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/eslint.constants.ts`, `oxlint.config.jsonc` · Src: [10]

## 3. Dead code

- **[CODE-22] Knip finds no dead code** — `pnpm dlx knip --include files,exports,types,enumMembers,duplicates` reports zero unused files, unused exports, unused exported types, unused enum members and duplicate exports in `app/`, `server/`, `shared/` and `scripts/`; each remaining item is a framework-discovered entry (page, layout, plugin, route wrapper, config) and is justified in the report.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [18]
- **[CODE-23] No commented-out code** — Source contains no run of three or more consecutive comment lines that parse as code and no disabled statement kept "just in case"; git history is the archive.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [1]
- **[CODE-24] No unreachable code** — No tsconfig or `nuxt.config.ts` sets `allowUnreachableCode: true`; `no-unreachable`, `no-constant-condition` and `@typescript-eslint/no-unnecessary-condition` stay at `error`; no `if (false)`, dead branch after an exhaustive narrowing, or statement after `return`/`throw` exists.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `nuxt.config.ts`, `oxlint.config.jsonc`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` · Src: [7], [11]
- **[CODE-25] No dead lint configuration** — Every flat config under `configs/eslint/flat-configs/` is imported by `eslint.config.ts`, every exported constant of `configs/eslint/eslint.constants.ts` is consumed, and every Oxlint `overrides[].files` glob matches at least one tracked file.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `eslint.config.ts`, `configs/eslint/**`, `oxlint.config.jsonc` · Src: [18]
- **[CODE-26] No unused component CSS** — No selector in an SFC `<style>` block lacks a matching class, attribute or element in that component's template, and no global class in `app/assets/css/**` is unreferenced.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/assets/css/**` · Src: [13]

## 4. Duplication

- **[CODE-27] New-code duplication gate** — SonarQube Cloud reports duplicated-lines density ≤ 3.0 % on new code for project `antoinezanardi_goat-it-web-game` (Sonar way gate value), with `sonar.cpd.exclusions` limited to `**/*.constants.ts`, `**/*.json` and `**/*.config.ts`.
  Evidence: `command` · Diff: ✗ · Severity: medium · Look: `sonar-project.properties` · Src: [2], [5]
- **[CODE-28] No new clone in the diff** — `pnpm dlx jscpd` over `app/`, `server/` and `shared/` (`.ts` and `.vue`, specs excluded) with explicit `minTokens` 50 and `minLines` 5, `--baseline-from-ref` set to the pull request base branch and `--fail-on-new-clones 0` exits 0.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [19], [20]
- **[CODE-29] No near-duplicate components** — No two SFCs share ≥ 80 % of their script + template token sequence; jscpd's similarity mode over `app/components/**/*.vue` is the proof, and a match is merged into one component with props or a shared composable.
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [19]
- **[CODE-30] No duplicated literals or config** — An identical literal array, object, regular expression or default value appearing in two or more production files is defined once in a `*.constants.ts` or `*.enums.ts` and imported.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `server/**/*.ts`, `shared/constants/**` · Src: [1]
- **[CODE-31] One implementation per concern** — A change never re-implements existing behaviour: async lanes use `useAsyncAction`, toasts use `useAppToast`, time/string/object/locale helpers come from `shared/utils/helpers/**`, and generic collection/equality utilities come from `radashi` instead of a hand-written copy.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/core/useAsyncAction/**`, `app/composables/ui/useAppToast/**`, `shared/utils/helpers/**` · Src: [1], project: docs/architecture.md §4.2

## 5. Complexity

- **[CODE-32] Cognitive complexity ≤ 15** — SonarQube Cloud reports no open issue for rule S3776 (cognitive complexity, default threshold 15, severity Critical in the Sonar way profile) on `app/`, `server/` or `shared/`; a function over 15 is split.
  Evidence: `command` · Diff: ✗ · Severity: medium · Look: `sonar-project.properties` · Src: [3], [4], [6]
- **[CODE-33] Cyclomatic complexity ≤ 10** — The `complexity` rule is configured with an explicit `max` of 10 in both ESLint and Oxlint, so no function exceeds 10 decision points (`if`, `&&`, `||`, `?:`, loops, `case`, `catch`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/flat-configs/eslint-global.flat-config.ts`, `oxlint.config.jsonc` · Src: [2]
- **[CODE-34] Function length cap** — `max-lines-per-function` stays at `error` with `max: 30`, `skipBlankLines` and `skipComments` in both linters for production code; overrides turning it off are limited to spec, setup and store files.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `configs/eslint/eslint.constants.ts`, `configs/eslint/flat-configs/**`, `oxlint.config.jsonc` · Src: [1], project: configs/eslint/eslint.constants.ts
- **[CODE-35] Bounded nesting** — No function body nests more than 4 control structures (`max-depth` enabled at 4 in both linters) and no template nests more than 3 levels of `v-if`/`v-for`; deeper logic moves to early returns, helpers or child components.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/**/*.ts`, `server/**/*.ts`, `shared/**/*.ts` · Src: [1], [4]
- **[CODE-36] Short parameter lists** — No production function takes more than 4 positional parameters; 5 or more related parameters become a named, typed options object (the lint ceiling `MAX_PARAMS` = 8 is a hard stop, not the target).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.ts`, `server/**/*.ts`, `shared/**/*.ts`, `configs/eslint/eslint.constants.ts` · Src: [1], [11]
- **[CODE-37] Typed lookup maps for discriminants** — Because `switch` is banned by `no-restricted-syntax`, a mapping over a union (enum or literal union, e.g. `AsyncResult` variants, question categories) uses a `Record<Union, T>` object that fails to compile when a member is added, and no `if`/`else if` chain has more than 5 branches on one discriminant.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/utils/**`, `shared/utils/**`, `configs/eslint/flat-configs/eslint-global.flat-config.ts` · Src: [1], [11], project: configs/eslint/flat-configs/eslint-global.flat-config.ts
- **[CODE-38] No boolean flag parameters** — No function takes a `boolean` parameter that selects between two behaviours; it is split into two functions or takes a discriminated option.
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [1]

## 6. Naming & magic values

- **[CODE-39] No magic numbers** — `no-magic-numbers` stays at `error` in both linters with only `0`, `1` and `-1` ignored (plus array indexes and default values), and is disabled only for spec, fixture, constants and config overrides; numeric limits, durations and sizes live in `*.constants.ts` with unit-suffixed names (`…_IN_MS`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `oxlint.config.jsonc`, `configs/eslint/flat-configs/eslint-global.flat-config.ts`, `configs/eslint/flat-configs/eslint-typescript.flat-config.ts` · Src: [11]
- **[CODE-40] Domain literals centralized** — Cookie names, store ids, route paths, locale codes, error codes, log event names and API paths come from `*.constants.ts`, `*.enums.ts` or `@goat-it/schemas` constant arrays; logic never compares against an inline domain string.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/enums/**`, `shared/constants/**`, `app/stores/**`, `server/utils/**` · Src: [11], project: AGENTS.md
- **[CODE-41] Naming convention enforced** — `@typescript-eslint/naming-convention` stays at `error` with `NAMING_CONVENTION_DEFAULT_CONFIG` (enum members `UPPER_CASE`; types, enums and type parameters `PascalCase`; functions `camelCase`; booleans prefixed `is`/`has`/`should`/`can`/…; exported variables `UPPER_CASE`) and no per-file override relaxes it for production code.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/eslint.constants.ts`, `configs/eslint/flat-configs/**` · Src: [11], project: configs/eslint/eslint.constants.ts
- **[CODE-42] Project symbol forms** — Composables are named `use*`, stores `use<Entity>Store`, repository factories `<resource>Repository`, mappers `create<Entity>From<Dto>`, schemas and constants `UPPER_SNAKE_CASE`, and types `PascalCase` aliases declared with `type` (never `interface`).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/**`, `app/stores/**`, `app/repositories/**`, `server/utils/**`, `shared/schemas/**` · Src: project: docs/architecture.md §3
- **[CODE-43] Self-explanatory names** — Exported names state their domain meaning without abbreviations beyond the `id-length` exceptions (`T`, `K`, `t`, `i`, `j`, `k`, `x`, `y`) and without generic placeholders (`data`, `info`, `tmp`, `handle`, `manager`).
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [21]

## 7. JSDoc policy & comments

- **[CODE-44] Comment policy** — `.ts` and `.vue` files under `app/`, `server/`, `shared/` and `scripts/` contain no plain `//` or `/* */` comment except JSDoc on the surfaces of `docs/jsdoc.md` §1, the two-line lint-disable pair, and inline comments inside an `@example` sample.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`, `scripts/**/*.ts` · Src: [21], project: docs/jsdoc.md §4
- **[CODE-45] No TODO or FIXME markers** — Source contains zero `TODO`, `FIXME`, `XXX` or `HACK` markers (`no-warning-comments` is off in both linters, so grep is the proof); open work is tracked as a GitHub issue.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [21], project: AGENTS.md
- **[CODE-46] JSDoc on public logic APIs** — Every surface in the `docs/jsdoc.md` §1 table has its required block: composable function block and return-type summary, store block plus every action and exposed state/getter, repository factory and method signatures, every exported helper and mapper in `server/utils`, `shared/utils` and `app/utils`, and the type block of shared, server-domain and app logic types.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `app/stores/**`, `app/repositories/**`, `server/utils/**`, `shared/utils/**`, `shared/types/**` · Src: [21], project: docs/jsdoc.md §1
- **[CODE-47] JSDoc style** — Blocks open with a one-sentence present-tense summary ending with a period, use no `{Type}` in tags and no `@author`, `@since`, `@file` or `@type`, put `@throws` on functions that throw (including `never`-returning server helpers), state composable option/return members once in the colocated `use-*.types.ts`, and stay within 150 characters per line.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/composables/**`, `app/stores/**`, `server/utils/**`, `shared/utils/**` · Src: project: docs/jsdoc.md §2
- **[CODE-48] JSDoc adds semantics** — Each block documents what TypeScript cannot express (side effects, lifecycle, invariants, failure behaviour, units, fallbacks); a block that only restates the symbol name or its types, or a new block on an out-of-scope surface (component contracts, handlers, constants, enums, private helpers), is a finding.
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [21], project: docs/jsdoc.md §1

## 8. SFC, composable & store conventions

- **[CODE-49] SFC structure** — Every `.vue` file uses `<script lang="ts" setup>` (no Options API, no plain-JS `<script>`) and orders blocks `<script>`, `<template>`, `<style>`, enforced by `vue/component-api-style` and `vue/block-order` with `order: ["script", "template", "style"]`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `configs/eslint/flat-configs/eslint-vue.flat-config.ts` · Src: project: docs/architecture.md §4.1, project: AGENTS.md
- **[CODE-50] Multi-word component names** — Every component name is multi-word except the root `App` and the `error` page (`vue/multi-word-component-names` ignore list), and the component name matches its filename.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `configs/eslint/flat-configs/eslint-vue.flat-config.ts` · Src: [13]
- **[CODE-51] Typed component contract** — Props, emits and slots are declared type-based (`defineProps<…>()`, `defineEmits<…>()`, `defineSlots<…>()`) from the component's contract types, never in array form; props are not destructured (`vue/define-props-destructuring: never`), every emitted event is declared (`vue/require-explicit-emits`) and exposed members go through a typed `defineExpose`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue`, `app/components/**/*.types.ts` · Src: [13], [15], project: docs/architecture.md §4.1
- **[CODE-52] Stable `v-for` keys** — Every `v-for` binds `:key` to a stable domain identity (id, code); an array index, a composite built from the index, or `Math.random()` is a finding.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [13]
- **[CODE-53] No `v-if` with `v-for`** — `v-if` and `v-for` never sit on the same element; filtering uses a computed list and conditional rendering uses a wrapper or `<template>`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [13]
- **[CODE-54] Scoped component styles** — Every component `<style>` block is `scoped` (`vue/enforce-style-attribute`); global styles live only in `app/assets/css/**`, `app/App.vue` and `app/layouts/**`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/assets/css/**`, `app/layouts/**` · Src: [13]
- **[CODE-55] Simple template expressions** — Templates contain no chained calls, multi-step expressions or inline business logic; such expressions become a `computed` or a function in `<script setup>`, and a `computed` performs one derivation.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.vue` · Src: [14], project: AGENTS.md
- **[CODE-56] Composable return contract** — Every composable is a named `use*` function with an explicit return annotation referencing a named `Use<Thing>` type from its colocated `use-*.types.ts`, and it returns a plain object of refs, computed refs and functions, never a `reactive()` object.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**/use*.ts`, `app/composables/**/use-*.types.ts` · Src: [16], project: docs/architecture.md §4.2
- **[CODE-57] Store definition shape** — Each `*.store.ts` declares exactly one setup store as `export const use<Entity>Store = defineStore(StoreNames.<ENTITY>, () => { … })`; no option-syntax store, no string-literal id and no second `defineStore` in the file.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/stores/**/*.store.ts`, `app/stores/store.enums.ts` · Src: [17], project: AGENTS.md
- **[CODE-58] Aliases only, explicit imports** — Imports in `app/`, `server/`, `shared/` and `tests/` use the project aliases (`@/` for app code, `#shared/`, `#server/` inside `server/` only, `~~/` for repository-root modules, `~/` only for Nuxt resources) and never `./` or `../`; project utilities are imported explicitly even where Nuxt or Nitro would auto-import them.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: project: docs/architecture.md §7, project: AGENTS.md
- **[CODE-59] No barrels or re-export files** — No file re-exports another module (`export * from`, `export { x } from`) or exists only to alias a symbol from another module; `oxc/no-barrel-file` stays at `error`, and consumers import from the source module.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `server/**/*.ts`, `shared/**/*.ts`, `oxlint.config.jsonc` · Src: project: docs/architecture.md §3, project: AGENTS.md
- **[CODE-60] Named exports only** — Utilities, composables, stores, repositories, helpers, mappers, schemas, constants and types use named exports; default exports appear only in framework entrypoints and configuration files that require them, which are the only `import/no-default-export` overrides.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.ts`, `server/**/*.ts`, `shared/**/*.ts`, `oxlint.config.jsonc` · Src: project: docs/architecture.md §3

## 9. Error-handling consistency

- **[CODE-61] No silent catch** — Every `catch` block and `.catch()` callback re-throws with context, returns a typed failure, or logs and surfaces an i18n message; none is empty or returns a fallback value without recording the error.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts` · Src: [1], project: AGENTS.md
- **[CODE-62] One failure contract per module** — Each repository, store action, server helper and handler either always throws or always returns a typed result (`AsyncResult` for store actions); no module mixes ad-hoc try/catch swallowing with typed failures.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/repositories/**`, `app/stores/**`, `server/utils/**`, `server/api/**`, `shared/types/async-result.types.ts` · Src: [1], project: docs/architecture.md §4.3
- **[CODE-63] Caught values narrowed** — Every caught value is typed `unknown` and narrowed (`instanceof`, Zod, a type guard) before property access; `use-unknown-in-catch-callback-variable` stays at `error` and no catch clause annotates its variable with a concrete type.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `server/**/*.ts`, `shared/**/*.ts` · Src: [7], [11]
- **[CODE-64] Validation errors propagate** — No `try/catch` wraps a Zod `.parse()` unless the caller can recover, and every `.safeParse()` result branches on `success` before reading `data`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/repositories/**`, `server/**/*.ts`, `shared/schemas/**` · Src: project: AGENTS.md
- **[CODE-65] No floating promises** — Every promise is awaited, returned, or explicitly discarded with `void`; `no-floating-promises` and `no-misused-promises` stay at `error`.
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
