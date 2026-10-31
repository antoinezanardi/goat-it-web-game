# SEO — SEO & social sharing

Covers how search engines and social platforms discover, render, index and present the Goat It web game (Nuxt 4 SSR, six locales served from one URL each under `no_prefix`, Docker on a VPS with a staging and a production host). That means environment indexability (`NUXT_SITE_ENV`, robots meta, `X-Robots-Tag`, `robots.txt`), titles and descriptions, canonical URLs, locale-related SEO under `no_prefix`, structured data (`nuxt-schema-org`), Open Graph and X cards, HTTP status codes, crawlability of SSR output, the production sitemap, page-experience signals, favicon and site identity, content signals, and search-operations tooling including the AI-crawler policy. It relies on the Nuxt SEO modules (`@nuxtjs/robots`, `@nuxtjs/sitemap`, `nuxt-schema-org`, `nuxt-seo-utils`, `nuxt-site-config`).

**Decision doc:** `docs/seo.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** Core Web Vitals, LCP/INP/CLS budgets and redirect-hop latency → PERF · `<html lang>`, translation parity of `seo.json` and head metadata reactivity → I18N · web app manifest, `apple-touch-icon` and PWA icons → PWA · one `h1` per page, image `alt` text, link purpose and viewport zoom → A11Y · HTTP→HTTPS redirect and reverse-proxy host forwarding → PLAT · Host-header trust and error-response leakage → SEC · SEO acceptance-test coverage → TEST

## Contents

- [1. Indexing per environment](#1-indexing-per-environment)
- [2. Titles and descriptions](#2-titles-and-descriptions)
- [3. Canonical URLs](#3-canonical-urls)
- [4. Internationalized SEO under no_prefix](#4-internationalized-seo-under-no_prefix)
- [5. Structured data](#5-structured-data)
- [6. Social cards](#6-social-cards)
- [7. Status codes and errors](#7-status-codes-and-errors)
- [8. Rendering and crawlability](#8-rendering-and-crawlability)
- [9. Sitemap](#9-sitemap)
- [10. Page experience](#10-page-experience)
- [11. Favicon and site identity](#11-favicon-and-site-identity)
- [12. Content signals](#12-content-signals)
- [13. Search operations and AI-crawler policy](#13-search-operations-and-ai-crawler-policy)
- [Sources](#sources)

## 1. Indexing per environment

- **[SEO-01] Site environment derived from `NUXT_SITE_ENV`** — `site.env` derives from `NUXT_SITE_ENV` when non-empty, otherwise `production` only when `NODE_ENV` is production; `site.indexable` is never set explicitly so it stays derived from `env`, and `sitemap.enabled` derives from the same environment value so one switch gates indexability and the sitemap (verified: nuxt-site-config 5.0.3).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `shared/utils/helpers/site/**` · Src: [24], [51], project: docs/architecture.md §9.1
- **[SEO-02] Same `NUXT_SITE_ENV` at build and runtime** — The Docker build stage receives `NUXT_SITE_ENV` as a build argument and the runtime stage carries the same value. The production deploy passes `production` and the staging deploy passes `staging`, because the generated site config, `sitemap.enabled` and the static robots rules are serialized at build time.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile`, `.github/workflows/deploy-*.yml`, `.github/actions/docker-build/**` · Src: [41], project: docs/architecture.md §9.1
- **[SEO-03] Robots header and meta tag stay enabled** — `robots.header` and `robots.metaTag` are not set to `false` (both default to `true`), so every page gets both the `X-Robots-Tag` header and the `<meta name="robots">` tag (verified: @nuxtjs/robots 7.0.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [44], [7]
- **[SEO-04] Staging responses carry `noindex`** — On the staging host, every HTML 200 response for `/`, `/game` and `/rules` carries `X-Robots-Tag: noindex, nofollow` and a `<meta name="robots" content="noindex, nofollow">` in the SSR `<head>` (verified: @nuxtjs/robots 7.0.2).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [7], [41], [44]
- **[SEO-05] Staging `robots.txt` blocks all crawlers** — `GET /robots.txt` on the staging host answers `User-agent: *` with `Disallow: /`, and `/sitemap.xml` answers 404 with no `Sitemap:` line in `robots.txt` (verified: @nuxtjs/robots 7.0.2).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [41], [20], [8]
- **[SEO-06] Production `robots.txt` is not a blanket block** — `GET /robots.txt` on the production host answers 200, UTF-8, under 500 KiB, with no `Disallow: /` for `User-agent: *` or `Googlebot`, no disallow of rendering assets (`/_nuxt/`, `/_i18n/`, `/fonts/`, `/img/`, `/pwa/`, `/og-image.png`, `/favicon.ico`), and an absolute `Sitemap:` line (verified: @nuxtjs/robots 7.0.2).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [8], [36]
- **[SEO-07] Production pages are indexable** — On the production host, `/`, `/game` and `/rules` carry neither a `noindex` robots meta nor a `noindex` `X-Robots-Tag`; the robots meta is `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` (verified: @nuxtjs/robots 7.0.2).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [37], [44], [2]
- **[SEO-08] Offline fallback is noindexed** — `routeRules["/offline"]` keeps `robots: false`, so the prerendered fallback sends `X-Robots-Tag: noindex, nofollow` plus the robots meta and never appears in `sitemap.xml` (verified: @nuxtjs/robots 7.0.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [25], [42], project: docs/pwa.md §6
- **[SEO-09] Deindexing uses `noindex`, not `Disallow`** — When a production URL must leave the index, it is served with `noindex` and stays crawlable: `robots.disallow`, `robots.groups` and any `public/robots.txt` or `public/_robots.txt` do not disallow it, because a crawler that obeys `robots.txt` never reads the `noindex` (verified: @nuxtjs/robots 7.0.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `public/**` · Src: [37], [41]

## 2. Titles and descriptions

- **[SEO-10] Every indexable page sets its own title and description** — `/`, `/game` and `/rules` each call `useSeoMeta` with `title` and `description` from `seo.<page>.title` and `seo.<page>.description`. No indexable page relies on the `nuxt-seo-utils` fallback title, which is derived from the last URL slug (verified: nuxt-seo-utils 9.0.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/pages/**/*.vue`, `app/i18n/locales/*/seo.json` · Src: [11], [48]
- **[SEO-11] SSR `<title>` is non-empty and page-specific** — For `/`, `/game` and `/rules` in each of the six locales, the server-rendered `<title>` is non-empty, in the rendered locale, not the site name alone and not a bare separator such as `| Goat It`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [11], [23]
- **[SEO-12] Titles and descriptions are unique per page** — In every `app/i18n/locales/<locale>/seo.json`, `seo.home/game/rules.title` are pairwise distinct and share no boilerplate beyond the brand; their `description` values are pairwise distinct, summarize each page in one or two sentences, and are not site-wide boilerplate.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/i18n/locales/*/seo.json` · Src: [11]
- **[SEO-13] Site name appears exactly once** — Either the default `%s %separator %siteName` template appends `SITE_NAME` to brand-free page titles, or `app.head.titleTemplate` is `"%s"` and every `seo.<page>.title` contains `Goat It` exactly once; each title puts the page-specific term before the brand so mobile truncation keeps the distinguishing text (verified: nuxt-seo-utils 9.0.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/i18n/locales/*/seo.json` · Src: [11], [48]

