# PWA and offline behavior

Reference for installability, service-worker behavior, the offline fallback, and the connectivity UI.
For file placement, see [Architecture](architecture.md); for the request/security contract, see [Security](security.md).

## 1. What is installable

`@vite-pwa/nuxt` generates the web manifest (`/manifest.webmanifest`) and the service worker (`/sw.js`).
The manifest, icons, screenshots, and shortcuts live in `nuxt.config.ts` under `pwa.manifest`. The update
strategy is `registerType: "autoUpdate"`: with the Nuxt client registration plugin the generated Workbox
config sets `clientsClaim` and `skipWaiting`, so a new service worker takes control without a prompt.

## 2. Service-worker precache

`pwa.workbox.globPatterns` precaches the build output (`js`, `css`, `html`, images, fonts) from
`.output/public` (`.nuxt/test/output/public` for acceptance builds). `globIgnores` excludes the PWA
screenshots. `@vite-pwa/nuxt` adds `**/_payload.json` to the glob patterns by default; the unused
`offline/_payload.json` is excluded because the fallback is scriptless. Vite-hashed assets under `_nuxt/`
are cached with a `null` revision because their filename is already versioned; other files get a content
revision.

`workbox.navigateFallback` stays explicitly `null`. The module defaults it to the base URL when the key is
absent, and a Workbox `NavigationRoute` would serve a configured document for every matching navigation,
including online ones. The fallback must be network-failure-only, so no navigation route is registered.

## 3. Offline fallback

`app/pages/offline/index.vue` is prerendered at build time and served without scripts:

- route rule: `"/offline": { prerender: true, noScripts: true, robots: false, sitemap: false }`;
- `noScripts` removes the Nuxt entry scripts, module preloads, and payload, so the document neither hydrates
  nor takes over routing; the requested URL stays in the address bar;
- copy comes from `app/utils/ui/offline/offline-page.constants.ts` and is resolved once at build time with
  `resolveOfflinePageCopy`, so the page always uses the build-configured default locale
  (`runtimeConfig.public.defaultLocale`, falling back to `DEFAULT_LOCALE_FALLBACK`);
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
prerendered `offline/index.html` is globbed by `**/*.html` and rewritten by `@vite-pwa/nuxt` to the `offline`
manifest URL, which Workbox resolves to `/offline` (the storage key adds `?__WB_REVISION__=<hash>`).

Prerequisite: the fallback only exists after the service worker has installed and precached it while online.
A first-ever visit made offline has no fallback document.

## 4. Connectivity indicator

`useConnectivityStatus` wraps VueUse `useNetwork().isOnline` and exposes a single `visibleStatus`:

- nothing before client mount (`useMounted`), so SSR markup is neutral;
- offline stays visible while the browser reports offline;
- online is shown for 2 seconds after a reconnect, then hidden; dropping offline during that window returns to
  offline immediately and cancels the hide timer.

`OfflineStatusIndicator` renders it globally in `App.vue` (Home, Rules, Game): fixed top center with
`env(safe-area-inset-top)`, one localized word, a decorative Lucide `i-lucide-wifi-off`/`i-lucide-wifi` icon,
`role="status"` + `aria-live="polite"`, a 200 ms fade/slide, and `motion-reduce:transition-none` for reduced
motion. The wrapper ignores pointer events, so it never covers game controls.

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

## 6. Error toasts around connectivity

`useGameQuestionFeed` suppresses the random-question error toast only when both conditions hold at failure
time: the browser reports offline and the error is a `FetchError` with no HTTP response
(`isConfirmedOfflineFetchError`). It still records `hasFetchError`, so the game error state and Retry are
unchanged. Response-backed failures (400/429/5xx) and no-response failures while online keep their toast.
`useGoatItApiErrorToast` itself is unchanged and is still used by theme and translation requests.

## 7. Security and SEO

- `/sw.js` is same-origin with scope `/`; no cross-origin import scripts are used.
- The fallback and every app route get the standard security headers from the security middleware; the
  fallback contains no Nuxt runtime and no payload.
- `/offline` sets `robots: false` (`X-Robots-Tag: noindex, nofollow` plus meta) and `sitemap: false`, so it is
  neither indexed nor listed. Sitemap generation stays production-gated.

## 8. Testing

Unit:

```bash
pnpm run test:unit app/composables/ui/useConnectivityStatus/useConnectivityStatus.spec.ts
pnpm run test:unit app/components/shared/ui/OfflineStatusIndicator/OfflineStatusIndicator.spec.ts
pnpm run test:unit app/pages/offline/index.spec.ts
pnpm run test:unit app/composables/domain/useGameQuestionFeed/useGameQuestionFeed.spec.ts
```

Acceptance (builds, then runs the tagged scenarios with a real service worker and `context.setOffline`):

```bash
pnpm run test:acceptance --tags "@pwa"
```

Generated-output inspection after `pnpm run test:acceptance:build`:

```bash
node -e "const s=require('node:fs').readFileSync('.nuxt/test/output/public/sw.js','utf8');const urls=[...s.matchAll(/url\s*:\s*['\"]([^'\"]+)['\"]/g)].map(m=>new URL(m[1],'https://x.test').pathname);console.log('offline precached:',urls.includes('/offline'));console.log('fallback plugin:',/fallbackURL\s*:\s*['\"]\/offline['\"]/.test(s));"
```

Manual iOS Safari check (the only installed-app platform not covered by Chromium acceptance):

1. open the site in Safari on iOS, add it to the Home Screen, and open it once online until the offline notice
   is precached (at least one full load after the service worker installs);
2. close the app, enable Airplane Mode, and cold-launch it from the Home Screen;
3. confirm the offline notice appears instead of the Safari network error, the address bar/URL is unchanged,
   and the app does not show a broken game state;
4. disable Airplane Mode, tap Retry, and confirm the requested page loads and the connectivity chip shows
   Online for two seconds.

## 9. Troubleshooting

- **Fallback never appears:** confirm the build is recent (`pnpm run test:acceptance:build`), that
  `.nuxt/test/output/public/sw.js` contains the fallback plugin and an `offline` precache entry, and that the
  service worker is active and controlling the page in DevTools → Application.
- **Fallback appears while online:** verify `navigateFallback` is still `null` and the runtime route matches
  `request.mode === "navigate"` only.
- **Stale fallback copy:** the HTML entry is content-hashed by the precache manifest; a redeploy plus a fresh
  service-worker install refreshes it. No `additionalManifestEntries` entry pins it.
