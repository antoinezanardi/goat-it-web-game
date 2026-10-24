# Architecture and File-Placement Conventions

This is the canonical reference for **where a project file belongs, how it is named, what may depend on it, and which companion files belong with it**. It defines project conventions on top of Nuxt 4's framework conventions.

For detailed testing mechanics, see [Unit Testing](unit-testing.md) and [Acceptance Testing](acceptance-testing.md). For server security contracts, see [Security](security.md). Those documents own their detailed procedures; this guide owns architecture, placement, naming, and dependency direction.

## 1. File-placement decision tree

1. **Is the file required by a framework scanner?** Use Nuxt's discovered location and required naming: application pages/layouts/components under `app/`; Nitro API routes, middleware, and plugins under root `server/`. Keep framework entrypoints thin and put testable behavior in owned units.
2. **Is it intended for both Vue and Nitro?** If runtime-neutral, place it in root `shared/`.
3. **Is it server-only?** Choose `server/api/`, `server/middleware/`, `server/plugins/`, or `server/utils/<domain>/` by responsibility.
4. **Is it app-only?** Choose the app concern: `components/`, `composables/{core,domain,ui}/`, `stores/domain/`, `repositories/`, or `utils/{core,domain,ui}/`.
5. **Is it independently tested production behavior?** Give it an owned directory containing the source and matching spec. Do not add a redundant nesting level when its existing domain directory already represents one coherent unit.
6. **Is it a type, constant, or helper?** Place it with the narrowest production owner. Promote to a domain root only when multiple production units in that domain consume it. Put it in `shared/` when it is runtime-neutral (app/server-neutral), even if a single production unit consumes it; app-only behavior stays in `app/`.
7. **Is it test infrastructure?** Keep shared setup, mocks, faketories, and support tools in their role-based `tests/` directories; do not scatter them through production source.

## 2. Framework boundaries and dependency direction

Nuxt 4 uses `app/` as the application source directory and keeps `server/` and `shared/` at the project root. This project follows that framework layout.

```text
app/                         Vue/Nuxt application
  assets/                    imported styles and assets
  components/                reusable and route/content UI
  composables/{core,domain,ui}/
  config/                    Nuxt UI component/theme configuration
  i18n/{locales,specs}/
  layouts/                   Nuxt layout entrypoints
  pages/                     Nuxt file-based route entrypoints
  plugins/                   Nuxt app plugins
  repositories/              clients for internal API routes
  stores/domain/             Pinia state/actions
  utils/{core,domain,ui}/    app-only utility domains
server/                      Nitro runtime
  api/                       HTTP route entrypoints and handlers
  middleware/                Nitro middleware entrypoints
  plugins/                   Nitro plugin entrypoints
  utils/<domain>/            server-only domain utilities
shared/                      runtime-neutral app/server code
  constants/                 cross-runtime constants
  enums/                     cross-runtime enums
  types/                     cross-runtime types
  utils/helpers/<domain>/    cross-runtime helpers
content/                     localized Nuxt Content documents
tests/unit/                  Vitest specs and shared test infrastructure
tests/acceptance/            Cucumber features, steps, support, fixtures
configs/                     lint, test, release, and tool configuration
scripts/                     standalone repository tools
modules/                     local Nuxt modules when introduced
docs/                        maintained project documentation
```

```text
app UI → composables/stores → repositories → internal /api routes → server handlers
  └──────────────────────────────────────────────────────────────────→ shared
server routes/middleware/plugins → server utilities ─────────────────→ shared
```

Normative boundaries:

- `app/` may import `shared/` but must not import `server/` implementation. App data access crosses the boundary through internal `/api/goat-it-api/**` routes via repositories.
- `server/` may import `shared/` but must not import `app/` implementation.
- `shared/` imports only runtime-neutral modules; it must not import `app/`, `server/`, or Nuxt build output. Keep Vue/browser/UI-only concepts out of this layer.
- `scripts/` is standalone and must not import app/server/shared project aliases.
- Server code validates external data with the shared Goat It schema package and converts DTOs to domain types in mapper units.
- Component access to stores and shared-state composables follows the role-based ownership rule in §4.1; stores must still use repositories for data access.

