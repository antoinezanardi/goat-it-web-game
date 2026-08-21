# 🐐👑 Goat It Web Admin Versioning Changelog

## [1.5.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.4.0...v1.5.0) (2026-08-21)

### 🚀 Features

* **game-question-card:** convert difficulty & hint badges to touch-friendly popover ([#196](https://github.com/antoinezanardi/goat-it-web-game/issues/196)) ([2f0db9c](https://github.com/antoinezanardi/goat-it-web-game/commit/2f0db9c95735ae694f1b3fd09097fe35ee809c7d))
* **game:** display secondary themes on question card ([#185](https://github.com/antoinezanardi/goat-it-web-game/issues/185)) ([5343b13](https://github.com/antoinezanardi/goat-it-web-game/commit/5343b1340e60ce254676c55c2d836e64676c2446))
* **game:** extract difficulty badge into icon-only circle badge with… ([#183](https://github.com/antoinezanardi/goat-it-web-game/issues/183)) ([d2c29e2](https://github.com/antoinezanardi/goat-it-web-game/commit/d2c29e29d33b490a61a31ae5f8deaec1279f5c77))
* **game:** surface theme isHint flag on question card ([#192](https://github.com/antoinezanardi/goat-it-web-game/issues/192)) ([61e6b56](https://github.com/antoinezanardi/goat-it-web-game/commit/61e6b56fc9045da4bf1e80892dae2e179bc5392a))

### 🐛 Bug Fixes

* **game:** prevent card halo animation reset during card transitions ([#182](https://github.com/antoinezanardi/goat-it-web-game/issues/182)) ([b5c871d](https://github.com/antoinezanardi/goat-it-web-game/commit/b5c871d8cf67917ad8a261f1158bae61afc98a61))
* **question-cards:** improve cards various animations ([#187](https://github.com/antoinezanardi/goat-it-web-game/issues/187)) ([7c52fef](https://github.com/antoinezanardi/goat-it-web-game/commit/7c52fef3c0a28c2fd8295b08cddaa293f8286755))
* **theme:** scope dark button colors to buttons only ([#180](https://github.com/antoinezanardi/goat-it-web-game/issues/180)) ([3c715c1](https://github.com/antoinezanardi/goat-it-web-game/commit/3c715c14b8b325d81476365850df6a022655ee2f))

### 🎨 Styles

* **game-question-card:** better alignments for game question headers ([#201](https://github.com/antoinezanardi/goat-it-web-game/issues/201)) ([1ec073b](https://github.com/antoinezanardi/goat-it-web-game/commit/1ec073b28a051a8771317c54123958b5e44ff44c))

### 🧹 Chore

* sync release v1.4.0 from main [skip ci] ([090bfb5](https://github.com/antoinezanardi/goat-it-web-game/commit/090bfb570b943c0513f6ac9931822940791c3c90))
* trigger release ([8341184](https://github.com/antoinezanardi/goat-it-web-game/commit/8341184e40cfc198dd9e1cc95d2b6b9482dab549))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@eslint/config-inspector` | `^3.3.0` |
| `@iconify-json/lucide` | `^1.2.124` |
| `@nuxt/ui` | `^4.11.0` |
| `@nuxtjs/robots` | `^6.2.0` |
| `@nuxtjs/sitemap` | `^8.5.0` |
| `@takumi-rs/core` | `^2.10.0` |
| `eslint` | `^10.9.0` |
| `happy-dom` | `^20.11.6` |
| `nuxt-schema-org` | `^6.3.0` |
| `nuxtseo-layer-devtools` | `^5.3.14` |
| `unhead` | `^3.4.0` |
| `vite` | `^8.2.2` |
| `oxlint monorepo` | `^1.79.0` |
| `vitest monorepo` | `^4.1.11` |
| `vue-language-tools monorepo` | `^3.3.11` |

## [1.4.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.3.0...v1.4.0) (2026-08-16)

### 🚀 Features

* **fonts:** self-host Geist font to remove build-time download ([#179](https://github.com/antoinezanardi/goat-it-web-game/issues/179)) ([e9f6bfb](https://github.com/antoinezanardi/goat-it-web-game/commit/e9f6bfbeb033d936d1bb82efa728ab4eb9d3a471))
* **rules:** add /rules page with Nuxt Content v3 and i18n markdown ([#156](https://github.com/antoinezanardi/goat-it-web-game/issues/156)) ([6a38038](https://github.com/antoinezanardi/goat-it-web-game/commit/6a38038e5d815f96445eb7e755e06e463c3aec5a))
* **rules:** add docs reading style with sticky TOC, back link and back-to-top button ([#172](https://github.com/antoinezanardi/goat-it-web-game/issues/172)) ([9c9f76f](https://github.com/antoinezanardi/goat-it-web-game/commit/9c9f76fcbb89664a8202b109e32c23acac0ed6f6))
* **rules:** polish docs page and fix layout transitions ([f02c7f0](https://github.com/antoinezanardi/goat-it-web-game/commit/f02c7f06a3cd6bffdd3096aeee6d7a7cea504902))
* **rules:** polish docs page and fix layout transitions ([#175](https://github.com/antoinezanardi/goat-it-web-game/issues/175)) ([b127908](https://github.com/antoinezanardi/goat-it-web-game/commit/b1279082392873df7cd8f757067bf65d2530d579))
* **theme:** define neon arcade button styles with AAA contrast ([#177](https://github.com/antoinezanardi/goat-it-web-game/issues/177)) ([512d74b](https://github.com/antoinezanardi/goat-it-web-game/commit/512d74b4b5728951ead9e6a2b2cdc41c254dd39e))

### 🐛 Bug Fixes

* **acceptance:** wait for app hydration before page interactions ([#176](https://github.com/antoinezanardi/goat-it-web-game/issues/176)) ([25fb890](https://github.com/antoinezanardi/goat-it-web-game/commit/25fb890b83f23d5fa41dd87fdc9e99a200859a38))

### 📖 Docs

* **agents:** add docs-fetcher subagent with context7 skill ([#162](https://github.com/antoinezanardi/goat-it-web-game/issues/162)) ([e98325d](https://github.com/antoinezanardi/goat-it-web-game/commit/e98325d58d17f0388371415600f3f80888602bb7))

### 🔩 Refactor

* **home:** extract play button and footer into domain components ([#163](https://github.com/antoinezanardi/goat-it-web-game/issues/163)) ([266a185](https://github.com/antoinezanardi/goat-it-web-game/commit/266a185fb8c8b71d7b9e5518981e0a5022fb645f))
* **theming:** restructure CSS and align tokens with Nuxt UI best practices ([#169](https://github.com/antoinezanardi/goat-it-web-game/issues/169)) ([337c074](https://github.com/antoinezanardi/goat-it-web-game/commit/337c0744522601133e0f7ace569f02dbee0fe8ba))

### 🔁 CI

* **semantic-release:** sync develop with release commit after publishing ([#153](https://github.com/antoinezanardi/goat-it-web-game/issues/153)) ([e9e63bd](https://github.com/antoinezanardi/goat-it-web-game/commit/e9e63bd0d60d3fe47d1a0f4a2bc1ea4d384d0c2c))

### 🧹 Chore

* **ai:** remove rtk ([#167](https://github.com/antoinezanardi/goat-it-web-game/issues/167)) ([d86656b](https://github.com/antoinezanardi/goat-it-web-game/commit/d86656bb3229750bcbf8af42c15fd08e19b518c7))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `commitlint monorepo` | `^21.2.2` |
| `@axe-core/playwright` | `^4.13.0` |
| `@faker-js/faker` | `^10.6.0` |
| `@pinia/nuxt` | `^1.0.2` |
| `@takumi-rs/core` | `^2.9.2` |
| `nuxt-seo-utils` | `^8.4.2` |
| `nuxt-site-config` | `^4.2.3` |
| `pinia` | `^4.0.3` |
| `pnpm` | `v11.22.0` |
| `vue-language-tools monorepo` | `^3.3.10` |

## [1.3.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.2.0...v1.3.0) (2026-08-11)

### 🚀 Features

* **app:** prerender home page with routeRules ([#128](https://github.com/antoinezanardi/goat-it-web-game/issues/128)) ([871d95e](https://github.com/antoinezanardi/goat-it-web-game/commit/871d95eab229ca79253c0997baa47b82382b1cc2))
* **game:** add GSAP-powered slide transition between question card ([#135](https://github.com/antoinezanardi/goat-it-web-game/issues/135)) ([0f34fca](https://github.com/antoinezanardi/goat-it-web-game/commit/0f34fca4901b48155530737de7708f51e0170ba1))
* **game:** add leave-game confirmation modal ([#145](https://github.com/antoinezanardi/goat-it-web-game/issues/145)) ([565b1f6](https://github.com/antoinezanardi/goat-it-web-game/commit/565b1f602f3a1b10fa41f45280259cfc3cc19d84))
* **game:** add previous question navigation button ([#131](https://github.com/antoinezanardi/goat-it-web-game/issues/131)) ([03d6934](https://github.com/antoinezanardi/goat-it-web-game/commit/03d6934b0d2376b6e082bf2c7edf8ed2be4649be))
* **modals:** implement modal system ([#144](https://github.com/antoinezanardi/goat-it-web-game/issues/144)) ([7f802ed](https://github.com/antoinezanardi/goat-it-web-game/commit/7f802ede03c32f6e1b0ea51463470bb894356f48))
* **seo:** add OG image, update SEO metadata ([#151](https://github.com/antoinezanardi/goat-it-web-game/issues/151)) ([d88a2be](https://github.com/antoinezanardi/goat-it-web-game/commit/d88a2beb639c9c10761a87a73a38ef37bece6bc5))

### 🐛 Bug Fixes

* **display:** remove overflows and polish game ui ([#148](https://github.com/antoinezanardi/goat-it-web-game/issues/148)) ([8343e00](https://github.com/antoinezanardi/goat-it-web-game/commit/8343e0066a6484d93089a0fba7b5e26f8d7072a8))

### 🔩 Refactor

* **mocks:** introduce MockHolder<T> pattern for global composable mock ([#138](https://github.com/antoinezanardi/goat-it-web-game/issues/138)) ([e2b53f3](https://github.com/antoinezanardi/goat-it-web-game/commit/e2b53f341895b1140526b9a423e42dfd55ab0eb1))

### ✅ Tests

* **game:** add single-question fixture and question-card content assertions ([#127](https://github.com/antoinezanardi/goat-it-web-game/issues/127)) ([e8c2ddb](https://github.com/antoinezanardi/goat-it-web-game/commit/e8c2ddbf9d43078bca7c42233bef8fe9c2b4bd2b))

### 🧹 Chore

* **vitest:** disable nuxt seo modules and vite environment api in unit tests ([#124](https://github.com/antoinezanardi/goat-it-web-game/issues/124)) ([f991fbc](https://github.com/antoinezanardi/goat-it-web-game/commit/f991fbc0d860f0ae4c83bdbc54a91c073f462de4))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@goat-it/schemas` | `^0.0.20` |
| `@iconify-json/lucide` | `^1.2.123` |
| `@nuxtjs/robots` | `^6.1.4` |
| `@nuxtjs/sitemap` | `^8.3.4` |
| `@tanstack/vue-table` | `^9.1.2` |
| `@vitest/eslint-plugin` | `^1.6.27` |
| `conventional-changelog-writer` | `^9.2.1` |
| `eslint` | `^10.8.1` |
| `eslint-plugin-oxlint` | `^1.78.0` |
| `happy-dom` | `^20.11.2` |
| `nuxt-og-image` | `^6.7.8` |
| `nuxt-schema-org` | `^6.2.9` |
| `nuxt-site-config` | `^4.2.1` |
| `nuxtseo-layer-devtools` | `^5.3.12` |
| `oxlint` | `^1.78.0` |
| `pnpm` | `v11.21.0` |

## [1.2.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.1.0...v1.2.0) (2026-08-07)

### 🚀 Features

* **game:** prevent duplicate questions via excluded-ids and game-over UI ([#111](https://github.com/antoinezanardi/goat-it-web-game/issues/111)) ([2e40202](https://github.com/antoinezanardi/goat-it-web-game/commit/2e40202590105f9096eb1028617900ba9cab0117))
* **home:** background and stylized play button ([#105](https://github.com/antoinezanardi/goat-it-web-game/issues/105)) ([97f34f0](https://github.com/antoinezanardi/goat-it-web-game/commit/97f34f0e141e18bee6b3ac741d984fa8865b0c8c))
* **nuxt-seo:** add five Nuxt SEO modules with i18n meta tags ([#119](https://github.com/antoinezanardi/goat-it-web-game/issues/119)) ([25692df](https://github.com/antoinezanardi/goat-it-web-game/commit/25692df0dda51c8001373d9f6f9aae825d5134df))
* **pwa:** add PWA support ([#100](https://github.com/antoinezanardi/goat-it-web-game/issues/100)) ([ee47fcf](https://github.com/antoinezanardi/goat-it-web-game/commit/ee47fcf61539ddd46f498c8ce0649856abda6274))
* **questions:** update API to use body for fetching random questions ([#118](https://github.com/antoinezanardi/goat-it-web-game/issues/118)) ([ff5356d](https://github.com/antoinezanardi/goat-it-web-game/commit/ff5356db1a5950a9d58d8b10220fae087c1db9af))

### 🎨 Styles

* **app:** stick to dark mode ([#99](https://github.com/antoinezanardi/goat-it-web-game/issues/99)) ([158cd3b](https://github.com/antoinezanardi/goat-it-web-game/commit/158cd3b1b1a6ac1bdb840c63a4f580e0188fb05a))

### 🔩 Refactor

* **game:** extract page states into dedicated components with transitions ([#114](https://github.com/antoinezanardi/goat-it-web-game/issues/114)) ([0a5da6d](https://github.com/antoinezanardi/goat-it-web-game/commit/0a5da6d8fcad9035a10b8be343111670bf515a44))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@cucumber/cucumber` | `^13.2.1` |
| `@eslint/config-inspector` | `^3.2.0` |
| `@nuxt/eslint` | `^1.17.0` |
| `@tanstack/vue-table` | `v9` |
| `@vitest/eslint-plugin` | `^1.6.26` |
| `eslint-plugin-oxlint` | `^1.77.0` |
| `eslint-plugin-unicorn` | `v73` |
| `nuxt` | `^4.5.2` |
| `oxlint` | `^1.77.0` |
| `semantic-release` | `^25.0.9` |
| `vite` | `^8.2.1` |
| `node.js` | `v26.6.0` |
| `pnpm` | `v11.20.0` |

## [1.1.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.0.0...v1.1.0) (2026-08-02)

### 🚀 Features

* **game-card:** add category display, difficulty pill, and sticky source footer ([#83](https://github.com/antoinezanardi/goat-it-web-game/issues/83)) ([0a673e3](https://github.com/antoinezanardi/goat-it-web-game/commit/0a673e3e2e0ac3c4040f1b8edbf5ebc39781da44))
* **game:** add game page with progressive prefetch ([#23](https://github.com/antoinezanardi/goat-it-web-game/issues/23)) ([062ea71](https://github.com/antoinezanardi/goat-it-web-game/commit/062ea7105f3650caa50362bb141ec05b62e1bbb2))
* **game:** game card animated inner halo ([#85](https://github.com/antoinezanardi/goat-it-web-game/issues/85)) ([ab40745](https://github.com/antoinezanardi/goat-it-web-game/commit/ab4074593c7d4645a827cb743b0b43a13b4f2170))
* **game:** implement design system POC with styled game screen ([1d1b356](https://github.com/antoinezanardi/goat-it-web-game/commit/1d1b35607ae8407345fdc39a1a7b57743cd517ea))
* **game:** implement design system POC with styled game screen ([bee9b18](https://github.com/antoinezanardi/goat-it-web-game/commit/bee9b18c999b2c888d69124ecf52112f542783d6))
* **game:** implement design system POC with styled game screen ([ea1b751](https://github.com/antoinezanardi/goat-it-web-game/commit/ea1b751245d93a064fab3ce955e1e2f7da9d4a0d))
* **game:** implement design system POC with styled game screen ([0b1104e](https://github.com/antoinezanardi/goat-it-web-game/commit/0b1104ea34b8478ebd320bf87909b1e8494e8a04))
* **game:** implement design system POC with styled game screen ([#50](https://github.com/antoinezanardi/goat-it-web-game/issues/50)) ([50d9972](https://github.com/antoinezanardi/goat-it-web-game/commit/50d997256e5f9b4a680f386b20c27f79884d341d))
* **game:** polish card UIand various elements ([#57](https://github.com/antoinezanardi/goat-it-web-game/issues/57)) ([494092e](https://github.com/antoinezanardi/goat-it-web-game/commit/494092e7f95e76ac8625c1110104127478ee10b9))
* **game:** restructure game components and update question fetching logic ([#46](https://github.com/antoinezanardi/goat-it-web-game/issues/46)) ([ff9bed1](https://github.com/antoinezanardi/goat-it-web-game/commit/ff9bed13408cf414c92cefc42403e8d5e672d788))
* **home:** redesign home page with branding, play button and version badge ([ef38364](https://github.com/antoinezanardi/goat-it-web-game/commit/ef383646f1c38e5faa6edadb0b9723119073faf3))
* **home:** redesign home page with branding, play button and version badge ([7294869](https://github.com/antoinezanardi/goat-it-web-game/commit/7294869125316866c152a7ef8ce379594f9327cc))
* **home:** redesign home page with branding, play button and version badge ([8d60bc8](https://github.com/antoinezanardi/goat-it-web-game/commit/8d60bc862ea8bb93a48749406c277b9b7dab3c04))
* **home:** redesign home page with branding, play button and version badge ([39df8a0](https://github.com/antoinezanardi/goat-it-web-game/commit/39df8a064a70a5374ec94e02a825bd34e5d6fc34))
* **project:** add logo, favicon and update README with live demo ([#88](https://github.com/antoinezanardi/goat-it-web-game/issues/88)) ([7d95311](https://github.com/antoinezanardi/goat-it-web-game/commit/7d95311c6bd7fc9f91c98937abbfff72271bf74e))
* **question-theme:** add read-only store, repository, composables ([#17](https://github.com/antoinezanardi/goat-it-web-game/issues/17)) ([83af06d](https://github.com/antoinezanardi/goat-it-web-game/commit/83af06d30f696e61384a80fb7ebfa94b6365033a))
* **questions:** add questions store with lazy append semantics ([#19](https://github.com/antoinezanardi/goat-it-web-game/issues/19)) ([e05f364](https://github.com/antoinezanardi/goat-it-web-game/commit/e05f364a3506f5fc1838dc90409918b57881c98f))
* **server:** add game API handlers for question-themes and questions/random ([#13](https://github.com/antoinezanardi/goat-it-web-game/issues/13)) ([6268b26](https://github.com/antoinezanardi/goat-it-web-game/commit/6268b26f971ba56ec954896152211d17802160dd))
* **server:** send Accept-Language header to Goat It API ([#26](https://github.com/antoinezanardi/goat-it-web-game/issues/26)) ([36b0829](https://github.com/antoinezanardi/goat-it-web-game/commit/36b08296f55ed7ad084352b0a35e3a6c958f586e))

### 🐛 Bug Fixes

* **release:** correct retrieved cache ([65faf93](https://github.com/antoinezanardi/goat-it-web-game/commit/65faf93ad1e414f4d3cf82c4993950c4a1075b48))

### 📖 Docs

* **agents:** update commands and repository structure in AGENTS.md ([#33](https://github.com/antoinezanardi/goat-it-web-game/issues/33)) ([d786762](https://github.com/antoinezanardi/goat-it-web-game/commit/d7867625cc14754afdbc67a396be21642d7a89a8))

### 🔩 Refactor

* **faketories:** use dto faketories from goat it schemas ([#76](https://github.com/antoinezanardi/goat-it-web-game/issues/76)) ([5ef8437](https://github.com/antoinezanardi/goat-it-web-game/commit/5ef843774c54ae4c0d9c413f75ace3802e86dfa8))
* **skills:** extract plan-writer custom skill from upstream writing-plans ([#42](https://github.com/antoinezanardi/goat-it-web-game/issues/42)) ([c441efe](https://github.com/antoinezanardi/goat-it-web-game/commit/c441efe4190e3f2a6ed13c207e4fadd2d3aa10e5))
* **theme:** align theme and components with tailwind v4 best practices ([#91](https://github.com/antoinezanardi/goat-it-web-game/issues/91)) ([ea329c9](https://github.com/antoinezanardi/goat-it-web-game/commit/ea329c9574b31199124dadbf0682b663829b7a43))

### ✅ Tests

* **acceptance:** add MongoDB fixture injection and accessibility tests ([#59](https://github.com/antoinezanardi/goat-it-web-game/issues/59)) ([4f5ec57](https://github.com/antoinezanardi/goat-it-web-game/commit/4f5ec57b2844562fa4a40d023cec2d9a30ce9c23))
* **game:** add acceptance tests for game ([#77](https://github.com/antoinezanardi/goat-it-web-game/issues/77)) ([45f03b4](https://github.com/antoinezanardi/goat-it-web-game/commit/45f03b4f695275b040bd66117da35a0967180e60))

### 🧹 Chore

* **stryker:** remove mutation testing ([#14](https://github.com/antoinezanardi/goat-it-web-game/issues/14)) ([90a25c1](https://github.com/antoinezanardi/goat-it-web-game/commit/90a25c170d0f1aa0858735fb585a718c862daca3))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `actions/setup-node action` | `v7` |
| `@cucumber/cucumber` | `^13.2.0` |
| `@eslint/config-inspector` | `^3.1.1` |
| `@goat-it/schemas` | `^0.0.19` |
| `@iconify-json/lucide` | `^1.2.121` |
| `@nuxt/hints` | `^1.1.4` |
| `@nuxt/test-utils` | `^4.1.0` |
| `@nuxt/ui` | `^4.9.0` |
| `@nuxtjs/i18n` | `^10.6.0` |
| `@pinia/nuxt` | `v1` |
| `@pinia/testing` | `v2` |
| `@semantic-release/git` | `^11.0.1` |
| `@vitest/eslint-plugin` | `^1.6.25` |
| `commitlint` | `^21.2.1` |
| `conventional-changelog-writer` | `^9.2.0` |
| `eslint` | `^10.8.0` |
| `eslint-plugin-import-x` | `v4.17.1` |
| `eslint-plugin-unicorn` | `v72` |
| `fuse.js` | `^7.5.0` |
| `happy-dom` | `^20.11.1` |
| `lint-staged` | `^17.3.0` |
| `nuxt` | `^4.5.1` |
| `oxlint` | `^1.74.0` |
| `oxlint-tsgolint` | `v7` |
| `pinia` | `v4` |
| `semantic-release` | `^25.0.8` |
| `tailwindcss` | `^4.3.3` |
| `node.js` | `v26.5.1` |
| `oxlint monorepo` | `^1.76.0` |
| `playwright monorepo` | `^1.62.1` |
| `pnpm` | `v11.18.0` |
| `semantic-release monorepo (major)` | `` |
| `vue-language-tools monorepo` | `^3.3.9` |
| `vueuse monorepo` | `^14.4.0` |

## 1.0.0 (2026-07-08)

### 📖 Docs

* **agents:** setup agent dev workflow ([309d281](https://github.com/antoinezanardi/goat-it-web-game/commit/309d2817a84b7b3f22e953a7ec7b228fe959d3dd))

### 🧹 Chore

* **project:** setup whole infra ([#2](https://github.com/antoinezanardi/goat-it-web-game/issues/2)) ([fb625cd](https://github.com/antoinezanardi/goat-it-web-game/commit/fb625cd08dd028278cbf687a41ccc8e5bffdddca))
