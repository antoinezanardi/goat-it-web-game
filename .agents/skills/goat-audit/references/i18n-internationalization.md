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
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `app/i18n/locales/**`, `app/i18n/specs/*.translations.spec.ts` · Src: [15], project: docs/unit-testing.md §6.11
- **[I18N-02] One parity spec per namespace** — Every `app/i18n/locales/fr/<namespace>.json` has a matching `app/i18n/specs/<namespace>.translations.spec.ts` that imports that namespace for all six locales.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/fr/*.json`, `app/i18n/specs/*.translations.spec.ts` · Src: project: docs/unit-testing.md §6.11, project: docs/architecture.md §4.7
- **[I18N-03] Namespace registered for every locale** — Every namespace file is listed in `locales[].files` of all six locale objects in `nuxt.config.ts`, because an unlisted file is never loaded for that locale (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `app/i18n/locales/**` · Src: [18], [24]
- **[I18N-04] No empty values** — No value in any locale file, `fr` included, matches `^\s*$`.
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `app/i18n/locales/**` · Src: [5]
- **[I18N-05] No untranslated copies of the source** — Every key whose `fr` value is prose has a different value in `de`, `en`, `es`, `it` and `pt`. The only exceptions are an explicit allowlist: the brand `Goat It`, proper nouns and format-only keys.
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `app/i18n/locales/**` · Src: [5], project: .opencode/commands/complete-i18n.md
- **[I18N-06] Placeholder parity per key** — For each key, the multisets of named `{name}` placeholders, list `{0}` placeholders, linked `@:key` references and `|` plural branches are identical in all six locales.
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `app/i18n/locales/**` · Src: [12]
- **[I18N-07] Call sites supply every placeholder** — Every `t()`/`$t()`/`<i18n-t>` call passes a value for each `{placeholder}` of its message and passes no named parameter the message does not use.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**/*.ts` · Src: [12]
- **[I18N-08] Plural form at zero follows CLDR** — Every pluralized key (`|` branches, e.g. `appliedCount` in `game.json`) renders the CLDR-correct form at 0, 1 and 2 in each locale. Vue I18n selects branches with its built-in choice rule unless `pluralRules` overrides it, so `fr` and `pt` (CLDR `one` covers 0) need a custom rule or an explicit zero branch (verified: vue-i18n 11.4.8).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/**`, `nuxt.config.ts` · Src: [7], [8]
- **[I18N-09] CLDR `many` category handled** — Pluralized keys that can receive multiples of 1,000,000 have a `many` branch in `es`, `fr`, `it` and `pt`, or the code documents a floor that makes such counts unreachable.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/locales/**` · Src: [7]
- **[I18N-10] Missing keys never render raw** — When a key is missing in the active locale, the user sees a configured `fallbackLocale` translation, never the raw key path. `fallbackLocale` is a Vue I18n option that lives in `app/i18n/i18n.config.ts`, not in `nuxt.config.ts`. `formatFallbackMessages` stays `false` (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/i18n/**` · Src: [13], [21], [22]
- **[I18N-11] Missing/fallback warnings not silenced globally** — When `app/i18n/i18n.config.ts` exists, it does not set `missingWarn: false` or `fallbackWarn: false` without a replacement. A RegExp scope or a `missing` handler that still reports keys no locale has is acceptable.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/**` · Src: [13], [22]
- **[I18N-12] No orphan keys** — Every flattened key is referenced by a `t(`/`$t(`/`<i18n-t keypath=` call, a key constant, or a dynamic key family that is documented (e.g. `errors.goatItApi.<code>`).
  Evidence: `command` · Diff: ✗ · Severity: low · Look: `app/i18n/locales/fr/*.json`, `app/**/*.vue` · Src: [5]

## 2. Hardcoded text

- **[I18N-13] No hardcoded user-facing text** — Every user-visible string in SFCs resolves through `t()`/`$t()`/`<i18n-t>`. This covers template text nodes, `aria-label`, `aria-description`, `title`, `alt`, `placeholder` and `label` attributes or props, toast and modal `title`/`description`/action labels, and the title and description values passed to `useSeoMeta`/`useHead`. Only `SITE_NAME`, icon names and non-linguistic tokens are exempt.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/App.vue` · Src: [1], [29], project: AGENTS.md
- **[I18N-14] Script-produced copy is keyed** — Composables, utils and constants under `app/` that produce user-visible text (toast payloads, error mappers, labels, filter names) return i18n keys or call `t()`, never literal prose in any language.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/**/*.ts`, `app/utils/**/*.ts`, `app/**/*.constants.ts` · Src: [1], project: AGENTS.md
- **[I18N-15] Head metadata follows a locale switch** — `useSeoMeta`, `useHead` and `useSchemaOrg` values that carry translated text are getters or computed values (`() => t('seo.home.title')`), never a `t()` result evaluated once. A client-side switch therefore updates `<title>` and the meta descriptions.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue`, `app/pages/**/*.vue` · Src: [17]
- **[I18N-16] Server-surfaced errors are keyed** — The UI never displays upstream or h3 `statusMessage` prose. Upstream `errorCode` values resolve to `errors.goatItApi.<code>` keys present in all six locales, with an HTTP-status fallback key when no code is present.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-error/**`, `app/i18n/locales/*/errors.json`, `app/composables/**/*.ts` · Src: [20], project: docs/security.md
- **[I18N-17] Nuxt UI built-in strings follow the active locale** — `UApp` either has no `locale` prop, so Nuxt UI follows the current `@nuxtjs/i18n` locale, or binds `locale` reactively to the active locale. A static `:locale` freezes built-in labels and component date formats in one language (verified: @nuxt/ui 4.12.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/App.vue` · Src: [35]
- **[I18N-18] No words baked into images** — Images, illustrations, PWA screenshots and SVGs contain no language-specific words, or ship one asset per locale. Meaningful images get their `alt` text from i18n.
  Evidence: `manual` · Diff: ✗ · Severity: low · Look: `public/img/**`, `public/pwa/**` · Src: [1]

