# ARCH — Architecture & design

Conformance of the repository to its canonical architecture guide, `docs/architecture.md`: where each file of the Nuxt 4 + Nitro quiz game lives (`app/`, `server/`, root `shared/`, `scripts/`, `tests/`), how it is named, which companions it carries, which runtime boundary it may depend on (app UI → composables/stores → repositories → internal `/api/goat-it-api/**` routes → server handlers, everything → runtime-neutral `shared/`), who owns and mutates Pinia state, how cohesive and coupled the units are, whether domain rules exist once, whether the module graph is free of cycles and orphans, and how architecture decisions and named exceptions are recorded. Named exceptions in `docs/architecture.md` (layout `spec/` folders, centralized i18n parity specs, Nuxt route wrappers, `gsap.types.ts`, contract-free components without `.types.ts`) are documented decisions and resolve to DECIDED.

**Decision doc:** `docs/architecture.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** TypeScript strictness, lint health, dead exports, complexity metrics, code duplication tooling, symbol naming, aliases and barrels, composable return-type annotations, JSDoc, prop mutation and Vue SFC rules → CODE · docs drift and general documentation structure → DOCS · framework API correctness (Pinia setup-store returns, no `readonly()`, `useStore()` before `await`, `useRequestFetch`, Nuxt discovery options) → STACK · cancellation primitive, timeouts, superseded handling and upstream DTO strictness → REL · game state machine and async ordering → LOGIC · Vitest project setup, mock registration and coverage → TEST · agent, skill and command files → AGENT

## Contents

- [1. Conformance](#1-conformance)
- [2. Dependency direction](#2-dependency-direction)
- [3. State ownership](#3-state-ownership)
- [4. Cohesion](#4-cohesion)
- [5. Coupling](#5-coupling)
- [6. Duplicated domain rules](#6-duplicated-domain-rules)
- [7. Cycles and orphan files](#7-cycles-and-orphan-files)
- [8. Decision records](#8-decision-records)
- [Sources](#sources)

## 1. Conformance

- **[ARCH-01] Placement follows the decision tree** — Every added or moved file sits where the §1 decision tree places it: framework-scanned files in their Nuxt location (`app/pages/`, `app/layouts/`, `app/components/`, `server/{api,routes,middleware,plugins}/`), runtime-neutral code in root `shared/`, server-only code in `server/utils/<domain>/`, and app-only code in `app/{components,composables/{core,domain,ui},stores/domain,repositories,utils/{core,domain,ui}}/`. A file whose runtime boundary contradicts its directory is a finding.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**`, `server/**`, `shared/**` · Src: project: docs/architecture.md §1, project: docs/architecture.md §2
- **[ARCH-02] Filename encodes the artifact kind** — Files use the §3 forms: `PascalCase.vue`, `usePascalCase.ts`, `<entity>.store.ts`, `<resource>.repository.ts`, `<resource>.<method>.handler.ts`, `<name>.helpers.ts`, `<entity>.mappers.ts`, `<name>.constants.ts`, `<entity>.schemas.ts`, `<name>.enums.ts` and `<name>.types.ts`. Auxiliary files are kebab-case and domain directory names are singular (`question-theme/`, `element/`) even when the file names the entity in plural.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**`, `server/utils/**`, `shared/**` · Src: project: docs/architecture.md §3
- **[ARCH-03] Spec suffix matches its Vitest project** — Each unit spec sits beside its source and keeps the routing suffix of its artifact (`.store.spec.ts`, `.repository.spec.ts`, `.helpers.spec.ts`, `.mappers.spec.ts`, `.translations.spec.ts`, `.dom.helpers.spec.ts`), so it runs in the matching project among `nuxt`, `composables`, `stores`, `repositories`, `node` and `dom`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**/*.store.spec.ts`, `app/repositories/**/*.repository.spec.ts`, `configs/vitest/**` · Src: project: docs/architecture.md §8.1, project: AGENTS.md
- **[ARCH-04] Every tested unit owns a directory** — An independently tested production unit owns a directory holding its source and spec as siblings. A component directory holds exactly one primary `.vue`; child components own separate directories. Single-unit domains (`shared/utils/helpers/{locale,object,string,time}/`) keep source and spec at the domain level without an extra `helpers/` level.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/composables/**`, `shared/utils/helpers/**` · Src: project: docs/architecture.md §3, project: docs/architecture.md §4.1, project: docs/architecture.md §5
- **[ARCH-05] No catch-all buckets** — No `misc`, `common` or universal top-level `helpers/`, `constants/` or `types/` taxonomy is introduced. Every `helpers/` directory sits beneath a named owner and contains responsibility-named unit directories (`helpers/<responsibility>/`).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/utils/**`, `server/utils/**`, `app/composables/**/helpers/**` · Src: project: docs/architecture.md §3, project: docs/architecture.md §3.2
- **[ARCH-06] Contract-bearing components have a types companion** — A component declaring props, emits, slots or `defineExpose` members has a colocated `*.types.ts` defining the full contract. A component without any contract has no `.types.ts` (named exception), and no empty or ceremonial companion file exists.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.types.ts`, `app/components/**/*.vue` · Src: project: docs/architecture.md §4.1, project: docs/architecture.md §8.1
- **[ARCH-07] Private contracts live in companions** — Helper-private types and constants live in a colocated `.types.ts` or `.constants.ts` beside the helper, and a handler's request/response contract lives in a sibling `.types.ts` (for example `check-liveness.types.ts`). Neither is declared inside the `.helpers.ts` or `.handler.ts` source.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `server/routes/**/*.types.ts`, `shared/utils/helpers/**`, `app/utils/**/helpers/**` · Src: project: docs/architecture.md §3.1, project: docs/architecture.md §6.1
- **[ARCH-08] Narrowest production owner** — A type, constant or helper sits beside its only production consumer and is promoted to the narrowest common domain root only when two or more production units consume it. Test-only imports never justify promotion; a runtime-neutral helper with one consumer may stay in `shared/`, while app-only contracts never move to `shared/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.constants.ts`, `app/**/*.types.ts`, `shared/**` · Src: project: docs/architecture.md §1, project: docs/architecture.md §3.1, project: docs/architecture.md §5
- **[ARCH-09] No route candidates under pages** — `app/pages/` contains only route `index.vue` files and their colocated `index.spec.ts`. Page constants and types live in the narrowest `app/utils/` domain outside `pages/`; only trivial one-use literals stay inline.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**` · Src: project: docs/architecture.md §4.6
- **[ARCH-10] Thin framework entrypoints** — `server/api/**` and `server/routes/**` `index.<method>.ts` wrappers only bind a handler unit with a default-export `defineEventHandler`. Nitro plugins, app plugins, `NN-<name>.middleware.ts` files and the root `sentry.*.config.ts` files keep only registration, dispatch or lifecycle glue and delegate behavior to covered helper units.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/api/**`, `server/routes/**`, `server/plugins/**`, `server/middleware/**`, `app/plugins/**`, `sentry.*.config.ts` · Src: project: docs/architecture.md §6.1, project: docs/architecture.md §6.3, project: docs/architecture.md §4.7, project: docs/architecture.md §5
- **[ARCH-11] Handler units never become routes** — `nuxt.config.ts` `nitro.ignore` keeps `api/**/handlers/**` and `routes/**/handlers/**`, and every handler unit lives in a `handlers/<action>/` directory covered by those patterns.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `server/api/**/handlers/**`, `server/routes/**/handlers/**` · Src: project: docs/architecture.md §6.1
- **[ARCH-12] Layer category matches responsibility** — In `app/composables/` and `app/utils/`, `core/` holds framework, browser or infrastructure behavior, `domain/` holds app-only business logic without markup, styling or presentation state, and `ui/` holds presentation behavior and tokens. Directories under `app/composables/` contain only composables.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `app/utils/**` · Src: project: docs/architecture.md §4.2, project: docs/architecture.md §4.5
- **[ARCH-13] Framework registrations survive moves** — After a page, layout or component move, the built app serves the same public paths (`/`, `/game`, `/rules`, `/offline`), resolves the same layouts, and renders Nuxt Content components under the name used by MDC Markdown.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: project: docs/architecture.md §2, project: docs/architecture.md §4.1, project: docs/architecture.md §4.6

## 2. Dependency direction

- **[ARCH-14] App never imports server code** — No module under `app/` imports `#server/…` or a path under `server/`; app data access crosses the runtime boundary only through internal `/api/goat-it-api/**` routes.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**` · Src: [4], project: docs/architecture.md §2
- **[ARCH-15] Server never imports app code** — No module under `server/` imports `@/`, `~/` or a path under `app/`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/**` · Src: [4], project: docs/architecture.md §2
- **[ARCH-16] Shared stays runtime-neutral** — Modules under `shared/` import no `app/`, `server/`, `#build/` or `#imports` module and no Vue, Nuxt, `@nuxt/ui` or other UI dependency, and use no browser or DOM global (`window`, `document`, `localStorage`).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `shared/**` · Src: [4], project: docs/architecture.md §2, project: docs/architecture.md §5
- **[ARCH-17] Scripts stay standalone** — Files under `scripts/` import no project alias (`@/`, `~/`, `~~/`, `#shared/`, `#server/`) and no module under `app/`, `server/` or `shared/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `scripts/**` · Src: project: docs/architecture.md §2, project: docs/architecture.md §9
- **[ARCH-18] App calls only internal API routes** — No app module calls the external Goat It API (its base URL or the server-only `runtimeConfig.goatItApi`); repositories under `app/repositories/goat-it-api/` are the only app callers of `/api/goat-it-api/**`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/repositories/**`, `app/**` · Src: project: docs/architecture.md §2, project: docs/architecture.md §4.4
- **[ARCH-19] UI never imports repositories** — Components and pages never import a `*.repository.ts` module nor call `/api/` routes with `$fetch`; stores construct repositories and expose actions instead.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/pages/**` · Src: [4], project: docs/architecture.md §2, project: docs/architecture.md §4.4
- **[ARCH-20] Repositories stay thin** — Repository factories accept a `$Fetch`-compatible dependency, call no Nuxt composable, embed no UI logic and perform no DTO-to-domain mapping.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/repositories/**` · Src: project: docs/architecture.md §4.4, project: AGENTS.md
- **[ARCH-21] DTOs are mapped in server mapper units** — Server handlers convert upstream DTOs to domain values only through pure `create<Entity>From<Dto>` functions in `server/utils/goat-it-api/mappers/<entity>/`; handlers contain no inline field-by-field mapping.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/mappers/**`, `server/api/**/handlers/**` · Src: project: docs/architecture.md §2, project: docs/architecture.md §6.2

## 3. State ownership

- **[ARCH-22] Stores are presentation-agnostic** — Files under `app/stores/` import or call no toast API (`useToast`, `useAppToast`), no i18n API (`useI18n`, `$t`, `t()`), no overlay API (`useOverlay`, `useLazyModal`), no router API (`useRouter`, `useRoute`, `navigateTo`), no component and no DOM API (`window`, `document`). Async failures surface only through the returned `AsyncResult`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/**` · Src: [2], project: docs/architecture.md §4.3
- **[ARCH-23] Store state changes only through actions** — No component, page or composable assigns store state (`store.x = …`, `stateRef.value = …` on a `storeToRefs` ref), mutates a store-owned array or object in place (`store.items.push(…)`, `store.settings.field = …`) or calls `$patch`; every change goes through an action of the owning store.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/**`, `app/pages/**`, `app/composables/**` · Src: [2], project: docs/architecture.md §4.1, project: docs/architecture.md §4.2, project: docs/architecture.md §4.3
- **[ARCH-24] Async store actions return AsyncResult** — Every async store action returns the discriminated `AsyncResult` from `shared/types/async-result.types.ts`, so the caller decides how to surface the failure.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `shared/types/async-result.types.ts` · Src: project: docs/architecture.md §4.3
- **[ARCH-25] Transient store state is a read-only getter** — Fetch statuses and loading flags are exposed by stores as read-only `computed` getters, never as writable refs consumers could assign.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**` · Src: project: docs/architecture.md §4.3, project: AGENTS.md
- **[ARCH-26] Caller owns presentation feedback** — The composable or component that calls a store action and receives its result owns the user feedback (toast, translated message); domain composables reach it only through UI composables (`useAppToast`, `useI18n`) and own no markup.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/domain/**`, `app/composables/ui/useAppToast/**` · Src: project: docs/architecture.md §4.2
- **[ARCH-27] Presentation children use props and emits** — A presentation child receives the data it displays through props and reports user intent through emits; only feature-owning components read a store or shared-state domain composable. Ownership follows responsibility, not depth, and no pass-through prop chain exists solely to hide a store read.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**` · Src: project: docs/architecture.md §4.1

## 4. Cohesion

- **[ARCH-28] Component size budget** — No `.vue` SFC exceeds 300 non-blank lines or 250 template lines; a larger component is split into child components or composables.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue`, `app/pages/**/*.vue` · Src: [1]
- **[ARCH-29] Composable size budget** — No composable file exceeds 200 lines and no composable returns more than 8 members; a larger one is split by responsibility.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**` · Src: [1], [7]
- **[ARCH-30] One store per file and per entity** — Each store file holds exactly one `defineStore` whose id comes from `StoreNames` (`app/stores/store.enums.ts`), no two stores share an id, and a store owns one domain entity; a store owning two entities is split.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `app/stores/store.enums.ts` · Src: [2], project: docs/architecture.md §3, project: docs/architecture.md §4.3
- **[ARCH-31] Store size budget** — No store file exceeds 250 lines or 10 actions.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**` · Src: [1], [2]
- **[ARCH-32] Mixed modules split by dependency** — A helper module that mixes runtime-neutral domain behavior with UI mappings is split along that boundary: the neutral part under `shared/utils/helpers/<domain>/`, the UI part under `app/utils/ui/<domain>/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/**`, `app/utils/ui/**` · Src: project: docs/architecture.md §3.1, project: docs/architecture.md §5

## 5. Coupling

- **[ARCH-33] UI tokens stay in the app UI layer** — Icons, presentation colors, labels and CSS/Tailwind classes for domain values live in `app/utils/ui/<domain>/` or the consuming component, never in `shared/`, `server/`, `app/utils/domain/` or `app/stores/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/utils/ui/**`, `shared/**`, `app/utils/domain/**` · Src: project: docs/architecture.md §3.1, project: docs/architecture.md §5
- **[ARCH-34] No DTO types in UI** — Components and pages reference no `*Dto` type and consume domain types from `shared/types/`; their `@goat-it/schemas` imports are limited to domain types and domain constant arrays (`QuestionCategory`, `QUESTION_CATEGORIES`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/pages/**`, `shared/types/**` · Src: [4], project: AGENTS.md, project: docs/architecture.md §2
- **[ARCH-35] No feature envy** — A function that reads three or more members of another module's object and at most one of its own moves to that module (a store getter, or a helper of that domain).
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [1]

## 6. Duplicated domain rules

- **[ARCH-36] One source per domain invariant** — Each domain invariant used by more than one unit (question and theme shape rules, locale validity, filter narrowing) is implemented once, in a schema or helper under `shared/` or in the owning unit, and every consumer imports that implementation; no second hand-written copy exists in `app/` or `server/`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `shared/schemas/**`, `shared/utils/helpers/**` · Src: [1], project: docs/architecture.md §2, project: docs/architecture.md §5
- **[ARCH-37] Cross-runtime constants defined once** — Values used by both app and server (cookie names from `CookieNames`, locale lists, Goat It API constants, site constants) are declared once in `shared/constants/` or `shared/enums/`; no identical literal array, object or default is repeated across `app/` and `server/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/constants/**`, `shared/enums/**` · Src: [1], project: docs/architecture.md §5, project: AGENTS.md
- **[ARCH-38] Upstream contract reused, not copied** — No module redefines a schema, DTO type or domain constant array exported by `@goat-it/schemas` (for example `QUESTION_CATEGORIES`, `QUESTION_COGNITIVE_DIFFICULTIES`, `isValidLocale`); server code validates upstream data with the package schemas and app code imports the package constants.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/**`, `app/**`, `shared/**` · Src: project: docs/architecture.md §2, project: docs/architecture.md §6.1, project: AGENTS.md

## 7. Cycles and orphan files

- **[ARCH-39] No runtime import cycles** — Added or changed imports create no runtime cycle between project modules; cycles made only of `import type` edges are tolerated.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**`, `server/**`, `shared/**` · Src: [4], [5]
- **[ARCH-40] No orphan production modules** — Every production module under `app/`, `server/` or `shared/` is reachable from a framework entrypoint (page, layout, Nuxt-registered component, plugin, server route, middleware, `nuxt.config.ts`); removing the last consumer of a unit also removes its spec and companions.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**`, `server/**`, `shared/**` · Src: [4], [6], project: docs/architecture.md §3
- **[ARCH-41] Cycle and orphan tooling configured** — When dependency-cruiser or knip is adopted, its configuration fails on runtime cycles (dependency-cruiser `circular: true` with `viaOnly.dependencyTypesNot: ["type-only"]` at severity `error`) and on orphan files (a dependency-cruiser `orphan: true` rule run on folders, or the knip `files` issue type), excluding `*.spec.ts` and `*.d.ts`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `package.json` · Src: [4], [5], [6]
- **[ARCH-42] Boundaries have an enforcement path** — Each §2 boundary (app ↛ server, server ↛ app, shared ↛ app/server, scripts ↛ project aliases, components/pages ↛ repositories) is either enforced by a tool rule such as a dependency-cruiser `forbidden` rule at severity `error`, or explicitly listed as enforced by convention and review only.
  Evidence: `static` · Diff: ✓ · Severity: info · Look: `docs/architecture.md` · Src: [3], [4], project: docs/architecture.md §10

## 8. Decision records

- **[ARCH-43] Deviations are named exceptions** — A file placement that departs from the guide matches a named exception in `docs/architecture.md` (layout specs in `app/layouts/<Layout>/spec/`, i18n parity specs in `app/i18n/specs/`, Nuxt route wrappers, `app/utils/ui/gsap/gsap.types.ts`) or a recorded decision; an unlisted deviation is a finding, not a precedent.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/layouts/**`, `app/i18n/specs/**`, `docs/architecture.md` · Src: project: docs/architecture.md §4.5, project: docs/architecture.md §4.6, project: docs/architecture.md §8.1
- **[ARCH-44] New boundaries are decided first** — A new root folder, layer category, import alias or Vitest project appears only with an approved design and the matching `docs/architecture.md` update in the same change.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/architecture.md` · Src: project: docs/architecture.md §7, project: docs/architecture.md §9, project: docs/architecture.md §10
- **[ARCH-45] Decision record format** — When an architecture decision log is introduced (for example `docs/adr/`), every record follows the Nygard (title, status, context, decision, consequences) or MADR template, carries a status (proposed, accepted, deprecated, superseded) and a date, and superseded records stay and link to their replacement.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/**` · Src: [8], [9]

## Sources

[1] Refactoring Guru — Code Smells catalog — https://refactoring.guru/refactoring/smells — fetched 2026-10-31 (2014–2026)
[2] Pinia — Defining a Store — https://pinia.vuejs.org/core-concepts/ — fetched 2026-10-31 (v3.x docs)
[3] dependency-cruiser — README — https://github.com/sverweij/dependency-cruiser — fetched 2026-10-31 (main)
[4] dependency-cruiser — Rules reference — https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md — fetched 2026-10-31 (main)
[5] dependency-cruiser — configs/recommended.cjs — https://raw.githubusercontent.com/sverweij/dependency-cruiser/main/configs/recommended.cjs — fetched 2026-10-31 (main)
[6] Knip — Issue Types — https://knip.dev/reference/issue-types — fetched 2026-10-31 (knip v6)
[7] Vue.js — Composables — https://vuejs.org/guide/reusability/composables.html — fetched 2026-10-31 (Vue 3 docs)
[8] ADR GitHub organization — homepage — https://adr.github.io/ — fetched 2026-10-31 (current)
[9] ADR GitHub organization — ADR Templates — https://adr.github.io/adr-templates/ — fetched 2026-10-31 (updated 2026-07-07)