## 3. Canonical URLs

- **[SEO-14] Site URL is the absolute production origin** — `site.url` resolves from `NUXT_PUBLIC_SITE_URL` to an absolute `https://` origin without trailing path for each deployment, and the production deploy passes the production origin. Without it, site config falls back to the request URL at runtime (verified: nuxt-site-config 5.0.3).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `envs/.env.example`, `.github/workflows/deploy-*.yml` · Src: [6], [51]
- **[SEO-15] Exactly one self-referencing canonical** — Every 200 HTML page (`/`, `/game`, `/rules`) contains exactly one `<link rel="canonical">` whose `href` is its own absolute URL built from `site.url` and the current route, using the production host over `https://` and never the staging host, `http://`, `localhost` or an attacker-supplied `Host` (verified: nuxt-seo-utils 9.0.1).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [6], [47]
- **[SEO-16] Tracking parameters stripped from canonical** — `/?utm_source=x&gclid=y` canonicalizes to `https://<host>/`. `seo.canonicalQueryWhitelist` only keeps parameters that change page content (default `page`, `sort`, `filter`, `search`, `q`, `category`, `tag`) (verified: nuxt-seo-utils 9.0.1).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [6], [47]
- **[SEO-17] Path variants resolve to one URL** — `/game/`, `/Game` and `/rules/` either answer a single-hop 301/308 to the canonical path, a 404, or a 200 whose canonical is the slash-less lowercase path; every permanent redirect (www/apex, legacy paths) answers 301/308 straight to the final canonical URL with no chain, and no canonical, sitemap `<loc>` or internal link targets a redirecting URL.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [6], [30]
- **[SEO-18] Canonical ignores the locale cookie** — The same path requested without a cookie and with each of the six `goat_it_locale` values returns an identical canonical URL.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [6], project: docs/seo.md §1
- **[SEO-19] Canonical signals agree** — For each indexable page, the HTML canonical, `og:url`, the `WebPage.url` in JSON-LD and the sitemap `<loc>` are byte-identical absolute URLs (verified: nuxt-seo-utils 9.0.1).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [6], [17]