## 3. Message design

- **[I18N-19] No sentence assembly** — Each message is a complete sentence or paragraph. Templates never build one sentence from several keys and variables (`{{ $t('a') }} {{ noun }} {{ $t('b') }}`), and keys are never concatenated in script.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**/*.ts` · Src: [1], [5]
- **[I18N-20] Named placeholders in prose** — Messages whose word order can differ between locales use named placeholders (`{count}`, `{theme}`), never positional `{0}`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/fr/*.json` · Src: [5], [12]
- **[I18N-21] One key per UI role** — A button label, a heading and a toast title that share French wording still use distinct keys, because noun/verb form and length differ per locale.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/i18n/locales/fr/*.json` · Src: [5]
- **[I18N-22] No HTML markup in messages** — Locale JSON contains no HTML tags, and `i18n.compilation.strictMessage` is not set to `false`. With the default `{ strictMessage: true, escapeHtml: false }`, HTML in static locale files only produces a build warning, so the build log is checked for that warning (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/i18n/locales/**`, `nuxt.config.ts` · Src: [24]
- **[I18N-23] Component interpolation for inline markup** — Links, emphasis or components inside a translated sentence use `<i18n-t keypath>` with named slots, never keys split around the element.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [11]
- **[I18N-24] Message-syntax special characters escaped** — Literal `{`, `}`, `@`, `$` and `|` in copy use literal interpolation (`{'@'}`) or backslash escapes (`\@`, `\{`, `\|`, available since vue-i18n 11.3) (verified: vue-i18n 11.4.8).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/i18n/locales/**` · Src: [12]
- **[I18N-25] French typography** — In `fr` messages and `content/fr/`, `;`, `!` and `?` are preceded by U+202F (narrow no-break space), `:` by U+00A0, and `«`/`»` are separated from their text by U+00A0. A plain U+0020 counts as a failure.
  Evidence: `command` · Diff: ✗ · Severity: low · Look: `app/i18n/locales/fr/*.json`, `content/fr/**` · Src: [31], [32]

## 4. Formatting

- **[I18N-26] Dates through a locale-aware formatter** — User-visible dates, such as changelog entry dates and any future timestamps, render through `$d`/`<i18n-d>` with declared `datetimeFormats`, `Intl.DateTimeFormat(activeLocale)`, or a Nuxt UI component that follows the active locale. Never use `toLocaleDateString()` without the active locale, and never assemble `dd/mm/yyyy` by hand.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/utils/**/*.ts` · Src: [9], [6]
- **[I18N-27] Numbers and percentages through `Intl`** — User-visible counts, scores and percentages render through `$n`/`<i18n-n>` or `Intl.NumberFormat(activeLocale)`, with `style: 'percent'` for percentages. No `toFixed()`, no hand-built thousands separators and no `n + ' %'` concatenation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/utils/**/*.ts` · Src: [10], [6]
- **[I18N-28] Lists through `Intl.ListFormat`** — User-visible enumerations, such as selected themes or filter summaries, use `Intl.ListFormat(activeLocale)`, never `array.join(', ')` or a translated "and" glued in code.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/utils/**/*.ts` · Src: [6]
- **[I18N-29] Explicit time-zone policy** — When dates or times are formatted during SSR and again on the client, every format declares `timeZone` (or a shared default) so the server and the browser render the same value.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/utils/**/*.ts` · Src: [9]

