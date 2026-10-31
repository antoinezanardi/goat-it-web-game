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

- **[ARCH-01] Placement follows the decision tree** — Every added or moved file sits where the §1 decision tree places it (framework-scanned files in their Nuxt location, runtime-neutral code in root `shared/`, server-only code in `server/utils/<domain>/`, app-only code in `app/{components,composables/{core,domain,ui},stores/domain,repositories,utils/{core,domain,ui}}/`); an independently tested unit owns a directory holding source and spec as siblings, a component directory holds exactly one primary `.vue`, no `misc`/`common`/universal `helpers/`/`constants/`/`types/` bucket exists, and `app/pages/` contains only route `index.vue` files with their colocated `index.spec.ts`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**`, `server/**`, `shared/**` · Src: project: docs/architecture.md §1, project: docs/architecture.md §2
- **[ARCH-02] Filename encodes the artifact kind** — Files use the §3 forms: `PascalCase.vue`, `usePascalCase.ts`, `<entity>.store.ts`, `<resource>.repository.ts`, `<resource>.<method>.handler.ts`, `<name>.helpers.ts`, `<entity>.mappers.ts`, `<name>.constants.ts`, `<entity>.schemas.ts`, `<name>.enums.ts` and `<name>.types.ts`. Auxiliary files are kebab-case and domain directory names are singular (`question-theme/`, `element/`) even when the file names the entity in plural.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**`, `server/utils/**`, `shared/**` · Src: project: docs/architecture.md §3
- **[ARCH-03] Spec suffix matches its Vitest project** — Each unit spec sits beside its source and keeps the routing suffix of its artifact (`.store.spec.ts`, `.repository.spec.ts`, `.helpers.spec.ts`, `.mappers.spec.ts`, `.translations.spec.ts`, `.dom.helpers.spec.ts`), so it runs in the matching project among `nuxt`, `composables`, `stores`, `repositories`, `node` and `dom`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**/*.store.spec.ts`, `app/repositories/**/*.repository.spec.ts`, `configs/vitest/**` · Src: project: docs/architecture.md §8.1, project: AGENTS.md
- **[ARCH-04] Contract-bearing components have a types companion** — A component declaring props, emits, slots or `defineExpose` members has a colocated `*.types.ts` defining the full contract, a contract-free component has none (named exception), helper-private types and constants live in a colocated `.types.ts`/`.constants.ts` beside the helper, and a handler request/response contract lives in a sibling `.types.ts` — never inline in the source.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.types.ts`, `app/components/**/*.vue` · Src: project: docs/architecture.md §4.1, project: docs/architecture.md §8.1
- **[ARCH-05] Narrowest production owner** — A type, constant or helper sits beside its only production consumer and is promoted to the narrowest common domain root only when two or more production units consume it. Test-only imports never justify promotion; a runtime-neutral helper with one consumer may stay in `shared/`, while app-only contracts never move to `shared/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.constants.ts`, `app/**/*.types.ts`, `shared/**` · Src: project: docs/architecture.md §1, project: docs/architecture.md §3.1, project: docs/architecture.md §5
- **[ARCH-06] Thin framework entrypoints** — `server/api/**` and `server/routes/**` `index.<method>.ts` wrappers only bind a handler unit with a default-export `defineEventHandler`, and `nuxt.config.ts` `nitro.ignore` keeps `api/**/handlers/**` and `routes/**/handlers/**` so handler units never become routes; Nitro plugins, app plugins, `NN-<name>.middleware.ts` files and the root `sentry.*.config.ts` files keep only registration, dispatch or lifecycle glue and delegate behavior to covered helper units.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/api/**`, `server/routes/**`, `server/plugins/**`, `server/middleware/**`, `app/plugins/**`, `sentry.*.config.ts` · Src: project: docs/architecture.md §6.1, project: docs/architecture.md §6.3, project: docs/architecture.md §4.7, project: docs/architecture.md §5
- **[ARCH-07] Layer category matches responsibility** — In `app/composables/` and `app/utils/`, `core/` holds framework, browser or infrastructure behavior, `domain/` holds app-only business logic without markup, styling or presentation state, and `ui/` holds presentation behavior and tokens. Directories under `app/composables/` contain only composables.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `app/utils/**` · Src: project: docs/architecture.md §4.2, project: docs/architecture.md §4.5
- **[ARCH-08] Framework registrations survive moves** — After a page, layout or component move, the built app serves the same public paths (`/`, `/game`, `/rules`, `/offline`), resolves the same layouts, and renders Nuxt Content components under the name used by MDC Markdown.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: project: docs/architecture.md §2, project: docs/architecture.md §4.1, project: docs/architecture.md §4.6

## 2. Dependency direction

- **[ARCH-09] Cross-runtime boundaries hold and are enforced** — No module under `app/` imports `#server/…` or a path under `server/`, and no module under `server/` imports `@/`, `~/` or a path under `app/`; app data access crosses the runtime boundary only through internal `/api/goat-it-api/**` routes, and each cross-runtime boundary is either enforced by a tool rule (a dependency-cruiser `forbidden` rule at `error`) or explicitly listed in `docs/architecture.md` as enforced by convention and review only.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**` · Src: [3], [4], project: docs/architecture.md §2
- **[ARCH-10] Shared and scripts stay runtime-neutral** — Modules under `shared/` import no `app/`, `server/`, `#build/` or `#imports` module and no Vue, Nuxt, `@nuxt/ui` or other UI dependency and use no browser or DOM global; files under `scripts/` import no project alias (`@/`, `~/`, `~~/`, `#shared/`, `#server/`) and no module under `app/`, `server/` or `shared/`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `shared/**` · Src: [4], project: docs/architecture.md §2, project: docs/architecture.md §5
- **[ARCH-11] App calls only internal API routes** — No app module calls the external Goat It API (its base URL or the server-only `runtimeConfig.goatItApi`) — repositories under `app/repositories/goat-it-api/` are the only app callers of `/api/goat-it-api/**` — and components and pages never import a `*.repository.ts` module nor call `/api/` routes with `$fetch`; stores construct repositories and expose actions instead.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/repositories/**`, `app/**` · Src: project: docs/architecture.md §2, project: docs/architecture.md §4.4
- **[ARCH-12] Thin repositories, mapped DTOs** — Repository factories accept a `$Fetch`-compatible dependency, call no Nuxt composable, embed no UI logic and perform no DTO-to-domain mapping; server handlers convert upstream DTOs only through pure `create<Entity>From<Dto>` functions in `server/utils/goat-it-api/mappers/<entity>/`, never inline field-by-field.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/repositories/**` · Src: project: docs/architecture.md §4.4, project: AGENTS.md

## 3. State ownership

- **[ARCH-13] Stores are presentation-agnostic** — Files under `app/stores/` import or call no toast API, no i18n API, no overlay API, no router API, no component and no DOM API — async failures surface only through the returned `AsyncResult` — and the composable or component that calls a store action and receives its result owns the user feedback, domain composables reaching it only through UI composables and owning no markup.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/stores/**` · Src: [2], project: docs/architecture.md §4.3
- **[ARCH-14] Store state changes only through actions** — No component, page or composable assigns store state (`store.x = …`, `stateRef.value = …` on a `storeToRefs` ref), mutates a store-owned array or object in place (`store.items.push(…)`, `store.settings.field = …`) or calls `$patch`; every change goes through an action of the owning store.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/components/**`, `app/pages/**`, `app/composables/**` · Src: [2], project: docs/architecture.md §4.1, project: docs/architecture.md §4.2, project: docs/architecture.md §4.3
- **[ARCH-15] Async store actions return AsyncResult** — Every async store action returns the discriminated `AsyncResult` from `shared/types/async-result.types.ts` so the caller decides how to surface the failure, and fetch statuses and loading flags are exposed as read-only `computed` getters, never as writable refs consumers could assign.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `shared/types/async-result.types.ts` · Src: project: docs/architecture.md §4.3
- **[ARCH-16] Presentation children use props and emits** — A presentation child receives the data it displays through props and reports user intent through emits; only feature-owning components read a store or shared-state domain composable. Ownership follows responsibility, not depth, and no pass-through prop chain exists solely to hide a store read.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**` · Src: project: docs/architecture.md §4.1

## 4. Cohesion

- **[ARCH-17] Component and composable size budgets** — No `.vue` SFC exceeds 300 non-blank lines or 250 template lines, no composable file exceeds 200 lines and no composable returns more than 8 members; a larger unit is split into child components, composables or helpers by responsibility.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue`, `app/pages/**/*.vue` · Src: [1], [7]
- **[ARCH-18] One store per file and per entity** — Each store file holds exactly one `defineStore` whose id comes from `StoreNames`, no two stores share an id, a store owns one domain entity (a store owning two is split), and no store file exceeds 250 lines or 10 actions.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `app/stores/store.enums.ts` · Src: [2], project: docs/architecture.md §3, project: docs/architecture.md §4.3

## 5. Coupling

- **[ARCH-19] No UI leakage across layers** — Icons, presentation colors, labels and CSS/Tailwind classes for domain values live in `app/utils/ui/<domain>/` or the consuming component, never in `shared/`, `server/`, `app/utils/domain/` or `app/stores/`; a helper module mixing runtime-neutral domain behavior with UI mappings is split along that boundary (`shared/utils/helpers/<domain>/` and `app/utils/ui/<domain>/`); and components and pages reference no `*Dto` type, consuming domain types from `shared/types/` with `@goat-it/schemas` imports limited to domain types and constant arrays.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/utils/ui/**`, `shared/**`, `app/utils/domain/**` · Src: project: docs/architecture.md §3.1, project: docs/architecture.md §5

