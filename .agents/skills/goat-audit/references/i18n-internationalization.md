# I18N — Internationalization & localization

Covers whether every user-facing surface of the Goat It quiz game works correctly in its six locales (`fr` source, `en`, `de`, `es`, `it`, `pt`) under the `no_prefix` strategy. That means translation completeness and parity, no hardcoded copy, message design, locale-aware formatting and sorting, `lang`/`dir` declaration, cookie-based locale negotiation and persistence, the language switcher, message loading, layout resilience to text expansion, translation quality, and localized Nuxt Content, manifest, offline and SEO texts. It also covers the i18n tests that guard all of these.

**Decision doc:** `docs/i18n.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** hreflang, canonical, sitemap, `og:locale` and locale indexing under `no_prefix` → SEO · `@nuxtjs/i18n` module config correctness (`i18n.config.ts` per-request cost, `defineI18nLocale` constraints) → STACK · translated HTML rendered via `v-html`, `escapeParameter` → SEC · locale cookie flags (`secure`, `sameSite`, `httpOnly`) → SEC · manifest validity, icons and install behavior → PWA · switcher keyboard operability, focus and contrast → A11Y · microcopy tone within one locale → UX · bundle-size budgets → PERF

## Contents

- [1. Completeness and parity](#1-completeness-and-parity)
- [2. Hardcoded text](#2-hardcoded-text)
- [3. Message design](#3-message-design)
- [4. Formatting](#4-formatting)
- [5. Sorting](#5-sorting)
- [6. Language and direction attributes](#6-language-and-direction-attributes)
- [7. Locale negotiation and persistence](#7-locale-negotiation-and-persistence)
- [8. Language switcher](#8-language-switcher)
- [9. Message loading](#9-message-loading)
- [10. Layout resilience](#10-layout-resilience)
- [11. Translation quality](#11-translation-quality)
- [12. Localized content](#12-localized-content)
- [13. i18n testing](#13-i18n-testing)
- [Sources](#sources)

## 1. Completeness and parity

- **[I18N-01] Key-set parity across the six locales** — Flatten every `app/i18n/locales/<locale>/<namespace>.json` and assert that the key sets of `de`, `en`, `es`, `it` and `pt` equal `fr` in both directions: zero missing keys, zero extra keys.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Look: `app/i18n/locales/**`, `app/i18n/specs/*.translations.spec.ts` · Src: [15], project: docs/unit-testing.md §6.11
- **[I18N-02] Namespace registered for every locale** — Every namespace file is listed in `locales[].files` of all six locale objects in `nuxt.config.ts`, because an unlisted file is never loaded for that locale (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `app/i18n/locales/**` · Src: [18], [24]
- **[I18N-03] No empty values** — No value in any locale file, `fr` included, matches `^\s*$`.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Look: `app/i18n/locales/**` · Src: [5]
- **[I18N-04] No untranslated copies of the source** — Every key whose source value is prose has a different value in every other locale. The only exceptions are an explicit allowlist: the brand `Goat It`, proper nouns, code-like tokens and format-only keys, which stay identical in every locale and content file.
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `app/i18n/locales/**` · Src: [5], project: .opencode/commands/complete-i18n.md
- **[I18N-05] Placeholder parity per key** — For each key, the multisets of named `{name}` placeholders, list `{0}` placeholders, linked `@:key` references and `|` plural branches are identical in all six locales.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Look: `app/i18n/locales/**` · Src: [12]
- **[I18N-06] Call sites supply every placeholder** — Every `t()`/`$t()`/`<i18n-t>` call passes a value for each `{placeholder}` of its message and passes no named parameter the message does not use.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**/*.ts` · Src: [12]
- **[I18N-07] Plural form at zero follows CLDR** — Every pluralized key renders the CLDR-correct form at 0, 1 and 2 in each locale; keys that can receive multiples of 1,000,000 also carry the CLDR `many` branch where the locale has one, or the code documents a floor that makes such counts unreachable (verified: vue-i18n 11.4.8).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/**`, `nuxt.config.ts` · Src: [7], [8]
- **[I18N-08] Missing keys never render raw** — When a key is missing in the active locale, the user sees a configured `fallbackLocale` translation, never the raw key path; `formatFallbackMessages` stays `false`, and missing/fallback warnings are not silenced globally without a replacement (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/i18n/**` · Src: [13], [21], [22]

## 2. Hardcoded text

- **[I18N-09] No hardcoded user-facing text** — Every user-visible string in SFCs resolves through `t()`/`$t()`/`<i18n-t>`. This covers template text nodes, `aria-label`, `aria-description`, `title`, `alt`, `placeholder` and `label` attributes or props, toast and modal `title`/`description`/action labels, and the title and description values passed to `useSeoMeta`/`useHead`. Only `SITE_NAME`, icon names and non-linguistic tokens are exempt.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**/*.vue`, `app/App.vue` · Src: [1], [29], project: AGENTS.md
- **[I18N-10] Script-produced copy is keyed** — Composables, utils and constants under `app/` that produce user-visible text (toast payloads, error mappers, labels, filter names) return i18n keys or call `t()`, never literal prose in any language.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/composables/**/*.ts`, `app/utils/**/*.ts`, `app/**/*.constants.ts` · Src: [1], project: AGENTS.md
- **[I18N-11] Head metadata follows a locale switch** — `useSeoMeta`, `useHead` and `useSchemaOrg` values that carry translated text are getters or computed values, so a client-side switch updates the title, meta descriptions and JSON-LD text; `WebPage.inLanguage` uses the active locale's BCP 47 tag.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/pages/**/*.vue` · Src: [17]
- **[I18N-12] Server-surfaced errors are keyed** — The UI never displays upstream or h3 `statusMessage` prose. Upstream `errorCode` values resolve to `errors.goatItApi.<code>` keys present in all six locales, with an HTTP-status fallback key when no code is present.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-error/**`, `app/i18n/locales/*/errors.json`, `app/composables/**/*.ts` · Src: [20], project: docs/security.md
- **[I18N-13] Nuxt UI built-in strings follow the active locale** — `UApp` either has no `locale` prop, so Nuxt UI follows the current `@nuxtjs/i18n` locale, or binds `locale` reactively to the active locale. A static `:locale` freezes built-in labels and component date formats in one language (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue` · Src: [35]

## 3. Message design

- **[I18N-14] No sentence assembly** — Each message is a complete sentence or paragraph with named placeholders where word order can differ; templates never build one sentence from several keys and variables, keys are never concatenated in script, and positional `{0}` placeholders are reserved for lists.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**/*.ts` · Src: [1], [5]
- **[I18N-15] No HTML markup in messages** — Locale JSON contains no HTML tags (rendering is checked in SEC-28), and `i18n.compilation.strictMessage` is not set to `false`; with the default `{ strictMessage: true, escapeHtml: false }`, HTML in static locale files only produces a build warning, so the build log is checked for that warning (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/i18n/locales/**`, `nuxt.config.ts` · Src: [24]
- **[I18N-16] Component interpolation for inline markup** — Links, emphasis or components inside a translated sentence use `<i18n-t keypath>` with named slots, never keys split around the element.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [11]
- **[I18N-17] Message-syntax special characters escaped** — Literal `{`, `}`, `@`, `$` and `|` in copy use literal interpolation (`{'@'}`) or backslash escapes (`\@`, `\{`, `\|`, available since vue-i18n 11.3) (verified: vue-i18n 11.4.8).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/i18n/locales/**` · Src: [12]
- **[I18N-18] French typography** — In `fr` messages and `content/fr/`, `;`, `!` and `?` are preceded by U+202F (narrow no-break space), `:` by U+00A0, and `«`/`»` are separated from their text by U+00A0. A plain U+0020 counts as a failure.
  Evidence: `command` · Diff: ✗ · Severity: low · Look: `app/i18n/locales/fr/*.json`, `content/fr/**` · Src: [31], [32]

## 4. Formatting

- **[I18N-19] Dates through a locale-aware formatter** — User-visible dates render through a locale-aware formatter (`$d`/`<i18n-d>`, `Intl.DateTimeFormat(activeLocale)` or a locale-following component) — never `toLocaleDateString()` without the locale, never hand-built `dd/mm/yyyy`; when a date is formatted during SSR and again on the client, the format declares `timeZone` so both render the same value.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/utils/**/*.ts` · Src: [9], [6]
- **[I18N-20] Numbers, percentages and lists through `Intl`** — User-visible counts, percentages and enumerations render through `Intl.NumberFormat`/`Intl.ListFormat` (or `$n`/`<i18n-n>`), with `style: 'percent'` for percentages; no `toFixed()`, no hand-built separators, no `n + ' %'`, and no `array.join(', ')` standing in for a localized list.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/utils/**/*.ts` · Src: [10], [6]

## 5. Sorting

- **[I18N-21] Locale-aware collation** — User-visible alphabetical lists sort with `Intl.Collator(activeLocale)` or `localeCompare(other, activeLocale)` and re-sort on locale change; free-text search matches with `sensitivity: 'base'` (or NFD normalization) so `e` matches `é`/`è`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `app/utils/**/*.ts`, `app/components/**/*.vue` · Src: [33]

## 6. Language and direction attributes

- **[I18N-22] SSR `<html lang>` matches the resolved locale** — For every supported locale set through the locale cookie, the server-rendered `<html lang>` equals that locale's configured BCP 47 `language` tag; a request without the cookie gets the default locale's tag.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [2], [29], project: docs/seo.md §1
- **[I18N-23] `<html lang>` updates on client switch** — After a switch through the locale select or the locale-suggestion toast, `<html lang>` equals the new locale's tag without a reload.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [17], [29]
- **[I18N-24] Every locale declares a BCP 47 `language`** — Each `i18n.locales[]` object declares `code`, `name` and `language` as a BCP 47 tag with region (e.g. `pt-PT`). `language` is required by the module's SEO features, which generate `lang` (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [24], [17]
- **[I18N-25] Switcher endonyms carry `lang`** — Each language option in every switcher exposes its endonym inside an element carrying that locale's `lang`, and any surface rendered in another language than the page (the locale-suggestion toast) carries that locale's `lang` too.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/shared/core/localization/**`, `app/components/domain/game/GameSettingsModal/**` · Src: [29], [2]
- **[I18N-26] Direction comes from locale config, not CSS** — Text direction derives from the locale `dir`/`defaultDirection` and never from the CSS `direction` property; new text containers use logical utilities (`ms-*`/`me-*`, `ps-*`/`pe-*`, `text-start`/`text-end`, `inset-inline-*`) rather than physical `left`/`right`, so a future RTL locale needs no layout rewrite.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/**`, `nuxt.config.ts` · Src: [3], [24]

## 7. Locale negotiation and persistence

- **[I18N-27] Browser-language detection disabled** — `i18n.detectBrowserLanguage` is exactly `false`. Detection is on by default, and any object value, including one that only sets `cookieKey`, re-enables it. Browser languages only feed `useLocaleSuggestion` (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [16], [24], project: docs/architecture.md §4.7
- **[I18N-28] Suggestion never switches without consent** — With no valid cookie and a supported browser language that differs from the current locale, only the suggestion toast appears; declining or closing it leaves the active locale unchanged and stores the current locale, only accepting calls `setLocale()`. With a valid locale cookie, no suggestion appears and no locale change fires on mount, whatever `navigator.languages` reports.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [16], [28], project: docs/seo.md §1
- **[I18N-29] Locale changes go through `setLocale()`** — Locale changes call `setLocale(code)`, which loads messages and triggers hooks. No production code assigns `locale.value` directly (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**/*.ts`, `app/plugins/**` · Src: [19]
- **[I18N-30] Choice persisted in the locale cookie** — Every user-initiated switch writes the locale cookie with the shared cookie options, and only the switcher and the suggestion flow write it. With browser detection disabled the module manages no locale cookie, so `setLocale()` alone does not persist the choice (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/shared/core/localization/**`, `app/composables/ui/useLocaleSuggestion/**`, `app/app.constants.ts` · Src: [19], [24], project: docs/architecture.md §4.7
- **[I18N-31] Server locale derivation from the cookie** — The server resolves the request locale from the locale cookie, falling back to the configured default for a missing, unsupported or malformed value; every upstream call forwards an `Accept-Language` built from the same cookie, constant and default locale, and the incoming request's `Accept-Language` is never forwarded.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `server/plugins/locale-detector/**`, `shared/utils/helpers/locale/**` · Src: [20], project: docs/architecture.md §4.7
- **[I18N-32] SSR and hydration resolve the same locale** — For each cookie locale, the hydrated page shows no text swap and logs no hydration-mismatch warning, and no client code rewrites the locale during hydration.
  Evidence: `runtime` · Diff: ✗ · Core: ✓ · Severity: high · Src: [16], [23]
- **[I18N-33] Locale-dependent data refetched on switch** — Every locale-dependent fetch re-runs on locale change, through `watch: [locale]` or a locale watcher. This includes question themes, active questions, and `content_<locale>`/`changelog_<locale>` queries, so no previous-locale data stays on screen.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/App.vue`, `app/pages/**/*.vue`, `app/components/domain/**/*.vue`, `app/stores/**` · Src: [34], project: docs/pwa.md
- **[I18N-34] Locale in data cache keys** — Every `useAsyncData`/`useFetch` key for locale-dependent data includes the locale (e.g. `rules-${locale}`), so SSR payloads and cached entries never serve another locale's content.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `app/pages/**/*.vue`, `app/components/**/*.vue`, `app/stores/**` · Src: [34]

## 8. Language switcher

- **[I18N-35] Endonym labels from config** — Switcher labels come from `locales[].name` and are endonyms (`Français`, `English`, `Deutsch`, `Español`, `Italiano`, `Português`), never exonyms like "Allemand" or bare ISO codes. Custom locale properties such as `name` are exposed at runtime (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/components/shared/core/localization/**` · Src: [1], [19], [24]
- **[I18N-36] Switcher reachable from every layout** — A locale switcher is reachable from every layout — home, docs and the game — without starting or abandoning a game.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/layouts/**`, `app/pages/**/*.vue`, `app/components/domain/game/GameSidebar/**`, `app/components/domain/game/GameSettingsModal/**` · Src: [19]
- **[I18N-37] Switching preserves route and game state** — Switching locale on `/game` keeps the user on `/game` with the same question position and filters, then re-fetches the active questions in the new locale. Switching on `/rules` stays on `/rules`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [23]
- **[I18N-38] Switch failure handled** — If loading messages fails or `setLocale()` rejects, the previous locale stays usable and the stored cookie matches the displayed locale. The error is logged with `console.error` and surfaced through a translated error toast.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/shared/core/localization/**`, `app/composables/ui/useLocaleSuggestion/**` · Src: project: AGENTS.md

## 9. Message loading

- **[I18N-39] Lazy per-locale messages** — Every locale loads its messages through `locales[].files`, with no inlined `messages` config and no message functions in locale files, so only the active locale's messages are fetched (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/i18n/**` · Src: [18], [24]
- **[I18N-40] Built message files are hashed and outside client chunks** — The built output keeps messages out of client chunks and only in content-hashed `_i18n/<hash>/<locale>/messages.json` files, so a translation fix is never masked by a stale immutable cache (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [18], [24]

## 10. Layout resilience

- **[I18N-41] Translated containers size from content and never clip** — Buttons, tabs, badges, toasts and headers that hold translated labels have no fixed width or height and never clip their text (`truncate`, `overflow-hidden`, `text-ellipsis`, `break-all`) unless the full text stays available through wrapping or a tooltip.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/config/**`, `app/**/*.constants.ts` · Src: [27], [5]
- **[I18N-42] Text expansion tolerated** — At 320 px and desktop widths, `de` and `pt` render home, rules, the game action bar, sidebar, settings, filters and toasts without overflow, clipping or overlap. Budget 200–300 % expansion for source strings of 10 characters or fewer and about 130 % above 70 characters.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [27], [5]
- **[I18N-43] Font covers every locale's glyphs** — The `@font-face` `unicode-range` declarations in `app/assets/css/fonts.css` cover every character used in the six locale files and in `content/`, including `ã õ ç ß œ « » € …`, U+00A0 and U+202F. No fallback-font glyph appears mid-word.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/fonts.css`, `public/fonts/**`, `app/i18n/locales/**` · Src: [1]

## 11. Translation quality

- **[I18N-44] French is the single source** — Only `app/i18n/locales/fr/**` and `content/fr/**` are authored by hand, and the other locales derive from French through `/complete-i18n`. A diff that adds or rewords a key in a non-`fr` locale without the matching `fr` change is a finding.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/complete-i18n.md`, `app/i18n/locales/fr/*.json`, `content/fr/**` · Src: [5], project: .opencode/commands/complete-i18n.md
- **[I18N-45] Register and terminology consistent per locale** — Each locale keeps one register and one canonical translation per game concept across UI, toasts, rules and changelog; a 10-string sample per locale shows no mixed address form and no competing term.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [5], project: .opencode/commands/complete-i18n.md
- **[I18N-46] Translations reviewed before release** — Each target locale has a recorded review by a native or fluent speaker (who, when, which namespaces) for machine- or agent-generated translations. Unreviewed machine translation shipped to `main` is a finding.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [5]

## 12. Localized content

- **[I18N-47] Content parity across locale trees** — Every file under `content/fr/` (`rules.md`, `changelog/<version>.md`) exists at the same relative path in `content/de/`, `content/en/`, `content/es/`, `content/it/` and `content/pt/`.
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `content/**` · Src: [34]
- **[I18N-48] One collection per locale** — `content.config.ts` defines `content_<locale>` and `changelog_<locale>` for every locale in `LOCALES`, each including only `<locale>/**`, and pages query the collection for the active locale (verified: @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content.config.ts`, `app/pages/**/*.vue`, `app/components/domain/changelog/**` · Src: [34]
- **[I18N-49] Content frontmatter localized** — Every content file's frontmatter `title` and `description` are written in the file's locale. Changelog `version` and `date` match the `fr` file.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/**` · Src: [34], [17]
- **[I18N-50] Default-locale content fallback is a safety net** — When a locale's content entry is missing, the page falls back to the default-locale entry and never renders an empty page or raw error.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/pages/**/*.vue` · Src: [34]
- **[I18N-51] Manifest texts come from translations and are localized** — The web app manifest takes `name`, `description` and shortcut labels from the default locale's translation files (never literals), sets `lang`, and exposes them localized for every supported locale or serves a per-locale manifest.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/pwa/manifest/**`, `nuxt.config.ts` · Src: [30], project: docs/pwa.md §1
- **[I18N-52] Offline page copy localized** — The offline page renders only offline-namespace keys and is prerendered in the build default locale, and the build-time and runtime default locale match.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/offline/**`, `app/i18n/locales/*/offline.json`, `nuxt.config.ts` · Src: project: docs/pwa.md §3
- **[I18N-53] Error pages localized** — A 404 and a 500 response rendered with the `de` cookie show translated copy, never Nuxt's default English error page.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [15]

## 13. i18n testing

- **[I18N-54] Parity specs cover every namespace and more than keys** — Every locale namespace has a translation spec that asserts, for all supported locales: placeholder multisets, plural branch counts, non-empty values and absence of untranslated source copies — not only equality of sorted key sets.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/specs/*.translations.spec.ts` · Src: [7], [8], project: docs/unit-testing.md §6.11
- **[I18N-55] Parity specs gate CI** — `*.translations.spec.ts` files run in a Vitest project included in `pnpm run test:unit:cov`, with no `skip`/`todo`, so a new `fr` key without five translations fails the pipeline.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/vitest/**`, `app/i18n/specs/*.translations.spec.ts` · Src: [5], project: docs/unit-testing.md §6.11
- **[I18N-56] Referenced keys exist in the source locale** — An automated check fails when code references a key absent from the source locale, through a static key scan or a `missing` handler that throws in tests. Console warnings alone do not count as a gate.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/vitest/**`, `tests/unit/setup/nuxt/use-i18n.nuxt.unit-setup.ts` · Src: [13]
- **[I18N-57] Acceptance covers `<html lang>`** — Acceptance scenarios assert `<html lang>` for the default locale, for a cookie-set locale and after a runtime switch.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/seo/seo-html-lang.feature` · Src: [29], [17]
- **[I18N-58] Acceptance covers switching and persistence** — An acceptance scenario switches locale, asserts that visible copy changes, reloads, and asserts the locale persisted through the cookie.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/**/*.feature` · Src: [19]
- **[I18N-59] Acceptance covers no auto-switch on first visit** — An acceptance scenario with browser languages `de-DE` and no cookie asserts that the page renders in the default locale and shows only the dismissible suggestion.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/locale-suggestion/*.feature` · Src: [16], [28]

## Sources

[1] Internationalization Quick Tips for the Web (W3C) — https://www.w3.org/International/quicktips/ — fetched 2026-10-31 (stable tips page, no date shown)
[2] Declaring language in HTML (W3C i18n Q&A) — https://www.w3.org/International/questions/qa-html-language-declarations — fetched 2026-10-31 (no date shown)
[3] Structural markup and right-to-left text in HTML (W3C) — https://www.w3.org/International/questions/qa-html-dir — fetched 2026-10-31 (no date shown)
[5] Localization best practices for developers (Mozilla l10n) — https://mozilla-l10n.github.io/documentation/localization/dev_best_practices.html — fetched 2026-10-31 (main branch)
[6] Intl (MDN) — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl — fetched 2026-10-31 (last modified 2025-09-24)
[7] Language Plural Rules (Unicode CLDR charts) — https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html — fetched 2026-10-31 (CLDR latest charts)
[8] Pluralization (Vue I18n docs source) — https://github.com/intlify/vue-i18n/blob/v11.4.8/docs/guide/essentials/pluralization.md — fetched 2026-10-31 (vue-i18n 11.4.8)
[9] Datetime Formatting (Vue I18n) — https://vue-i18n.intlify.dev/guide/essentials/datetime.html — fetched 2026-10-31 (Vue I18n v11 docs)
[10] Number Formatting (Vue I18n) — https://vue-i18n.intlify.dev/guide/essentials/number.html — fetched 2026-10-31 (Vue I18n v11 docs)
[11] Component Interpolation (Vue I18n) — https://vue-i18n.intlify.dev/guide/advanced/component.html — fetched 2026-10-31 (Vue I18n v11 docs)
[12] Message Format Syntax (Vue I18n docs source) — https://github.com/intlify/vue-i18n/blob/v11.4.8/docs/guide/essentials/syntax.md — fetched 2026-10-31 (vue-i18n 11.4.8; escape sequences from v11.3)
[13] Fallbacking (Vue I18n) — https://vue-i18n.intlify.dev/guide/essentials/fallback.html — fetched 2026-10-31 (Vue I18n docs)
[15] Installation (Nuxt I18n) — https://i18n.nuxtjs.org/docs/getting-started — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[16] Browser language detection (Nuxt I18n) — https://i18n.nuxtjs.org/docs/guide/browser-language-detection — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[17] SEO (Nuxt I18n) — https://i18n.nuxtjs.org/docs/guide/seo — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[18] Lazy-load translations (Nuxt I18n) — https://i18n.nuxtjs.org/docs/guide/lazy-load-translations — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[19] Lang Switcher (Nuxt I18n) — https://i18n.nuxtjs.org/docs/guide/lang-switcher — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[20] Server-Side Translations (Nuxt I18n) — https://i18n.nuxtjs.org/docs/guide/server-side-translations — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0, experimental)
[21] Locale fallback (Nuxt I18n) — https://i18n.nuxtjs.org/docs/guide/locale-fallback — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[22] Vue I18n Configuration (Nuxt I18n) — https://i18n.nuxtjs.org/docs/getting-started/vue-i18n — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[23] Usage (Nuxt I18n) — https://i18n.nuxtjs.org/docs/getting-started/usage — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[24] Options (Nuxt I18n docs source) — https://github.com/nuxt-modules/i18n/blob/v10.6.0/docs/content/docs/04.api/00.options.md — fetched 2026-10-31 (@nuxtjs/i18n 10.6.0)
[27] Text size in translation (W3C i18n) — https://www.w3.org/International/articles/article-text-size — fetched 2026-10-31 (no date shown)
[28] Accept-Language used for locale setting (W3C i18n Q&A) — https://www.w3.org/International/questions/qa-accept-lang-locales — fetched 2026-10-31 (no date shown)
[29] lang HTML global attribute (MDN) — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang — fetched 2026-10-31 (last modified 2026-09-08)
[30] Web Application Manifest (W3C Working Draft) — https://www.w3.org/TR/appmanifest/ — fetched 2026-10-31 (WD 2026-10-26)
[31] Espace insécable (Wikipédia FR) — https://fr.wikipedia.org/wiki/Espace_ins%C3%A9cable — fetched 2026-10-31 (oldid 240875105)
[32] Punctuation and typography (Le Conjugueur, Le Figaro) — https://leconjugueur.lefigaro.fr/ukponctuationtypographie.php — fetched 2026-10-31 (no revision date)
[33] Intl.Collator (MDN) — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator — fetched 2026-10-31 (last modified 2025-07-10)
[34] Nuxt i18n module integration (Nuxt Content) — https://content.nuxt.com/docs/integrations/i18n — fetched 2026-10-31 (@nuxt/content 3.16.2)
[35] Internationalization (Nuxt UI) — https://ui.nuxt.com/docs/getting-started/integrations/i18n/nuxt — fetched 2026-10-31 (@nuxt/ui 4.12.0, automatic locale since 4.12)
