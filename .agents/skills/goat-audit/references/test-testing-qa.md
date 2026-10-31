# TEST — Testing & quality assurance

Effectiveness and reliability of the Goat It web game test suites: the test strategy and risk coverage across the six Vitest projects (`nuxt`, `composables`, `stores`, `repositories`, `node`, `dom`) and the Cucumber + Playwright acceptance suite that runs against the built Nuxt app and the Dockerized Goat It API sandbox; unit assertion quality, determinism and isolation; what the 100 % aggregate coverage gate does and does not prove, and mutation testing; mocking discipline at the Nuxt/Nitro boundaries; acceptance locators, waits, hydration, data isolation and flakiness; the browser, device, locale and timezone matrix; visual, load and security test types; the CI test infrastructure (reports, sandbox, environment parity, quarantine); drift between the testing guides and the suites. Per-file spec and step conventions are audited by `/lint-unit-tests` and `/lint-acceptance-tests`, not here. Checks titled `(strategy)` are the only TEST checks applied in diff mode.

**Decision doc:** `docs/acceptance-testing.md` when the evidence is under `tests/acceptance/**` or concerns E2E/visual/load testing, else `docs/unit-testing.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** CI pipeline hardening, quality-gate wiring, `continue-on-error` neutralization, required status checks, CodeQL/SAST → CICD · axe rule set, WCAG tags, scanned pages × states × viewports, axe exclusions, keyboard and focus criteria → A11Y · Lighthouse CI assertions and bundle-size budgets → PERF · security header, CSP, rate-limit and body-guard behaviour itself → SEC · dependency and secret scanning → SUP · runtime upstream DTO validation and degradation → REL · translation parity specs → I18N · spec placement, source/spec companions and Vitest routing by suffix → ARCH · general ESLint/Oxlint parity and TypeScript strictness → CODE · README/CONTRIBUTING invariants and generic docs drift → DOCS · per-file spec and step conventions → `/lint-unit-tests` and `/lint-acceptance-tests` (the audit does not duplicate them)

## Contents

- [1. Strategy and risk coverage](#1-strategy-and-risk-coverage)
- [2. Unit test quality](#2-unit-test-quality)
- [3. Coverage meaning and mutation testing](#3-coverage-meaning-and-mutation-testing)
- [4. Mocking discipline](#4-mocking-discipline)
- [5. Acceptance quality and flakiness](#5-acceptance-quality-and-flakiness)
- [6. Browser and device matrix](#6-browser-and-device-matrix)
- [7. Accessibility, visual, load and security test types](#7-accessibility-visual-load-and-security-test-types)
- [8. CI test infrastructure](#8-ci-test-infrastructure)
- [9. Test-docs drift](#9-test-docs-drift)
- [10. Per-file convention sweep](#10-per-file-convention-sweep)
- [Sources](#sources)

## 1. Strategy and risk coverage

- **[TEST-01] Documented layered test strategy** — `docs/unit-testing.md` and `docs/acceptance-testing.md` together state which risk each layer covers (the six Vitest projects, Cucumber scenarios against the built app and the API sandbox, axe scans, manual checks), that the 100 % coverage gate is a floor, not proof of test effectiveness, and a dated register of every deliberately untested area with a tracking issue or accepted-risk note each.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/unit-testing.md`, `docs/acceptance-testing.md` · Src: [14], [10], [1], [12], project: docs/architecture.md §8
- **[TEST-02] Every route has an acceptance scenario (strategy)** — Every page under `app/pages/**` (`/`, `/game`, `/rules`, `/offline`) and every root route under `server/routes/**` (`/healthz`, `/readyz`) is visited or requested by at least one `.feature` scenario, or is excluded with a reason in `docs/acceptance-testing.md`; a diff adding a page or root route adds its scenario.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/pages/**/*.vue`, `server/routes/**`, `tests/acceptance/features/**/*.feature` · Src: [10], [11]
- **[TEST-03] New user-facing behaviour has an acceptance scenario (strategy)** — A change that adds or alters user-visible behaviour (a page state, flow, modal, toast, shortcut, setting or route) adds or updates a scenario in the matching `tests/acceptance/features/<domain>/` feature that asserts the visible outcome.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/**/*.feature`, `app/**/*.vue` · Src: [14], [1], project: docs/acceptance-testing.md §10
- **[TEST-04] Bug fix carries a regression test (strategy)** — A `fix:` change adds or modifies a unit spec or acceptance scenario that fails without the fix and whose title names the fixed condition (`should <expected> when <failing condition>.`); of the last 20 `fix:` commits on the default branch, every commit touching `app/`, `server/` or `shared/` also touches a `*.spec.ts` or `*.feature`, with exceptions justified in the commit or pull request.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `**/*.spec.ts`, `tests/acceptance/features/**/*.feature` · Src: [14], [1]
- **[TEST-05] Unhappy paths tested per boundary (strategy)** — For every upstream-dependent flow, upstream 4xx/5xx, timeout, empty collection, offline, `429` and invalid input each have at least one unit spec or acceptance scenario; a change adding a failure branch in a handler, repository, store or composable adds the test for that branch.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**`, `app/repositories/**`, `app/stores/**`, `tests/acceptance/features/**/*.feature` · Src: [1], [14]
- **[TEST-06] Contract changes update their specs (strategy)** — A change to a schema under `shared/schemas/**` or a mapper under `server/utils/goat-it-api/mappers/**` updates the matching spec with a valid-path case and a malformed-payload case covering the changed field.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/schemas/**`, `server/utils/goat-it-api/mappers/**` · Src: [14], [1], project: docs/unit-testing.md §6.10
- **[TEST-07] No unit test reaches the real network** — No spec in any Vitest project performs a real HTTP call: `$fetch` stays stubbed by `tests/unit/setup/nuxt/fetch.nuxt.unit-setup.ts`, repository specs inject `vi.fn<$Fetch>()`, and helpers whose only outbound seam is the global `fetch` stub it in the spec.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `**/*.spec.ts`, `tests/unit/setup/**` · Src: [1], [5], project: docs/unit-testing.md §4

## 2. Unit test quality

- **[TEST-08] Assertion, focus and structure guards enforced** — `vitest/expect-expect`, `vitest/no-focused-tests`, `vitest/no-disabled-tests`, `vitest/max-expects` (`max: 1`), `vitest/valid-title` (`/^should .+ when .+\S\.$/`), `vitest/require-top-level-describe`, `vitest/no-conditional-expect`, `vitest/no-conditional-in-test` and `vitest/hoisted-apis-on-top` are `error` in both unit-test lint configs, so assertion-free tests, `.only`, `.skip`, `.todo` and structural violations cannot land.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/eslint/flat-configs/eslint-unit-tests.config.ts`, `oxlint.config.jsonc` · Src: [1], project: docs/unit-testing.md §10
- **[TEST-09] No tautological or existence-only assertions** — No spec asserts `expect(true).toBe(true)` or uses `toBeDefined()` as proof of behaviour; value-returning units are asserted against the exact expected value with `toStrictEqual`/`toBe`, `toBeTruthy()` is used only on boolean results such as `wrapper.exists()`, and no spec snapshots component HTML or JSON blobs (inline snapshots, when used, are short intentional fragments of at most 7 lines).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `**/*.spec.ts` · Src: [1], project: docs/unit-testing.md §10
- **[TEST-10] Error assertions are specific** — Error-path tests assert the error class or message (`await expect(promise).rejects.toThrow(ZodError)`, `toThrowError("…")`, or the asserted `createError` payload), never a bare `rejects.toThrow()` that any failure satisfies.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `**/*.spec.ts` · Src: [1], project: docs/unit-testing.md §10
- **[TEST-11] Time is controlled explicitly** — Every Vitest project runs with `env: { TZ: "UTC" }`, and every spec touching dates, timers or `requestAnimationFrame` installs `vi.useFakeTimers()`/`vi.setSystemTime()` in the test or its `beforeEach` and restores `vi.useRealTimers()` in `afterEach`; no assertion depends on the real clock.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/vitest/vitest.config.constants.ts`, `**/*.spec.ts` · Src: [15], [5], project: docs/unit-testing.md §4
- **[TEST-12] Faketory outcomes are deterministic** — Every field an assertion or branch depends on is passed explicitly through the faketory `Partial<T>` override (`createFakeQuestion({ … })`) or faker is seeded with `faker.seed(<n>)`, so no test outcome depends on an unseeded random value.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/unit/utils/faketories/**`, `**/*.spec.ts` · Src: [1], [15], project: docs/unit-testing.md §9
- **[TEST-13] Isolation flags on every project** — `mockReset: true`, `clearMocks: true` and `restoreMocks: true` are set in the shared inline config inherited by all six Vitest projects, including those running with `isolate: false`; every `vi.stubGlobal`/`vi.stubEnv` in a spec is paired with `vi.unstubAllGlobals()`/`vi.unstubAllEnvs()` in `afterEach`, or the project sets `unstubGlobals`/`unstubEnvs` (both default `false`), with setup-file stubs re-applied per `beforeEach` exempt (verified: vitest 5.0.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/vitest/vitest.config.constants.ts`, `configs/vitest/vitest.config.projects.constants.ts` · Src: [5], project: AGENTS.md
- **[TEST-14] Specs and scenarios are order-independent and stable** — `pnpm run test:unit --sequence.shuffle` passes for every project, a sample of five specs per project passes when run alone with `pnpm run test:unit <file>`, and three consecutive `pnpm run test:acceptance:skip-build` runs on the same fresh build are all green with no intermittently failing scenario (verified: vitest 5.0.5).
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [15], [9], [13]
- **[TEST-15] Async assertions are awaited** — `vitest/valid-expect`, `vitest/valid-expect-in-promise` and `no-floating-promises` apply to spec files, and every `.resolves`/`.rejects` assertion and async helper call in a spec is awaited.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/flat-configs/eslint-unit-tests.config.ts`, `oxlint.config.jsonc` · Src: [2], [1]

## 3. Coverage meaning and mutation testing

- **[TEST-16] Coverage include covers every production source** — `coverage.include` lists `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts` and `shared/**/*.ts`, because without it only files imported during the run are reported and never-imported files escape the threshold (verified: vitest 5.0.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/vitest/vitest.config.ts` · Src: [6], [7]
- **[TEST-17] All four metrics gated at 100 %** — `coverage.thresholds` sets `100: true` (statements, branches, functions and lines at 100) as an aggregate across projects, not a lines-only threshold (verified: vitest 5.0.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/vitest/vitest.config.ts` · Src: [6], [7], project: docs/unit-testing.md §3
- **[TEST-18] Coverage exclusions are narrow and documented** — Every `coverage.exclude` glob covers only constants, enums, types, declarations, configs, specs, plugins, thin route wrappers, middleware or Nitro plugins, the list matches `docs/unit-testing.md` §3 and `AGENTS.md` exactly, and no file under `app/`, `server/` or `shared/` contains `v8 ignore`, `c8 ignore` or `istanbul ignore` hints — untestable code moves to an excluded file class instead.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/vitest/vitest.config.ts`, `docs/unit-testing.md`, `AGENTS.md` · Src: [6], project: docs/unit-testing.md §3
- **[TEST-19] Changed behaviour updates its unit spec (strategy)** — A change altering the behaviour of a covered production unit (new branch, argument, return shape, emitted event or error path) modifies that unit's spec to assert the new behaviour, rather than relying on incidental coverage from other specs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `**/*.spec.ts` · Src: [1], [12], project: docs/unit-testing.md §6.12
- **[TEST-20] Mutation testing on critical modules** — StrykerJS with the Vitest runner targets the game-state composables, stores and server mappers with an explicit `thresholds.break` (for example 80) so a score drop fails the run, `mutate` lists production files only and survivors are triaged; otherwise the testing guide records the deferral.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `docs/unit-testing.md` · Src: [12], [13]

## 4. Mocking discipline

- **[TEST-21] Mock only at boundaries** — `vi.mock` and `mockNuxtImport` target only repositories, `$fetch`/network, clock, storage, browser APIs, Nuxt/i18n/router auto-imports and the composables registered as global mocks; pure app helpers and mappers are exercised for real, and no spec mocks the module it tests or that module own pure helpers (which is why the `composables` project does not load the composable mock setup files).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `**/*.spec.ts`, `tests/unit/setup/**` · Src: [5], [14]
- **[TEST-22] Mock setup files load in the right projects** — `VITEST_COMPOSABLES_MOCK_SETUP_FILES` load only in `nuxt` and `stores`, `VITEST_REPOSITORIES_MOCK_SETUP_FILES` load only in `nuxt`, `composables` and `stores`, neither loads in `repositories`, `node` or `dom`, every file under `tests/unit/setup/nuxt/composables/` and `tests/unit/setup/nuxt/repositories/` appears in the matching constant, and no constant entry points to a missing file.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/vitest/vitest.config.projects.constants.ts`, `configs/vitest/vitest.config.setup-files.constants.ts` · Src: [5], [11], project: docs/unit-testing.md §2
- **[TEST-23] Mocks typed against real contracts** — Composable and repository mocks are typed with `ToMock<T>` against the real export and implement every method of the real repository, and mock payloads come from faketories typed against domain types, so contract drift is a type error.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/unit/utils/mocks/**`, `tests/unit/utils/faketories/**` · Src: [14], project: docs/unit-testing.md §8
- **[TEST-24] Hoist-safe Nuxt import mocks** — Each spec calls `mockNuxtImport` at most once per mocked import, varies behaviour between tests through `vi.hoisted` values and `mockImplementation`, and mock factories reference only hoisted values or imports, because `mockNuxtImport` compiles to a hoisted `vi.mock` (verified: @nuxt/test-utils 4.3.4).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `**/*.spec.ts`, `tests/unit/setup/**` · Src: [11], [5]
- **[TEST-25] Acceptance exercises the real upstream path** — The acceptance suite reaches the Docker Goat It API sandbox through the Nitro proxy; `context.route` interception of `/api/goat-it-api/**` is limited to scenarios provoking a failure path, so DTO drift stubbed away in unit tests surfaces.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/step-definitions/**`, `tests/acceptance/features/support/**` · Src: [14], [1], project: docs/acceptance-testing.md §9

## 5. Acceptance quality and flakiness

- **[TEST-26] User-facing locators** — Steps and helpers locate elements with `getByRole`, then `getByTestId`, then `getByText`; CSS classes, `#id`, XPath and `nth-child` selectors appear only where no ARIA role or test id exists.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/step-definitions/**`, `tests/acceptance/features/support/helpers/**` · Src: [2], project: docs/acceptance-testing.md §7.2
- **[TEST-27] Web-first assertions** — UI assertions are auto-retrying `await expect(locator).toBeVisible()`/`toHaveText()`/`toHaveURL()`; no `expect(await locator.isVisible()).toBe(true)` or comparisons on `textContent()` snapshots, except boolean results of documented helpers such as `doesTableContainRowMatchingAttributes`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/step-definitions/**`, `tests/acceptance/features/support/helpers/**` · Src: [2], project: docs/acceptance-testing.md §7.3
- **[TEST-28] Zero fixed sleeps, justified timeouts** — No step, helper or hook calls `waitForTimeout`, awaits a `setTimeout` delay or polls with a literal delay — every wait is driven by an assertion, a load state, a URL, an event or `page.waitForFunction`; the default step timeout stays 15 s via `setDefaultTimeout`, and every explicit step or hook timeout belongs to an inherently long operation listed in `docs/acceptance-testing.md` §2, never to mask a slow or flaky step.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/**/*.ts` · Src: [2], [15], project: docs/acceptance-testing.md §7.4
- **[TEST-29] Interaction only after hydration** — Navigations before interaction go through `goOnPage`/`waitForPageLoadStates` (browser `load` plus `$nuxt.isHydrating === false`); bare `page.goto()` followed by a click exists only in the documented offline-navigation step, since clicking before hydration is a documented flake source (verified: @nuxt/test-utils 4.3.4).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/step-definitions/**`, `tests/acceptance/features/support/helpers/**` · Src: [11], project: docs/acceptance-testing.md §12
- **[TEST-30] Fresh state per scenario** — The `Before` hook resets the worker's sandbox MongoDB (`dropDatabase`) and opens a new `BrowserContext` and page for every scenario, and no scenario relies on data, cookies or storage produced by another scenario.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/support/hooks.ts`, `tests/acceptance/features/support/fixtures/**` · Src: [15], [11], project: docs/acceptance-testing.md §9
- **[TEST-31] Shared server state keyed per scenario** — Scenarios touching state that the dropped database does not reset (the in-process rate-limiter buckets of the shared Nuxt server) use a client identifier unique across the whole suite, so the 4 parallel workers and any scenario order cannot interfere.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/security/**`, `tests/acceptance/features/step-definitions/security/**` · Src: [2], [15], project: docs/security.md
- **[TEST-32] Deterministic fixtures** — Fixture sets under `tests/acceptance/features/support/fixtures/**` use literal values, the default locale is pinned by `ACCEPTANCE_TESTS_DEFAULT_LOCALE`, and no scenario asserts on the current date or on random upstream ordering.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/support/fixtures/**`, `tests/acceptance/features/support/**` · Src: [15], [21]
- **[TEST-33] No retry masking flakiness** — Neither `configs/cucumber/cucumber.json` nor the CI command retries failed scenarios; if retries are ever enabled, scenarios that pass only on retry are reported as flaky and counted, not as passed.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `configs/cucumber/cucumber.json`, `.github/actions/acceptance-tests/action.yml` · Src: [20]
- **[TEST-34] One behaviour per scenario** — Each scenario verifies one business behaviour in at most about 8 steps; distinct outcomes are split into separate scenarios or a `Scenario Outline`, and repeated `When`/`Then` pairs only re-check the same behaviour across inputs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/**/*.feature` · Src: [16], [17]
- **[TEST-35] No ambiguous or duplicate step definitions** — No two step definitions match the same Gherkin text, and a new domain step is added only when no generic step (`element`, `navigation`, `text`, `toast`, `modal`, `accessibility`) covers the action.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/step-definitions/**/*-steps.ts` · Src: [17], project: docs/acceptance-testing.md §6.1
- **[TEST-36] Failure diagnostics captured** — Every failed scenario attaches a screenshot to the Cucumber report and saves a Playwright trace kept only for failures (tracing started per context, retained on failure), so a CI failure is diagnosable without a rerun.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/support/hooks.ts`, `tests/acceptance/features/support/helpers/**` · Src: [2]

## 6. Browser and device matrix

- **[TEST-37] Browser matrix is an explicit decision** — Either the acceptance suite runs the critical game flow on WebKit and Firefox in addition to Chromium, or `docs/acceptance-testing.md` records Chromium-only as an accepted risk naming what is not covered (Safari and iOS PWA, Firefox); at least the start-game, answer and settings scenarios also run once in a browser context with a mobile viewport, `isMobile: true` and `hasTouch: true`, not only through `setViewportSize` (verified: @nuxt/test-utils 4.3.4).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/support/hooks.ts`, `docs/acceptance-testing.md` · Src: [2], [10], [11]
- **[TEST-38] Browser locale and timezone set explicitly** — `browser.newContext()` sets `locale` and `timezoneId` explicitly instead of inheriting the host, and the critical flow is covered in the default `en` locale plus `fr` (verified: playwright 1.64.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/support/hooks.ts`, `tests/acceptance/features/**/*.feature` · Src: [21], [15]
- **[TEST-39] Offline and reduced-motion emulation covered** — `@pwa` scenarios switch the context offline with `context.setOffline(true)` and assert the offline UI, and at least one scenario emulates `reducedMotion: "reduce"` before asserting the page (verified: playwright 1.64.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `tests/acceptance/features/pwa/**`, `tests/acceptance/features/step-definitions/accessibility/**` · Src: [21], [4], project: docs/acceptance-testing.md §7.5

## 7. Accessibility, visual, load and security test types

- **[TEST-40] Visual regression is an explicit decision** — Either `toHaveScreenshot` baselines generated on the CI platform (Linux Chromium) are committed for the home page, the game question card and the rules page with animations disabled, or `docs/acceptance-testing.md` records the skip rationale and compensating checks.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/acceptance-testing.md`, `tests/acceptance/features/**/*.ts` · Src: [3]
- **[TEST-41] Load testing is an explicit decision** — Either a k6 smoke script runs minimal VUs against the built app and `/api/goat-it-api/**` with thresholds on `http_req_failed` and p95 `http_req_duration`, or the testing guide records "no load test" with the expected load profile.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/acceptance-testing.md`, `package.json` · Src: [18]
- **[TEST-42] Security headers, CSP and abuse guards asserted** — Acceptance scenarios assert the headers documented in `docs/security.md` (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`) on an HTML route and on an `/api/goat-it-api/**` response, plus `Content-Security-Policy` on the HTML route; they also assert that every inline script carries the response nonce with no CSP violation, `429` with `Retry-After` once a client budget is exhausted (another client unaffected), `413` for an oversized JSON body and `415` for a non-JSON body on a `POST` proxy route.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/security/**`, `tests/acceptance/features/step-definitions/security/**` · Src: [19], project: docs/security.md
- **[TEST-43] DAST baseline wired or deferred** — A ZAP baseline scan (spider and passive rules only) runs against the built app at least per release with a rules file promoting relevant alerts to FAIL, since every alert defaults to WARN; otherwise the deferral is documented with an expiry date.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/build.yml`, `docs/acceptance-testing.md` · Src: [19]

## 8. CI test infrastructure

- **[TEST-44] Test reports uploaded on failure** — The unit and acceptance composite actions upload `tests/unit/coverage` and `tests/acceptance/reports` (Cucumber JSON, JUnit XML, failure screenshots) before the final failing step, so a red job is diagnosable from artifacts alone.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/unit-tests/action.yml`, `.github/actions/acceptance-tests/action.yml` · Src: [2]
- **[TEST-45] Sandbox readiness, reset and image pinning fail loudly** — `BeforeAll` aborts the run when the sandbox health check fails after `SANDBOX_HEALTH_CHECK_MAX_RETRIES`, a failing `resetSandboxData` fails the `Before` hook instead of being caught and ignored, and `docker/goat-it-api-sandbox/docker-compose.yml` references the Goat It API and MongoDB images by released version or digest rather than a moving tag such as `:develop`, so an upstream change cannot redden unrelated pull requests.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/support/hooks.ts`, `tests/acceptance/features/support/helpers/**` · Src: [15], project: docs/acceptance-testing.md §9.3
- **[TEST-46] Acceptance runs the production build** — CI runs scenarios against the `nuxi build --envName test` output served by the Nitro server (`createTest` with `build: false`, `server: true`) and never against `nuxt dev`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `tests/acceptance/features/support/hooks.ts`, `package.json`, `.github/actions/acceptance-tests/action.yml` · Src: [1], [11]
- **[TEST-47] Flaky-test quarantine policy** — A documented quarantine mechanism (for example a `@flaky` tag excluded from the blocking run) requires a linked issue and a maximum age of one week per quarantined scenario or spec; flaky tests are never silently deleted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/acceptance-testing.md`, `docs/unit-testing.md` · Src: [15]

## 9. Test-docs drift

- **[TEST-48] Documented test trees, tags and setup tables match disk** — The tag families table in `docs/acceptance-testing.md` §5.2 lists exactly the tags used in the features and every feature carries its domain tag; the feature tree (§5.1), step-definition tree and generic/domain step table (§6.1) list only domains and files that exist under `tests/acceptance/features/`; and the setup and mock tables of `docs/unit-testing.md` §4 list every file under `tests/unit/setup/nuxt/**` and the methods of each repository mock.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/acceptance-testing.md`, `tests/acceptance/features/**/*.feature` · Src: [11], project: docs/acceptance-testing.md §5.2

## 10. Per-file convention sweep


## Sources

[1] JavaScript & Node.js testing best practices — https://github.com/goldbergyoni/javascript-testing-best-practices — fetched 2026-10-31 (readme August 2025)
[2] Best Practices | Playwright — https://playwright.dev/docs/best-practices — fetched 2026-10-31 (docs © 2026)
[3] Visual comparisons | Playwright — https://playwright.dev/docs/test-snapshots — fetched 2026-10-31 (docs © 2026)
[4] Accessibility testing | Playwright — https://playwright.dev/docs/accessibility-testing — fetched 2026-10-31 (docs © 2026)
[5] Mocking | Vitest — https://vitest.dev/guide/mocking.html — fetched 2026-10-31 (vitest 5.0.5)
[6] Coverage | Vitest — https://vitest.dev/guide/coverage.html — fetched 2026-10-31 (vitest 5.0.5)
[7] coverage | Config | Vitest — https://vitest.dev/config/coverage — fetched 2026-10-31 (vitest 5.0.5)
[9] sequence | Config | Vitest — https://vitest.dev/config/sequence — fetched 2026-10-31 (vitest 5.0.5)
[10] Testing | Vue.js — https://vuejs.org/guide/scaling-up/testing.html — fetched 2026-10-31 (Vue 3 docs, undated)
[11] Testing | Nuxt — https://nuxt.com/docs/4.x/getting-started/testing — fetched 2026-10-31 (Nuxt 4.x, @nuxt/test-utils 4.3.4)
[12] What is mutation testing? | Stryker — https://stryker-mutator.io/docs/ — fetched 2026-10-31 (Stryker general docs)
[13] Configuration | StrykerJS — https://stryker-mutator.io/docs/stryker-js/configuration/ — fetched 2026-10-31 (StrykerJS v7+ options)
[14] The Practical Test Pyramid — https://martinfowler.com/articles/practical-test-pyramid.html — fetched 2026-10-31 (26 Feb 2018)
[15] Eradicating Non-Determinism in Tests — https://martinfowler.com/articles/nonDeterminism.html — fetched 2026-10-31 (14 Apr 2011)
[16] Writing better Gherkin | Cucumber — https://cucumber.io/docs/bdd/better-gherkin/ — fetched 2026-10-31 (last updated 27 Oct 2026)
[17] Anti-patterns | Cucumber — https://cucumber.io/docs/guides/anti-patterns/ — fetched 2026-10-31 (last updated 27 Oct 2026)
[18] Load test types | Grafana k6 — https://grafana.com/docs/k6/latest/testing-guides/test-types/ — fetched 2026-10-31 (latest)
[19] ZAP Baseline Scan — https://www.zaproxy.org/docs/docker/baseline-scan/ — fetched 2026-10-31 (© 2026 ZAP dev team)
[20] Retries | Playwright — https://playwright.dev/docs/test-retries — fetched 2026-10-31 (docs © 2026)
[21] Emulation | Playwright — https://playwright.dev/docs/emulation — fetched 2026-10-31 (docs © 2026)
