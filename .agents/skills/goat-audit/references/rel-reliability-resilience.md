# REL — Reliability & resilience

How the web game behaves when a hop is slow, failing, cancelled or overloaded: timeouts and the end-to-end budget from the
browser through the Nitro proxy to the Goat It API, method-aware retries and backoff, cooperative cancellation and the
latest-wins `useAsyncAction` lanes, graceful degradation (a failure is never rendered as empty data or success), bounded
collections and caps at every boundary, upstream contract compatibility with `@goat-it/schemas`, and capacity under load.

**Decision doc:** `docs/operations.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** game-specific races and invariants, seen-question dedup, persisted-state evolution → LOGIC · error UX and copy → UX · abuse, rate-limit keying, body-size guard, upstream response size cap → SEC · memory leaks and heap analysis → PERF · probe design, graceful shutdown, scale-out state → PLAT · monitors, alerts, runbooks, logging schema → OPS · dependency pinning hygiene → SUP

## Contents

- [1. Timeouts & end-to-end budget](#1-timeouts--end-to-end-budget)
- [2. Retries & backoff](#2-retries--backoff)
- [3. Cancellation & latest-wins](#3-cancellation--latest-wins)
- [4. Graceful degradation](#4-graceful-degradation)
- [5. Limits at boundaries](#5-limits-at-boundaries)
- [6. Upstream contract compatibility](#6-upstream-contract-compatibility)
- [7. Capacity & load](#7-capacity--load)
- [Sources](#sources)

## 1. Timeouts & end-to-end budget

- **[REL-01] Hop timeout inventory** — Every network hop has a named timeout constant: browser→proxy `GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS` (15 s), proxy→upstream `GOAT_IT_API_REQUEST_TIMEOUT_IN_MS` (10 s), `/readyz`→upstream `GOAT_IT_API_READINESS_PROBE_TIMEOUT_IN_MS` (3 s); no hop relies on a library default, and a change adding a hop adds its constant.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `shared/constants/goat-it-api.constants.ts`, `server/utils/goat-it-api/goat-it-api.constants.ts`, `server/utils/goat-it-api/helpers/goat-it-api-readiness/**` · Src: [1], [9], project: docs/security.md
- **[REL-02] Client lane timeout** — Every `useAsyncAction` that wraps a network call passes `timeoutInMs` (proxy calls use `GOAT_IT_API_CLIENT_ASYNC_ACTION_OPTIONS`); repositories never set their own timeout.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/stores/**`, `app/composables/**` · Src: [1], project: docs/architecture.md §4.4
- **[REL-03] Explicit `useAsyncData`/`useFetch` timeout** — When `useAsyncData`, `useFetch` or `useLazyFetch` fetches over the network, it passes an explicit `timeout`; the option defaults to `undefined` (no timeout) and its expiry aborts the handler signal (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**/*.vue`, `app/composables/**` · Src: [9], [10]
- **[REL-04] Upstream timeout composed into the signal** — Every proxy→upstream `$fetch` uses the signal built by `createGoatItApiFetchOptions` (`AbortSignal.any([disconnect, AbortSignal.timeout(GOAT_IT_API_REQUEST_TIMEOUT_IN_MS)])`); no call relies on ofetch `timeout` together with `signal`, because ofetch ignores `timeout` when a `signal` is present (verified: ofetch 1.5.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-fetch-options/**`, `server/api/goat-it-api/**` · Src: [13], project: docs/security.md
- **[REL-05] End-to-end budget arithmetic** — The client timeout (15 s) exceeds the proxy worst case — one 10 s signal created once per inbound request and shared by every upstream attempt and retry delay — plus proxy overhead, and this arithmetic is written in `docs/security.md`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/security.md`, `server/utils/goat-it-api/helpers/goat-it-api-fetch-options/**` · Src: [1], [3], project: docs/security.md
- **[REL-06] SSR fetches bounded** — Data fetched during SSR (store actions through `useRequestFetch`, `useAsyncData` handlers) runs under a timeout no longer than the client budget, so a slow upstream cannot hold an SSR document beyond 15 s; Nuxt waits for `useAsyncData` on the server before rendering (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/pages/**/*.vue`, `app/stores/**` · Src: [9], [3]
- **[REL-07] Timeout behaviour at runtime** — With the upstream delayed beyond 10 s, a proxy call answers `504` with `data.errorCode = "upstream-timeout"` in about 10 s and the client lane ends in `error` before 15 s, with no endless pending state.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [1], project: docs/security.md

## 2. Retries & backoff

- **[REL-08] Idempotent-only retries** — Only `GET`/`HEAD` upstream calls retry: `createGoatItApiFetchOptions` resolves `retry: 0` for `POST` and for any `PUT`/`PATCH`/`DELETE` call; a custom `retry` value makes ofetch retry every method (verified: ofetch 1.5.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-fetch-options/**` · Src: [2], [13], project: docs/security.md
- **[REL-09] Retry policy keyed on the real method** — Every handler passes the same `method` to `createGoatItApiFetchOptions` and to `$fetch`, so the retry policy cannot diverge from the method actually sent (the helper defaults to `GET`).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/api/goat-it-api/**` · Src: [2], project: docs/security.md
- **[REL-10] No retry amplification** — Only one layer retries a hop: browser calls to `/api/goat-it-api/**` pass `retry: 0`, because ofetch retries `GET` once by default and stacks with the proxy's `GOAT_IT_API_REQUEST_RETRY_COUNT` retries (verified: ofetch 1.5.1); otherwise the stacked attempt count per user action is a documented decision.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/repositories/goat-it-api/**`, `app/stores/**` · Src: [1], [3], [13]
- **[REL-11] Backoff with jitter** — Retry delays are non-zero and grow between attempts with randomized jitter, or the fixed `GOAT_IT_API_REQUEST_RETRY_DELAY_IN_MS` is a documented choice bounded by the retry count; ofetch's default `retryDelay` is `0` ms (verified: ofetch 1.5.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/goat-it-api.constants.ts` · Src: [1], [3], [13]
- **[REL-12] Retry predicate** — Retries fire only on network errors and transient statuses (408, 425, 5xx); other 4xx and Zod contract failures are terminal, and upstream `429` is never retried before its `Retry-After` delay — ofetch's default `retryStatusCodes` include `409` and `429` (verified: ofetch 1.5.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/helpers/goat-it-api-fetch-options/**` · Src: [1], [4], [13]
- **[REL-13] No retry after abort** — Calls aborted by a client disconnect, a superseding request or a timeout are not retried and settle immediately; no retry starts a new attempt on an already-aborted signal.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/helpers/goat-it-api-fetch-options/**`, `app/composables/core/useAsyncAction/**` · Src: [3], [4]

## 3. Cancellation & latest-wins

- **[REL-14] Client disconnect aborts upstream** — The upstream signal aborts when the inbound response closes before it was sent (`res.on("close")` with `!writableEnded`), freeing the upstream call; a request whose response was already sent is never aborted.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-fetch-options/**` · Src: [3], project: docs/security.md
- **[REL-15] Signal forwarded end to end** — Every repository method accepts `GoatItApiRequestOptions` and forwards `signal` unchanged to the fetch, and every store or composable action forwards the `{ signal }` it receives from `useAsyncAction`; no network call inside an async lane drops the signal.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/repositories/goat-it-api/**`, `app/stores/**` · Src: [3], project: docs/architecture.md §4.4
- **[REL-16] Latest-wins lane** — Overlapping executions of one operation go through one `useAsyncAction` instance, which aborts the previous request with an `AbortError` reason and clears its timer before starting the next; no hand-rolled request id or `AbortController` bookkeeping exists outside it.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/core/useAsyncAction/**`, `app/stores/**`, `app/composables/domain/**` · Src: [3], project: docs/architecture.md §4.2
- **[REL-17] Separate lanes for independent operations** — Operations that may legitimately run concurrently (for example the random batch and the by-ids lookup) use distinct `useAsyncAction` instances, so one never cancels the other.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**` · Src: project: docs/architecture.md §4.3
- **[REL-18] Superseded is a silent no-op** — A superseded result (`{ ok: false, superseded: true }`) writes no fetch status, no state and calls no `onError`, and callers narrow `result.superseded === true` before surfacing an error, so a cancellation never produces a toast or an error log.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/**`, `app/stores/**`, `shared/types/async-result.types.ts` · Src: [3], project: docs/architecture.md §4.3
- **[REL-19] Timeout is an error, supersede is not** — A lane timeout aborts with a `TimeoutError` reason and resolves as a failure (`fetchStatus` `error`, `onError` called), distinct from a supersede abort; code never treats the two reasons as the same outcome.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/core/useAsyncAction/**` · Src: [1], project: docs/architecture.md §4.2
- **[REL-20] `useAsyncData` handlers honour the signal** — When `useAsyncData` is used, its handler forwards the `{ signal }` from its second argument to `$fetch` or its own work, so `dedupe: 'cancel'`, `clear()` and `timeout` actually abort the request (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/pages/**/*.vue` · Src: [9]
- **[REL-21] `useAsyncData` cancellation options deliberate** — When a keyed `useAsyncData` can be re-triggered, its `dedupe` is chosen deliberately (default `'cancel'` aborts the pending call, `'defer'` keeps it), and when `enabled` gates it the UI does not treat retained `data` as fresh: switching `enabled` to `false` cancels in-flight work without clearing `data`, and re-enabling does not refetch (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `app/pages/**/*.vue` · Src: [9], [11]
- **[REL-22] Cancellation at runtime** — Rapidly re-triggering an action (changing settings, restarting a game, navigating away) shows the previous proxy request as cancelled in the browser network log, and only the latest response reaches the UI.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [9]

## 4. Graceful degradation

- **[REL-23] Failure is never empty or success** — Stores apply only `ok` results; a failed or unparsable response (a repository `ZodError` surfaces as `{ ok: false, error }`) leaves existing state untouched and the lane in `error`, and no repository, store or handler converts a failure into `[]`, a default object or a success status.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/repositories/goat-it-api/**`, `app/stores/**`, `server/api/goat-it-api/**` · Src: [5], [12], project: docs/architecture.md §4.3
- **[REL-24] Proxy failure statuses** — Upstream failures map to the error contract — `502` `upstream-error` (upstream 5xx, 401/403, redirect, network failure, contract drift), `504` `upstream-timeout`, `500` `internal-error` — each with `data.errorCode`; the proxy never answers `200` with an empty or partial body after an upstream failure.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-error/**` · Src: [5], project: docs/security.md
- **[REL-25] Retry-After propagation** — An upstream `429` keeps its status and forwards `Retry-After` as `data.retryAfter`, and every `429` or `503` the `/api/goat-it-api/**` proxy emits itself carries a `Retry-After` header, so clients back off instead of retrying immediately.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/helpers/goat-it-api-error/**`, `server/middleware/02-api-rate-limit.middleware.ts` · Src: [3], project: docs/security.md
- **[REL-26] Degradation matrix documented** — `docs/operations.md` or `docs/security.md` maps each dependency failure — upstream 5xx, upstream timeout, contract drift, upstream `429`, client offline, Sentry unreachable, logger failure — to its HTTP status and user-visible behaviour.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md`, `docs/security.md` · Src: [5], [8]
- **[REL-27] Partial batch policy explicit** — When an upstream batch contains an item that fails validation, the policy is explicit and documented — reject the whole batch with `502`, or drop invalid items above a minimum count with a warning log — and items are never silently truncated.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/helpers/goat-it-api-validation/**` · Src: [5], project: docs/security.md
- **[REL-28] Persistent-failure cooldown** — Repeated upstream failures trip a bounded cooldown (circuit breaker or short negative cache) instead of one upstream call per user retry, or the absence is a documented decision that names the rate limiter as the bound.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/**` · Src: [1], [3]
- **[REL-29] Non-critical dependency isolation** — A Sentry transport failure or a logger write error never fails a request, an SSR render or a client action: logger errors are caught (falling back to `console.error`) and error reporting never throws into the request path.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `server/plugins/error-logging/**` · Src: [5], project: docs/operations.md
- **[REL-30] Upstream outage drill** — With the upstream stopped or answering `503`, the home and game pages still render with HTTP `200` and show an error state, proxy calls answer `502` with `data.errorCode`, and the web process stays live (`/healthz` `200`).
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [5], project: docs/operations.md
- **[REL-31] Kill switch** — Upstream-dependent features can be disabled through a runtime `NUXT_*` variable without a rebuild, documented in `envs/.env.example`, or the absence of a kill switch is a recorded decision.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `envs/.env.example`, `server/utils/runtime-config/**` · Src: [3], [8]

## 5. Limits at boundaries

- **[REL-32] Proxy clamps page size** — Every proxy route that forwards a `limit` clamps it with `clampFindQueryLimit` to its `FIND_*_QUERY_LIMIT_MAXIMUM` (the `0` sentinel maps to the maximum), so a client cannot request an unbounded upstream page.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/api/goat-it-api/**`, `server/utils/goat-it-api/helpers/goat-it-api-find-query-limit/**` · Src: [3], [14]
- **[REL-33] Caps aligned with the upstream schema** — Each proxy cap (`FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM`, `FIND_QUESTION_THEMES_QUERY_LIMIT_MAXIMUM`) is at most the maximum the matching `@goat-it/schemas` query DTO accepts, so a clamped request never fails upstream validation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/constants/goat-it-api.constants.ts` · Src: [14]
- **[REL-34] Bounded request arrays** — Every array a proxy route accepts (query `ids`, random-search exclusion list) is bounded by a `.max()` in its validation schema before any upstream call, and a request over the bound fails with `400` `invalid-request`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/api/goat-it-api/**`, `server/utils/goat-it-api/helpers/goat-it-api-validation/**` · Src: [3], [14], project: docs/security.md
- **[REL-35] Exclusion list fits the body guard** — The client caps the exclusion list it sends with a named maximum (newest ids kept), so maximum ids × maximum id length stays well under the 512 KiB body guard and within the upstream array maximum; a long session never trips `413`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/composables/domain/useGameQuestionFeed/**` · Src: [6], project: docs/security.md
- **[REL-36] Session-growing collections capped** — Every client collection that grows during a session (question buffer, answer history, any id list) has a named maximum constant enforced on insert, so a long session cannot grow requests or state without bound.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/stores/**`, `app/composables/domain/**` · Src: [3], [6]
- **[REL-37] Response arrays bounded** — Shared domain schemas used by repositories bound every array, top-level and nested, with a named maximum (nested ones reuse `@goat-it/schemas` constants such as `QUESTION_SOURCE_URLS_MAX_ITEMS`), so an oversized proxy response fails validation instead of flooding the UI.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/schemas/**` · Src: [14]

## 6. Upstream contract compatibility

- **[REL-38] Additive drift tolerated, other drift rejected** — Upstream responses go through `parseAndMapGoatItApiResponse`: when every issue is `unrecognized_keys`, the keys are stripped from a clone and the payload re-parsed with a `GOAT_IT_API_SCHEMA_DRIFT` warning; any other issue becomes `502` `upstream-error`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/helpers/goat-it-api-validation/**`, `server/api/goat-it-api/**` · Src: [14], project: docs/security.md
- **[REL-39] Unknown-key policy deliberate per boundary** — Each schema boundary chooses its unknown-key policy on purpose — `z.object` strips, `z.strictObject` throws, `z.looseObject` passes keys through, and `.extend()` keeps the base schema's policy (spreading `.shape` into an explicit constructor makes it visible) — and domain schemas extending strict `@goat-it/schemas` DTOs accept exactly the keys the proxy mappers emit (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/schemas/**` · Src: [14]
- **[REL-40] No silent fallbacks on transported data** — Schemas that parse upstream DTOs or proxy responses never use `.catch()`, which returns a fallback instead of failing and hides contract drift (verified: zod 4.6.7); `.catch()` is reserved for persisted client preferences.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/schemas/**`, `server/utils/goat-it-api/**` · Src: [14]
- **[REL-41] Drift is observable** — Every tolerated drift logs the stripped paths at `warn`, and every rejected drift logs the failing issue paths before answering `502`, so an upstream contract change is visible before users report it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/helpers/**` · Src: [5], project: docs/operations.md
- **[REL-42] New enum values handled** — The behaviour when the upstream adds an enum value (question category, cognitive difficulty, locale) is decided and documented — whole-batch `502` or a mapped fallback — and a unit spec of the validation path covers it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/**`, `shared/schemas/**` · Src: [5], [14]
- **[REL-43] Schema package pinned** — `package.json` pins `@goat-it/schemas` to an exact version or a range that admits a single version, and `pnpm-lock.yaml` resolves it, so contract changes arrive only through a reviewed upgrade.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `pnpm-lock.yaml` · Src: [7], [14]
- **[REL-44] Schema upgrade procedure** — A documented procedure governs `@goat-it/schemas` upgrades: read the package changelog, re-check proxy caps, mappers and domain schemas against the new DTOs, and run the validation and mapper specs before merging.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `AGENTS.md`, `docs/**` · Src: [7], [14]

## 7. Capacity & load

- **[REL-45] Rate limit sized for legitimate play** — The per-client budget (`NUXT_RATE_LIMIT_MAXIMUM_REQUESTS` `60` per `NUXT_RATE_LIMIT_WINDOW_IN_MS` `60000`) covers the heaviest legitimate flow — fast play with prefetch, client retries, several players behind one NAT address — with documented headroom.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/security.md`, `server/middleware/02-api-rate-limit.middleware.ts` · Src: [6], project: docs/security.md
- **[REL-46] Load test to breaking point** — SSR pages and `/api/goat-it-api/**` have been load-tested to their breaking point on the production VPS size, and the sustainable requests per second, p95 latency and failure mode are recorded.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [3], [6]
- **[REL-47] Overload sheds load** — At about 2× expected peak traffic the app answers `429` or `503` and recovers when load drops, without a crash or restart loop.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [3], [5]
- **[REL-48] Soak stability** — A session of at least 1 h at steady load keeps latency and error rate flat, with no unbounded growth of prefetch buffers or history.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [6]
- **[REL-49] Upstream quota headroom** — Peak proxy requests per second × upstream attempts per request × instances stays below the Goat It API quota or rate limit, and the figure is written down.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [6], [8]
- **[REL-50] Memory limit alignment** — The container memory limit and the Node heap limit (`--max-old-space-size` or `NODE_OPTIONS`) are aligned so the process reaches its heap limit before a kernel OOM kill, and OOM restarts are observable.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [7]

## Sources

[1] AWS Builders' Library — Timeouts, retries, and backoff with jitter — https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ — fetched 2026-10-31 (published 2019-12-05)
[2] AWS Builders' Library — Making retries safe with idempotent APIs — https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/ — fetched 2026-10-31 (online article)
[3] Google SRE Book, Ch. 22 — Addressing Cascading Failures — https://sre.google/sre-book/addressing-cascading-failures/ — fetched 2026-10-31 (2017)
[4] Mercari Production Readiness Checklist — Smart retries — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/smart-retries.md — fetched 2026-10-31 (repo master)
[5] Mercari Production Readiness Checklist — Graceful degradation — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/graceful-degradation.md — fetched 2026-10-31 (repo master)
[6] Mercari Production Readiness Checklist — Capacity planning — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/capacity-planning.md — fetched 2026-10-31 (repo master)
[7] Mercari Production Readiness Checklist — Pre-production checklist — https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/pre-production-checklist.md — fetched 2026-10-31 (repo master)
[8] Google SRE Book, Appendix E — Launch Coordination Checklist — https://sre.google/sre-book/launch-checklist/ — fetched 2026-10-31 (2017)
[9] Nuxt 4.x — useAsyncData API — https://nuxt.com/docs/4.x/api/composables/use-async-data — fetched 2026-10-31 (nuxt 4.6.3, docs v4.6)
[10] Nuxt 4.x — useFetch API — https://nuxt.com/docs/4.x/api/composables/use-fetch — fetched 2026-10-31 (nuxt 4.6.3, docs v4.6)
[11] Nuxt 4.x — Data Fetching — https://nuxt.com/docs/4.x/getting-started/data-fetching — fetched 2026-10-31 (nuxt 4.6.3)
[12] Nuxt 4.x — Error Handling — https://nuxt.com/docs/4.x/getting-started/error-handling — fetched 2026-10-31 (nuxt 4.6.3)
[13] ofetch v1 — README (retry, retryDelay, timeout defaults) — https://github.com/unjs/ofetch/blob/v1/README.md — fetched 2026-10-31 (library ofetch 1.5.1)
[14] Zod — Defining schemas (objects, `.extend()`, `.catch()`) — https://github.com/colinhacks/zod/blob/v4.6.5/packages/docs/content/api.mdx — fetched 2026-10-31 (docs v4.6.5, library zod 4.6.7)