## 4. Internationalized SEO under no_prefix

- **[SEO-20] Shared-URL locale strategy is the documented one** — `i18n.strategy` is `"no_prefix"`, matching `docs/seo.md` §1. Any change of strategy, of the crawler locale (`NUXT_PUBLIC_DEFAULT_LOCALE`) or of hreflang handling updates that section in the same change.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `docs/seo.md` · Src: [4], [5], project: docs/seo.md §1
- **[SEO-21] No hreflang alternates without distinct URLs** — While all locales share one URL per page, no `<link rel="alternate" hreflang>` and no `x-default` is emitted, `useLocaleHead` is not used for alternates, and `sitemap.autoI18n` is `false` so the sitemap stays a single file without locale prefixes (verified: @nuxtjs/sitemap 9.1.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/layouts/**`, `app/pages/**/*.vue` · Src: [4], [35], project: docs/seo.md §1
- **[SEO-22] No language-based redirect and crawlers get full HTML** — A request to `/`, `/game` or `/rules` with `Accept-Language: de-DE` and no cookie answers 200 in place, with no 3xx and no JS redirect; the same request with a Googlebot user agent returns the complete default-locale title, description and main content.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [5], project: docs/seo.md §1
- **[SEO-23] `og:locale` matches the rendered locale** — `og:locale` is in `language_TERRITORY` form (`fr_FR`, `en_US`, `de_DE`, `es_ES`, `it_IT`, `pt_PT`) and matches the rendered locale. The module only emits it when the locale carries a region code (verified: nuxt-seo-utils 9.0.1).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [17], [35], [47]

## 5. Structured data

- **[SEO-24] Default WebSite and WebPage nodes kept** — `schemaOrg.defaults` is not `false`, so the module emits the `WebSite` and `WebPage` root nodes, and `app/App.vue` only extends them through `defineWebSite`/`defineWebPage`; `schemaOrg.reactive` stays `false`, so JSON-LD is generated on the server for the request locale and is not expected to change after a client-side locale switch (verified: nuxt-schema-org 7.0.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `app/App.vue` · Src: [22], [50], project: docs/seo.md §3
- **[SEO-25] JSON-LD parses cleanly** — Every `<script type="application/ld+json">` on `/`, `/game` and `/rules` is valid JSON with `@context` `https://schema.org`, and every `@graph` node has an explicit `@type` and `@id`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [14]
- **[SEO-26] Organization identity is complete** — `schemaOrg.identity` declares `type: "Organization"` with `name: SITE_NAME`, `sameAs` including the GitHub URL, and a crawlable PNG `ImageObject` logo of at least 112×112 px with `width` and `height`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `shared/constants/site.constants.ts` · Src: [15], project: docs/seo.md §3
- **[SEO-27] One brand name everywhere** — `Organization.name`, `WebSite.name`, `og:site_name` and `apple-mobile-web-app-title` all come from `SITE_NAME`, and the visible header/logo text names the same brand.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/App.vue`, `shared/constants/site.constants.ts` · Src: [15], [16]
- **[SEO-28] Single WebSite node on the home page** — The SSR graph of `/` contains exactly one `WebSite` node, with `name` and `url` equal to the production origin; site-name properties are nested in that node, not in a second `WebSite` block.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [16]
- **[SEO-29] Markup describes visible content only** — Every JSON-LD entity and property is backed by visible page content or real public facts. There is no `aggregateRating`, `review` or `offers` on `SoftwareApplication`/`VideoGame`/`WebApplication` without real data.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/App.vue`, `app/pages/**/*.vue`, `nuxt.config.ts` · Src: [14], [31]
- **[SEO-30] Validators report no errors** — `/` passes Google's Rich Results Test and the Schema Markup Validator with zero errors, and the Search Console enhancement reports show no new invalid items.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [14], [39]

## 6. Social cards

- **[SEO-31] Core Open Graph tags on every page** — The SSR `<head>` of `/`, `/game` and `/rules` contains `og:title`, `og:description`, `og:type` = `website`, `og:url` and `og:site_name`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [17], [47]
- **[SEO-32] Social text mirrors the page metadata** — Each page passes `ogTitle` and `ogDescription` from the same `seo.<page>.title` and `seo.<page>.description` keys as `title` and `description`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**/*.vue` · Src: [17]
- **[SEO-33] `og:image` is an absolute HTTPS URL** — `og:image` and `twitter:image` resolve to `https://<production-host>/og-image.png` (or a CDN URL), never a relative `/og-image.png`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [17], [49]
- **[SEO-34] Social image file convention and platform limits** — The shared social image is `public/og-image.png`, resolved by the `nuxt-seo-utils` filename convention, which emits `og:image:width`, `og:image:height` and `og:image:type`; an explicit `useSeoMeta({ ogImage })` also sets the dimensions, and the file meets both platforms — at least 1200×630 close to 1.91:1 and at most 8 MB for Open Graph, and a 2:1 (at least 300×157, at most 4096×4096, under 5 MB) JPG/PNG/WEBP/GIF for X (verified: nuxt-seo-utils 9.0.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `public/og-image.png`, `app/pages/**/*.vue`, `app/App.vue` · Src: [49], project: docs/seo.md §2
- **[SEO-35] Large X card requested** — Every indexable page emits `<meta name="twitter:card" content="summary_large_image">`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [19], [18]
- **[SEO-36] Localized `og:image:alt` and explicit `twitter:image:alt`** — `app/App.vue` sets `ogImageAlt` from the localized `seo.imageAlt` key through a reactive `useSeoMeta`, describing the image rather than captioning the page, and declares `twitterImageAlt` explicitly (X never infers it) at most 420 characters per locale.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/i18n/locales/*/seo.json` · Src: [17], project: docs/seo.md §2

## 7. Status codes and errors

- **[SEO-37] Unknown routes answer a real 404, never a soft 404** — `GET /does-not-exist` answers HTTP 404 with the localized error page, never a 200 app shell, and no 200 response renders empty or "page not found" content — a missing resource uses `createError({ statusCode: 404 })` server-side.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [10], [3]
- **[SEO-38] Error pages are noindexed** — The HTML of a 404 and of a 500 response carries `noindex` through the robots meta or `X-Robots-Tag`.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [37]
- **[SEO-39] Server failures surface as 5xx** — A failed SSR render answers 500, 502 or 503, never 200 with an error UI.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [10]

## 8. Rendering and crawlability

- **[SEO-40] Indexable routes stay server-rendered** — `ssr` stays `true`, no route rule sets `ssr: false` or `noScripts` on `/`, `/game` or `/rules`, and hash routing (`router.options.hashMode`) is not enabled.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [3]
- **[SEO-41] SSR HTML contains the content** — With JavaScript disabled, `/`, `/game` and `/rules` show their main copy and navigation links in the server HTML (`/rules` includes the full rules content), and primary content — the game explanation on `/`, the rules on `/rules` — is visible without opening a tab, accordion or modal.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [3], [2]
- **[SEO-42] Head metadata is in the initial HTML** — Title, description, canonical, Open Graph tags, robots meta and JSON-LD are present in the SSR response source, not only after hydration.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [3]

## 9. Sitemap

- **[SEO-43] Production sitemap is valid XML** — On production, `GET /sitemap.xml` answers 200 with an XML content type and a UTF-8 `<urlset>` of absolute canonical URLs, within 50,000 URLs and 50 MB uncompressed.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [28], [9]
- **[SEO-44] Sitemap is prerendered at build** — With `sitemap.zeroRuntime: true`, a production build (`NUXT_SITE_ENV=production`) contains `.output/public/sitemap.xml`, because `/sitemap.xml` is added to `nitro.prerender.routes` and generation never runs at runtime (verified: @nuxtjs/sitemap 9.1.0).
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [46], project: docs/architecture.md §9.1
- **[SEO-45] Only indexable pages listed** — The production sitemap lists `/`, `/game` and `/rules` and excludes `/offline`, error pages, `/api/**`, `/_nuxt/**`, noindexed routes and redirecting URLs.
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [28], [21]
- **[SEO-46] Every `<loc>` answers 200** — Each sitemap URL answers 200 on production with no 3xx, 4xx or 5xx.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [28], [10]
- **[SEO-47] `lastmod` is honest or omitted** — `sitemap.autoLastmod` stays `false` (default), and no source sets `lastmod` to the build date; `priority` and `changefreq` are not relied on (verified: @nuxtjs/sitemap 9.1.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `nuxt.config.ts` · Src: [28], [46]

## 10. Page experience

- **[SEO-48] Mobile and desktop get the same content** — Requests with a mobile and a desktop user agent return the same title, description, canonical, structured data, main content and links, as indexing is mobile-first.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], [29]
- **[SEO-49] No intrusive interstitial on entry** — A first visit to `/`, `/game` or `/rules` (including from search) shows no full-screen overlay such as an auto-opened changelog modal covering the content; legally required notices are exempt.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [32]

## 11. Favicon and site identity

- **[SEO-50] Favicon declared, crawlable and large enough** — The SSR `<head>` of `/` declares `<link rel="icon">` whose URL answers 200, is not disallowed in `robots.txt`, stays stable across releases, and is square in a supported format (ICO, PNG, SVG) at least 48×48 px recommended.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [13]

## 12. Content signals

- **[SEO-51] Crawlable content explains the product** — The SSR HTML of `/` contains crawlable text explaining what Goat It is (at least the tagline and one descriptive sentence), not only a logo and a play button, and `/`, `/game` and `/rules` each carry primary content matching their title with no near-duplicate pages competing for the same intent.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1]
- **[SEO-52] Indexable pages linked internally** — `/game` and `/rules` are reachable from `/` through crawlable `<a href>` links within one click, and each page links back to `/`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**/*.vue`, `app/layouts/**`, `app/components/**/*.vue` · Src: [33], [1]

## 13. Search operations and AI-crawler policy

- **[SEO-53] Search consoles verified and indexing monitored** — The production host is verified in Google Search Console (DNS or meta tag) with the sitemap submitted, verified in Bing Webmaster Tools with the sitemap submitted or IndexNow configured, and the Page Indexing and Sitemaps reports are reviewed after each release with no unexpected growth of Excluded, Soft 404 or Indexed-though-blocked.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [39], [29]
- **[SEO-54] AI-crawler policy is explicit** — `robots.blockAiBots` is set deliberately (`false`, `"training"` or `true`) and the choice is recorded in `docs/seo.md`. `"training"` blocks `GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot` and other training tokens while leaving AI search agents unblocked; blocking `Google-Extended` also opts out of Gemini grounding (verified: @nuxtjs/robots 7.0.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `docs/seo.md` · Src: [43], [44], [27], [36]

## Sources

[1] Search Engine Optimization (SEO) Starter Guide — https://developers.google.com/search/docs/fundamentals/seo-starter-guide — fetched 2026-10-31 (undated)
[2] Google Search technical requirements — https://developers.google.com/search/docs/essentials/technical — fetched 2026-10-31 (last updated 2025-12-18)
[3] Understand the JavaScript SEO basics — https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics — fetched 2026-10-31 (last updated 2026-03-04)
[4] Tell Google about localized versions of your page — https://developers.google.com/search/docs/specialty/international/localized-versions — fetched 2026-10-31 (undated)
[5] Managing multi-regional and multilingual sites — https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites — fetched 2026-10-31 (undated)
[6] How to specify a canonical with rel="canonical" and other methods — https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls — fetched 2026-10-31 (last updated 2026-07-10)
[7] Robots meta tag, data-nosnippet, and X-Robots-Tag specifications — https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag — fetched 2026-10-31 (undated)
[8] Robots.txt introduction and guide — https://developers.google.com/search/docs/crawling-indexing/robots/intro — fetched 2026-10-31 (last updated 2025-12-10)
[9] Learn about sitemaps — https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview — fetched 2026-10-31 (last updated 2025-12-10)
[10] How HTTP status codes affect Google's crawlers — https://developers.google.com/crawling/docs/troubleshooting/http-status-codes — fetched 2026-10-31 (last updated 2026-02-04)
[11] Influencing title links in Google Search — https://developers.google.com/search/docs/appearance/title-link — fetched 2026-10-31 (last updated 2025-12-10)
[13] Define a favicon to show in search results — https://developers.google.com/search/docs/appearance/favicon-in-search — fetched 2026-10-31 (last updated 2026-10-27)
[14] General structured data guidelines — https://developers.google.com/search/docs/appearance/structured-data/sd-policies — fetched 2026-10-31 (last updated 2026-07-10)
[15] Organization (Organization) structured data — https://developers.google.com/search/docs/appearance/structured-data/organization — fetched 2026-10-31 (last updated 2026-09-08)
[16] Site names in Google Search — https://developers.google.com/search/docs/appearance/site-names — fetched 2026-10-31 (undated)
[17] The Open Graph protocol — https://ogp.me/ — fetched 2026-10-31 (undated spec)
[18] Cards markup (X) — https://web.archive.org/web/20260116124848/https://developer.x.com/en/docs/x-for-websites/cards/overview/markup — fetched 2026-10-31 (archived 2026-01-16; original URL now 404/redirects)
[19] Summary Card with Large Image (X) — https://web.archive.org/web/20260112050218/https://developer.x.com/en/docs/x-for-websites/cards/overview/summary-card-with-large-image — fetched 2026-10-31 (archived 2026-01-12; original URL now 404/redirects)
[20] Nuxt Robots — https://nuxtseo.com/docs/robots/getting-started/introduction — fetched 2026-10-31 (library @nuxtjs/robots 7.0.2)
[21] Nuxt Sitemap — https://nuxtseo.com/docs/sitemap/getting-started/introduction — fetched 2026-10-31 (library @nuxtjs/sitemap 9.1.0)
[22] Nuxt Schema.org — https://nuxtseo.com/docs/schema-org/getting-started/introduction — fetched 2026-10-31 (last updated 2026-07-19, library nuxt-schema-org 7.0.1)
[23] Nuxt SEO Utils — https://nuxtseo.com/docs/seo-utils/getting-started/introduction — fetched 2026-10-31 (library nuxt-seo-utils 9.0.1)
[24] Nuxt Site Config — https://nuxtseo.com/docs/site-config/getting-started/introduction — fetched 2026-10-31 (library nuxt-site-config 5.0.3)
[25] Nuxt Robots: config using route rules — https://nuxtseo.com/docs/robots/guides/route-rules — fetched 2026-10-31 (library @nuxtjs/robots 7.0.2)
[27] Control web crawlers and crawl budget in Nuxt — https://nuxtseo.com/learn-seo/nuxt/controlling-crawlers — fetched 2026-10-31 (published 2024-11-03)
[28] Build and submit a sitemap — https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap — fetched 2026-10-31 (undated)
[29] Meta tags and attributes that Google supports — https://developers.google.com/search/docs/crawling-indexing/special-tags — fetched 2026-10-31 (undated)
[30] Redirects and Google Search — https://developers.google.com/search/docs/crawling-indexing/301-redirects — fetched 2026-10-31 (undated)
[31] Software app (SoftwareApplication) structured data — https://developers.google.com/search/docs/appearance/structured-data/software-app — fetched 2026-10-31 (undated)
[32] Avoid intrusive interstitials and dialogs — https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials — fetched 2026-10-31 (last updated 2025-12-10)
[33] SEO link best practices — https://developers.google.com/search/docs/crawling-indexing/links-crawlable — fetched 2026-10-31 (undated)
[35] Nuxt i18n: SEO — https://i18n.nuxtjs.org/docs/guide/seo — fetched 2026-10-31 (undated)
[36] How Google interprets the robots.txt specification — https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec — fetched 2026-10-31 (undated)
[37] Block Search indexing with noindex — https://developers.google.com/search/docs/crawling-indexing/block-indexing — fetched 2026-10-31 (last updated 2025-12-10)
[39] Get started with Search Console — https://developers.google.com/search/docs/monitor-debug/search-console-start — fetched 2026-10-31 (last updated 2025-12-10)
[41] Nuxt Robots: Disabling Site Indexing — https://nuxtseo.com/docs/robots/guides/disable-indexing — fetched 2026-10-31 (library @nuxtjs/robots 7.0.2)
[42] Nuxt Robots: Disable Page Indexing — https://nuxtseo.com/docs/robots/guides/disable-page-indexing — fetched 2026-10-31 (library @nuxtjs/robots 7.0.2)
[43] Nuxt Robots: Robots.txt Recipes — https://nuxtseo.com/docs/robots/guides/robot-recipes — fetched 2026-10-31 (library @nuxtjs/robots 7.0.2)
[44] Nuxt Robots: Nuxt Config — https://nuxtseo.com/docs/robots/api/config — fetched 2026-10-31 (library @nuxtjs/robots 7.0.2)
[46] Nuxt Sitemap: Config — https://nuxtseo.com/docs/sitemap/api/config — fetched 2026-10-31 (library @nuxtjs/sitemap 9.1.0)
[47] Nuxt SEO Utils: Best Practice Default Meta — https://nuxtseo.com/docs/seo-utils/guides/default-meta — fetched 2026-10-31 (library nuxt-seo-utils 9.0.1)
[48] Nuxt SEO Utils: Enhanced Titles — https://nuxtseo.com/docs/seo-utils/guides/fallback-title — fetched 2026-10-31 (library nuxt-seo-utils 9.0.1)
[49] Nuxt SEO Utils: Open Graph Images — https://nuxtseo.com/docs/seo-utils/guides/open-graph-images — fetched 2026-10-31 (library nuxt-seo-utils 9.0.1)
[50] Nuxt Schema.org: Default Schema.org — https://nuxtseo.com/docs/schema-org/guides/default-schema-org — fetched 2026-10-31 (library nuxt-schema-org 7.0.1)
[51] Nuxt Site Config: How it works — https://nuxtseo.com/docs/site-config/guides/how-it-works — fetched 2026-10-31 (library nuxt-site-config 5.0.3)