## 6. Duplicated domain rules

- **[ARCH-20] One source per domain rule and constant** — Each domain invariant used by more than one unit (question and theme shape rules, locale validity, filter narrowing) is implemented once in a schema or helper under `shared/` or in the owning unit and imported by every consumer; values used by both app and server (cookie names, locale lists, Goat It API constants, site constants) are declared once in `shared/constants/` or `shared/enums/`, with no identical literal repeated across `app/` and `server/`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `shared/schemas/**`, `shared/utils/helpers/**` · Src: [1], project: docs/architecture.md §2, project: docs/architecture.md §5
- **[ARCH-21] Upstream contract reused, not copied** — No module redefines a schema, DTO type or domain constant array exported by `@goat-it/schemas` (for example `QUESTION_CATEGORIES`, `QUESTION_COGNITIVE_DIFFICULTIES`, `isValidLocale`); server code validates upstream data with the package schemas and app code imports the package constants.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/**`, `app/**`, `shared/**` · Src: project: docs/architecture.md §2, project: docs/architecture.md §6.1, project: AGENTS.md

## 7. Cycles and orphan files

- **[ARCH-22] No cycles or orphans, and the tooling exists** — Added or changed imports create no runtime cycle between project modules (cycles made only of `import type` edges are tolerated), every production module under `app/`, `server/` or `shared/` is reachable from a framework entrypoint, and when dependency-cruiser or knip is adopted its configuration fails on runtime cycles (`circular: true` with `viaOnly.dependencyTypesNot: ["type-only"]`) and on orphan files, excluding `*.spec.ts` and `*.d.ts`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**`, `server/**`, `shared/**` · Src: [4], [5], [6]

## 8. Decision records

- **[ARCH-23] Deviations and new boundaries are decided, not invented** — A file placement that departs from the guide matches a named exception in `docs/architecture.md` or a recorded decision (an unlisted deviation is a finding, not a precedent); a new root folder, layer category, import alias or Vitest project appears only with an approved design and the matching architecture-guide update in the same change; and when an architecture decision log is introduced, every record follows the Nygard or MADR template with a status and a date, superseded records staying and linking to their replacement.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/layouts/**`, `app/i18n/specs/**`, `docs/architecture.md` · Src: project: docs/architecture.md §4.5, project: docs/architecture.md §4.6, project: docs/architecture.md §8.1 [8], [9]

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
