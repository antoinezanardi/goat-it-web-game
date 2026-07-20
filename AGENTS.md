# AGENTS

This file is a concise, actionable guide for automated agents working in this repository.
It explains how to build, lint and run tests (including running a single test), plus
the coding conventions agents must follow (imports, formatting, types, naming, error
handling, Nuxt conventions, and other repo-specific rules).

## Build / Run / Lint / Test commands

- Package manager: `pnpm` (exact version in `package.json` -> `packageManager`).
  - Unlike npm, `pnpm` does NOT require an extra `--` before flags. Pass arguments directly:
    `pnpm run test:unit -t "should render"` (correct) vs ~~`pnpm run test:unit -- -t "should render"`~~ (unnecessary).
- Node requirement: see `package.json` -> `engines.node` and `configs/node/.node-version`.
- Dev server: `pnpm run dev` (nuxt dev, port 4000, dotenv `envs/.env.development`)
- Build: `pnpm run build`; preview: `pnpm run preview` / `pnpm run start:prod`

- Linting (always run both linters):
  - Full lint: `pnpm run lint`         Full lint + fix: `pnpm run lint:fix`
  - ESLint only: `pnpm run lint:eslint` / `pnpm run lint:eslint:fix`
  - Oxlint only: `pnpm run lint:oxlint` / `pnpm run lint:oxlint:fix`
- Typecheck: `pnpm run typecheck` (nuxt typecheck / vue-tsc, strict mode)

- Tests:
  - Full unit run:   `pnpm run test:unit`
  - With coverage:   `pnpm run test:unit:cov`
  - Watch mode:      `pnpm run test:unit:watch`
  - Acceptance (Cucumber + Playwright): `pnpm run test:acceptance`
  - Acceptance build only: `pnpm run test:acceptance:build`
  - Install Playwright: `pnpm run test:acceptance:prepare` (run once locally)

Running a single test or file (`NODE_OPTIONS='--no-webstorage'` is required):

- By filename:    `pnpm run test:unit index.spec.ts`
- By test name:    `pnpm run test:unit -t "should render"`
- Watch file: `pnpm run test:unit:watch app/pages/index.spec.ts`
- Direct:     `pnpm exec cross-env NODE_OPTIONS='--no-webstorage' vitest --config configs/vitest/vitest.config.ts path/to/file.spec.ts`

Running acceptance tests:

- Full run (build + test):  `pnpm run test:acceptance`
- Build only:               `pnpm run test:acceptance:build`
- By scenario name:         `pnpm run test:acceptance --name "should display"`
- By tag:                   `pnpm run test:acceptance --tags "@question-themes"`
- Multiple tags (OR):       `pnpm run test:acceptance --tags "@home or @questions"`
- Exclude tag:              `pnpm run test:acceptance --tags "not @accessibility"`
- By tag (AND):             `pnpm run test:acceptance --tags "@question-themes and @accessibility"`

> **Per-task agents** should scope acceptance tests to their changes with `--tags`:
> `pnpm run test:acceptance --tags "@feature-tag"`
> Always build fresh (do not use `test:acceptance:skip-build`).

**Mandatory quality gates** — the orchestrator (via the gatekeeper agent) runs these four commands **in order** before considering any task complete. **Do NOT skip any gate**, even for "trivial" changes:

1. `pnpm run lint:fix`
2. `pnpm run typecheck`
3. `pnpm run test:unit:cov`
4. `pnpm run test:acceptance`

If any gate fails, fix the issue and re-run from that gate onward until all four pass.

> **Orchestrator runs the full gate.** Per-task agents (implementer, plan-writer) must NOT run the full `lint:fix`, `test:unit:cov`, or `test:acceptance` suite — only focused checks on their own files:
> - Lint: `pnpm run lint:eslint:fix <path>` and `pnpm run lint:oxlint:fix <path>` on modified files
> - Unit tests: `pnpm run test:unit <path>` on modified files
> - Acceptance tests: `pnpm run test:acceptance --tags "@tag"` if acceptance scenarios are part of the task

## Repository structure

- `app/`              – Nuxt application source
  - `pages/`, `assets/`
  - `composables/`    – Organised as `core/`, `domain/`, `ui/`; each composable in its own sub-dir
  - `repositories/`   – Client-side data access (`*.repository.ts`); factory functions, auto-imported by Nuxt
  - `stores/`         – Pinia stores under `domain/`; store names from `stores/store.enums.ts`
  - `i18n/`           – i18n resources, locale JSON files live in `locales/{de,en,es,fr,it,pt}/`
