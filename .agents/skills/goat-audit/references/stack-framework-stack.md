# STACK — Framework & stack correctness

Correct use of the framework and library APIs this product is built on: Nuxt 4 data fetching and SSR lifecycle, Nuxt configuration, error pages and route rules, Vue 3.5 reactivity under SSR, Pinia 4 setup stores, VueUse, Nuxt UI, the `@nuxtjs/i18n` module configuration, Nitro/h3 v1 server helpers, Nuxt Content 3, the `@sentry/nuxt` 11 SDK wiring, the `@vite-pwa/nuxt` module API, Zod 4 schema APIs, and deprecations across the stack. A check here fails when code or configuration misuses a documented API contract or relies on a deprecated, removed or version-specific behavior of the installed version, whatever the user-facing consequence.

**Decision doc:** `docs/architecture.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** security consequences (CSP, XSS, error leakage, secrets in bundle) → SEC · performance consequences (bundle size, lazy hydration, payload weight, duplicate requests measured at runtime) → PERF · accessibility consequences (accessible names, focus) → A11Y · translation quality, locale parity, locale cache keys, browser-language detection → I18N · Sentry data collection and PII → PRIV · runtimeConfig declaration, Node runtime version, container config → PLAT · timeouts, retries, cancellation, unknown-key policy → REL · store mutation boundary and presentation-agnostic stores → ARCH · TypeScript strictness, lint, store definition shape, silent `catch` → CODE · precache, manifest, update strategy → PWA · dependency vulnerabilities and update bots → SUP

## Contents

- [1. Nuxt data fetching and SSR](#1-nuxt-data-fetching-and-ssr)
- [2. Nuxt configuration](#2-nuxt-configuration)
- [3. Errors and route rules](#3-errors-and-route-rules)
- [4. Vue reactivity and SSR](#4-vue-reactivity-and-ssr)
- [5. Pinia](#5-pinia)
- [6. VueUse](#6-vueuse)
- [7. Nuxt UI](#7-nuxt-ui)
- [8. Nuxt I18n module configuration](#8-nuxt-i18n-module-configuration)
- [9. Nitro and h3](#9-nitro-and-h3)
- [10. Nuxt Content](#10-nuxt-content)
- [11. Sentry SDK](#11-sentry-sdk)
- [12. PWA module](#12-pwa-module)
- [13. Zod](#13-zod)
- [14. Stack currency and deprecations](#14-stack-currency-and-deprecations)
- [Sources](#sources)

## 1. Nuxt data fetching and SSR

- **[STACK-01] No bare `$fetch` in setup for SSR-rendered data** — Data rendered during SSR is loaded through `useAsyncData`/`useFetch`, or through a store action awaited inside `callOnce`; no top-level `await $fetch(...)` or direct repository call runs in `<script setup>`, a composable body or a plugin, because `$fetch` does not transfer state to the client and the request runs again during hydration (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**`, `app/plugins/**` · Src: [3]
- **[STACK-02] Request-aware fetch during SSR** — Code that calls internal `/api/goat-it-api/**` routes during SSR uses the fetcher returned by `useRequestFetch()` (stores build repositories as `<resource>Repository(useRequestFetch())`), never the global `$fetch`, which forwards no request headers (cookie, `accept-language`) on the server; hop-by-hop headers such as `host`, `connection` and `accept` are stripped by design (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/**`, `app/repositories/**` · Src: [2], project: docs/architecture.md §4.4
- **[STACK-03] Shared `useAsyncData` keys share options** — All `useAsyncData`/`useFetch` calls that use the same explicit key pass the same `handler`, `deep`, `transform`, `pick`, `getCachedData`, `default` and `middleware`; only `server`, `lazy`, `immediate`, `dedupe`, `watch`, `enabled` and `serialize` differ, and shared-key calls with custom options live in one composable (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**`, `app/composables/**` · Src: [1], [10]
- **[STACK-04] Reactive keys for reactive inputs** — A `useAsyncData` key that depends on reactive input (locale, route param, filter) is a computed ref or getter, so each value is stored and refetched separately; a string built once from `.value` and paired with `watch` keeps one key for different payloads (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**` · Src: [1], [10]
- **[STACK-05] Handlers resolve a defined value** — No `useAsyncData` handler resolves `undefined` or `null` (for example a missing `queryCollection(...).first()` result). It maps absence to an explicit empty value or sentinel, otherwise the request may run again on the client (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**` · Src: [1]
- **[STACK-06] Store actions awaited inside `callOnce`** — Store-populating actions called from setup run through `await callOnce(...)`, the documented Pinia pattern, and use `{ mode: navigation }` only when data must refresh on every client-side navigation; no code reads a value from `callOnce`, which returns nothing, and `useAsyncData` handlers only return data — one-time side effects such as store population never run inside a handler (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/pages/**` · Src: [4], [26]
- **[STACK-07] Shallow `data` never mutated in place** — No code mutates nested properties of `useAsyncData`/`useFetch` `data` and expects reactivity: `data` is a `shallowRef` (`deep` defaults to `false`), so code replaces the whole value or opts in with `deep: true` (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**`, `app/composables/**` · Src: [1], [10]
- **[STACK-08] SSR-shared state through `useState`** — Cross-component state that must survive SSR and hydration uses `useState(key, init)` with a key from the project state-name enum and holds only JSON-serializable values (no class instance, function, symbol, `Map` or `Set`) (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**` · Src: [5], [6]
- **[STACK-09] Composables called in a valid context** — Nuxt and Vue composables (`useRuntimeConfig`, `useNuxtApp`, `useState`, `useI18n`, `useRequestFetch`…) are called synchronously inside setup, a Nuxt plugin or route middleware. They never run at module scope, and never after an `await` outside `<script setup>`, `defineNuxtPlugin` or `defineNuxtRouteMiddleware` ("Nuxt instance is unavailable") (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/**`, `app/stores/**`, `app/utils/**` · Src: [7]
- **[STACK-10] Plugin loading strategy declared** — Nuxt app plugins load sequentially by default. An async plugin that no later plugin depends on declares `parallel: true`, and a dependency is expressed with `dependsOn` or a zero-padded numeric filename prefix. Object-syntax fields are static literals, and browser-only plugins carry the `.client` suffix (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/plugins/**` · Src: [8]

## 2. Nuxt configuration

- **[STACK-11] `compatibilityDate` set and bumped deliberately** — `nuxt.config.ts` sets `compatibilityDate` to a `YYYY-MM-DD` date (a missing value raises `B5001`), and a change to that date comes with a review of the Nitro and module behavior defaults it opts into (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [11]
- **[STACK-12] Compatibility version pinned to 4** — `future.compatibilityVersion` stays `4`. Version `5` is a testing switch that flips defaults (Vite Environment API, `payloadExtraction: 'client'`, `navigateToEarlyReturn`, Nitro auto-imports off, Options API compiled out) and is enabled only by a dedicated Nuxt 5 migration (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [10], project: docs/architecture.md §9.2
- **[STACK-13] Experimental flags exist and are justified** — Every experimental flag set in `nuxt.config.ts` (`experimental.*`, `content.experimental.*`, `ui.experimental.*`, `i18n.experimental.*`) exists in the installed version and has a recorded reason and removal trigger in the owning doc, because experimental features can be removed or modified (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `nuxt.config.ts` · Src: [12]
- **[STACK-14] Runtime code reads config through `useRuntimeConfig`** — App and Nitro runtime code reads deployment settings through `useRuntimeConfig()`, never `process.env`, so `NUXT_*` overrides apply; `app/app.config.ts` and `app/config/**` hold only non-environment, build-time values (theme and component config) and read no `process.env`, since `app.config` is bundled; build-time reads in `nuxt.config.ts` and the documented `sentry.server.config.ts` exception are exempt (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**`, `server/**` · Src: [9]
- **[STACK-15] Type checking runs outside the build** — With `typescript.typeCheck` unset or `false`, Nuxt type-checks neither `nuxt dev` nor `nuxt build`, so `package.json` defines a `typecheck` script running `nuxt typecheck` (or `vue-tsc`) and it is a documented quality gate (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `nuxt.config.ts` · Src: [13], project: AGENTS.md

## 3. Errors and route rules

- **[STACK-16] `error.vue` contract** — When `app/error.vue` exists, it sits at the app root next to `app/App.vue` (not under `pages/`), declares the single `error` prop typed `NuxtError`, does not call `definePageMeta`, and renders `error.status`/`error.statusText` rather than the legacy `statusCode`/`statusMessage` (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue` · Src: [14]
- **[STACK-17] App errors carry custom fields in `data`** — App-side `createError`/`showError` calls pass `status`/`statusText` and put any custom field under `data`; other custom fields are dropped from the `NuxtError` (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**` · Src: [14]
- **[STACK-18] `NuxtErrorBoundary` treated as client-only** — When `<NuxtErrorBoundary>` is used, it only contains client-side errors of its default slot (it relies on `onErrorCaptured`). SSR and data errors are handled through `useAsyncData` `error`/`status` or the error page, not assumed to be caught by the boundary (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.vue` · Src: [15]
- **[STACK-19] Route rules: SWR carries a TTL, layouts exist** — No `routeRules` entry uses `swr: true`, which emits `stale-while-revalidate` without any max-age; every SWR-cached route sets a TTL in seconds (`swr: 3600`), and every `routeRules[*].appLayout` value is `false` or the name of a layout registered from `app/layouts/` (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [16]

## 4. Vue reactivity and SSR

- **[STACK-20] No module-scope reactive state** — No `ref`, `reactive`, `shallowRef` or mutable `Map`/`Set`/array is created at module scope in code that runs on the server (composables, stores, utils, plugins, shared helpers). Module singletons persist across requests and leak one visitor's state into another (cross-request state pollution); use `useState`, Pinia or per-call state (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/**`, `app/utils/**`, `shared/**` · Src: [18], [6]
- **[STACK-21] Browser APIs and client effects only on the client** — `window`, `document`, `navigator`, `localStorage` and `matchMedia` are reached only in `onMounted` or other client-only hooks, `.client` plugins or behind `import.meta.client`, never at module scope or in the synchronous setup body; timers, subscriptions and global listeners are likewise created in `onMounted`, because unmount hooks never run during SSR (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**`, `app/utils/**` · Src: [18]
- **[STACK-22] Deterministic server render** — Rendered output never depends on values that differ between server and client (`Math.random()`, `Date.now()`/`new Date()`, timezone-dependent formatting, viewport size) — such parts render after `onMounted`, inside `<ClientOnly>`, or share a seed through the payload — and templates never produce markup the HTML parser rewrites (a block element inside `<p>`); loading `/`, `/game` and `/rules` in each locale under `pnpm run dev` then completing one game turn logs no hydration mismatch warning (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [18]
- **[STACK-23] Watchers created synchronously** — `watch`/`watchEffect` are created synchronously during setup. A watcher created in an async callback or after an `await` outside `<script setup>` is not bound to its owner and is stopped manually through its returned handle (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/composables/**` · Src: [19]
- **[STACK-24] Template-ref arrays not assumed ordered** — Code reading the array produced by a template ref inside `v-for` (`useTemplateRef` or `ref`) does not rely on it matching the source array order, which Vue does not guarantee; it maps elements by key or data attribute (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.vue` · Src: [20]

## 5. Pinia

- **[STACK-25] Setup store shape** — Each setup store returns every `ref`/`reactive` it creates (no private state) and never wraps returned state in `readonly()`, both of which break SSR hydration, devtools and plugins; `store.$reset()` is called only on stores that define their own `$reset` action, since setup stores have no built-in one (verified: pinia 4.1.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/**/*.store.ts` · Src: [22], project: docs/architecture.md §4.3
- **[STACK-26] `useStore()` before any `await`** — In store actions and async composables, every `use…Store()` call happens before the first `await`; a later call can bind the wrong Pinia instance during SSR (verified: pinia 4.1.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/**`, `app/composables/**` · Src: [23]
- **[STACK-27] State destructured through `storeToRefs`** — Store state and getters are destructured only through `storeToRefs()`, while actions are destructured from the store itself; destructuring state or getters directly from the store loses reactivity (verified: pinia 4.1.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/composables/**` · Src: [22]
- **[STACK-28] `skipHydrate` for client-only store state** — When a setup store returns state that must not be hydrated from the server payload (e.g. `useLocalStorage`, browser-only refs), that property is returned wrapped in `skipHydrate()` (verified: pinia 4.1.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**/*.store.ts` · Src: [25]
- **[STACK-29] Pinia module wiring** — `pinia.storesDirs` uses a recursive glob (`stores/**`) because `@pinia/nuxt` auto-imports only top-level `app/stores` files while stores live in `app/stores/domain/<entity>/`, and `package.json` lists `@vue/devtools-api` (v8) next to `pinia` 4, which moved it to `peerDependencies` and no longer installs it (verified: pinia 4.1.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [26], [27]

## 6. VueUse

- **[STACK-30] SSR width for media queries** — `useMediaQuery`/`useBreakpoints` in SSR-rendered components pass `ssrWidth`, or the app calls `provideSSRWidth`; otherwise server and client render different branches (verified: @vueuse/core 15.0.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/composables/**` · Src: [29], [30]
- **[STACK-31] VueUse `useStorage` imported explicitly** — App code that needs VueUse `useStorage` imports it from `@vueuse/core`; in Nuxt the auto-imported `useStorage` is Nitro's storage API (verified: @vueuse/core 15.0.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**` · Src: [31]

## 7. Nuxt UI

- **[STACK-32] `UApp` wraps the whole app** — `app/App.vue` renders `<UApp>` around `<NuxtLayout>`/`<NuxtPage>`, and every component that raises toasts, shows tooltips or opens programmatic modals/slideovers renders inside it, since `UApp` provides those providers (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/App.vue` · Src: [32]
- **[STACK-33] Dynamic components listed for detection** — With `ui.experimental.componentDetection` enabled, every Nuxt UI component reached only dynamically (`<component :is>`, string-resolved) is named in the array form (`componentDetection: ['Modal', …]`); otherwise its theme CSS is not generated (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/**/*.vue` · Src: [33]

## 8. Nuxt I18n module configuration

- **[STACK-34] No avoidable `i18n.config.ts`** — Vue I18n runtime options live in an `i18n.config.ts` (resolved from the i18n `restructureDir`, here `app/i18n/`) only when they need non-serializable runtime values. That file is loaded on every request and adds server latency, so everything the module supports stays under the `i18n` key of `nuxt.config.ts` (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/i18n/**` · Src: [35], [34]
- **[STACK-35] Strict message compilation explicit** — `i18n.compilation.strictMessage` is set explicitly to `true`; with the default, HTML in static locale files read by the server build is only a build warning. Any `strictMessage: false` comes with `escapeHtml: true` (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [34]
- **[STACK-36] Portable locale loaders** — When a locale file uses `defineI18nLocale`, its loader uses only APIs available on both server and browser (`$fetch`, `useRuntimeConfig`). Any Nuxt app composable is called directly in the locale file, not through an imported helper, and no loader reads server-only resources through Nuxt composables (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/**` · Src: [36]

## 9. Nitro and h3

- **[STACK-37] Validated reads: throwing validator, awaited** — `readValidatedBody`/`getValidatedQuery` receive a function that throws on invalid input (`(raw) => SCHEMA.parse(raw)`), never a bare Zod schema object or `SCHEMA.safeParse` — h3 v1 fails validation only on a thrown error or `false` and otherwise returns the function result — and every call is awaited, since both return a Promise in h3 v1 (verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**`, `server/api/**` · Src: [37], [38]
- **[STACK-38] Cached server output varies on its inputs** — When a `cache`/`swr` route rule, `defineCachedEventHandler` or `defineCachedFunction` serves request-dependent output (locale cookie `goat_it_locale`, `accept-language`), its `varies` option lists those headers, because all other request headers are dropped when handling cached responses (verified: nitropack 2.13.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/**`, `nuxt.config.ts` · Src: [40]
- **[STACK-39] `nuxt/server` imports not mixed with h3** — When a server file imports helpers from `nuxt/server` (Nuxt 4.6+), it also imports `defineEventHandler` from `nuxt/server`; pairing them with h3's auto-imported `defineEventHandler` fails with `NUXT_E8012` (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/**` · Src: [10]

## 10. Nuxt Content

- **[STACK-40] Server queries pass the event** — When Nitro code queries a collection, it calls `queryCollection(event, '<collection>')` with the H3 event as first argument; the event-less signature is for Vue code only (verified: @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/**` · Src: [41]
- **[STACK-41] No Content v2 APIs** — Code uses none of the removed v2 APIs: `queryContent()`, `fetchContentNavigation()`, `useContent()`, `<ContentDoc>`, `<ContentList>`, `<ContentNavigation>`, `<ContentQuery>`, `._path` or `_dir.yml`. Their replacements are `queryCollection*`, `<ContentRenderer>`, `.path` and `.navigation.yml` (verified: @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**`, `content/**` · Src: [43]

## 11. Sentry SDK

- **[STACK-42] No legacy server bootstrap** — No `public/instrument.server.*` file exists and no start command (`package.json` scripts, `Dockerfile` `CMD`, `NODE_OPTIONS`) preloads a Sentry server config with `--import`; the root `sentry.server.config.ts` is bundled into the Nitro build and initializes itself (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `package.json`, `Dockerfile`, `sentry.*.config.ts` · Src: [44]
- **[STACK-43] Sentry config files split env and SDK options** — `sentry.server.config.ts` reads its settings from `process.env`, because it initializes before `useRuntimeConfig()` is available, while `sentry.client.config.ts` may read `useRuntimeConfig().public`; runtime SDK options (`dsn`, `environment`, `release`, sample rates, `beforeSend`, integrations) are passed to `init()` in the two config files, built by `shared/utils/helpers/sentry/`, and the `sentry` key of `nuxt.config.ts` keeps only module and build options (`sourcemaps`, `telemetry`, org, project, auth) (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `sentry.*.config.ts` · Src: [45]
- **[STACK-44] No removed or no-op Sentry options** — `init()` and the `sentry` key of `nuxt.config.ts` include none of `sendDefaultPii` (removed, replaced by `dataCollection`), `beforeSendTransaction` or `ignoreTransactions` (no-ops under span streaming; use `beforeSendSpan`/`ignoreSpans`), `enableMetrics`/`_experiments.enableMetrics` (removed), `autoInjectServerSentry` or `experimental_entrypointWrappedFunctions` (deprecated in v11), or `sourceMapsUploadOptions` (removed — its fields move to the top level) (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `sentry.*.config.ts`, `shared/utils/helpers/sentry/**` · Src: [44]

## 12. PWA module

- **[STACK-45] `$pwa` access tolerates `undefined`** — Every read of `$pwa` or `useNuxtApp().$pwa` uses optional chaining or an explicit guard. `$pwa` is undefined when PWA is disabled and in `nuxt dev` unless `pwa.devOptions.enabled` (default `false`) is set, and its features are unavailable when `pwa.client.registerPlugin` is `false` (verified: @vite-pwa/nuxt 1.1.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**` · Src: [46], [47]

## 13. Zod

- **[STACK-46] Zod coercion traps avoided** — String inputs carrying booleans (env vars, query params, cookie values) use `z.stringbool()` or an explicit enum — `z.coerce.boolean()` is `Boolean(input)`, so "false" parses to `true` — and `z.coerce.number()` is never applied to values that may be empty strings without a guard (`z.string().min(1)` pipe or preprocess), since an empty string silently coerces to `0` (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `shared/schemas/**`, `server/utils/env/**`, `server/**` · Src: [48]
- **[STACK-47] `.catch()` only for intended silent fallbacks** — Schema `.catch()` returns its fallback on any validation error without surfacing the issue. It appears only where a silent default is the intended behavior (e.g. tolerant preference parsing), never on request-body, query or upstream DTO schemas (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/schemas/**`, `server/**`, `app/**` · Src: [48]
- **[STACK-48] No deprecated Zod 4 APIs** — String formats use the top-level forms (`z.url()`, `z.email()`, `z.uuid()`, `z.iso.datetime()`…) — the method forms are deprecated — and code uses none of `.merge()` (use `.extend()`), `.strict()`/`.passthrough()` (use `z.strictObject()`/`z.looseObject()`), `z.nativeEnum()` (use `z.enum()`), the `message` parameter (use `error`), `ZodError.format()`/`.flatten()` (use `z.treeifyError()`), `.addIssue()`/`.addIssues()` or `z.promise()` (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `shared/**`, `server/**`, `app/**` · Src: [49], [48]

## 14. Stack currency and deprecations

- **[STACK-49] No deprecated head and module APIs** — `useHead`/`useSeoMeta` entries use none of the props removed in Unhead v2 (`vmid`, `hid`, `children`, `body`) and pass no Promise as input; module configuration uses no flag deprecated by the installed version, e.g. `content.experimental.nativeSqlite` (use `sqliteConnector`) or the deprecated `app/plugins/<dir>/index.ts` scanning (verified: nuxt 4.6.3, @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.vue`, `app/composables/**` · Src: [10]
- **[STACK-50] Clean build diagnostics** — `pnpm run build` and a `pnpm run dev` start print no deprecation warning or diagnostic code from Nuxt (e.g. `B5001`), Nuxt modules, Vue or Pinia; each one is fixed or recorded as a decision (verified: nuxt 4.6.3, pinia 4.1.0).
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [11], [28]

## Sources

[1] Nuxt — useAsyncData — https://nuxt.com/docs/4.x/api/composables/use-async-data — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[2] Nuxt — useRequestFetch — https://nuxt.com/docs/4.x/api/composables/use-request-fetch — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[3] Nuxt — $fetch — https://nuxt.com/docs/4.x/api/utils/dollarfetch — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[4] Nuxt — callOnce — https://nuxt.com/docs/4.x/api/utils/call-once — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[5] Nuxt — useState — https://nuxt.com/docs/4.x/api/composables/use-state — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[6] Nuxt — State Management (best practices) — https://nuxt.com/docs/4.x/getting-started/state-management — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[7] Nuxt — Auto-imports (Vue and Nuxt composables context) — https://nuxt.com/docs/4.x/guide/concepts/auto-imports — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[8] Nuxt — plugins directory — https://nuxt.com/docs/4.x/directory-structure/app/plugins — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[9] Nuxt — Configuration (runtimeConfig vs app.config) — https://nuxt.com/docs/4.x/getting-started/configuration — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[10] Nuxt — Upgrade Guide (Testing Nuxt 5, nuxt/server, Nuxt 4 changes) — https://nuxt.com/docs/4.x/getting-started/upgrade — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[11] Nuxt — B5001 (missing compatibilityDate) — https://nuxt.com/docs/4.x/errors/b5001 — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[12] Nuxt — Experimental Features — https://nuxt.com/docs/4.x/guide/going-further/experimental-features — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[13] Nuxt — TypeScript (type-checking) — https://nuxt.com/docs/4.x/guide/concepts/typescript — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[14] Nuxt — error.vue — https://nuxt.com/docs/4.x/directory-structure/app/error — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[15] Nuxt — NuxtErrorBoundary — https://nuxt.com/docs/4.x/api/components/nuxt-error-boundary — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[16] Nuxt — Rendering Modes (route rules) — https://nuxt.com/docs/4.x/guide/concepts/rendering — fetched 2026-10-31 (nuxt 4.6.3, docs 4.x)
[18] Vue — Server-Side Rendering (SSR) — https://vuejs.org/guide/scaling-up/ssr — fetched 2026-10-31 (vue 3.5.44)
[19] Vue — Watchers — https://vuejs.org/guide/essentials/watchers — fetched 2026-10-31 (vue 3.5.44)
[20] Vue — Template Refs — https://vuejs.org/guide/essentials/template-refs — fetched 2026-10-31 (vue 3.5.44)
[22] Pinia — Defining a Store — https://pinia.vuejs.org/core-concepts/ — fetched 2026-10-31 (pinia 4.1.0, docs v4 branch)
[23] Pinia — Composing Stores — https://pinia.vuejs.org/cookbook/composing-stores.html — fetched 2026-10-31 (pinia 4.1.0, docs v4 branch)
[25] Pinia — Dealing with Composables (skipHydrate) — https://pinia.vuejs.org/cookbook/composables.html — fetched 2026-10-31 (pinia 4.1.0, docs v4 branch)
[26] Pinia — Nuxt (callOnce, auto imports, storesDirs) — https://pinia.vuejs.org/ssr/nuxt.html — fetched 2026-10-31 (pinia 4.1.0, @pinia/nuxt 1.0.3)
[27] Pinia — @pinia/nuxt ModuleOptions — https://pinia.vuejs.org/api/%40pinia/nuxt/interfaces/ModuleOptions.html — fetched 2026-10-31 (@pinia/nuxt 1.0.3)
[28] Pinia — CHANGELOG (4.0.0 breaking changes, 4.1.0) — https://github.com/vuejs/pinia/blob/v4/packages/pinia/CHANGELOG.md — fetched 2026-10-31 (pinia 4.1.0)
[29] VueUse — useMediaQuery (SSR) — https://vueuse.org/core/useMediaQuery/ — fetched 2026-10-31 (@vueuse/core 15.0.0)
[30] VueUse — useBreakpoints (ssrWidth) — https://vueuse.org/core/useBreakpoints/ — fetched 2026-10-31 (@vueuse/core 15.0.0)
[31] VueUse — useStorage (Nuxt auto-import note) — https://vueuse.org/core/useStorage/ — fetched 2026-10-31 (@vueuse/core 15.0.0)
[32] Nuxt UI — App component — https://ui.nuxt.com/docs/components/app — fetched 2026-10-31 (@nuxt/ui 4.12.0)
[33] Nuxt UI — Installation, Nuxt (experimental.componentDetection) — https://ui.nuxt.com/docs/getting-started/installation/nuxt — fetched 2026-10-31 (@nuxt/ui 4.12.0)
[34] @nuxtjs/i18n — Options — https://github.com/nuxt-modules/i18n/blob/v10.6.0/docs/content/docs/04.api/00.options.md — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[35] @nuxtjs/i18n — Vue I18n Configuration (i18n.config.ts per request) — https://github.com/nuxt-modules/i18n/blob/v10.6.0/docs/content/docs/01.getting-started/03.vue-i18n.md — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[36] @nuxtjs/i18n — defineI18nLocale — https://github.com/nuxt-modules/i18n/blob/v10.6.0/docs/content/docs/06.composables/11.define-i18n-locale.md — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[37] h3 — Request utils (readValidatedBody, getValidatedQuery) — https://github.com/h3js/h3/blob/v1.15.11/docs/2.utils/1.request.md — fetched 2026-10-31 (h3 1.15.11)
[38] h3 — validateData source — https://github.com/h3js/h3/blob/v1.15.11/src/utils/internal/validate.ts — fetched 2026-10-31 (h3 1.15.11)
[40] Nitro — Cache (varies, JSON serialization) — https://github.com/nitrojs/nitro/blob/v2.13.5/docs/1.guide/6.cache.md — fetched 2026-10-31 (nitropack 2.13.5)
[41] Nuxt Content — queryCollection (server usage) — https://content.nuxt.com/docs/utils/query-collection — fetched 2026-10-31 (@nuxt/content 3.16.2)
[43] Nuxt Content — Migration from v2 — https://content.nuxt.com/docs/getting-started/migration — fetched 2026-10-31 (@nuxt/content 3.16.2)
[44] Sentry JavaScript SDK — MIGRATION.md (v10 to v11) — https://github.com/getsentry/sentry-javascript/blob/11.9.0/MIGRATION.md — fetched 2026-10-31 (@sentry/nuxt 11.9.0)
[45] Sentry — Nuxt manual setup — https://docs.sentry.io/platforms/javascript/guides/nuxt/manual-setup/ — fetched 2026-10-31 (@sentry/nuxt 11.9.0)
[46] Vite PWA — Nuxt framework guide ($pwa, registerPlugin) — https://github.com/vite-pwa/docs/blob/main/frameworks/nuxt.md — fetched 2026-10-31 (@vite-pwa/nuxt 1.1.1)
[47] Vite PWA — Development (devOptions) — https://github.com/vite-pwa/docs/blob/main/guide/development.md — fetched 2026-10-31 (@vite-pwa/nuxt 1.1.1)
[48] Zod — API (coercion, stringbool, catch) — https://github.com/colinhacks/zod/blob/v4.6.7/packages/docs/content/api.mdx — fetched 2026-10-31 (zod 4.6.7)
[49] Zod — Migration guide / v4 changelog (deprecations) — https://github.com/colinhacks/zod/blob/v4.6.7/packages/docs/content/v4/changelog.mdx — fetched 2026-10-31 (zod 4.6.7)
