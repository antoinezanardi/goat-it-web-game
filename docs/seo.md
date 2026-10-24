# SEO and Social Identity Decisions

Decision record for the SEO surface: URL/locale strategy, social images, structured data, sitemap and indexability. It complements [Architecture](architecture.md) §9.1 and [Security](security.md).

## 1. URL and locale strategy: `no_prefix`

Decision (2026-10-15): keep `i18n.strategy: "no_prefix"`.

Every locale is served from the same URL (`/`, `/game`, `/rules`). The active locale is resolved from the `goat_it_locale` cookie, falling back to `NUXT_PUBLIC_DEFAULT_LOCALE`, which is what crawlers receive. Browser languages only drive the locale-suggestion toast (`useLocaleSuggestion`); they never change the resolved locale automatically.

Locale cookie behavior is documented in [Architecture](architecture.md) §4.7.

Rationale:

- distinct localized URLs and hreflang were consciously deferred; the public URL surface stays stable;
- language selection is user-driven (`detectBrowserLanguage: false`), so no navigation ever redirects to another URL.

Consequences:

- hreflang alternates are intentionally absent: 5 of the 6 locales are not separately indexed;
- crawlers get the default-locale HTML only;
- per-locale prerendering is not viable under `no_prefix`;
- the sitemap cannot express locale alternates; the unused hreflang sitemap step was removed (see §4);
- canonical URLs are identical for every locale (`useLocaleHead` is not used; `html lang` is emitted by `nuxt-seo-utils` from the current locale).

## 2. Social images and alt texts

All routes share one static Open Graph image, `public/og-image.png` (1200×600), resolved by the `nuxt-seo-utils` filename convention. Per-page images are an optional follow-up and are out of scope.

Because the banner is shared, the alt text is a single global localized key, `seo.imageAlt`, applied once in `app/App.vue` through `useSeoMeta` (`ogImageAlt` and `twitterImageAlt`). Declaring `ogImageAlt` without `ogImage` keeps the default image dimensions and type; `twitterImageAlt` must be declared explicitly because Twitter alt text is never inferred.

Module-level alt options (`public/og-image.alt.txt`, `seo.meta`) are static at build time and cannot be localized, which is why the alt lives in a reactive `useSeoMeta`.

## 3. Structured data identity

`nuxt-schema-org` emits a site-wide `Organization` identity declared in `nuxt.config.ts` (`schemaOrg.identity`), with the site name, contact email, GitHub `sameAs`, founding date (the first commit on GitHub, 2025-10-11) and a 512×512 `ImageObject` logo.

The module also emits a referenced `ImageObject` logo node. The logo is a PNG because the only files under `public/img/logo/` are AVIF, which is less reliable for rich results.

`app/App.vue` completes the identity with the localized site description and `home.tagline` as `slogan`, adds the localized `WebSite.description` and `WebPage.inLanguage`, and points `WebPage.primaryImageOfPage` at the shared 1200×600 social image.

The identity is additive: the implicit `WebSite` and `WebPage` nodes keep their `@id`/`@type`, and `WebSite.publisher` / `WebPage.about` point to the identity. Keep `schemaOrg.defaults` at its default (`true`); setting `defaults: false` also disables the identity.

`schemaOrg.reactive` stays at its production default (`false`): JSON-LD is generated on the server for the request locale and does not update after a client-side locale switch without navigation or reload.

This is intentional because crawlers consume the SSR HTML; enabling `reactive` would ship the schema-org runtime to the client for no SEO gain.

Acceptance assertions parse every `ld+json` script, flatten `@graph`, and assert the `Organization` name, its enriched identity fields, its logo relationship, and a logo `contentUrl` ending with `/pwa/pwa-512x512.png`. They also assert the `WebSite` description, `WebPage.inLanguage` and the `primaryImageOfPage` social image.

## 4. Sitemap, indexability and `validateAppHead`

`site.env` (from `NUXT_SITE_ENV`) gates both robots and the sitemap; the sitemap is generated only for `production`. Acceptance builds use `staging`, so no sitemap is served there and production sitemap/indexability coverage is tracked in issue #537.

The unused hreflang sitemap step was removed because hreflang alternates are intentionally absent under `no_prefix`; the two sitemap-content steps and `fetchSitemapXml` remain reserved for #537.

`seo.validateAppHead` stays `true`. It runs once on `modules:done` at dev/build, warns (never throws) about `app.head` conflicts, and does not validate image alt text — so it costs nothing at runtime while catching duplicated `app.head` tags.