- `server/`           – Nitro server routes and utilities (API handlers, mappers, helpers)
  - `api/**/handlers/` – Route handler files (`*.handler.ts`); thin wrappers in `api/**/index.*.ts`
  - `utils/goat-it-api/` – Helpers, mappers, types, constants for the external API
- `shared/types/`     – Types shared between app and server (e.g. `QuestionTheme`)
- `shared/utils/`     – Helpers auto-imported in both app and server
- `tests/unit/`       – Test utilities: `setup/nuxt/`, `utils/faketories/`, `utils/mocks/`
- `tests/acceptance/` – Acceptance tests: Cucumber features, Playwright step definitions, hooks
- `configs/`          – Vitest, Cucumber, ESLint, Oxlint, lint-staged configs
- `envs/`             – `.env.development`, `.env.test`, `.env.example`
- `modules/`          – Modules directory; `scripts/` – shell and TypeScript scripts
- `docker/goat-it-api-sandbox/` – Local API sandbox via docker-compose

## Project conventions & style

- Frameworks / paradigms:
  - Nuxt 4 file-based routing, composables, auto-imports. Prefer idiomatic Nuxt patterns.
  - Vue 3 `script setup` in all SFCs. Keep `<script>` before `<template>` in every `.vue`.
  - Pinia for global state; stores named `use<Entity>Store`, store ID from `StoreNames` enum.
  - Composables use `use*` prefix; repositories use `*Repository` suffix.
  - Prefer `@nuxt/ui` components and `@vueuse/core` composables where applicable.
  - i18n via `@nuxtjs/i18n`; use `$t()` / `useI18n()` — no hardcoded user-visible strings.

- TypeScript:
  - `any` is forbidden. Use precise types; `unknown` + narrowing when truly needed.
  - No unsafe type assertions without an explicit ESLint disable comment explaining why.
  - Use `zod` for runtime validation of external data (API responses, request bodies, env vars).
  - Types colocated: component props inline, shared in `shared/types/`, server-local in
    `server/utils/**/*.types.ts`.
  - `type-fest` utilities (e.g. `TupleToUnion`, `ArrayValues`) preferred over manual mapped types.

- Formatting / Editor settings (see `.editorconfig`):
  - Indent: 2 spaces; EOL: LF; charset: UTF-8; max line length: 150.
  - Final newline: YES for `.md`, `.json`, `.yaml`, `.yml`, `.sh`, `.env*`; NO for everything else.
  - Use `pnpm run lint:fix` for reformatting; avoid manual reformatting.

- Imports and module layout (groups separated by blank lines, in order):
  1. Node builtins (`node:path`)
  2. External packages
  3. Project aliases (`~~/`, `#server/`, `#components`, `@/`, `~/`)
  4. Relative imports

  - Use `type` imports for type-only symbols (`import type { Foo } from '...'`).
  - Prefer named exports; avoid default exports for utilities and composables.
  - Barrel exports are forbidden (`export { foo } from '...'` or `export * from '...'`). Always import directly from the source module.

- Import aliases:
  - `@/` and `~/` → `app/`
  - `~~/` → repo root (use for `~~/tests/unit/...` in tests)
  - `#server/utils/...` → inside `server/` only
  - `#shared/` → `shared/`
  - `#build/` → `.nuxt/`
  - `#acceptance/` → `tests/acceptance/` (acceptance tests only, via Node subpath imports)

- Naming conventions:
  - Files: Components: `PascalCase.vue` | Composables: `use*.ts` | Stores: `<entity>.store.ts`
    Repositories: `<resource>.repository.ts` | Server handlers: `<resource>.<method>.handler.ts`
    Types: `*.types.ts` | Constants: `*.constants.ts` | Enums: `*.enums.ts`
    Tests: `*.spec.ts` next to source | Faketories: `<entity>.<layer>.faketory.ts`
    Mocks: `<composable>.mock.ts` (+ `.mock.constants.ts` + `.mock.types.ts` as needed)
  - Symbols: Types/Interfaces: `PascalCase` | Variables/functions: `camelCase`
    Exported constants: `UPPER_SNAKE_CASE`

- Vue / component rules:
  - Keep components small and single-responsibility.
  - Prefer props + emits over global state for reusable components.
  - Minimal logic in templates; move complexity to `script setup` or composables.
  - Components with tests use `mountSuspended` from `@nuxt/test-utils/runtime`.

- Server-side (Nitro) rules:
  - API route files (`*.get.ts`, etc.) are 3-line thin wrappers: import handler + `defineEventHandler`.
  - All logic lives in `*.handler.ts` (accepts `H3Event`).
  - Validate all external API responses with `zod` before mapping to domain types.
  - Validate request bodies with `zod` via `readBody(event)` + `SCHEMA.parse(body)`.
  - Use `createGoatItApiEndpoint` / `createGoatItApiFetchOptions` helpers; never inline fetch options.
  - Map DTOs to domain types via dedicated mapper functions in `server/utils/goat-it-api/mappers/`.