## 5. Sorting

- **[I18N-30] Locale-aware collation** — User-visible alphabetical lists, such as question themes in filters and settings, sort with `Intl.Collator(activeLocale)` or `localeCompare(other, activeLocale)`, not with default `sort()`/`toSorted()` code-unit order. They re-sort when the locale changes.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `app/utils/**/*.ts`, `app/components/**/*.vue` · Src: [33]
- **[I18N-31] Accent-insensitive filtering** — When a free-text search or filter exists, it matches with `Intl.Collator(activeLocale, { sensitivity: 'base' })` or NFD normalization with combining marks stripped, so `e` matches `é`/`è`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/components/**/*.vue`, `app/utils/**/*.ts` · Src: [33]

## 6. Language and direction attributes

- **[I18N-32] SSR `<html lang>` matches the resolved locale** — For each of the six locales set through the `goat_it_locale` cookie, the server-rendered `<html lang>` equals that locale's `language` tag (`fr-FR`, `en-US`, `de-DE`, `es-ES`, `it-IT`, `pt-PT`). A request without the cookie gets the default locale's tag.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [2], [29], project: docs/seo.md §1
- **[I18N-33] `<html lang>` updates on client switch** — After a switch through the locale select or the locale-suggestion toast, `<html lang>` equals the new locale's tag without a reload.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [17], [29]
- **[I18N-34] Every locale declares a BCP 47 `language`** — Each `i18n.locales[]` object declares `code`, `name` and `language` as a BCP 47 tag with region (e.g. `pt-PT`). `language` is required by the module's SEO features, which generate `lang` (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [24], [17]
- **[I18N-35] Switcher endonyms carry `lang`** — Each language option in the switchers (`LocaleSelect`, `GameSettingsLocaleSelect`) exposes its endonym inside an element with that locale's `lang` (e.g. `<bdi lang="de">Deutsch</bdi>`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/shared/core/localization/**`, `app/components/domain/game/GameSettingsModal/**` · Src: [29], [2]
- **[I18N-36] Suggestion toast declares its language** — The locale-suggestion toast is rendered in the suggested locale, not the page locale, so its title, description and actions sit in an element with that locale's `lang`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/ui/useLocaleSuggestion/**`, `app/composables/ui/useAppToast/**` · Src: [29], [2]
- **[I18N-37] Direction comes from locale config, not CSS** — Text direction derives from the locale `dir` or `defaultDirection` (`ltr`) and reaches `<html dir>`/`UApp`. The CSS `direction` property never sets document or component direction (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/assets/css/**`, `nuxt.config.ts` · Src: [3], [24]
- **[I18N-38] Logical properties on text containers** — New text containers use logical utilities and properties (`ms-*`/`me-*`, `ps-*`/`pe-*`, `text-start`/`text-end`, `inset-inline-*`) rather than physical `left`/`right`, so a future RTL locale needs no layout rewrite.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/**/*.vue`, `app/assets/css/**` · Src: [3]

## 7. Locale negotiation and persistence

- **[I18N-39] Browser-language detection disabled** — `i18n.detectBrowserLanguage` is exactly `false`. Detection is on by default, and any object value, including one that only sets `cookieKey`, re-enables it. Browser languages only feed `useLocaleSuggestion` (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [16], [24], project: docs/architecture.md §4.7
- **[I18N-40] Suggestion never switches without consent** — With no valid cookie and a supported browser language that differs from the current locale, only the suggestion toast appears. Declining or closing it leaves the active locale unchanged and stores the current locale; only accepting calls `setLocale()`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [16], [28], project: docs/seo.md §1
- **[I18N-41] A stored choice wins over browser languages** — With a valid `goat_it_locale` cookie, whatever `navigator.languages` reports, no suggestion toast is shown and no locale change fires on mount.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [28]
- **[I18N-42] Locale changes go through `setLocale()`** — Locale changes call `setLocale(code)`, which loads messages and triggers hooks. No production code assigns `locale.value` directly (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/composables/**/*.ts`, `app/plugins/**` · Src: [19]
- **[I18N-43] Choice persisted in the locale cookie** — Every user-initiated switch writes `goat_it_locale` (`CookieNames.LOCALE`) with `LOCALE_COOKIE_OPTIONS`, and only `LocaleSelect` and `useLocaleSuggestion` write it. With `detectBrowserLanguage: false` the module manages no locale cookie, so `setLocale()` alone does not persist the choice (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/components/shared/core/localization/**`, `app/composables/ui/useLocaleSuggestion/**`, `app/app.constants.ts` · Src: [19], [24], project: docs/architecture.md §4.7
- **[I18N-44] SSR locale resolved from the cookie** — `server/plugins/locale-detector` sets the request locale from `goat_it_locale` through `resolveCookieLocale`, falling back to the configured default locale.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/plugins/locale-detector/**`, `shared/utils/helpers/locale/**` · Src: [20], project: docs/architecture.md §4.7
- **[I18N-45] Upstream `Accept-Language` uses the same cookie** — Every Goat It API call forwards an `Accept-Language` built by `extractLocaleFromEvent` from `goat_it_locale`, using the same `CookieNames.LOCALE` constant and default locale as the UI. The incoming request's `Accept-Language` is never forwarded.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-locale/**`, `server/utils/goat-it-api/helpers/goat-it-api-fetch-options/**` · Src: [28], project: docs/architecture.md §4.7, project: docs/security.md
- **[I18N-46] Invalid cookie values degrade to the default** — An unsupported cookie value (`xx`, `pt-BR`, empty string) resolves to the default locale through `isValidLocale` on both server and client. It never throws and never renders raw keys.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/locale/**`, `server/plugins/locale-detector/**` · Src: [21]
- **[I18N-47] SSR and hydration resolve the same locale** — For each cookie locale, the hydrated page shows no text swap and logs no hydration-mismatch warning, and no client code rewrites the locale during hydration.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [16], [23]
- **[I18N-48] Locale-dependent data refetched on switch** — Every locale-dependent fetch re-runs on locale change, through `watch: [locale]` or a locale watcher. This includes question themes, active questions, and `content_<locale>`/`changelog_<locale>` queries, so no previous-locale data stays on screen.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/App.vue`, `app/pages/**/*.vue`, `app/components/domain/**/*.vue`, `app/stores/**` · Src: [34], project: docs/pwa.md
- **[I18N-49] Locale in data cache keys** — Every `useAsyncData`/`useFetch` key for locale-dependent data includes the locale (e.g. `rules-${locale}`), so SSR payloads and cached entries never serve another locale's content.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/pages/**/*.vue`, `app/components/**/*.vue`, `app/stores/**` · Src: [34]

## 8. Language switcher

- **[I18N-50] Endonym labels from config** — Switcher labels come from `locales[].name` and are endonyms (`Français`, `English`, `Deutsch`, `Español`, `Italiano`, `Português`), never exonyms like "Allemand" or bare ISO codes. Custom locale properties such as `name` are exposed at runtime (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/components/shared/core/localization/**` · Src: [1], [19], [24]
- **[I18N-51] No flags for languages** — No flag icon, flag emoji or country code represents a language in the switchers, the suggestion toast or settings.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/**/*.vue`, `app/composables/ui/useLocaleSuggestion/**` · Src: [26], [4]
- **[I18N-52] Switcher reachable from every layout** — A locale switcher is reachable from the home page, the docs layout and the game (sidebar or settings), without starting or abandoning a game.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/layouts/**`, `app/pages/**/*.vue`, `app/components/domain/game/GameSidebar/**`, `app/components/domain/game/GameSettingsModal/**` · Src: [19]
- **[I18N-53] Switching preserves route and game state** — Switching locale on `/game` keeps the user on `/game` with the same question position and filters, then re-fetches the active questions in the new locale. Switching on `/rules` stays on `/rules`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [23]
- **[I18N-54] Switch failure handled** — If loading messages fails or `setLocale()` rejects, the previous locale stays usable and the stored cookie matches the displayed locale. The error is logged with `console.error` and surfaced through a translated error toast.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/components/shared/core/localization/**`, `app/composables/ui/useLocaleSuggestion/**` · Src: project: AGENTS.md

## 9. Message loading

- **[I18N-55] Lazy per-locale messages** — Every locale loads its messages through `locales[].files`, and no messages are inlined through a Vue I18n config `messages` option, so only the active locale's messages are fetched (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `app/i18n/**` · Src: [18], [24]
- **[I18N-56] Client chunks carry no locale messages** — `.output/public/_nuxt/*.js` contains no locale message strings (sample one unique string per locale). Messages are served as `_i18n/<hash>/<locale>/messages.json`.
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [18], [24]
- **[I18N-57] Plain-JSON locale files** — Locale files are plain JSON without message functions. A locale file containing a message function ships that locale in the client bundle and bypasses the messages endpoint and prerendered messages (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/**`, `nuxt.config.ts` · Src: [18], [24]
- **[I18N-58] Message-compiler choice is explicit** — `i18n.bundle.runtimeOnly` and `bundle.dropMessageCompiler` default to `false`, so the message compiler ships to the client. Either that trade-off is recorded, or `dropMessageCompiler: true` is set with every message coming from precompiled locale files (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `nuxt.config.ts` · Src: [24], [14]
- **[I18N-59] Immutable message URLs are content-hashed** — Because `/_i18n/**` is served with `Cache-Control: immutable`, every built message file lives under a hashed `_i18n/<hash>/<locale>/messages.json` path, so a translation fix is never masked by a stale browser cache (verified: @nuxtjs/i18n 10.6.0).
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [24]

## 10. Layout resilience

- **[I18N-60] No fixed sizes on translated containers** — Buttons, tabs, badges, toasts and headers that hold translated labels have no fixed width or height (`w-[120px]`, `h-8` with single-line clipping). They size from content with `min-*` constraints.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/config/**`, `app/**/*.constants.ts` · Src: [27], [5]
- **[I18N-61] No silent truncation of translated text** — Translated labels never use `truncate`, `overflow-hidden`, `text-ellipsis` or `break-all` unless the full text stays available through wrapping or a tooltip.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue`, `app/config/**`, `app/assets/css/**` · Src: [5]
- **[I18N-62] Text expansion tolerated** — At 320 px and desktop widths, `de` and `pt` render home, rules, the game action bar, sidebar, settings, filters and toasts without overflow, clipping or overlap. Budget 200–300 % expansion for source strings of 10 characters or fewer and about 130 % above 70 characters.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [27], [5]
- **[I18N-63] Font covers every locale's glyphs** — The `@font-face` `unicode-range` declarations in `app/assets/css/fonts.css` cover every character used in the six locale files and in `content/`, including `ã õ ç ß œ « » € …`, U+00A0 and U+202F. No fallback-font glyph appears mid-word.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/assets/css/fonts.css`, `public/fonts/**`, `app/i18n/locales/**` · Src: [1]
- **[I18N-64] Long-locale smoke test** — An automated run renders the core pages in `de`, or in a pseudo-locale with about +40 % length and bracket delimiters, and fails on clipped or overflowing controls.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [25]

## 11. Translation quality

- **[I18N-65] French is the single source** — Only `app/i18n/locales/fr/**` and `content/fr/**` are authored by hand, and the other locales derive from French through `/complete-i18n`. A diff that adds or rewords a key in a non-`fr` locale without the matching `fr` change is a finding.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/complete-i18n.md`, `app/i18n/locales/fr/*.json`, `content/fr/**` · Src: [5], project: .opencode/commands/complete-i18n.md
- **[I18N-66] Register consistent per locale** — Each locale keeps one register across UI, toasts, rules and changelog. Formal or informal address is never mixed within a locale, and a 10-string sample per locale shows a single register.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [5], project: .opencode/commands/complete-i18n.md
- **[I18N-67] Consistent game terminology** — Each game concept (theme, question, filter, hint, tutorial, settings) uses one canonical translation per locale across UI keys, rules content and changelog.
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [5]
- **[I18N-68] Brand and identifiers untranslated** — `Goat It`, `SITE_NAME`, product names and code-like tokens are identical in every locale file and content file.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/i18n/locales/**`, `content/**` · Src: project: .opencode/commands/complete-i18n.md
- **[I18N-69] Translations reviewed before release** — Each target locale has a recorded review by a native or fluent speaker (who, when, which namespaces) for machine- or agent-generated translations. Unreviewed machine translation shipped to `main` is a finding.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [5]

## 12. Localized content

- **[I18N-70] Content parity across locale trees** — Every file under `content/fr/` (`rules.md`, `changelog/<version>.md`) exists at the same relative path in `content/de/`, `content/en/`, `content/es/`, `content/it/` and `content/pt/`.
  Evidence: `command` · Diff: ✗ · Severity: high · Look: `content/**` · Src: [34]
- **[I18N-71] One collection per locale** — `content.config.ts` defines `content_<locale>` and `changelog_<locale>` for every locale in `LOCALES`, each including only `<locale>/**`, and pages query the collection for the active locale (verified: @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content.config.ts`, `app/pages/**/*.vue`, `app/components/domain/changelog/**` · Src: [34]
- **[I18N-72] Content frontmatter localized** — Every content file's frontmatter `title` and `description` are written in the file's locale. Changelog `version` and `date` match the `fr` file.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/**` · Src: [34], [17]
- **[I18N-73] Default-locale content fallback is a safety net** — When a locale's content entry is missing, the page falls back to the default-locale entry and never renders an empty page or raw error.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/pages/**/*.vue` · Src: [34]
- **[I18N-74] Manifest texts come from translations** — `buildPwaManifest` takes `name`, `description` and the shortcut label from the default locale's translation files, not from literals, and sets `lang` to that locale.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/pwa/manifest/**`, `nuxt.config.ts` · Src: [30], project: docs/pwa.md §1
- **[I18N-75] Manifest localized for every locale** — The web app manifest exposes `name_localized`, `short_name_localized` and `description_localized` for the six locales, or a per-locale manifest is served.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `shared/utils/helpers/pwa/manifest/**` · Src: [30], project: docs/pwa.md §1
- **[I18N-76] Offline page copy localized** — `app/pages/offline/index.vue` renders only `offline`-namespace keys and is prerendered in the build default locale, and the build-time and runtime `NUXT_PUBLIC_DEFAULT_LOCALE` match.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/offline/**`, `app/i18n/locales/*/offline.json`, `nuxt.config.ts` · Src: project: docs/pwa.md §3
- **[I18N-77] Structured-data text localized** — JSON-LD text fields (the `Organization` and `WebSite` description and the slogan) come from `t()`, and `WebPage.inLanguage` is the active locale's BCP 47 `language` tag (`fr-FR`), not the bare code.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/App.vue` · Src: [17], project: docs/seo.md
- **[I18N-78] Error pages localized** — A 404 and a 500 response rendered with the `de` cookie show translated copy, never Nuxt's default English error page.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [15]

## 13. i18n testing

- **[I18N-79] Parity specs check more than keys** — Translation specs also assert placeholder multisets, plural branch counts, non-empty values and absence of untranslated `fr` copies, not only equality of the sorted key sets.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/specs/*.translations.spec.ts` · Src: [7], [8], project: docs/unit-testing.md §6.11
- **[I18N-80] Parity specs gate CI** — `*.translations.spec.ts` files run in a Vitest project included in `pnpm run test:unit:cov`, with no `skip`/`todo`, so a new `fr` key without five translations fails the pipeline.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/vitest/**`, `app/i18n/specs/*.translations.spec.ts` · Src: [5], project: docs/unit-testing.md §6.11
- **[I18N-81] Referenced keys exist in the source locale** — An automated check fails when code references a key absent from `fr`, through a static key scan or a `missing` handler that throws in tests. Console warnings alone do not count as a gate.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/vitest/**`, `tests/unit/setup/nuxt/use-i18n.nuxt.unit-setup.ts` · Src: [13]
- **[I18N-82] Acceptance covers `<html lang>`** — Acceptance scenarios assert `<html lang>` for the default locale, for a cookie-set locale and after a runtime switch.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/seo/seo-html-lang.feature` · Src: [29], [17]
- **[I18N-83] Acceptance covers switching and persistence** — An acceptance scenario switches locale, asserts that visible copy changes, reloads, and asserts the locale persisted through the cookie.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/**/*.feature` · Src: [19]
- **[I18N-84] Acceptance covers no auto-switch on first visit** — An acceptance scenario with browser languages `de-DE` and no cookie asserts that the page renders in the default locale and shows only the dismissible suggestion.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/locale-suggestion/*.feature` · Src: [16], [28]

## Sources

[1] Internationalization Quick Tips for the Web (W3C) — https://www.w3.org/International/quicktips/ — fetched 2026-10-31 (stable tips page, no date shown)
[2] Declaring language in HTML (W3C i18n Q&A) — https://www.w3.org/International/questions/qa-html-language-declarations — fetched 2026-10-31 (no date shown)
[3] Structural markup and right-to-left text in HTML (W3C) — https://www.w3.org/International/questions/qa-html-dir — fetched 2026-10-31 (no date shown)
[4] Indicating the language of a link destination (W3C) — https://www.w3.org/International/questions/qa-link-lang — fetched 2026-10-31 (no date shown)
[5] Localization best practices for developers (Mozilla l10n) — https://mozilla-l10n.github.io/documentation/localization/dev_best_practices.html — fetched 2026-10-31 (main branch)
[6] Intl (MDN) — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl — fetched 2026-10-31 (last modified 2025-09-24)
[7] Language Plural Rules (Unicode CLDR charts) — https://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html — fetched 2026-10-31 (CLDR latest charts)
[8] Pluralization (Vue I18n docs source) — https://github.com/intlify/vue-i18n/blob/v11.4.8/docs/guide/essentials/pluralization.md — fetched 2026-10-31 (vue-i18n 11.4.8)
[9] Datetime Formatting (Vue I18n) — https://vue-i18n.intlify.dev/guide/essentials/datetime.html — fetched 2026-10-31 (Vue I18n v11 docs)
[10] Number Formatting (Vue I18n) — https://vue-i18n.intlify.dev/guide/essentials/number.html — fetched 2026-10-31 (Vue I18n v11 docs)
[11] Component Interpolation (Vue I18n) — https://vue-i18n.intlify.dev/guide/advanced/component.html — fetched 2026-10-31 (Vue I18n v11 docs)
[12] Message Format Syntax (Vue I18n docs source) — https://github.com/intlify/vue-i18n/blob/v11.4.8/docs/guide/essentials/syntax.md — fetched 2026-10-31 (vue-i18n 11.4.8; escape sequences from v11.3)
[13] Fallbacking (Vue I18n) — https://vue-i18n.intlify.dev/guide/essentials/fallback.html — fetched 2026-10-31 (Vue I18n docs)
[14] Optimization (Vue I18n) — https://vue-i18n.intlify.dev/guide/advanced/optimization.html — fetched 2026-10-31 (Vue I18n v11 docs, JIT default from v10)
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
[25] Pseudolocalization (Microsoft Learn) — https://learn.microsoft.com/en-us/globalization/methodology/pseudolocalization — fetched 2026-10-31 (updated 2022-08-12)
[26] Flags are not languages (blog) — https://www.flagsarenotlanguages.com/blog/ — fetched 2026-10-31 (posts 2013–2025)
[27] Text size in translation (W3C i18n) — https://www.w3.org/International/articles/article-text-size — fetched 2026-10-31 (no date shown)
[28] Accept-Language used for locale setting (W3C i18n Q&A) — https://www.w3.org/International/questions/qa-accept-lang-locales — fetched 2026-10-31 (no date shown)
[29] lang HTML global attribute (MDN) — https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/lang — fetched 2026-10-31 (last modified 2026-09-08)
[30] Web Application Manifest (W3C Working Draft) — https://www.w3.org/TR/appmanifest/ — fetched 2026-10-31 (WD 2026-10-26)
[31] Espace insécable (Wikipédia FR) — https://fr.wikipedia.org/wiki/Espace_ins%C3%A9cable — fetched 2026-10-31 (oldid 240875105)
[32] Punctuation and typography (Le Conjugueur, Le Figaro) — https://leconjugueur.lefigaro.fr/ukponctuationtypographie.php — fetched 2026-10-31 (no revision date)
[33] Intl.Collator (MDN) — https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator — fetched 2026-10-31 (last modified 2025-07-10)
[34] Nuxt i18n module integration (Nuxt Content) — https://content.nuxt.com/docs/integrations/i18n — fetched 2026-10-31 (@nuxt/content 3.16.2)
[35] Internationalization (Nuxt UI) — https://ui.nuxt.com/docs/getting-started/integrations/i18n/nuxt — fetched 2026-10-31 (@nuxt/ui 4.12.0, automatic locale since 4.12)
