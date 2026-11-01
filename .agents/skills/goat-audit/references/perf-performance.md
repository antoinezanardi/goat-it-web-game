# PERF — Performance

Loading, rendering and runtime performance of the Goat It web game across its SSR pages (`/`, `/game`, `/rules`, `/offline`):
Core Web Vitals budgets and measurement, client JavaScript and CSS cost (route chunks, lazy components and hydration, scoped heavy
libraries such as GSAP, Sentry and the Nuxt Content WASM client database), fonts, images, SSR payload size and Vue reactivity cost,
interaction responsiveness and animation, HTTP caching and compression of Nitro-served assets, back/forward cache eligibility, server
response time, memory growth during long game sessions, and web sustainability.

**Decision doc:** `docs/performance.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** hydration mismatch causes, `$fetch` in `<script setup>`, `useAsyncData` key consistency → STACK · service-worker precache scope and browser support baseline → PWA · reduced motion → A11Y · animation durations, loading states and perceived performance → UX · upstream timeouts and retries → REL · reverse-proxy configuration → PLAT · security headers and CSP → SEC

## Contents

- [1. Budgets & measurement](#1-budgets--measurement)
- [2. JavaScript cost](#2-javascript-cost)
- [3. CSS & fonts](#3-css--fonts)
- [4. Images](#4-images)
- [5. SSR payload & large data](#5-ssr-payload--large-data)
- [6. INP & animation](#6-inp--animation)
- [7. Caching & delivery](#7-caching--delivery)
- [8. bfcache](#8-bfcache)
- [9. Server performance](#9-server-performance)
- [10. Memory & leaks](#10-memory--leaks)
- [11. Sustainability](#11-sustainability)
- [Sources](#sources)

## 1. Budgets & measurement

- **[PERF-01] Lab Core Web Vitals and score** — Mobile Lighthouse runs of `/`, `/game` and `/rules` show LCP ≤ 2500 ms, CLS ≤ 0.1 and a performance score ≥ 90 (weights: TBT 30 %, LCP 25 %, CLS 25 %, FCP 10 %, Speed Index 10 %).
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [1], [23]
- **[PERF-02] Field Core Web Vitals at p75** — Field data (RUM or CrUX) shows LCP ≤ 2500 ms, INP ≤ 200 ms and CLS ≤ 0.1 at the 75th percentile, reported separately for mobile and desktop; INP verdicts never come from lab runs.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [1]
- **[PERF-03] Field RUM collection** — A client plugin registers `web-vitals` (v5+) `onLCP`, `onINP`, `onCLS`, `onTTFB` and `onFCP` exactly once per page load (never per route change or component mount), reports through `navigator.sendBeacon` or `fetch` with `keepalive`, and tags every report with the navigation type (`navigate`, `reload`, `back-forward`, `prerender`) so bfcache restores are analysed apart from full loads.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/plugins/**`, `nuxt.config.ts` · Src: [25]
- **[PERF-04] Lighthouse CI assertions** — CI runs Lighthouse on `/`, `/game` and `/rules` with assertions on LCP, TBT, CLS and a performance score ≥ 0.9 (the "good" band is 90–100).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/**`, `.github/actions/**` · Src: [18], [23]
- **[PERF-05] Bundle budgets cover JS and CSS** — The size-budget configuration sets an explicit byte limit for all client JS and all client CSS in the build output, and the bundle-size script runs that configuration.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/size-limit/**`, `package.json` · Src: [18]
- **[PERF-06] Per-page-type budget** — The initial JS of each page type (home `/`, game `/game`, docs `/rules`: entry chunk plus the page chunk and its static imports) has its own ceiling, separate from the aggregate `_nuxt/**/*.js` limit.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/size-limit/**` · Src: [18]
- **[PERF-07] Regression detected against the base commit** — The bundle-size job measures both the PR build and the exact base commit and reports or fails on a size regression, not only on an absolute budget overflow.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/bundle-size/**`, `scripts/bundle-size/**` · Src: [18]
- **[PERF-08] Bundle budgets pass** — `pnpm run check:bundle-size` run after a fresh `pnpm run build` reports every size-limit entry under its limit.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [18]

## 2. JavaScript cost

- **[PERF-09] Per-route chunks** — `.output/public/_nuxt` contains a separate chunk per page (`/`, `/game`, `/rules`) and the entry chunk contains no page-only feature code (game question feed, tutorial, docs shell).
  Evidence: `artifact` · Diff: ✗ · Core: ✓ · Severity: high · Src: [9], [19]
- **[PERF-10] GSAP absent from the initial graph** — In the built client, `gsap` code lives only in a dynamically imported chunk; neither the entry chunk nor the `modulepreload` set of `/` contains GSAP.
  Evidence: `artifact` · Diff: ✗ · Core: ✓ · Severity: high · Look: `app/composables/core/useGsap/**` · Src: [9], [21]
- **[PERF-11] GSAP loaded only through useGsap** — No runtime import of GSAP exists outside its single loader unit; other files use `import type` only and obtain the instance through that loader.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**` · Src: [9], [21], project: docs/architecture.md §4.5
- **[PERF-12] Sentry client SDK scoped** — The client Sentry init imports no `replayIntegration`, `browserTracingIntegration` or profiling integration unless a documented decision accepts their bundle cost; optional integrations are tree-shaken only when not imported (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `sentry.client.config.ts`, `shared/utils/helpers/sentry/**` · Src: [32]
- **[PERF-13] Content client database confined to content pages** — `queryCollection` calls run inside `useAsyncData` on content pages only (served from the payload after SSR); because the first client-side query downloads the full database dump and starts a WASM SQLite database in the browser, no component rendered on `/` or `/game` calls `queryCollection` (verified: @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**`, `content.config.ts` · Src: [30]
- **[PERF-14] No content dump on game flows** — Loading `/` and `/game` and navigating between them triggers no Nuxt Content database dump or `.wasm` download in the network log.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [30]
- **[PERF-15] No globally registered components** — `components.global` is never `true` and no `.global.vue` file or `components/global/` directory exists; each global component is emitted as its own async chunk registered app-wide (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/components/**` · Src: [20]
- **[PERF-16] Off-critical-path components lazy** — Modals, popovers, the tutorial and the changelog render through the `Lazy` prefix (or `defineAsyncComponent`) behind a `v-if` such as `useLazyModal` `hasEverOpened`, so their code loads on first open; a server-rendered lazy component that sits below the fold or is interactive only on demand uses a hydration strategy (`hydrate-on-visible`, `hydrate-on-idle`, `hydrate-on-interaction`, `hydrate-on-media-query`, `hydrate-after`, `hydrate-when`) (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/composables/ui/useLazyModal/**` · Src: [19], [20], [21]
- **[PERF-17] No delayed hydration above the fold** — The home logo and play button, header controls and the first question card hydrate eagerly; no `hydrate-*` strategy is set on content in the initial viewport (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**` · Src: [20]
- **[PERF-18] Hydration strategy usable** — Each lazy component sets at most one strategy, writes the hydration prop in the template (no `v-bind` object spread), is not imported directly from `#components`, never uses `hydrate-never` on interactive UI, and shares no `v-model` that would force hydration (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/pages/**` · Src: [20]
- **[PERF-19] Prefetch volume bounded** — The SSR HTML of `/` carries `rel="prefetch"` hints only for chunks of likely next navigations; chunks never needed from that page are excluded through the `build:manifest` hook with `chunk.prefetch = false` (verified: nuxt 4.6.3).
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [11], [19]
- **[PERF-20] No duplicated dependency copies** — Each library (vue, gsap, zod, @goat-it/schemas, reka-ui…) appears once in the client chunk graph, in a single version.
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [9]
- **[PERF-21] Tree-shakeable ES module dependencies** — Packages reaching the client bundle ship ES modules and are consumed through named imports; no CommonJS-only package is bundled whole.
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [21]
- **[PERF-22] No legacy JavaScript** — Client chunks contain no `core-js` polyfills and no down-levelled syntax for features supported by the declared browser baseline.
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [9]
- **[PERF-23] Third-party SDKs deferred** — When a third-party SDK other than error monitoring (analytics, chat, ads) is added, it loads after hydration through `onNuxtReady`, an idle callback or a Nuxt Scripts trigger, never in the critical head path.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/plugins/**`, `nuxt.config.ts` · Src: [19]
- **[PERF-24] Client plugins stay cheap** — Files under `app/plugins/` do no heavy synchronous work during hydration; expensive logic lives in composables, utilities or lazy imports.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/plugins/**` · Src: [19]

## 3. CSS & fonts

- **[PERF-25] Render-blocking CSS budget** — The render-blocking `entry.*.css` transfer size is smaller than the LCP resource of `/`, or the critical CSS is inlined; route-specific stylesheets (`docs.css`, `game-tutorial.css`) are not shipped to routes that do not use them.
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [2]
- **[PERF-26] Nuxt UI CSS limited to used components** — `ui.experimental.componentDetection` is enabled so CSS is generated only for the Nuxt UI components (and their dependencies) the source uses (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [31]
- **[PERF-27] Theme colour aliases trimmed** — `ui.theme.colors` lists only the colour aliases the app uses (keeping `error` when forms rely on it), because each alias generates a full set of shades in component themes (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `nuxt.config.ts`, `app/app.config.ts` · Src: [31]
- **[PERF-28] WOFF2 only** — Every `@font-face` `src` and every font file requested by pages is WOFF2; no `.woff`, `.ttf`, `.otf` or `.eot` request occurs on page load.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**`, `public/fonts/**` · Src: [6]
- **[PERF-29] Fonts limited and subset** — Pages load one family and the minimum number of files split by `unicode-range` that covers the script ranges of the supported locales; variable-font axes are restricted to those used.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/**`, `public/fonts/**` · Src: [6], [26]
- **[PERF-30] Explicit font-display** — Every `@font-face` sets `font-display: swap` or `optional`; `block` and `auto` are never used for body text.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**` · Src: [6]
- **[PERF-31] Fallback metric overrides** — The fallback face declares `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` so the swap to the web font causes no visible layout shift.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/**` · Src: [4], [6]
- **[PERF-32] No icon fonts or runtime stylesheet imports** — Icons render as SVG, never as an icon font, and no stylesheet or font CSS reaches the browser through a runtime CSS `@import` or a remote URL (build-inlined local `@import`s are fine).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/**`, `nuxt.config.ts` · Src: [6]

## 4. Images

- **[PERF-33] LCP image never lazy-loaded** — The above-the-fold logo on `/` and any image in the first viewport of `/game` and `/rules` carry no `loading="lazy"`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/pages/**`, `app/components/**` · Src: [2], [10]
- **[PERF-34] LCP image discoverable with high priority** — The LCP image is an `<img>` whose `src` is in the SSR HTML with `fetchpriority="high"`; it is never injected by client JS or rendered inside a `.client` component or `<ClientOnly>`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/pages/**` · Src: [2]
- **[PERF-35] Background LCP preloaded** — When a CSS `background-image` can be the LCP element, the page emits a matching `<link rel="preload" as="image" fetchpriority="high">`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `public/img/**` · Src: [2], [8]
- **[PERF-36] Dimensions on every image** — Every `<img>` has `width` and `height` attributes or a CSS `aspect-ratio`, so space is reserved before the image loads.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**` · Src: [4]
- **[PERF-37] Modern image formats** — Images rendered in pages are AVIF or WebP (with a `<picture>` fallback when a legacy format is still required); no multi-hundred-KB PNG or JPEG is rendered in a page.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `public/img/**`, `app/components/**` · Src: [7]
- **[PERF-38] Correctly sized images** — Lighthouse "Properly size images" passes on `/`, `/game` and `/rules`: intrinsic size matches rendered CSS pixels × DPR (beyond DPR 2 is rarely perceivable).
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [7]
- **[PERF-39] srcset paired with sizes** — When `srcset` uses width descriptors, the same element sets `sizes` (width descriptors are ignored without it).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/components/**` · Src: [7]
- **[PERF-40] Lazy loading for below-the-fold media** — Images that start below the fold or render inside modals, drawers or popovers use `loading="lazy"`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**` · Src: [10]

## 5. SSR payload & large data

- **[PERF-41] No duplicate requests on hydration** — During hydration of `/`, `/game` and `/rules`, the network log shows no repeat of a request already resolved during SSR; that data arrives through the payload (verified: nuxt 4.6.3).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [19], [28]
- **[PERF-42] Payload bounded per route** — `__NUXT_DATA__` in each route SSR HTML holds only data the page renders (no unused upstream fields or duplicated catalogs); `pick` or `transform` trims large responses, large or immutable results keep `deep: false`, and data not needed after hydration uses `serialize: false` (verified: nuxt 4.6.3).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [22], [28]
- **[PERF-43] Shallow reactivity for large immutable data** — Large immutable structures (question buffers, theme catalogs) held in refs or stores use `shallowRef` or `shallowReactive` and are updated by replacing the root value (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `app/composables/**` · Src: [21]
- **[PERF-44] v-memo used correctly** — `v-memo` sits on the same element as `v-for` (it does not work inside `v-for`), is reserved for large lists or measured hotspots, and its dependency array covers every value the subtree renders (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/pages/**` · Src: [21], [29]
- **[PERF-45] Stable props in lists** — Parents pass per-item primitives (e.g. `:active="item.id === activeId"`) instead of a shared changing value, so only affected children re-render (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**` · Src: [21]
- **[PERF-46] Client-only content off the LCP path** — `.client` components and `<ClientOnly>` never wrap above-the-fold content of `/`, `/game` or `/rules`; the LCP-element rule is PERF-39 (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/layouts/**`, `app/App.vue` · Src: [20]
- **[PERF-47] Static routes prerendered** — Routes whose HTML is identical for every request and needs no hydration are prerendered with `prerender: true` and `noScripts` (e.g. `/offline`); cookie-localized interactive routes are not prerendered.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `nuxt.config.ts` · Src: [19], [27], project: docs/pwa.md §3

## 6. INP & animation

- **[PERF-48] No long tasks on key interactions** — A DevTools Performance recording with 4× CPU throttling shows no main-thread task over 50 ms during load or on answer reveal, next/previous question, and opening filters or settings.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [12]
- **[PERF-49] Interaction latency within 200 ms** — In the same recording, each of those interactions presents its next frame within 200 ms.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [3], [19]
- **[PERF-50] Bulk work yields** — When a loop or work queue can exceed 50 ms, it yields to the main thread (for example `scheduler.yield()` with a `setTimeout` fallback where it is unsupported), batching to a ~50 ms deadline; no `isInputPending()` polling or busy-wait.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `app/utils/**` · Src: [12]
- **[PERF-51] Handlers paint first** — Event handlers of primary interactions apply the visual update first and defer non-visual work (cookie persistence, telemetry, logging) to a later task.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/composables/**` · Src: [3]
- **[PERF-52] No layout thrashing** — No code writes styles and then reads layout (`offsetWidth`, `getBoundingClientRect`, `scrollHeight`) in the same task inside loops, scroll/resize handlers or animation callbacks.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/composables/**`, `app/utils/**` · Src: [3]
- **[PERF-53] Composited animations only** — CSS transitions and keyframes and GSAP tweens animate `transform` and `opacity` only, never `top`, `left`, `width`, `height`, `margin` or `box-shadow`; `will-change` is set only while an element animates and removed afterwards, never as a permanent rule on many elements.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/**`, `app/components/**` · Src: [4], [13]
- **[PERF-54] DOM size bounded** — Lighthouse DOM size on `/`, `/game` (sidebar and modals closed) and `/rules` stays below 800 elements and never reaches 1400.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [14]
- **[PERF-55] Large lists virtualized** — When a rendered list can exceed about 100 items (theme filters, changelog entries), only viewport-adjacent items are rendered; long sections rendered offscreen use `content-visibility: auto` with `contain-intrinsic-size` to avoid scrollbar jitter.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**` · Src: [21]

## 7. Caching & delivery

- **[PERF-56] Hashed build assets immutable** — Responses for hashed files under `/_nuxt/` carry `Cache-Control: public, max-age=31536000, immutable`.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [17]
- **[PERF-57] Immutable only for versioned URLs** — Every path served as immutable (`routeRules` headers for `/fonts/**`, `/img/**`, `/pwa/**`, `/_i18n/**`, or `publicAssets[].maxAge`, which emits `public, max-age=n, immutable`) changes its URL whenever its content changes (verified: nitropack 2.13.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `public/**` · Src: [17], [27]
- **[PERF-58] Documents revalidate, never no-store** — HTML documents are served `no-cache` or `max-age=0, must-revalidate`; `no-store` stays scoped to `/api/**` and health probes so pages remain bfcache-eligible.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/middleware/**`, `server/utils/security/**` · Src: [16], [17], project: docs/security.md
- **[PERF-59] Public assets precompressed** — `nitro.compressPublicAssets` enables `gzip` and `brotli` (default: both off); Nitro then writes `.gz`/`.br` only for supported MIME types larger than 1024 bytes, never for WOFF/WOFF2 or raster images, and after a build `.output/public/_nuxt/` holds those siblings for every JS and CSS file above 1024 bytes (verified: nitropack 2.13.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [27]
- **[PERF-60] Compressed responses served** — Production responses for JS, CSS, SVG, SSR HTML and `/api/**` JSON carry `Content-Encoding: br` (gzip fallback) with `Vary: Accept-Encoding`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [5]
- **[PERF-61] No redirect hops** — HTTPS navigations to `/`, `/game` and `/rules` resolve with no same-origin redirect (no trailing-slash or locale bounce).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [5]
- **[PERF-62] Multiplexed protocol** — Production serves documents and assets over HTTP/2 or HTTP/3 (DevTools Protocol column or `Alt-Svc` header).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [5]
- **[PERF-63] Resource hints justified** — `preconnect` appears only for critical cross-origin origins (with `crossorigin` for CORS fetches such as fonts); other origins get at most `dns-prefetch`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/App.vue`, `nuxt.config.ts` · Src: [8]
- **[PERF-64] Preloads well-formed** — Pages carry at most three manual `preload`s, all consumed with no preloaded-but-not-used warning; every manual `preload` sets `as`, font preloads add `crossorigin` and `type="font/woff2"`, and responsive image preloads use `imagesrcset`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/pages/**` · Src: [8]

## 8. bfcache

- **[PERF-65] No unload listeners** — No `unload` listener exists in app code or bundled dependencies (Lighthouse `no-unload-listeners` passes).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**` · Src: [16]
- **[PERF-66] beforeunload conditional** — A `beforeunload` listener is attached only while unsaved state exists and removed as soon as it is gone.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `app/components/**` · Src: [16]
- **[PERF-67] Restore refreshes stale state** — Lifecycle work uses `pagehide`/`pageshow`, and a `pageshow` with `event.persisted` refreshes state that can be stale after a restore (e.g. connectivity status).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `app/plugins/**` · Src: [16]
- **[PERF-68] bfcache eligibility verified** — DevTools Application → Back/forward cache → "Test back/forward cache" reports a restore for `/`, `/game` and `/rules`.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [16]

## 9. Server performance

- **[PERF-69] TTFB budget** — Navigation TTFB for `/`, `/game` and `/rules` is ≤ 0.8 s at p75 (0.8–1.8 s needs improvement, > 1.8 s is poor).
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [2], [5]
- **[PERF-70] Server-Timing exposed** — Document responses expose SSR and upstream phases through `Server-Timing` (Nitro `timing: true` adds the header), so server time is measurable even behind caching (verified: nitropack 2.13.5).
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [5], [27]
- **[PERF-71] SSR awaits only rendered data** — Server rendering awaits only data the initial view renders; data used after an interaction (filters modal, settings, changelog) is fetched on demand or with `lazy: true` (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**`, `app/stores/**`, `app/composables/**` · Src: [19], [28]
- **[PERF-72] HTML route caching respects variance** — When `swr`, `isr` or `cache` route rules are added for HTML, the cache varies on the `goat_it_locale` cookie and never replays a per-request CSP nonce.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [19], [27], project: docs/security.md, project: docs/pwa.md

## 10. Memory & leaks

- **[PERF-73] No detached DOM after navigation cycles** — A heap snapshot filtered on Detached is empty after 10 cycles of opening and closing modals, the sidebar and the tutorial and of navigating between `/` and `/game`; a Performance recording with forced GC at start and end shows the JS heap back at baseline after repeated games and question navigation.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [24]
- **[PERF-74] Teardown for listeners, observers and timers** — Every `addEventListener`, `ResizeObserver`, `IntersectionObserver`, `setInterval` and pending `setTimeout` created by a component or composable is released in `onUnmounted` or `onScopeDispose`, or registered through a scope-bound helper.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/composables/**` · Src: [24]
- **[PERF-75] GSAP animations reverted** — Every GSAP tween, timeline or `gsap.context()` created by a component is killed or reverted on unmount.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**`, `app/composables/**` · Src: [13], [24]
- **[PERF-76] Bounded server caches** — Every in-process server map or cache has a TTL and a size cap; no map grows without bound with request input.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/**`, `server/middleware/**` · Src: [5]

## 11. Sustainability

- **[PERF-77] Resource goals defined** — `docs/performance.md` defines measurable limits on transferred bytes, requests and rendered elements per page type, tracked over time; every third-party resource is assessed, self-hosted where possible, loaded only when needed and counted in those budgets.
  Evidence: `static` · Diff: ✓ · Severity: low · Src: [18], [26]
- **[PERF-78] Animation only where it serves the task** — No decorative loop animation runs continuously; animation is tied to game feedback and pauses when offscreen or when the tab is hidden.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/**`, `app/components/**` · Src: [26]

## Sources

[1] Web Vitals — https://web.dev/articles/vitals — fetched 2026-10-31 (last updated 2024-10-31)
[2] Optimize Largest Contentful Paint — https://web.dev/articles/optimize-lcp — fetched 2026-10-31 (last updated 2025-03-31)
[3] Optimize Interaction to Next Paint — https://web.dev/articles/optimize-inp — fetched 2026-10-31 (last updated 2025-09-02)
[4] Optimize Cumulative Layout Shift — https://web.dev/articles/optimize-cls — fetched 2026-10-31 (last updated 2025-02-07)
[5] Optimize Time to First Byte — https://web.dev/articles/optimize-ttfb — fetched 2026-10-31 (last updated 2025-11-28)
[6] Best practices for fonts — https://web.dev/articles/font-best-practices — fetched 2026-10-31 (last updated 2022-10-04)
[7] Image performance (Learn Performance) — https://web.dev/learn/performance/image-performance — fetched 2026-10-31 (last updated 2023-11-01)
[8] Assist the browser with resource hints — https://web.dev/learn/performance/resource-hints — fetched 2026-10-31 (last updated 2023-11-01)
[9] Code-split JavaScript — https://web.dev/learn/performance/code-split-javascript — fetched 2026-10-31 (last updated 2023-12-04)
[10] Lazy load images and iframe elements — https://web.dev/learn/performance/lazy-load-images-and-iframe-elements — fetched 2026-10-31 (last updated 2023-11-01)
[11] Prefetching, prerendering, and service worker precaching — https://web.dev/learn/performance/prefetching-prerendering-precaching — fetched 2026-10-31 (last updated 2023-11-01)
[12] Optimize long tasks — https://web.dev/articles/optimize-long-tasks — fetched 2026-10-31 (last updated 2024-12-19)
[13] How to create high-performance CSS animations — https://web.dev/articles/animations-guide — fetched 2026-10-31 (undated article)
[14] How large DOM sizes affect interactivity — https://web.dev/articles/dom-size-and-interactivity — fetched 2026-10-31 (last updated 2023-05-09)
[16] Back/forward cache — https://web.dev/articles/bfcache — fetched 2026-10-31 (last updated 2026-10-16)
[17] Prevent unnecessary network requests with the HTTP Cache — https://web.dev/articles/http-cache — fetched 2026-10-31 (undated article)
[18] Performance budgets 101 — https://web.dev/articles/performance-budgets-101 — fetched 2026-10-31 (last updated 2018-11-05)
[19] Nuxt performance — https://nuxt.com/docs/4.x/guide/best-practices/performance — fetched 2026-10-31 (nuxt 4.6.3)
[20] Nuxt components directory (lazy components, delayed hydration, global components) — https://nuxt.com/docs/4.x/directory-structure/app/components — fetched 2026-10-31 (nuxt 4.6.3)
[21] Vue Performance — https://vuejs.org/guide/best-practices/performance.html — fetched 2026-10-31 (vue 3.5.44)
[22] Vue Server-Side Rendering (SSR) — https://vuejs.org/guide/scaling-up/ssr.html — fetched 2026-10-31 (Vue 3.5+ docs)
[23] Lighthouse performance scoring — https://developer.chrome.com/docs/lighthouse/performance/performance-scoring — fetched 2026-10-31 (weights unchanged since Lighthouse 10; current stable 13.6.0)
[24] Fix memory problems (Chrome DevTools) — https://developer.chrome.com/docs/devtools/memory-problems — fetched 2026-10-31 (last updated 2024-11-06)
[25] web-vitals README — https://github.com/GoogleChrome/web-vitals — fetched 2026-10-31 (v5 line)
[26] Web Sustainability Guidelines (WSG) — https://w3c.github.io/sustainableweb-wsg/ — fetched 2026-10-31 (W3C IG draft 2026)
[27] Nitro configuration (compressPublicAssets, publicAssets maxAge, serveStatic, timing, routeRules) — https://github.com/nitrojs/nitro/blob/v2.13.5/docs/3.config/0.index.md — fetched 2026-10-31 (nitropack 2.13.5)
[28] Nuxt useAsyncData (deep, serialize, lazy, pick) — https://nuxt.com/docs/4.x/api/composables/use-async-data — fetched 2026-10-31 (nuxt 4.6.3)
[29] Vue built-in directives (v-once, v-memo) — https://vuejs.org/api/built-in-directives.html — fetched 2026-10-31 (vue 3.5.44)
[30] Nuxt Content database (WASM SQLite in browser) — https://content.nuxt.com/docs/advanced/database — fetched 2026-10-31 (@nuxt/content 3.16.2)
[31] Nuxt UI installation options (componentDetection, theme.colors) — https://ui.nuxt.com/docs/getting-started/installation/nuxt — fetched 2026-10-31 (@nuxt/ui 4.12.0)
[32] Sentry Nuxt tree shaking — https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/tree-shaking/ — fetched 2026-10-31 (@sentry/nuxt 11.9.0)
