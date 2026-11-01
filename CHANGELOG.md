# 🐐👑 Goat It Web Game Versioning Changelog

## [1.11.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.10.0...v1.11.0) (2026-11-01)

### 🚀 Features

* **changelog:** enhance entry points and release history UX ([#595](https://github.com/antoinezanardi/goat-it-web-game/issues/595)) ([04f57f3](https://github.com/antoinezanardi/goat-it-web-game/commit/04f57f3a18a3d0e325d6bfd2a92b19b14dfba399))
* **goat-audit:** add 20-category audit skill, agent and command ([#592](https://github.com/antoinezanardi/goat-it-web-game/issues/592)) ([a15af2b](https://github.com/antoinezanardi/goat-it-web-game/commit/a15af2bec031c75d1aa874d4c9c188dbd4cf87e9))
* **health:** add root liveness and readiness probes ([#583](https://github.com/antoinezanardi/goat-it-web-game/issues/583)) ([6fdf497](https://github.com/antoinezanardi/goat-it-web-game/commit/6fdf497f5f11b5ab2749c31c2cf2007fc35bac1d))
* **observability:** add Sentry tracking, structured logs and uptime runbook ([#584](https://github.com/antoinezanardi/goat-it-web-game/issues/584)) ([74d6a03](https://github.com/antoinezanardi/goat-it-web-game/commit/74d6a03ee99d9af290f3b8a04ddb22284fba7b0b))
* **pwa:** add offline fallback and connectivity status ([#567](https://github.com/antoinezanardi/goat-it-web-game/issues/567)) ([455cab3](https://github.com/antoinezanardi/goat-it-web-game/commit/455cab3704526008b238b0eabd16a42c50cfd260))
* **security:** rate limiting, hardened fetch pipeline, CSP, excluded ids cap and error messages ([#528](https://github.com/antoinezanardi/goat-it-web-game/issues/528)) ([76fe41a](https://github.com/antoinezanardi/goat-it-web-game/commit/76fe41aa67ab8ef4bb80b62caf773bb31635f236))
* **seo:** add organization identity and localized social image alt ([#549](https://github.com/antoinezanardi/goat-it-web-game/issues/549)) ([1182298](https://github.com/antoinezanardi/goat-it-web-game/commit/11822987dfa3f94d5cd70012992494d2a02d8e22))

### 🐛 Bug Fixes

* **api:** validate payloads, cap limits and fail fast on invalid env ([#523](https://github.com/antoinezanardi/goat-it-web-game/issues/523)) ([2db3905](https://github.com/antoinezanardi/goat-it-web-game/commit/2db39054af1328270198f4396a22c6de434483b5)), closes [#456](https://github.com/antoinezanardi/goat-it-web-game/issues/456) [#457](https://github.com/antoinezanardi/goat-it-web-game/issues/457) [#458](https://github.com/antoinezanardi/goat-it-web-game/issues/458)
* audit bug bundle (staging SEO, game error/empty states, tutorial focus) ([#536](https://github.com/antoinezanardi/goat-it-web-game/issues/536)) ([2f3fd64](https://github.com/antoinezanardi/goat-it-web-game/commit/2f3fd64363c7c82ccdaa9f59f332397423f38b24)), closes [#467](https://github.com/antoinezanardi/goat-it-web-game/issues/467) [#468](https://github.com/antoinezanardi/goat-it-web-game/issues/468) [#469](https://github.com/antoinezanardi/goat-it-web-game/issues/469) [#499](https://github.com/antoinezanardi/goat-it-web-game/issues/499)
* **ci:** whitelist NUXT_SITE_ENV in built output secrets scan ([#547](https://github.com/antoinezanardi/goat-it-web-game/issues/547)) ([71344c9](https://github.com/antoinezanardi/goat-it-web-game/commit/71344c91ea1a4e4531b66efe6e1b313d99cc5c04))
* **core:** add request identity, cancellation and latest-wins semantics to async actions ([#560](https://github.com/antoinezanardi/goat-it-web-game/issues/560)) ([9a51696](https://github.com/antoinezanardi/goat-it-web-game/commit/9a516962895f46faceefc5dbbb284bcc6c73d719)), closes [#470](https://github.com/antoinezanardi/goat-it-web-game/issues/470)
* **docker:** copy sentry config entrypoints into the image ([d27270e](https://github.com/antoinezanardi/goat-it-web-game/commit/d27270e7b9d60b4ade949aecf461e92aaff22234))
* **game:** wrap card text, gate shortcuts, and enforce state ownership ([#563](https://github.com/antoinezanardi/goat-it-web-game/issues/563)) ([6feb6a5](https://github.com/antoinezanardi/goat-it-web-game/commit/6feb6a5c06414cd6337de21dbd0ac917a244dbc1))
* **sentry:** scrub nuxt context path and add error tags ([#588](https://github.com/antoinezanardi/goat-it-web-game/issues/588)) ([f3508e3](https://github.com/antoinezanardi/goat-it-web-game/commit/f3508e3490f6517e9b4d01055de78f59536c4dee))
* small bug bundle (source URLs, locale suggestion, cookies, components) ([#535](https://github.com/antoinezanardi/goat-it-web-game/issues/535)) ([ffc2744](https://github.com/antoinezanardi/goat-it-web-game/commit/ffc2744d4c7b6bf9bf9305b8d0b64dcaa3ee4943)), closes [#461](https://github.com/antoinezanardi/goat-it-web-game/issues/461) [#474](https://github.com/antoinezanardi/goat-it-web-game/issues/474) [#484](https://github.com/antoinezanardi/goat-it-web-game/issues/484) [#501](https://github.com/antoinezanardi/goat-it-web-game/issues/501)
* **ssr:** guard tutorial and lazy-load the changelog query ([#566](https://github.com/antoinezanardi/goat-it-web-game/issues/566)) ([3845b6a](https://github.com/antoinezanardi/goat-it-web-game/commit/3845b6a43f7d36a6bdbeffd629534e22e1c9abe9))

### 📖 Docs

* **changelog:** add end-user changelog for v1.11.0 ([#596](https://github.com/antoinezanardi/goat-it-web-game/issues/596)) ([370ee91](https://github.com/antoinezanardi/goat-it-web-game/commit/370ee918582c5740ef5e9a2fbdcc87b199e6d6b0))
* **jsdoc:** document public logic APIs and add quality guard ([#564](https://github.com/antoinezanardi/goat-it-web-game/issues/564)) ([89c4295](https://github.com/antoinezanardi/goat-it-web-game/commit/89c429586c26d6afd78b81825c42fa7d60d9ae52))

### 🔩 Refactor

* **api:** consolidate server helper hygiene ([#527](https://github.com/antoinezanardi/goat-it-web-game/issues/527)) ([e340a0d](https://github.com/antoinezanardi/goat-it-web-game/commit/e340a0de55067d047db098d82628786eba0ffbeb)), closes [#488](https://github.com/antoinezanardi/goat-it-web-game/issues/488)
* **env:** validate the app runtime config with a single Zod schema ([#591](https://github.com/antoinezanardi/goat-it-web-game/issues/591)) ([631c025](https://github.com/antoinezanardi/goat-it-web-game/commit/631c025ad39ae811273b1982cefcf5ebdd740d33))
* **game:** decompose game state architecture into focused units ([#534](https://github.com/antoinezanardi/goat-it-web-game/issues/534)) ([11aab35](https://github.com/antoinezanardi/goat-it-web-game/commit/11aab356de5ffeccbf987aa426a34f8d8f381098)), closes [#485](https://github.com/antoinezanardi/goat-it-web-game/issues/485) [#476](https://github.com/antoinezanardi/goat-it-web-game/issues/476) [#483](https://github.com/antoinezanardi/goat-it-web-game/issues/483) [#479](https://github.com/antoinezanardi/goat-it-web-game/issues/479) [#478](https://github.com/antoinezanardi/goat-it-web-game/issues/478) [#480](https://github.com/antoinezanardi/goat-it-web-game/issues/480)
* **game:** extract game state renderer and merge card sections ([#546](https://github.com/antoinezanardi/goat-it-web-game/issues/546)) ([9c21174](https://github.com/antoinezanardi/goat-it-web-game/commit/9c21174f571f767f06ba83213c5b064c75756593))
* **repositories:** validate internal API responses with zod ([#565](https://github.com/antoinezanardi/goat-it-web-game/issues/565)) ([f8a98b6](https://github.com/antoinezanardi/goat-it-web-game/commit/f8a98b6de06f2ae3bb1a033e23329d2a718d782a))
* small hygiene bundle (content loop, SSR await, ring one-shot, DocsToc hook, perf, deps) ([#530](https://github.com/antoinezanardi/goat-it-web-game/issues/530)) ([3a2923c](https://github.com/antoinezanardi/goat-it-web-game/commit/3a2923c53c0df827913386ac5fd9fdb986cda60b)), references [#510](https://github.com/antoinezanardi/goat-it-web-game/issues/510) [#472](https://github.com/antoinezanardi/goat-it-web-game/issues/472) [#473](https://github.com/antoinezanardi/goat-it-web-game/issues/473) [#481](https://github.com/antoinezanardi/goat-it-web-game/issues/481) [#495](https://github.com/antoinezanardi/goat-it-web-game/issues/495) [#511](https://github.com/antoinezanardi/goat-it-web-game/issues/511)
* state project conventions and architecture ([#531](https://github.com/antoinezanardi/goat-it-web-game/issues/531)) ([53d1547](https://github.com/antoinezanardi/goat-it-web-game/commit/53d154752851943691f3a031ca933d5d26975302))
* **ui:** extract a shared status screen component ([#572](https://github.com/antoinezanardi/goat-it-web-game/issues/572)) ([cb5fc71](https://github.com/antoinezanardi/goat-it-web-game/commit/cb5fc717baed49a1f164057fcf958485583d1f32))

### ⚡️ Performance

* **bundle:** lazy-load GSAP core on the game route and drop unused plugins ([#559](https://github.com/antoinezanardi/goat-it-web-game/issues/559)) ([c252b47](https://github.com/antoinezanardi/goat-it-web-game/commit/c252b4775c9a8ca549c3a51f95d0cd6af3d04c2d))
* **pwa:** slim precache, localize manifest and add iOS safe areas ([#570](https://github.com/antoinezanardi/goat-it-web-game/issues/570)) ([9b110c7](https://github.com/antoinezanardi/goat-it-web-game/commit/9b110c7b15d93c97d164b7bbcaed8ff35f57447a))

### ✅ Tests

* **acceptance:** wait for full nuxt hydration before interactions ([#589](https://github.com/antoinezanardi/goat-it-web-game/issues/589)) ([7323a17](https://github.com/antoinezanardi/goat-it-web-game/commit/7323a175f282535d6cd3ffa93b41853a808f92cd))
* **pwa:** increase random-question failure timeout ([747b435](https://github.com/antoinezanardi/goat-it-web-game/commit/747b4359e12020af9f5c63b90f6dfe99c46373dc))
* **seo:** lock the runtime <html lang> locale update with a regression test ([#525](https://github.com/antoinezanardi/goat-it-web-game/issues/525)) ([264fa71](https://github.com/antoinezanardi/goat-it-web-game/commit/264fa71198b05181ea796e5a653b5cae947f0cc2)), closes [#496](https://github.com/antoinezanardi/goat-it-web-game/issues/496)
* stabilize unit suite and raise acceptance step timeout ([#544](https://github.com/antoinezanardi/goat-it-web-game/issues/544)) ([85d2b80](https://github.com/antoinezanardi/goat-it-web-game/commit/85d2b8005af26149ce5e1d1e4e8e79c54a00474a))
* unify acceptance tags and test infrastructure hygiene ([#556](https://github.com/antoinezanardi/goat-it-web-game/issues/556)) ([7e6e444](https://github.com/antoinezanardi/goat-it-web-game/commit/7e6e444b04d87623f91f5e81f1acbf3af7c1fc29))

### 🔁 CI

* **acceptance:** cache Playwright browsers and drop redundant apt installs ([#576](https://github.com/antoinezanardi/goat-it-web-game/issues/576)) ([f8638e5](https://github.com/antoinezanardi/goat-it-web-game/commit/f8638e5356ab349a4300af6be3b61dca1cda9216))
* **build:** enforce client bundle-size budgets and report PR comparison ([#580](https://github.com/antoinezanardi/goat-it-web-game/issues/580)) ([7232564](https://github.com/antoinezanardi/goat-it-web-game/commit/7232564da146d9ff20ed9749931503df262f3a5d))
* **security:** verify deploy host keys, pin actions by SHA, add supply-chain cooldown and audit job ([#522](https://github.com/antoinezanardi/goat-it-web-game/issues/522)) ([5392da2](https://github.com/antoinezanardi/goat-it-web-game/commit/5392da2d9beea19b9d55cf607fc58e5d32dcf79a))

### 🧹 Chore

* batch repo hygiene, test docs and UI constant follow-ups ([#553](https://github.com/antoinezanardi/goat-it-web-game/issues/553)) ([4f4c749](https://github.com/antoinezanardi/goat-it-web-game/commit/4f4c74911324912345b05af90ec9a2fe51b2cba9)), closes [#514](https://github.com/antoinezanardi/goat-it-web-game/issues/514) [#503](https://github.com/antoinezanardi/goat-it-web-game/issues/503) [#509](https://github.com/antoinezanardi/goat-it-web-game/issues/509) [#502](https://github.com/antoinezanardi/goat-it-web-game/issues/502)
* **docker:** stop baking secrets into images and harden build hygiene ([#520](https://github.com/antoinezanardi/goat-it-web-game/issues/520)) ([dd895f6](https://github.com/antoinezanardi/goat-it-web-game/commit/dd895f668cb9957c6a9ca81c81c396aa727991fb))
* sync release v1.10.0 from main ([90e8713](https://github.com/antoinezanardi/goat-it-web-game/commit/90e8713c1c19adf67e47ad820be51de3babd5c69))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `commitlint monorepo` | `^21.2.4` |
| `@axe-core/playwright` | `^4.14.0` |
| `@goat-it/schemas` | `^0.0.26` |
| `@iconify-json/lucide` | `^1.2.147` |
| `@nuxt/test-utils` | `^4.3.4` |
| `@nuxt/ui` | `^4.12.0` |
| `@semantic-release/npm` | `^13.2.0` |
| `@types/node` | `v26` |
| `@vitest/eslint-plugin` | `^1.6.28` |
| `eslint` | `^10.13.0` |
| `eslint-plugin-unicorn` | `v79` |
| `happy-dom` | `^21.0.4` |
| `nuxt` | `^4.6.3` |
| `oxlint-tsgolint` | `^7.0.2005` |
| `radashi` | `v13` |
| `vite` | `^8.3.5` |
| `docker/login-action digest` | `81c6f93` |
| `github/codeql-action digest` | `9b32540` |
| `node.js` | `v26.13.0` |
| `oxlint monorepo` | `^1.90.0` |
| `pnpm` | `v12.16.1` |
| `sentry-javascript monorepo` | `^11.10.0` |
| `sonarsource/sonarqube-scan-action action` | `v8.4` |

## [1.10.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.9.0...v1.10.0) (2026-10-16)

### 🚀 Features

* **changelog:** add localized end-user changelog experience ([#439](https://github.com/antoinezanardi/goat-it-web-game/issues/439)) ([2a0a2c4](https://github.com/antoinezanardi/goat-it-web-game/commit/2a0a2c479fa10d74805040280182a5a8c4f445b7))
* **game:** add adult content option to game settings ([#375](https://github.com/antoinezanardi/goat-it-web-game/issues/375)) ([8b211d7](https://github.com/antoinezanardi/goat-it-web-game/commit/8b211d7e9bb2e8a64786671af3fb397fd844b22c))
* **game:** add category and theme filters to the game questions filters modal ([#416](https://github.com/antoinezanardi/goat-it-web-game/issues/416)) ([2fa159e](https://github.com/antoinezanardi/goat-it-web-game/commit/2fa159e57598f044a602bbd6eb9e4e1e3045c68b))
* **game:** apply game settings changes when the settings modal closes ([#385](https://github.com/antoinezanardi/goat-it-web-game/issues/385)) ([a2cbd99](https://github.com/antoinezanardi/goat-it-web-game/commit/a2cbd9928835c24c0134bc4ecf7a293dd96462cb))
* **game:** filter questions by cognitive difficulty ([#401](https://github.com/antoinezanardi/goat-it-web-game/issues/401)) ([d485489](https://github.com/antoinezanardi/goat-it-web-game/commit/d485489d47f08d83677a78f0199215a33349f0cc))
* **game:** guard question filter drafts and refine filters modal UX ([#410](https://github.com/antoinezanardi/goat-it-web-game/issues/410)) ([a505d53](https://github.com/antoinezanardi/goat-it-web-game/commit/a505d53662ea6fec4e70ac918c932393432bd1b7))
* **game:** improve question filters discoverability ([#404](https://github.com/antoinezanardi/goat-it-web-game/issues/404)) ([449cd74](https://github.com/antoinezanardi/goat-it-web-game/commit/449cd741bd249450a91fa8f4447f1887b7bfd268))
* **game:** move question filters into a dedicated apply modal ([#403](https://github.com/antoinezanardi/goat-it-web-game/issues/403)) ([5c36606](https://github.com/antoinezanardi/goat-it-web-game/commit/5c3660657b59daede1681e404cf1e995f950501e))
* **game:** persist game settings across reloads ([#378](https://github.com/antoinezanardi/goat-it-web-game/issues/378)) ([9e32b8c](https://github.com/antoinezanardi/goat-it-web-game/commit/9e32b8c8fbd951f23ec10d2d5f1c05756f4d2f0c))
* **game:** show an adult content badge on the question card ([#372](https://github.com/antoinezanardi/goat-it-web-game/issues/372)) ([5bf3b33](https://github.com/antoinezanardi/goat-it-web-game/commit/5bf3b333566fc35f87ad880ed7bd6a2ff823e5c8))

### 📖 Docs

* **changelog:** add end-user changelog for v1.10.0 ([#517](https://github.com/antoinezanardi/goat-it-web-game/issues/517)) ([d407270](https://github.com/antoinezanardi/goat-it-web-game/commit/d407270b4da00d73d7cd8a10f1b316a7650e8149))
* **changelogs:** add opencode command for generating changelog entries ([#516](https://github.com/antoinezanardi/goat-it-web-game/issues/516)) ([5b83fe1](https://github.com/antoinezanardi/goat-it-web-game/commit/5b83fe15eaa29ef72f4017e3d4b18c68ece9b45f))

### ⚡️ Performance

* **build:** replace runtime og image with static asset ([#452](https://github.com/antoinezanardi/goat-it-web-game/issues/452)) ([d8913c4](https://github.com/antoinezanardi/goat-it-web-game/commit/d8913c47288f75ad361561f325dc6a86827eaf2e))
* **build:** shrink deploy artifacts and harden upstream fetches ([#450](https://github.com/antoinezanardi/goat-it-web-game/issues/450)) ([3adabd3](https://github.com/antoinezanardi/goat-it-web-game/commit/3adabd3478e83f112273002b49d2631ff3c4e94e))
* **vitest:** halve warm unit runs with persistent fs module cache ([#445](https://github.com/antoinezanardi/goat-it-web-game/issues/445)) ([9bf8aac](https://github.com/antoinezanardi/goat-it-web-game/commit/9bf8aacef5f54ec52b56918f58e47c93d67aba6e))

### ✅ Tests

* **acceptance:** lint tests command ([#397](https://github.com/antoinezanardi/goat-it-web-game/issues/397)) ([2bb04c9](https://github.com/antoinezanardi/goat-it-web-game/commit/2bb04c9212489e4876e2f7b2360b5982c0b2f6fd))
* **accessibility:** extend acceptance coverage to game states ([#393](https://github.com/antoinezanardi/goat-it-web-game/issues/393)) ([2ca18aa](https://github.com/antoinezanardi/goat-it-web-game/commit/2ca18aa790822983f958be0dc4f82e06bf1eec43))
* fix unit test convention violations across specs ([#388](https://github.com/antoinezanardi/goat-it-web-game/issues/388)) ([a4e3dd5](https://github.com/antoinezanardi/goat-it-web-game/commit/a4e3dd56463139654056d047aa00118e1639eacf))

### 🧹 Chore

* **seo:** upgrade all deps to v6 ([145b016](https://github.com/antoinezanardi/goat-it-web-game/commit/145b016a9e7bad371ad7136f38b934fbaa1fa623))
* sync release v1.9.0 from main ([50abebd](https://github.com/antoinezanardi/goat-it-web-game/commit/50abebd255ce31445b8399d5e91a6040eda3c3b1))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@cucumber/cucumber` | `^13.3.0` |
| `@iconify-json/lucide` | `^1.2.145` |
| `@nuxt/content` | `^3.16.2` |
| `@nuxt/hints` | `^1.1.5` |
| `@nuxt/test-utils` | `^4.3.3` |
| `@nuxtjs/robots` | `^6.2.4` |
| `@nuxtjs/sitemap` | `^9.1.0` |
| `@pinia/nuxt` | `^1.0.3` |
| `@pinia/testing` | `^2.0.2` |
| `@takumi-rs/core` | `^2.16.2` |
| `@tanstack/vue-table` | `^9.3.1` |
| `@types/node` | `^25.9.9` |
| `conventional-changelog-writer` | `^9.3.0` |
| `eslint` | `^10.12.0` |
| `eslint-plugin-oxlint` | `^1.87.0` |
| `eslint-plugin-unicorn` | `v78` |
| `happy-dom` | `v21` |
| `lint-staged` | `^17.6.0` |
| `mongodb` | `^7.7.0` |
| `nuxt` | `^4.6.1` |
| `nuxt-og-image` | `^7.0.7` |
| `nuxt-schema-org` | `^6.4.3` |
| `nuxt-seo-utils` | `^9.0.1` |
| `nuxt-site-config` | `^5.0.3` |
| `oxlint` | `^1.87.0` |
| `oxlint-tsgolint` | `^7.0.2004` |
| `pinia` | `^4.1.0` |
| `unhead` | `^3.4.3` |
| `vite` | `^8.3.4` |
| `zod` | `^4.6.7` |
| `mongo docker tag` | `v9` |
| `node.js` | `v26.12.0` |
| `oxlint monorepo` | `^1.88.0` |
| `playwright monorepo` | `^1.64.1` |
| `pnpm` | `v12.9.1` |
| `sonarsource/sonarqube-scan-action action` | `v8.3` |
| `vitest monorepo` | `^5.0.5` |
| `vue-language-tools monorepo` | `^3.3.13` |

## [1.9.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.8.0...v1.9.0) (2026-09-25)

### 🚀 Features

* **game:** add a settings modal to the game sidebar ([#343](https://github.com/antoinezanardi/goat-it-web-game/issues/343)) ([696835f](https://github.com/antoinezanardi/goat-it-web-game/commit/696835ff18041e18e72adb91abce7e5a062ac00f))
* **game:** navigate questions and tutorial steps with arrow keys ([#340](https://github.com/antoinezanardi/goat-it-web-game/issues/340)) ([7dc1ead](https://github.com/antoinezanardi/goat-it-web-game/commit/7dc1ead3145210bd3ac1a2a65d7384f0b1df72bc))
* **game:** navigate to home page when clicking the sidebar logo ([#337](https://github.com/antoinezanardi/goat-it-web-game/issues/337)) ([b8ed91d](https://github.com/antoinezanardi/goat-it-web-game/commit/b8ed91dfec0bd2d6594771fc382a47a6322f7f30))
* **game:** scroll the question card when the context and trivia accordion opens ([#334](https://github.com/antoinezanardi/goat-it-web-game/issues/334)) ([b80ef25](https://github.com/antoinezanardi/goat-it-web-game/commit/b80ef2576d7c1703d7bd7cf2145988a73e663d9f))

### 🐛 Bug Fixes

* **game:** prevent arrow keys from leaking from the tutorial into question navigation ([#344](https://github.com/antoinezanardi/goat-it-web-game/issues/344)) ([1f282ba](https://github.com/antoinezanardi/goat-it-web-game/commit/1f282ba8890bbfa0885aa4718e4f9eb46df958a8)), closes [#342](https://github.com/antoinezanardi/goat-it-web-game/issues/342)
* **game:** reset questions when re-entering the game page ([#335](https://github.com/antoinezanardi/goat-it-web-game/issues/335)) ([35364a9](https://github.com/antoinezanardi/goat-it-web-game/commit/35364a9a5de1fd9595237171768de29260f64cef))
* **game:** reveal interactive tutorial targets through a backdrop spotlight window ([#333](https://github.com/antoinezanardi/goat-it-web-game/issues/333)) ([ddaa980](https://github.com/antoinezanardi/goat-it-web-game/commit/ddaa980ddca2990b9546bfda14b49b994e81c230))
* **game:** target the context accordion from the clues tutorial step ([#350](https://github.com/antoinezanardi/goat-it-web-game/issues/350)) ([d630e35](https://github.com/antoinezanardi/goat-it-web-game/commit/d630e353f374e46756771a3764b85551ae36d509))

### 🧹 Chore

* sync release v1.8.0 from main ([3f47e48](https://github.com/antoinezanardi/goat-it-web-game/commit/3f47e48e5b3b7a7cf82ce3427fb8259eb6a53199))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `commitlint monorepo` | `^21.2.3` |
| `@iconify-json/lucide` | `^1.2.136` |
| `@nuxt/content` | `^3.16.1` |
| `@nuxt/ui` | `^4.11.2` |
| `eslint-plugin-oxlint` | `^1.85.0` |
| `nuxt-og-image` | `^6.9.0` |
| `oxlint` | `^1.85.0` |
| `oxlint-tsgolint` | `^7.0.2003` |
| `radashi` | `^12.9.6` |
| `vite` | `^8.3.1` |
| `node.js` | `` |
| `oxlint monorepo` | `^1.84.0` |
| `pnpm` | `v12.6.0` |

## [1.8.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.7.0...v1.8.0) (2026-09-19)

### 🚀 Features

* **game-question-card:** sequential bounce+brightness highlight on active card ([#301](https://github.com/antoinezanardi/goat-it-web-game/issues/301)) ([563fb19](https://github.com/antoinezanardi/goat-it-web-game/commit/563fb19ec8c3e48ae11d706bfcaa5e49dff53f5e))
* **game-sidebar:** add locale selector to game sidebar ([#310](https://github.com/antoinezanardi/goat-it-web-game/issues/310)) ([6579d31](https://github.com/antoinezanardi/goat-it-web-game/commit/6579d31d800feb7b3f5a0b80ca5acdd2f6eb63ee))
* **game:** add an interactive tutorial to the game page ([#324](https://github.com/antoinezanardi/goat-it-web-game/issues/324)) ([87dfff3](https://github.com/antoinezanardi/goat-it-web-game/commit/87dfff3cbe7f39f8a762f91ec5283843146bcb62))
* **game:** invite first-time visitors to launch the interactive tutorial ([#327](https://github.com/antoinezanardi/goat-it-web-game/issues/327)) ([86c91fa](https://github.com/antoinezanardi/goat-it-web-game/commit/86c91fac35e39c316dd3fef482e17819ca58e5bb))
* **game:** re-fetch active questions in new locale on language change ([#320](https://github.com/antoinezanardi/goat-it-web-game/issues/320)) ([f9af57b](https://github.com/antoinezanardi/goat-it-web-game/commit/f9af57b4bfef07de9f967cad8041abb406b5e2df))

### 🐛 Bug Fixes

* **game-question-card:** prevent highlight cropping and dev vue-tsc error ([#309](https://github.com/antoinezanardi/goat-it-web-game/issues/309)) ([07405ee](https://github.com/antoinezanardi/goat-it-web-game/commit/07405ee3ff8bb6ac190b26b1c8b8bfd48e140260))

### 🧹 Chore

* sync release v1.7.0 from main ([2317b4e](https://github.com/antoinezanardi/goat-it-web-game/commit/2317b4e0d04b123dddb03c890eba9d1c7fd8511f))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@eslint/config-inspector` | `^3.5.0` |
| `@iconify-json/lucide` | `^1.2.134` |
| `@nuxtjs/robots` | `^6.2.3` |
| `@takumi-rs/core` | `^2.14.0` |
| `@types/node` | `^25.9.8` |
| `@vue/test-utils` | `^2.5.1` |
| `eslint` | `^10.11.0` |
| `eslint-plugin-unicorn` | `v76` |
| `nuxt-og-image` | `^6.8.0` |
| `nuxt-schema-org` | `^6.3.2` |
| `nuxt-seo-utils` | `^8.5.1` |
| `oxlint-tsgolint` | `^7.0.2002` |
| `radashi` | `^12.9.5` |
| `type-fest` | `^5.10.0` |
| `unhead` | `^3.4.1` |
| `zod` | `^4.6.5` |
| `node.js` | `` |
| `oxlint monorepo` | `^1.83.0` |
| `pnpm` | `v12.4.2` |
| `vitest monorepo` | `^5.0.1` |
| `vueuse monorepo` | `v15` |

## [1.7.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.6.1...v1.7.0) (2026-09-12)

### 🚀 Features

* **icons:** bundle all icons client-side via auto-scan ([#275](https://github.com/antoinezanardi/goat-it-web-game/issues/275)) ([caeb0b6](https://github.com/antoinezanardi/goat-it-web-game/commit/caeb0b6569d24f6bf1b402f25cfa784ad571cf40))

### 🐛 Bug Fixes

* **game:** hide empty context accordion and extract trivia content section ([#290](https://github.com/antoinezanardi/goat-it-web-game/issues/290)) ([4f25dae](https://github.com/antoinezanardi/goat-it-web-game/commit/4f25daed1d6a93152de7bf39f55813a0ab670efc))
* **game:** stabilize flaky question-card acceptance tests ([#289](https://github.com/antoinezanardi/goat-it-web-game/issues/289)) ([a8aea59](https://github.com/antoinezanardi/goat-it-web-game/commit/a8aea597f79fb7fe2e71f8f600093a2a2f26a43e))
* **server:** use configured default locale for Accept-Language fallback ([#279](https://github.com/antoinezanardi/goat-it-web-game/issues/279)) ([ff14f42](https://github.com/antoinezanardi/goat-it-web-game/commit/ff14f422112cc6cc113637981c7c208b87a2c31a))

### ⚡️ Performance

* **game:** eliminate question-card slide stutter on low-end devices ([#287](https://github.com/antoinezanardi/goat-it-web-game/issues/287)) ([ec58e2f](https://github.com/antoinezanardi/goat-it-web-game/commit/ec58e2f4e0c11c8ca8ca7c82c803e748ce6da3fb))

### 🧹 Chore

* **plan-writer:** add batch writing strategy for large plans ([#251](https://github.com/antoinezanardi/goat-it-web-game/issues/251)) ([f5e5c6a](https://github.com/antoinezanardi/goat-it-web-game/commit/f5e5c6a0b46d0b042f776a12aa1c701f33428181))
* **plan-writer:** use snippet-only modify steps and mirror admin models ([#273](https://github.com/antoinezanardi/goat-it-web-game/issues/273)) ([2aee965](https://github.com/antoinezanardi/goat-it-web-game/commit/2aee9656da332650120df8e57e926cd590fb5782))
* sync release v1.6.1 from main ([f6e78d7](https://github.com/antoinezanardi/goat-it-web-game/commit/f6e78d71290ff2bcfdccb37d2a78a1492dda22ce))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@eslint/config-inspector` | `^3.4.1` |
| `@goat-it/schemas` | `^0.0.24` |
| `@iconify-json/lucide` | `^1.2.131` |
| `@nuxt/content` | `^3.16.0` |
| `@nuxt/test-utils` | `^4.3.2` |
| `@nuxt/ui` | `^4.11.1` |
| `@nuxtjs/robots` | `^6.2.2` |
| `@nuxtjs/sitemap` | `^8.5.1` |
| `@takumi-rs/core` | `^2.13.7` |
| `@tanstack/vue-table` | `^9.2.4` |
| `@types/node` | `^25.9.6` |
| `@vue/test-utils` | `^2.5.0` |
| `eslint` | `^10.10.0` |
| `eslint-plugin-unicorn` | `v74` |
| `happy-dom` | `^20.14.5` |
| `lint-staged` | `^17.5.1` |
| `nuxt-seo-utils` | `^8.5.0` |
| `nuxtseo-layer-devtools` | `^5.3.16` |
| `radashi` | `^12.9.2` |
| `type-fest` | `^5.9.0` |
| `vite` | `^8.3.0` |
| `zod` | `^4.6.2` |
| `node.js` | `v26.8.2` |
| `oxlint monorepo` | `^1.82.0` |
| `playwright monorepo` | `^1.63.0` |
| `pnpm` | `v12.4.1` |
| `vitest monorepo` | `v5` |

## [1.6.1](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.6.0...v1.6.1) (2026-08-27)

### 🧹 Chore

* sync release v1.6.0 from main ([fd18906](https://github.com/antoinezanardi/goat-it-web-game/commit/fd18906c9ad830bff62c7f6f7e2496d31cc81d78))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@tanstack/vue-table` | `^9.2.3` |
| `happy-dom` | `^20.11.8` |
| `nuxt-schema-org` | `^6.3.1` |
| `node.js` | `v26.8.1` |

## [1.6.0](https://github.com/antoinezanardi/goat-it-web-game/compare/v1.5.0...v1.6.0) (2026-08-26)

### 🚀 Features

* **game:** add collapsible sidebar to game page ([#210](https://github.com/antoinezanardi/goat-it-web-game/issues/210)) ([4b689f1](https://github.com/antoinezanardi/goat-it-web-game/commit/4b689f146ae70be072c1cce087832d465c75ddbe))
* **locale:** add browser locale suggestion toast and cookie-based SSR resolution ([#222](https://github.com/antoinezanardi/goat-it-web-game/issues/222)) ([84f5f44](https://github.com/antoinezanardi/goat-it-web-game/commit/84f5f4401e6e29ff06988e2ecde5948925c84461))
* **rules:** add start-game button, sidebar link, example round and translation fixes ([#217](https://github.com/antoinezanardi/goat-it-web-game/issues/217)) ([cbb5641](https://github.com/antoinezanardi/goat-it-web-game/commit/cbb5641d1072901697f5d23138275eed20e9e39a))

### 🐛 Bug Fixes

* **ci:** remove skip ci token from sync-develop merge message ([#207](https://github.com/antoinezanardi/goat-it-web-game/issues/207)) ([a849f0a](https://github.com/antoinezanardi/goat-it-web-game/commit/a849f0a02d5d09525ae337f5381251845bd2b2e0))

### 📖 Docs

* **opencode:** improve agentic workflow review handling ([#208](https://github.com/antoinezanardi/goat-it-web-game/issues/208)) ([e93f0ee](https://github.com/antoinezanardi/goat-it-web-game/commit/e93f0eeab0a857472369cb88c8b51dc1bd6d8f86))
* **testing:** align unit-testing references with lint checklist and harden agent workflow ([#216](https://github.com/antoinezanardi/goat-it-web-game/issues/216)) ([cb2106e](https://github.com/antoinezanardi/goat-it-web-game/commit/cb2106e8bf365986066846c438c59cb828f90195))

### 🔩 Refactor

* **tests:** remove unworthy tests in nuxt test suite ([#211](https://github.com/antoinezanardi/goat-it-web-game/issues/211)) ([007c594](https://github.com/antoinezanardi/goat-it-web-game/commit/007c5945f2caa01f8a2f9f46cb560ecdd6e007b0))

### 🧹 Chore

* sync release v1.5.0 from main ([8b9087e](https://github.com/antoinezanardi/goat-it-web-game/commit/8b9087e7c263cb440989d428e878f8a735e58ae8))

### 📦 Upgraded Dependencies

| Package | Version |
| --- | :---: |
| `@iconify-json/lucide` | `^1.2.126` |
| `@takumi-rs/core` | `^2.12.0` |
| `eslint` | `^10.9.1` |
| `eslint-plugin-oxlint` | `^1.80.0` |
| `mongodb` | `^7.6.0` |
| `nuxt-seo-utils` | `^8.4.3` |
| `oxlint` | `^1.80.0` |
| `pnpm` | `v11.24.0` |

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
