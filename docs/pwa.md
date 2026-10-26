# PWA and offline behavior

Reference for installability, service-worker behavior, the offline fallback, and the connectivity UI.
For file placement, see [Architecture](architecture.md); for the request/security contract, see [Security](security.md).

## 1. What is installable

`@vite-pwa/nuxt` generates the web manifest (`/manifest.webmanifest`) and the service worker (`/sw.js`).
The manifest is built at build time by `shared/utils/helpers/pwa/manifest/build-pwa-manifest.helpers.ts`
from the default locale's `home`/`seo` translations loaded by
`shared/utils/helpers/pwa/manifest/load-pwa-manifest-translations.helpers.ts`; `nuxt.config.ts` only wires
the locale file reader. It uses the build-time `NUXT_PUBLIC_DEFAULT_LOCALE` (falling back to
`DEFAULT_LOCALE_FALLBACK`) for `name`, `description`, `lang`, and the play shortcut label, and adds
`id: "/"`, `dir: "ltr"`, and `display_override: ["standalone", "minimal-ui"]`. Build and runtime default
locales must match: switching locale in the app does not regenerate the installed manifest. Icons,
screenshots, colors, display mode, and categories remain static. The update strategy is
`registerType: "autoUpdate"`: with the Nuxt client registration plugin the generated Workbox config sets
`clientsClaim` and `skipWaiting`, so a new service worker takes control without a prompt.

### iOS standalone display

`App.vue` emits `mobile-web-app-capable` and `apple-mobile-web-app-capable`, a `black-translucent` status bar,
and the `Goat It` Apple title. `app.head.viewport` includes `viewport-fit=cover`, so the layout draws under
the status bar and home indicator; edge-anchored controls add `env(safe-area-inset-*)` padding: home and game
top controls, the home footer, the docs shell and back-to-top button, the game sidebar header/footer, and the
game action bar. The offline indicator uses the top inset.

Verify on iOS Safari and on an installed standalone PWA (notched device or Simulator): home, rules, game,
sidebar, footer, and action bar must stay clear of the notch and home indicator. Chromium cannot emulate
safe-area insets, so the automated suite only checks the meta tags and viewport content. Apple startup
images (`apple-touch-startup-image`) are intentionally not generated; install metadata comes from the
manifest, icons, and the static app background color.

## 2. Service-worker precache

`pwa.workbox.globPatterns` precaches only the offline shell from `.output/public`
(`.nuxt/test/output/public` for acceptance builds): `offline/index.html`, the Nuxt entry stylesheet
(`_nuxt/entry.*.css`), and the self-hosted Geist fonts. `globIgnores` excludes the unused
`offline/_payload.json`; screenshots are not part of the precache. `@vite-pwa/nuxt` also adds `**/_payload.json`
and the small `_nuxt/builds/**/*.json` app-manifest files. `maximumFileSizeToCacheInBytes` is a deliberate
512 KiB: a shell asset that grows past it is excluded from the precache with a Workbox warning, and the
`@pwa` acceptance test then fails because the expected shell entry is missing.

The precache holds 7 entries / ~0.21 MiB (the module also precaches the 1 KiB manifest). Lazy `_nuxt/*.js`
chunks, `_i18n` bundles, icons, images, and screenshots are not precached. They are fetched on demand and left
to the browser's immutable HTTP cache. The offline guarantee remains the fallback only; app routes are not
available offline.

Vite-hashed assets under `_nuxt/` are cached with a `null` revision because their filename is already
versioned; other files get a content revision.

`workbox.navigateFallback` stays explicitly `null`. The module defaults it to the base URL when the key is
absent, and a Workbox `NavigationRoute` would serve a configured document for every matching navigation,
including online ones. The fallback must be network-failure-only, so no navigation route is registered.

## 3. Offline fallback

`app/pages/offline/index.vue` is prerendered at build time and served without scripts:

- route rule: `"/offline": { prerender: true, noScripts: true, robots: false }`;
- `noScripts` removes the Nuxt entry scripts, module preloads, and payload, so the document neither hydrates
  nor takes over routing; the requested URL stays in the address bar;
- copy comes from the `offline` namespace in `app/i18n/locales/<locale>/offline.json` and is rendered during
  prerender with the build-configured default locale (`i18n.defaultLocale`, driven by
  `NUXT_PUBLIC_DEFAULT_LOCALE` and falling back to `DEFAULT_LOCALE_FALLBACK`);
