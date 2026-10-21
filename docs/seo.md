# SEO and Social Identity Decisions

Decision record for the SEO surface: URL/locale strategy, locale cookie naming, social images, structured data, sitemap and indexability. It complements [Architecture](architecture.md) §9.1 and [Security](security.md).

## 1. URL and locale strategy: `no_prefix`

Decision (2026-10-15): keep `i18n.strategy: "no_prefix"`.

Every locale is served from the same URL (`/`, `/game`, `/rules`). The active locale is resolved from the `goat_it_locale` cookie, falling back to `NUXT_PUBLIC_DEFAULT_LOCALE`, which is what crawlers receive. Browser languages only drive the locale-suggestion toast (`useLocaleSuggestion`); they never change the resolved locale automatically.

Rationale:

- distinct localized URLs and hreflang were consciously deferred; the public URL surface stays stable;
- language selection is user-driven (`detectBrowserLanguage: false`), so no navigation ever redirects to another URL.

Consequences:

- hreflang alternates are intentionally absent: 5 of the 6 locales are not separately indexed;
- crawlers get the default-locale HTML only;
- per-locale prerendering is not viable under `no_prefix`;
- the sitemap cannot express locale alternates; the unused hreflang sitemap step was removed (see §5);
- canonical URLs are identical for every locale (`useLocaleHead` is not used; `html lang` is emitted by `nuxt-seo-utils` from the current locale).

## 2. Locale cookie naming

The locale cookie is `goat_it_locale` (`CookieNames.LOCALE`, options `LOCALE_COOKIE_OPTIONS`). It was hard-renamed from `i18n_redirected` with no legacy fallback: old cookie values are ignored, and an existing user falls back to the default locale once.

Why the rename is safe:

- `@nuxtjs/i18n` runs with `detectBrowserLanguage: false`, so the module never writes or clears `i18n_redirected`; only app code writes the cookie (`LocaleSelect`, `useLocaleSuggestion`);
- the server reads the same cookie for `Accept-Language` forwarding (`extractLocaleFromEvent`) and for `event.context.nuxtI18n.detectLocale` (`server/plugins/locale-detector`).

Do not set `detectBrowserLanguage.cookieKey`: any object value re-enables browser-language detection and may redirect `/`.

## 3. Social images and alt texts

All routes share one static Open Graph image, `public/og-image.png` (1200×600), resolved by the `nuxt-seo-utils` filename convention. Per-page images are an optional follow-up and are out of scope.

Because the banner is shared, the alt text is a single global localized key, `seo.imageAlt`, applied once in `app/App.vue` through `useSeoMeta` (`ogImageAlt` and `twitterImageAlt`). Declaring `ogImageAlt` without `ogImage` keeps the default image dimensions and type; `twitterImageAlt` must be declared explicitly because Twitter alt text is never inferred.

Module-level alt options (`public/og-image.alt.txt`, `seo.meta`) are static at build time and cannot be localized, which is why the alt lives in a reactive `useSeoMeta`.

## 4. Structured data identity

`nuxt-schema-org` emits a site-wide `Organization` identity declared in `nuxt.config.ts` (`schemaOrg.identity`), with `logo: "/pwa/pwa-512x512.png"`. The module also emits a referenced `ImageObject` logo node. The logo is a PNG because the only files under `public/img/logo/` are AVIF, which is less reliable for rich results.

The identity is additive: the implicit `WebSite` and `WebPage` nodes keep their `@id`/`@type`, and `WebSite.publisher` / `WebPage.about` point to the identity. Keep `schemaOrg.defaults` at its default (`true`); setting `defaults: false` also disables the identity.

Acceptance assertions parse every `ld+json` script, flatten `@graph`, and assert the `Organization` type plus a logo `contentUrl` ending with `/pwa/pwa-512x512.png`.

## 5. Sitemap, indexability and `validateAppHead`

`site.env` (from `NUXT_SITE_ENV`) gates both robots and the sitemap; the sitemap is generated only for `production`. Acceptance builds use `staging`, so no sitemap is served there and production sitemap/indexability coverage is tracked in issue #537. The unused hreflang sitemap step was removed because hreflang alternates are intentionally absent under `no_prefix`; the two sitemap-content steps and `fetchSitemapXml` remain reserved for #537.

`seo.validateAppHead` stays `true`. It runs once on `modules:done` at dev/build, warns (never throws) about `app.head` conflicts, and does not validate image alt text — so it costs nothing at runtime while catching duplicated `app.head` tags.