- Repository pattern:
  - Factory function: `export const fooRepository: FooRepository = (fetch: $Fetch) => ({ ... })`.
  - Calls internal Nuxt server routes (`/api/goat-it-api/...`), never the external API directly.
  - Auto-imported by Nuxt; instantiated in stores as `fooRepository($fetch)`.

- Error handling and logging:
  - Never swallow exceptions silently — re-throw with context, return typed failure, or log + show i18n UI message.
  - Zod parse errors propagate naturally; do not catch unless you can recover.
  - No `console.log` in production code. `console.error` only for unexpected errors that are caught and handled gracefully.

- Control flow:
  - Prefer early returns over deeply nested `if/else` blocks.

- No agent-generated comments in source code. Agents must never add comments to `.ts`, `.vue`, or other source files unless:
  1. **Lint disable comments** — following the two-line format below
  2. **JSDoc-type documentation** — for public API surfaces, exported functions, and composables
  - No explanatory comments, no `// TODO`, no `// FIXME`, no inline notes, no section markers.

- Lint disable comments (last resort):
  - Disabling lint rules should be a **last resort**. Exhaust all alternatives first.
  - When a disable is genuinely needed, use the following two-line format:
    ```ts
    // Acceptable as <concise justification explaining WHY the disable is safe>
    // oxlint-disable-next-line <rule-name(s)>
    ```
  - The reason line MUST start with `// Acceptable as` (no variations, no trailing period).
  - Never use inline `--` reason comments.
  - Never use file-level or block-level disables without explicit approval.

- `@goat-it/schemas` package (version in `package.json`):
  - Provides Zod schemas, DTO types, and domain constants shared with the Goat It API.
  - Sub-paths used: `@goat-it/schemas/question`, `@goat-it/schemas/question-theme`, `@goat-it/schemas/shared/error`, `@goat-it/schemas/shared/locale`.
  - Used in server handlers for response/query validation (`parse()` before mapping to domain types) and in app code for type-only imports (`import type` for DTO types, domain constant arrays).
  - Listed in `vite.optimizeDeps.include` for correct tree-shaking in non-hoisted pnpm setups.
  - Version is re-exported from the `goat-it-api` repo's `packages/schemas/`.

## Tests and test style

- Framework: Vitest + `@nuxt/test-utils` + `@vue/test-utils` + `happy-dom`.
- Vitest runs five projects (defined in `configs/vitest/vitest.config.ts`):
  - `nuxt`         – `app/**/*.spec.ts`, `server/**/*.spec.ts`, `shared/**/*.spec.ts` (excluding composables/stores/repositories/node)
  - `composables`  – `app/composables/**/*.spec.ts`
  - `stores`       – `app/**/*.store.spec.ts` (includes Pinia + composables + repository mock setup)
  - `repositories` – `app/**/*.repository.spec.ts` (plain Node env, no Nuxt)
  - `node`         – `*.mappers.spec.ts`, `*.helpers.spec.ts`, `*.translations.spec.ts` under app/, server/, shared/
- Coverage threshold: 100% (`thresholds: { 100: true }`).
  - Collected for `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`.
  - Excluded: `*.constants.ts`, `*.enums.ts`, `*.types.ts`, `*.d.ts`, `*.config.ts`,
    `*.spec.ts`, `server/api/**/*.{get,post,put,patch,delete}.ts`.

- Mocks in `tests/unit/utils/mocks/` — `composables/` and `repositories/` sub-dirs.
  - Non-trivial mocks use a triplet: `.mock.ts` + optionally `.mock.constants.ts` + `.mock.types.ts`.
  - Use `ToMock<T>` from `~~/tests/unit/utils/types/mock.types.ts` to type mock objects.
- Mock setup files in `tests/unit/setup/nuxt/` sub-dirs `composables/` and `repositories/`.
  - New repository mocks: use `vi.mock(...)` (NOT `mockNuxtImport`).
  - New composable mocks: use `mockNuxtImport`.
  - Register in `VITEST_COMPOSABLES_MOCK_SETUP_FILES` or `VITEST_REPOSITORIES_MOCK_SETUP_FILES`
    in `configs/vitest/vitest.config.constants.ts`. Load in `nuxt`, `composables`, `stores`; NOT in `repositories` or `node`.