- the Retry control is a native `<a href="">`, which reloads the current requested URL; it never calls the API
  and never claims that game state was restored.

The navigation fallback is a `generateSW` runtime route:

```ts
runtimeCaching: [
  {
    urlPattern: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
    handler: "NetworkOnly",
    options: { precacheFallback: { fallbackURL: "/offline" } },
  },
],
```

The callback is stringified into `sw.js`, so it must stay self-contained. `NetworkOnly` attempts the network;
`PrecacheFallbackPlugin` only acts on `handlerDidError`, so online navigations are never replaced. The
prerendered `offline/index.html` is the precached HTML entry and is rewritten by `@vite-pwa/nuxt` to the
`offline` manifest URL, which Workbox resolves to `/offline` (the storage key adds
`?__WB_REVISION__=<hash>`).

Prerequisite: the fallback only exists after the service worker has installed and precached it while online.
A first-ever visit made offline has no fallback document.

## 4. Connectivity indicator

`useConnectivityStatus` wraps VueUse `useNetwork().isOnline` and exposes a single `visibleStatus`:

- nothing before client mount (`useMounted`), so SSR markup is neutral;
- offline stays visible while the browser reports offline;
- online is shown for 2 seconds after a reconnect, then hidden; dropping offline during that window returns to
  offline immediately and cancels the hide timer.

`OfflineStatusIndicator` renders it globally in `App.vue` (Home, Rules, Game): fixed top center with
`env(safe-area-inset-top)`, one localized word at `text-sm`, a 16 px decorative Lucide
`i-lucide-wifi-off`/`i-lucide-wifi` icon colored `text-error` offline and `text-success` online with a 200 ms
color transition, `role="status"` + `aria-live="polite"`, a 200 ms fade/slide, and
`motion-reduce:transition-none` for reduced motion. The wrapper ignores pointer events, so it never covers
game controls.

The signal is browser connectivity only. Captive portals, VPN failures, and unreachable origins can still
report online.

## 5. API caching and gameplay limits

There is **no API response runtime caching**, by design:

- theme catalog and question-by-id responses depend on the locale selected by the `goat_it_locale` cookie;
- the service worker cannot read the Cookie request header, so `Vary: Cookie` does not partition Cache Storage
  safely, and a cached response could be in the wrong language;
- question-by-id is only used for language changes during a game.

Random questions are a `POST` request, so they cannot be served by GET response caching. A fresh game cannot
start offline, an in-progress game survives only with the questions already in its in-memory buffer, and a
reload discards that buffer. Nothing is retried automatically when connectivity returns; use the existing
manual Retry.

## 6. Security and SEO

- `/sw.js` is same-origin with scope `/`; no cross-origin import scripts are used.
- The fallback and every app route get the standard security headers from the security middleware; the
  fallback contains no Nuxt runtime and no payload.
- `/offline` sets `robots: false` (`X-Robots-Tag: noindex, nofollow` plus meta). `@nuxtjs/sitemap` filters
  robots-blocked routes, so the fallback is not listed either. Sitemap generation stays production-gated.

## 7. Troubleshooting

- **Fallback never appears:** confirm the build is recent (`pnpm run test:acceptance:build`), that
  `.nuxt/test/output/public/sw.js` contains the fallback plugin and an `offline` precache entry, and that the
  service worker is active and controlling the page in DevTools → Application.
- **Fallback appears while online:** verify `navigateFallback` is still `null` and the runtime route matches
  `request.mode === "navigate"` only.
- **Stale fallback copy:** the HTML entry is content-hashed by the precache manifest; a redeploy plus a fresh
  service-worker install refreshes it. No `additionalManifestEntries` entry pins it.
- **Precache grew unexpectedly:** keep `globPatterns` limited to the offline shell; the `@pwa` scenario
  `the built service worker should precache only the offline shell` fails when lazy chunks, locale bundles, or
  screenshots return, or when the shell exceeds the 10-entry / 512 KiB budget.
- **Manifest in the wrong language:** the manifest follows the build-time `NUXT_PUBLIC_DEFAULT_LOCALE`; make
  the build and runtime values match, then rebuild. Switching locale in the app does not rebuild it.