Framework discovery behavior takes precedence over project layout preference. Verify routes/component registrations after moving framework-discovered files. Official Nuxt references: [directory structure](https://nuxt.com/docs/4.x/directory-structure), [server directory](https://nuxt.com/docs/4.x/directory-structure/server), [app components](https://nuxt.com/docs/4.x/directory-structure/app/components), [app pages](https://nuxt.com/docs/4.x/directory-structure/app/pages).

## 3. Navigation order, names, and unit ownership

Navigate by **runtime boundary → framework/project area → category/domain → unit**. Artifact kind belongs in the filename suffix; it is not a reason to create a universal top-level `helpers/`, `constants/`, or `types/` taxonomy.

| Artifact       | Filename form                           | Symbol convention                        |
|----------------|-----------------------------------------|------------------------------------------|
| Component      | `PascalCase.vue`                        | PascalCase component name                |
| Composable     | `usePascalCase.ts`                      | `use*` function                          |
| Store          | `<entity>.store.ts`                     | `use<Entity>Store`; ID from `StoreNames` |
| Repository     | `<resource>.repository.ts`              | `<resource>Repository` factory           |
| Server handler | `<resource>.<method>.handler.ts`        | named verb/resource handler              |
| Helper         | `<descriptive-name>.helpers.ts`         | named camelCase functions                |
| Mapper         | `<entity>.mappers.ts`                   | `create<Entity>From<Dto>`                |
| Constants      | `<descriptive-name>.constants.ts`       | exported `UPPER_SNAKE_CASE`              |
| Enums          | `<descriptive-name>.enums.ts`           | PascalCase enum; upper-snake members     |
| Types          | `<descriptive-name>.types.ts`           | PascalCase type aliases                  |
| Unit spec      | matching artifact basename + `.spec.ts` | focused subject-specific describe        |

An independently understood production unit owns a directory. If it has a unit spec, source and spec are siblings in that directory. Owner-private types/constants are optional sibling files. Do not add empty/ceremonial companions. A current domain folder may itself be the unit if it contains one coherent source/spec pair (for example, `shared/utils/helpers/object/`). Add a responsibility subdirectory only for genuinely distinct units or nested private helper units.

No `misc` or catch-all buckets. Use type-only imports where appropriate, named exports for utilities, kebab-case filenames for auxiliary files, and the project-enforced symbol casing. Default exports are reserved for framework entrypoints/config where required. Barrel exports and relative imports are forbidden. A file whose only purpose is to re-export or alias a symbol from another module is forbidden too: import the source module directly.

Domain directory names are always singular (`question-theme/`, `element/`), even when the files they contain name the entity in plural (`question-themes.store.ts`).

### 3.1 Choosing helper, type, and constant scope

Choose placement by **production ownership and dependencies**, not by where a test imports the symbol:

1. Component/composable/store-private contract or constant → beside that owner.
2. Helper-private contract or constant → beside that helper source/spec in a colocated `.types.ts` or `.constants.ts` companion, not declared inside the `.helpers.ts` source.
3. Reused by multiple production units in one domain → at the narrowest common domain root.
4. Runtime-neutral (common to app and server, or a neutral domain helper with a single consumer) → root `shared/`.
5. UI-only mapping/token (icons, presentation colors, labels, CSS/Tailwind classes) → app `utils/ui/` or its consuming component.

A constant used by two components should not stay artificially private to one component. Conversely, a one-consumer constant does not become domain-wide merely because it sounds like a domain concept. If a mixed helper module contains both runtime-neutral domain behavior and UI mappings, split along that dependency boundary.

### 3.2 Helper extraction

- Keep short, private implementation details inline. A 10–20-line block or one to three straightforward functions is not, by itself, a reason to extract a helper.
- Extract behavior-bearing named functions declared outside a main composable by default, except trivial adapters/constants with no meaningful behavior.
- Extract complex, multi-responsibility inline logic when a distinct responsibility and useful input/output boundary clarify the owning module or enable valuable independent tests.
- Do not extract reactive wiring, lifecycle behavior, or state/store-capturing closures merely to satisfy a folder rule. Extract only where dependencies can remain explicit without obscuring behavior.
- An independently tested helper owns source and spec together. Component/composable-private helpers live beneath their owner in `helpers/<responsibility>/`; shared helpers live at the narrowest common domain.
- `helpers/` is not a dump folder. The owner and unit names must communicate responsibility.

## 4. Application architecture

### 4.1 Components

Location: `app/components/<group>/<ComponentName>/`.

```text
app/components/domain/game/GameSidebar/
├── GameSidebar.vue
├── GameSidebar.spec.ts
├── game-sidebar.types.ts
└── game-sidebar.constants.ts
```

- One component per owned directory. Child/reusable components own separate directories; do not put a second primary `.vue` in the parent component directory.
- If a component declares props, emits, slots, or exposed instance members, it must have a colocated `*.types.ts` defining the full contract, including `defineExpose` members.
- Component-private constants stay beside the component. Promote only when multiple production units share them.
- Components read store state through getters/refs and props, subject to the ownership rule in §4.1. They must never assign store state or mutate store-owned values in place (`store.items.push(...)`, `store.settings.field = ...`, `$patch`); every state change goes through a store action. Props are read-only: emit an event instead of mutating them.
- Keep small private logic in `<script setup>`; extract meaningful complexity only under the helper rules above.
- SFC order is `<script lang="ts" setup>`, `<template>`, `<style>`.
- Nuxt Content components also own a directory beneath `app/components/content/`. Preserve the component name used by MDC Markdown and verify rendering after moves. Nuxt's `pathPrefix: false` names components from their filename; the exact nested Content registration is verified by this project, not assumed.

#### Component state ownership

A component's access to global state follows its responsibility, not its depth:

- A **feature-owning component** may read a store or shared-state domain composable when it coordinates that feature or derives feature-specific state needed by its UI.
- A **presentation child** receives the data it displays through props and communicates user intent with emits; it does not reach into shared application state merely to render that data.
- Component depth, reuse, and being located under a page do not by themselves determine ownership. Apply the rule according to the component's responsibility.
- Keep state access at the nearest meaningful feature owner. Do not lift state or add pass-through props solely to conceal a store/composable read.
- Store-owned mutations still go through store actions; props remain read-only and children emit intent rather than mutating props.

This is a project convention layered on Vue's one-way-down props and emit-up contract; neither Vue nor Pinia specifies this component taxonomy.

Current audit classification:

| Component                                                    | Classification                                                    |
|--------------------------------------------------------------|-------------------------------------------------------------------|
| `GameQuestionsFiltersThemeFilter`                            | Presentation child — props/emits only                             |
| `GameQuestionsFiltersButton`                                 | Feature UI deriving its feature-specific applied-filter count     |
| `GameSidebar`                                                | Feature UI deriving its count; changelog feature host             |
| `ChangelogWhatsNewButton`                                    | Presentation child — props/emits only                             |
| `ChangelogWhatsNewButtonContent`                             | Presentation child — props only                                   |
| `GameQuestionsFiltersModal`                                  | Feature coordinator owning draft/snapshot state                   |
| `ChangelogModal` / `useChangelog`                            | Changelog side-effect and state owner                             |
| `App.vue` bootstrap                                          | Application initialization                                        |
| `LocaleSelect`                                               | Explicit locale-cookie exception (§4.7)                           |

The audit is descriptive and reviewed against component responsibility; it is not enforced by a lint rule.

### 4.2 Composables

Location: `app/composables/{core,domain,ui}/useThing/`.

```text
app/composables/domain/useGameQuestionFeed/
├── useGameQuestionFeed.ts
├── useGameQuestionFeed.spec.ts
├── use-game-question-feed.types.ts
├── use-game-question-feed.constants.ts
└── helpers/
    └── game-excluded-ids/
        ├── game-excluded-ids.helpers.ts
        ├── game-excluded-ids.helpers.spec.ts
        ├── game-excluded-ids.types.ts        # only when the helper owns a private contract
        └── game-excluded-ids.constants.ts    # only when the helper owns a private constant
```

- Every composable owns its source/spec and a required named return type in a colocated kebab-case `.types.ts`. Keep the explicit function return annotation required by lint and reference the named type. This project convention is stricter than lint, which also permits inline return annotations.
- Options/return contracts and composable-private constants stay with the composable. Helper-private types/constants stay with the helper.
- Behavior-bearing module-scope functions should be extracted into a private helper unit; extract complex inline logic when it obscures the composable's public flow. Keep simple reactivity and state/lifecycle closures inline unless a clear explicit-input boundary exists.
- Composables follow the same store boundary as components: `storeToRefs` and getters are read-only views. Never write store state or mutate store-owned arrays/objects; call the owning store's actions instead. When an action returns a result, the calling composable owns the presentation feedback (toast, translated message).
- Directories beneath `app/composables/` must contain actual composables. General domain/UI utilities belong in `app/utils/` or root `shared/` by runtime boundary.

`core` is framework/browser/infrastructure behavior; `domain` is app-only business logic without presentation ownership (markup, styling, layout); `ui` is presentation behavior and tokens. Domain composables may surface user feedback through UI composables (`useAppToast`, `useI18n`) but must not own markup or presentation state. These are responsibility categories, not merely filename labels.

### 4.3 Stores

Location: `app/stores/domain/<entity>/`.

```text
app/stores/domain/game-settings/
├── game-settings.store.ts
├── game-settings.store.spec.ts
├── game-settings.constants.ts
└── game-settings.types.ts
```

Stores own domain state and state-changing actions. Use `StoreNames`; follow the established async-action pattern. Colocate private constants. Add `.types.ts` when there is a standalone public state/action contract. Do not create an empty types file. Repositories own data access; the direct page/component store access policy follows §4.1.

- Stores own the only actions allowed to change their state. Consumers must not assign store state or mutate store-owned values; every change goes through an action. Transient state (fetch status, loading flags) is exposed as read-only computed getters.
- Stores are presentation-agnostic. They must not import or call toast, i18n, overlay, router, component, or DOM APIs. Async actions return the discriminated `AsyncResult` from `shared/types/async-result.types.ts` so the caller decides how to surface errors.
- Serialized state must stay writable refs for SSR hydration and devtools; do not wrap returned state in `readonly()`. Enforce the mutation boundary by convention and review, not by hiding state. Which component may read a store is decided by §4.1.

### 4.4 Repositories

Location: `app/repositories/goat-it-api/<resource>/`.

```text
app/repositories/goat-it-api/questions/
├── questions.repository.ts
└── questions.repository.spec.ts
```

Repositories are typed factories accepting a `$Fetch`-compatible dependency and calling only internal `/api/goat-it-api/**` routes. Do not fetch the external API from app code, embed UI logic in repositories, or do DTO-to-domain mapping there. Stores construct repositories with `useRequestFetch()`; repository factories themselves must not call Nuxt composables. Nuxt documents that `useRequestFetch()` forwards request context during SSR and behaves like `$fetch` on the client ([docs](https://nuxt.com/docs/4.x/api/composables/use-request-fetch)). Add repository helpers/types/constants only for distinct justified behavior.

### 4.5 App utility areas

Location: `app/utils/{core,domain,ui}/<domain>/`.

| Category  | Responsibility                                                                                             |
|-----------|------------------------------------------------------------------------------------------------------------|
| `core/`   | App framework, browser, or infrastructure utilities not tied to a business domain or presentation contract |
| `domain/` | App-only domain behavior without presentation dependencies                                                 |
| `ui/`     | Presentation mappings/tokens: icons, UI colors, labels, CSS/Tailwind, reusable UI integration types        |

```text
app/utils/ui/question/
├── question.constants.ts                 # only tokens consumed by multiple production UI units
└── helpers/
    ├── category-display/
    │   ├── question-category-display.helpers.ts
    │   ├── question-category-display.helpers.spec.ts
    │   └── question-category-display.constants.ts
    └── cognitive-difficulty-display/
        ├── question-cognitive-difficulty-display.helpers.ts
        ├── question-cognitive-difficulty-display.helpers.spec.ts
        └── question-cognitive-difficulty-display.constants.ts
```

Domain-root types/enums/constants exist only when multiple production units share them; helper-private values stay inside the helper unit. Runtime-neutral question rules intended for app and server belong in `shared/`, not `app/utils/domain/`. Import utility modules explicitly even though Nuxt can auto-import `app/utils/`.

`app/utils/ui/gsap/gsap.types.ts` is an intentional shared UI integration type, prepared for future consumers. It is not a general instruction to make a standalone type module for every one-consumer type.

### 4.6 Pages and layouts

Pages own a directory while preserving Nuxt's route through `index.vue`:

```text
app/pages/
├── index/
│   ├── index.vue                 # /
│   └── index.spec.ts
├── (docs)/rules/
│   ├── index.vue                 # /rules
│   └── index.spec.ts
└── (game)/game/
    ├── index.vue                 # /game
    └── index.spec.ts
```

Nuxt documents `pages/foo/index.vue` as `/foo`, and parenthesized groups do not contribute a URL segment. Keep public URL paths stable and verify generated routes after moving files. Do not keep arbitrary `.ts` constants/types under `app/pages/`, where they can be discovered as route candidates. Put meaningful page constants in the narrowest app utility domain outside `pages/`; trivial one-use literals may remain inline.

Layouts remain at `app/layouts/<Layout>/` with stable filenames/path-derived keys. The current `layouts/<layout>/spec/` spec placement is a named exception; do not rename layouts as part of routine file moves. References: [pages](https://nuxt.com/docs/4.x/guide/directory-structure/pages), [layouts](https://nuxt.com/docs/4.x/guide/directory-structure/layouts).

### 4.7 App plugins, configuration, assets, and i18n

- `app/plugins/`: Nuxt app entrypoints; keep registration/lifecycle glue thin and delegate testable behavior.
- `app/config/*.config.ts`: Nuxt UI component/theme configuration. `app/app.config.ts` composes it.
- `app/assets/`: bundled/imported styles and assets. Root `public/` is for files served unchanged.
- Locale dictionaries: `app/i18n/locales/<locale>/<namespace>.json`.
- Translation parity specs: `app/i18n/specs/<namespace>.translations.spec.ts`. This is an explicit exception because one test compares a namespace across all locale resources.
- Locale cookie: `goat_it_locale` (`CookieNames.LOCALE`) with `LOCALE_COOKIE_OPTIONS`. Only `LocaleSelect` and `useLocaleSuggestion` write it; the server reads it for `Accept-Language` forwarding (`extractLocaleFromEvent`) and locale detection (`server/plugins/locale-detector`). It was hard-renamed from `i18n_redirected` with no legacy fallback.
- Do not set `detectBrowserLanguage.cookieKey`: any object value re-enables browser-language detection and may redirect `/`.

## 5. Shared architecture

Root `shared/` is for runtime-neutral modules consumed across the app/server boundary:

```text
shared/
├── constants/<concern>.constants.ts
├── enums/<concern>.enums.ts
├── types/<concern>.types.ts
└── utils/helpers/<domain>/<unit>.helpers.ts
```

- Shared constants/types are contracts, not a fallback for app-local files.
- Use explicit imports even where Nuxt supports shared utility auto-imports.
- Existing single-unit utility domains (`locale`, `object`, `string`, `time`) keep source/spec at the domain directory level; do not add a second `helpers/` level.
- A runtime-neutral helper may stay under its shared domain even when one production unit consumes it. Its private types/constants remain in the helper unit. Do not move app-only helpers or app-only contracts into `shared/`.
- When a domain has multiple distinct helper responsibilities, give each responsibility a subdirectory under `shared/utils/helpers/<domain>/`, with source/spec together.
- Question utilities are split by dependency: runtime-neutral context/theme/source/category/difficulty rules go under `shared/utils/helpers/question/<responsibility>/`; theme selection goes under `shared/utils/helpers/question-theme/selection/`. UI mappings/icons/colors/Tailwind classes stay under app UI utilities.
- Do not add Vue, DOM, browser, Nuxt, or app UI dependencies to shared modules.

## 6. Server architecture

### 6.1 API routes and handlers

Nuxt/Nitro route wrappers remain path-oriented under `server/api/`, using the required method suffix and a thin default-export `defineEventHandler` binding. Behavior belongs in an action-oriented handler unit:

```text
server/api/goat-it-api/questions/
├── index.get.ts
└── handlers/find/
    ├── index.get.handler.ts
    └── index.get.handler.spec.ts
```

The route wrapper is an explicit framework-discovery exception; the handler owns behavior and its spec. Validate query/body/upstream response data with the established Zod validation helpers and `@goat-it/schemas`; map DTOs to domain values through dedicated mappers.

### 6.2 Server utility domains

```text
server/utils/<domain>/
├── <domain>.constants.ts       # only when shared by domain units
├── <domain>.types.ts           # only when shared by domain units
├── <domain>.enums.ts           # only when shared by domain units
├── helpers/<unit>/
│   ├── <descriptive-unit>.helpers.ts
│   └── <descriptive-unit>.helpers.spec.ts
└── mappers/<entity>/
    ├── <entity>.mappers.ts
    └── <entity>.mappers.spec.ts
```

- Every independently tested server helper owns a unit directory under its server domain. Directory/source/spec use the descriptive unit stem unless a focused split makes a more precise name.
- Keep domain contracts at the domain root only when multiple production units consume them; helper-private companions stay in the helper directory.
- The Goat It API domain owns outbound endpoint construction, fetch-option assembly, upstream validation, error classification, locale resolution used by the proxy, and DTO mappers.
- Incoming request guards belong to the security/request-hardening domain, not outbound API utilities.
- Mappers are pure DTO-to-domain conversions; convert wire-specific representations there.
- Prefer explicit `#server/` and `#shared/` imports over Nitro auto-imports for project utilities.

### 6.3 Middleware and Nitro plugins

- Middleware is named `NN-<name>.middleware.ts` when execution order matters. Keep request dispatch/path matching thin; extract independently testable behavior to helpers.
- Nitro plugins live under `server/plugins/<name>/` as framework entrypoints. Keep registration/lifecycle glue thin and delegate behavior to covered helper units.
- See [Security](security.md) for headers, CSP, rate limiting, body guards, upstream fetch, and error contracts.

## 7. Aliases and imports

Aliases are mandatory; relative imports are forbidden.

| Alias                                | Canonical scope                                                                                      |
|--------------------------------------|------------------------------------------------------------------------------------------------------|
| `@/`                                 | The sole alias for app code imports                                                                  |
| `~/`                                 | Nuxt resource/config paths such as assets, CSS references, and discovery globs; not app code imports |
| `#shared/`                           | Root `shared/` modules                                                                               |
| `#server/`                           | Root `server/` modules; server-side code only                                                        |
| `~~/`                                | Repository root, commonly test utilities/package files                                               |
| `#acceptance/`                       | Acceptance test modules via Node subpath imports                                                     |
| `#components`, `#imports`, `#build/` | Nuxt-generated framework surfaces                                                                    |

Examples:

```ts
import { useGame } from "@/composables/domain/useGame/useGame";
import { getPrimaryTheme } from "#shared/utils/helpers/question/themes/question-themes.helpers";
import { throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api-error/goat-it-api-error.helpers";
```

Import utilities explicitly even if Nuxt/Nitro can auto-import them. When changing aliases, distinguish TypeScript code imports from Nuxt resource references; preserve `~/` for resources/config.

## 8. Tests and test infrastructure

### 8.1 Unit specs

Production unit specs sit beside their source in the owned directory. Preserve suffixes because Vitest selects its project/environment by spec path: `.store.spec.ts`, `.repository.spec.ts`, `.helpers.spec.ts`, `.mappers.spec.ts`, `.translations.spec.ts`, and `.dom.helpers.spec.ts` have routing significance.

Named exceptions:

- Layout specs remain in `app/layouts/<layout>/spec/`.
- i18n parity specs remain centralized in `app/i18n/specs/`.
- Nuxt-discovered route wrappers remain at their URL-derived paths; their handler units own behavior specs.
- Components without props/emits/slots/exposed contracts do not need `.types.ts`; contract-bearing components do.

Test infrastructure is centralized by test role, not production unit:

```text
tests/unit/
├── setup/{nuxt,node}/
└── utils/{faketories,mocks,helpers,types}/
```

The current Vitest configuration has six projects: `nuxt`, `composables`, `stores`, `repositories`, `node`, and `dom`. See [Unit Testing](unit-testing.md) for setup matrices, mocks, faketories, coverage and test patterns; configuration is authoritative if prose drifts.

### 8.2 Acceptance tests

Acceptance tests are not organized by production-unit ownership. Their domain-separated structure is:

```text
tests/acceptance/
└── features/
    ├── <feature-domain>/*.feature
    ├── step-definitions/<step-domain>/
    └── support/{hooks.ts,constants,types,helpers,fixtures}/
```

Feature domains own scenarios/tags; step domains own reusable Gherkin steps; cross-domain helpers and fixture infrastructure live under support. See [Acceptance Testing](acceptance-testing.md) for exact naming, tags, steps, DataTables, Playwright and fixture rules. No broad acceptance-tree restructure is implied by this architecture guide.

## 9. Other repository file classes

| Location                                                    | Responsibility                                                                                  |
|-------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `configs/`                                                  | Test/lint/release/Node/tool config only; no runtime business logic                              |
| `scripts/`                                                  | Standalone maintenance or validation tools; no app/server/shared imports                        |
| `modules/`                                                  | Local Nuxt modules when an actual reusable Nuxt integration is introduced                       |
| Root `nuxt.config.ts`, `content.config.ts`, `tsconfig.json` | Framework/build configuration                                                                   |
| `content/<locale>/`                                         | Localized Markdown/content source; Markdown Vue components stay under `app/components/content/` |
| `app/assets/`                                               | Imported/bundled assets; root `public/` for files served unchanged                              |
| `docs/`                                                     | Maintained human-facing documentation                                                           |
| `.opencode/`, `.agents/`                                    | Agent, skill and workflow instructions                                                          |
| `.nuxt/`, `.output/`, coverage and acceptance reports       | Generated output only; never hand-edited as source                                              |

Do not add a new root folder simply because a concept is shared. Pick an established runtime boundary and domain first. If no existing category fits, propose the boundary and update this guide through an approved design.

### 9.1 Environment indexability

`site.env` in `nuxt.config.ts` controls whether `@nuxtjs/robots` treats the deployment as indexable, and the same value gates the sitemap. It resolves from `NUXT_SITE_ENV`, falling back to `production` only when `NODE_ENV` is `production`; every other value is treated as non-production. The pure resolver lives in `../shared/utils/helpers/site/site-environment.helpers.ts` and is unit-tested.

`NUXT_SITE_ENV` is read at build time (for `site.env`, `sitemap.enabled`, prerendered sitemap and static robots rules) and again by `nuxt-site-config` at runtime, where `NUXT_SITE_*` variables outrank build-time site config for SSR robots headers/meta and `/robots.txt`. Keep the same value at build and runtime. Runtime env cannot re-enable or regenerate a sitemap disabled at build time.

- Production builds must set `NUXT_SITE_ENV=production`.
- Staging builds must set `NUXT_SITE_ENV=staging` **at build time** (the Docker build stage serializes the value into the generated site config) and carry the same value at runtime.
- Local development uses `NUXT_SITE_ENV=development`.
- Acceptance builds use `staging` (`.env.test`) so the SEO scenarios assert the non-indexable contract. Production indexability and sitemap generation are tracked as a follow-up test task (#537).

Non-production also disables the sitemap (`sitemap.enabled`), because `@nuxtjs/sitemap` does not filter URLs by site indexability. Do not set `site.indexable` directly: an explicit value overrides the environment-derived behavior and reopens the staging indexing bug.

URL/locale strategy (`no_prefix`), social image alt policy, structured-data identity, JSON-LD reactivity and the production-only sitemap are recorded in [SEO](seo.md); locale cookie behavior is documented in §4.7.

## 10. Agent and workflow compliance

This document is canonical. Do not copy its full contents into every prompt. Every agent, skill, or command that can plan or cause project files to be created, edited, or moved must require consulting `docs/architecture.md` before that work.

- Design/spec authors identify placement boundaries and migration consequences.
- The plan-writer names exact paths for sources, specs, types, constants and helpers; records which companions are required or intentionally omitted; accounts for consumers/imports, framework discovery and Vitest routing.
- Implementers follow planned paths. If repository reality conflicts with the guide or plan, stop and surface the mismatch rather than inventing a rule.
- Debugger, investigator, review-fix, gatekeeper/autofix, test-writing, localization, and config-edit workflows consult the guide before file edits.
- The final reviewer checks every created, edited, or moved file for owner directory, source/spec pairing, type/constant scope, alias, layer dependency, framework discovery and test-project correctness.
- Specialist testing/security documents remain authoritative for their detailed procedures and are linked rather than duplicated.
- This guide does not itself add lint/Vitest enforcement. No agent commits.

## 11. Framework references

Official documentation consulted (Nuxt package line in this project: `^4.6.1`; the cited docs are the Nuxt 4.x line):

- [Nuxt directory structure](https://nuxt.com/docs/4.x/directory-structure) — `app/`, root `server/` and `shared/`.
- [Nuxt server directory](https://nuxt.com/docs/4.x/directory-structure/server) — Nitro scanning and server alias.
- [Nuxt app components](https://nuxt.com/docs/4.x/directory-structure/app/components) — path-derived names and `pathPrefix: false`.
- [Nuxt app pages](https://nuxt.com/docs/4.x/directory-structure/app/pages) and [pages guide](https://nuxt.com/docs/4.x/guide/directory-structure/pages) — index routes and route groups.
- [Nuxt layouts](https://nuxt.com/docs/4.x/guide/directory-structure/layouts) — layout discovery and names.
- [`useRequestFetch`](https://nuxt.com/docs/4.x/api/composables/use-request-fetch), [`$fetch`](https://nuxt.com/docs/4.x/api/utils/dollarfetch), [data fetching](https://nuxt.com/docs/4.x/getting-started/data-fetching) — SSR request forwarding and fetch behavior.
- [Nuxt Content Markdown components](https://content.nuxt.com/docs/files/markdown) — `::component-name` and `components/content/`. Nested component resolution is verified by project build/acceptance tests.