- Infrastructure registration checklist:
  - New composable mock → register in `VITEST_COMPOSABLES_MOCK_SETUP_FILES`
  - New repository mock → register in `VITEST_REPOSITORIES_MOCK_SETUP_FILES`
  - New bounded context (API) or domain alias → register in `nuxt.config.ts` `imports.dir` and Vitest aliases

- Fake data: faketory functions (`@faker-js/faker`) in `tests/unit/utils/faketories/`.
  - Accept `Partial<T>`; named `createFake<Entity>` (e.g. `createFakeQuestionTheme`).
  - Two layers per entity: `entity/` (domain type) and `dto/` (raw API DTO).

- Config per project: `mockReset: true`, `clearMocks: true`, `restoreMocks: true`.
- `describe(functionName, ...)` — pass the function/composable/store reference as label. Exception for components, which are always `describe("<ComponentName> Component", ...)`
- Test names: `"should <action> when <condition>."` pattern.
- Use `expect(...).toHaveBeenCalledExactlyOnceWith(...)` for single-call assertions.

- Composable tests with dependencies: use `mockNuxtImport` + `vi.resetModules()` + dynamic
  `await import(...)` inside `beforeEach` to pick up fresh mock instances.
- Store tests: `setActivePinia(createPinia())` is handled by the shared stores setup file;
  capture `action`/`onError` arguments via closure inside `mockNuxtImport` factories.

## Git / commit / PR expectations

- **Never commit unless the user explicitly asks for it.** Do not create commits
  autonomously after completing tasks or passing quality gates. This applies to ALL
  agents, including subagents dispatched via Task/parallel execution.
- Do not commit `.env.*` files with real secrets (`.env.example` is safe).
- Husky pre-commit hooks are active; never bypass with `--no-verify`.
- Conventional commits enforced by commitlint: `type(scope): message`.
  Common types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`.
- Validate branch names: `pnpm run validate:branch-name`.

## Agent skills (`.agents/skills/`)

Each skill has a `SKILL.md` entry point. Load only the relevant skill for the task.

Available skills: `acceptance-testing`, `brainstorming`, `nuxt`, `nuxt-ui`, `receiving-code-review`,
`systematic-debugging`, `unit-testing`, `vite`, `vitest`, `vue`, `vueuse`, `writing-plans`, `writing-skills`.

- **When writing unit tests** (including inside plans): always load the `unit-testing` skill first.
- **When writing acceptance tests** (including inside plans): always load the `acceptance-testing` skill first.
- **When brainstorming or writing plans**: always consult the `nuxt`, `nuxt-ui`, and `vueuse` skills.

## OpenCode commands (`.opencode/commands/`)

Slash commands available in OpenCode sessions:

- `/complete-i18n`   – Translate all French locale JSON files into every other locale.
- `/write-unit-test` – Write a complete, passing unit test for a given source file.
- `/write-acceptance-test` – Write a complete acceptance test (feature + steps) for a given page/feature.

## Useful docs (`docs/`)

- `docs/superpowers/` – Agent workflow artifacts: `specs/` (design specs from brainstormer), `plans/` (implementation plans from plan-writer).
- `docs/unit-testing.md` – Full human-readable unit testing guide (patterns, examples, pitfalls).
- `docs/acceptance-testing.md` – Full acceptance testing guide (Cucumber, Playwright, patterns, examples).

## MemPalace (persistent project memory)

MemPalace stores project context as searchable embeddings. It runs as an MCP server
(prefixed `mcp_mempalace_*`). All data stays on your machine.

- Wing: `goat_it_web_game` | Rooms: `app`, `testing`, `documentation`, `backend/cli`, `configuration`, `scripts`, `general`, `docker`, `design`, `modules`, `shared`
- For codebase context (architecture, patterns, past decisions): `mcp mempalace_search "query" --wing goat_it_web_game`
- File learnings after decisions: `mcp mempalace_kg_add`
- Write diary entries at session end: `mcp mempalace_diary_write`

## Useful paths

- Vitest config:    `configs/vitest/vitest.config.ts` + `vitest.config.constants.ts`
- ESLint config:    `eslint.config.ts` + `configs/eslint/flat-configs/`
- Oxlint config:    `oxlint.config.jsonc`
- Cucumber config:  `configs/cucumber/cucumber.json`
- Nuxt config:      `nuxt.config.ts`
- Env files:        `envs/.env.development`, `envs/.env.test`, `envs/.env.example`
- Test setup:       `tests/unit/setup/nuxt/` (base + `composables/` + `repositories/`)
- Test utilities:   `tests/unit/utils/` (faketories, mocks, types)
- API sandbox:      `docker/goat-it-api-sandbox/docker-compose.yml`
