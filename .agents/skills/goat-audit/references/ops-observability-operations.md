# OPS — Observability & operations

Operating the deployed Goat It web game (Nuxt 4 SSR + Nitro proxy, one Docker container per environment on a VPS,
production and staging): Sentry error tracking setup and noise control, structured Pino server logs, SLIs/SLOs and
alerting (or their explicit deferral), external uptime monitoring of `/healthz` and `/readyz`, runbooks and incident
readiness, and post-deploy verification in the deploy workflows. It checks that failures are detected, attributed and
actionable, not what data may be collected or how probes are designed.

**Decision doc:** `docs/operations.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** Sentry PII, data collection and scrubbing → PRIV · what may be logged, log redaction, secrets in logs, public source-map exposure → SEC · deprecated SDK options → STACK · RUM web-vitals → PERF · probe design (liveness/readiness semantics, `HEALTHCHECK`, shutdown, immutable image tags) → PLAT · timeouts, retries, degradation matrix, capacity & load, zero-downtime deploy → REL · deploy workflow hardening and credentials → CICD

## Contents

- [1. Error tracking](#1-error-tracking)
- [2. Structured logs](#2-structured-logs)
- [3. SLIs, SLOs and alerting](#3-slis-slos-and-alerting)
- [4. Uptime monitoring](#4-uptime-monitoring)
- [5. Runbooks and incidents](#5-runbooks-and-incidents)
- [6. Post-deploy verification](#6-post-deploy-verification)
- [Sources](#sources)

## 1. Error tracking

- **[OPS-01] Conditional Sentry initialization** — `sentry.client.config.ts` and `sentry.server.config.ts` call `init` only when the build is not a dev build, `public.sentry.disabled` is `false`, the environment label is `production` or `staging`, and the trimmed `NUXT_PUBLIC_SENTRY_DSN` is non-empty; `enabled: false` alone does not remove SDK overhead, so the `init` call itself is conditional (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `sentry.*.config.ts`, `shared/utils/helpers/sentry/**` · Src: [12], [14], project: docs/operations.md
- **[OPS-02] Server SDK self-initializes without preload** — `sentry.server.config.ts` sits at the repository root next to `nuxt.config.ts`, and the production start command (`Dockerfile` `CMD`, `start:prod` script) is `node .output/server/index.mjs` with no `--import` or `NODE_OPTIONS` preload, because the SDK bundles the server config into the Nitro build and initializes at server start (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `Dockerfile`, `package.json`, `sentry.*.config.ts` · Src: [20]
- **[OPS-03] Test builds never contact Sentry** — The `$test` build sets `sentry: { enabled: false }` in `nuxt.config.ts` and `envs/.env.test` sets `NUXT_PUBLIC_SENTRY_DISABLED=true`, so no unit or acceptance run sends an event.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `envs/**` · Src: project: docs/operations.md
- **[OPS-04] Explicit environment label** — Every initialized SDK passes `environment` explicitly as `production` or `staging` resolved from `NUXT_SITE_ENV`; the SDK default (`development` or `production` depending on packaging) is never relied on and `NUXT_PUBLIC_SENTRY_ENVIRONMENT` is not used (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `sentry.*.config.ts`, `shared/utils/helpers/sentry/**`, `nuxt.config.ts` · Src: [14], project: docs/operations.md
- **[OPS-05] Client label matches the deploy target** — Each `.github/workflows/deploy-*.yml` builds its image with `NUXT_SITE_ENV` equal to its target (`production` in the production workflow, `staging` in the staging workflow), because the client label is resolved at build time and the server label at runtime; an image is never promoted to another environment without a rebuild.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/deploy-*.yml` · Src: [14], project: docs/operations.md
- **[OPS-06] Release tag on both runtimes** — Client and server `init` set `release` to the deployed immutable version (release tag or git SHA), injected at build time for the client and through the option or `SENTRY_RELEASE` on the server, so regressions are attributable to a deploy (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `sentry.*.config.ts`, `nuxt.config.ts`, `.github/workflows/deploy-*.yml` · Src: [14], [16], project: docs/operations.md
- **[OPS-07] Documented source-map strategy** — Sentry source maps are either uploaded from CI with a token that never reaches the client bundle and deleted after upload, or disabled with the resulting limitation (minified client stack traces) documented (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts`, `docs/operations.md` · Src: [13], [20], project: docs/operations.md
- **[OPS-08] Deliberate error sample rate** — Error `sampleRate` stays at its default `1.0` (every error sent) or is set explicitly with a quota rationale recorded in `docs/operations.md` (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `sentry.*.config.ts`, `shared/utils/helpers/sentry/**` · Src: [14], [15]
- **[OPS-09] Trace sampling excludes probes** — When tracing is enabled (`tracesSampleRate` or `tracesSampler` set), the rate is explicit and `/healthz`/`/readyz` spans are dropped with `ignoreSpans` (or a `tracesSampler` returning `0`), since `ignoreTransactions` and `beforeSendTransaction` no-op under default span streaming (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `sentry.*.config.ts`, `shared/utils/helpers/sentry/**` · Src: [14], [15], [20]
- **[OPS-10] Client noise filters** — Shared `ignoreErrors` and `denyUrls` constants cover aborted requests, `ResizeObserver` loop warnings and browser-extension script URLs (`chrome-extension://`, `moz-extension://`, `safari-web-extension://`), and the SDK's default `EventFilters` integration that applies them stays enabled.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/sentry/**` · Src: [14], project: docs/security.md
- **[OPS-11] Expected traffic dropped before send** — `beforeSend` drops expected 4xx responses, `/healthz`/`/readyz` traffic and aborted upstream requests, and `beforeBreadcrumb` drops health-check fetch breadcrumbs, so issue volume reflects real failures.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/utils/helpers/sentry/**`, `sentry.*.config.ts` · Src: [14], project: docs/security.md
- **[OPS-12] One capture per failure** — Server failures are captured only by the SDK's Nitro error hook (no second capture hook; the Pino error-logging plugin never calls Sentry), and the client reporting boundary reports only client-only unexpected errors (for example a repository `ZodError`), never `FetchError`, errors carrying an HTTP status, or aborted/timed-out requests; the Nuxt SDK captures through Nuxt error hooks, not a Vue `errorHandler` (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/plugins/error-logging/**`, `app/utils/core/sentry/**`, `sentry.*.config.ts` · Src: [14], project: docs/security.md
- **[OPS-13] Issue alerts routed to an owner** — The Sentry project has alert rules for new issues, regressions and event-frequency spikes, filtered by the `production`/`staging` environment, each notifying a named owner channel (email or Slack); every configured alert (Sentry, UptimeRobot) is actionable, classified as page or notification, and names the runbook section to follow.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [17], [2]
- **[OPS-14] Spike protection with notification** — Sentry Spike Protection is enabled for the project and a notification action is added, because enabling it sends no notification by default and it does not apply during a trial.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [18]

## 2. Structured logs

- **[OPS-15] NDJSON records with a stable base schema** — Every server log record is one JSON line on stdout carrying an ISO-8601 `time`, the numeric Pino `level`, the service `name` `goat-it-web-game` and an `event` field; no file or worker-thread transport is configured.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**` · Src: [9], [19], project: docs/operations.md
- **[OPS-16] Closed event-name catalogue** — Every `logServerWarning`/`logServerError` call passes a `ServerLogEventName` enum member in dotted `<domain>.<event>` form (for example `goat-it-api.upstream-error`); no free-text event names or interpolated messages.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `server/utils/goat-it-api/**` · Src: [9], [19]
- **[OPS-17] Request ID lifecycle** — The server accepts an inbound `x-request-id` only when it matches a bounded length and charset, otherwise generates one, forwards it on the upstream Goat It API call and returns it in the response header.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/middleware/**`, `server/utils/goat-it-api/**` · Src: [8], [11]
- **[OPS-18] Log and Sentry correlation** — The request id is included in every request-scoped log record and attached as a Sentry tag on server events, so one id joins a log line and an issue.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `sentry.*.config.ts` · Src: [8], [14]
- **[OPS-19] Level discipline** — Unexpected 5xx failures log at `error`, upstream API failures and additive schema drift at `warn`, and the Nitro `error` hook skips expected 4xx responses and proxy failures already logged by the Goat It API error path.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `server/plugins/error-logging/**` · Src: [9], [19], project: docs/operations.md
- **[OPS-20] Logging never fails a request** — Logger writes are wrapped in `try/catch` with a single `console.error` fallback, and the Nitro `error` hook never throws.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `server/plugins/error-logging/**` · Src: project: docs/operations.md
- **[OPS-21] No stray console calls** — `no-console` is an error for `app/`, `server/` and `shared/` in both ESLint (only `console.error` allowed) and Oxlint, with overrides limited to scripts and tests, and server code logs through the Pino helpers; browser-only diagnostic console calls are a documented scope decision.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/eslint/**`, `oxlint.config.jsonc` · Src: [19], project: AGENTS.md
- **[OPS-22] Log rotation and retention documented** — `docs/operations.md` states the container log rotation on the VPS (Docker `json-file` `max-size`/`max-file`, or an equivalent driver setting) and how long stdout logs are retained.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [5], [9]

## 3. SLIs, SLOs and alerting

- **[OPS-23] Golden signals measurable** — Request rate, error rate by class (4xx, 5xx, `errorCode`), latency distribution (p50/p95/p99) and saturation (in-flight requests, memory) of `/api/goat-it-api/**` are emitted per request through logs or a metrics endpoint.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `server/middleware/**` · Src: [2], project: docs/operations.md
- **[OPS-24] SLI specification** — `docs/operations.md` defines availability as good proxy responses over total valid requests and latency as p95 of proxied requests, each with its measurement source, window (for example 28 days) and aggregation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [3], [10]
- **[OPS-25] SLO targets or explicit deferral** — `docs/operations.md` states numeric SLO targets with an owner (for example 99.5 % availability, p95 < 2 s) or an explicit deferral with its rationale and revisit trigger; when numeric SLOs exist, the document also states the action taken when the error budget is exhausted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [3], [5], project: docs/operations.md
- **[OPS-26] Burn-rate alerting** — When numeric SLOs exist, alerts fire on burn rate with a fast window and a slow window (multi-window), or a documented simpler equivalent.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [4]

## 4. Uptime monitoring

- **[OPS-27] Monitor inventory per environment and probe** — `docs/operations.md` lists one external monitor for each probe endpoint in each environment, with URL, method, expected result and interval.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/operations.md` · Src: [11], [2], project: docs/operations.md
- **[OPS-28] Keyword assertions match probe bodies** — Each monitor asserts HTTP 2xx plus a body keyword, not an open port, and the documented keywords (`"status":"ok"` for `/healthz`, `"status":"ready"` for `/readyz`) match the bodies returned by the `server/routes/**` handlers.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md`, `server/routes/**` · Src: [11]
- **[OPS-29] Monitors active outside the host** — The provider account has the four documented monitors active, probing from outside the VPS, with names that include the environment and the probe type.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [11], [2], project: docs/operations.md
- **[OPS-30] Alert delivery tested** — Monitor alerts reach a primary and an escalation contact, and a test alert was delivered and acknowledged.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [5], [2]
- **[OPS-31] Synthetic user journey** — A scripted external check periodically exercises a core user journey in production (load the home page and complete one primary interaction).
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [4], [2]
- **[OPS-32] Certificate and domain expiry monitoring** — TLS certificate expiry for every deployed host and the domain registration expiry are monitored with lead-time alerts.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1]
- **[OPS-33] Monitoring heartbeat** — A missing heartbeat from the monitoring path (dead-man's switch) raises an alert, so a silent monitor or alert channel is itself detected.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1]

## 5. Runbooks and incidents

- **[OPS-34] Deploy and rollback runbook** — `docs/operations.md` documents how a release reaches staging and production and the manual rollback (redeploy the previous immutable image tag on the VPS) with copy-pasteable commands and the expected verification.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/operations.md` · Src: [5], [7]
- **[OPS-35] Restart and rate-limiter recovery runbook** — `docs/operations.md` documents a safe container restart (honoring the ~35 s stop grace) and how to clear the in-process rate-limiter state when legitimate players are throttled.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [5], project: docs/security.md
- **[OPS-36] Secret rotation runbook** — `docs/operations.md` documents, for `NUXT_GOAT_IT_API_GAME_KEY`, the Sentry DSN, the deploy SSH keys and the Docker Hub credentials, where each value lives, how to rotate it and how to verify the rotation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [5]
- **[OPS-37] Upstream outage runbook** — `docs/operations.md` documents how to confirm a Goat It API outage (`/readyz` 503, readiness monitor alert, `goat-it-api.upstream-error` log events), its user-visible effect, the upstream contact and how to verify recovery.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [5], [6]
- **[OPS-38] Runbook commands stay current** — Every command, script path, environment variable, endpoint and URL in `docs/operations.md` exists today (for example `scripts/post-deploy-health-check.sh`, `NUXT_LOGGER_LEVEL`, the `jq` filter on the Pino `level` field).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md`, `scripts/**`, `server/utils/logging/**` · Src: [5]
- **[OPS-39] Rollback rehearsed** — The previous release's image tag was redeployed (staging or production) and the time to recover was recorded.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [5], [7]
- **[OPS-40] Incident contacts** — The repository names the service owner, the escalation path and the upstream Goat It API contact.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [5]
- **[OPS-41] Dependency inventory** — `docs/operations.md` lists every runtime dependency (Goat It API, Sentry, UptimeRobot, VPS host, Docker Hub registry, DNS/TLS provider) with its owner, plan limits and known SLA.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [6], [5]
- **[OPS-42] Failure-mode table** — `docs/operations.md` states, for upstream down, network partition to the upstream, container kill or OOM, host disk full and Sentry unreachable, the expected system behavior and the monitor, alert or log that detects it.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `docs/operations.md` · Src: [1]

## 6. Post-deploy verification

- **[OPS-43] Post-deploy gate in every deploy workflow** — Every deploy workflow runs the health-check composite action as a separate step after the deploy step against the site `/healthz`, and a gate failure fails the deployment job; traffic switches to the new container only after it answers 200 on `/healthz` (the old one keeps serving on failure), or the restart gap of the single-container deploy is documented as accepted.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/actions/health-check/**` · Src: [5], [11], project: docs/operations.md
- **[OPS-44] Bounded gate with strict success** — `scripts/post-deploy-health-check.sh` uses a bounded budget (default 5 attempts, 5 s apart, 3 s per request), treats only HTTP `200` as success, retries any other status, timeout or connection error, and exits non-zero with an `::error::` annotation after the last attempt.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `scripts/post-deploy-health-check.sh`, `.github/actions/health-check/**` · Src: [11], project: docs/operations.md
- **[OPS-45] Smoke beyond liveness** — Post-deploy verification also checks `/readyz`, the home page and one real proxied API call, not only `/healthz`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/deploy-*.yml`, `.github/actions/health-check/**` · Src: [5], [11], project: docs/operations.md
- **[OPS-46] Automatic rollback on failed verification** — A failed post-deploy gate automatically redeploys the previous image tag.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/actions/deploy/**` · Src: [5], project: docs/operations.md

## Sources

[1] Appendix E — Launch Coordination Checklist (Google SRE Book) — https://sre.google/sre-book/launch-checklist/ — fetched 2026-10-31 (2017)
[2] Ch.6 — Monitoring Distributed Systems (Google SRE Book) — https://sre.google/sre-book/monitoring-distributed-systems/ — fetched 2026-10-31 (2017)
[3] Ch.4 — Service Level Objectives (Google SRE Book) — https://sre.google/sre-book/service-level-objectives/ — fetched 2026-10-31 (2017)
[4] Ch.5 — Alerting on SLOs (Google SRE Workbook) — https://sre.google/workbook/alerting-on-slos/ — fetched 2026-10-31 (2018)
[5] Mercari Production Readiness Checklist — Pre-production Checklist — https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/pre-production-checklist.md — fetched 2026-10-31 (repo master)
[6] Mercari Production Readiness Checklist — Design Checklist — https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/design-checklist.md — fetched 2026-10-31 (repo master)
[7] Mercari Production Readiness Checklist — Zero downtime deploy — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/zero-downtime-deploy.md — fetched 2026-10-31 (repo master)
[8] Mercari Production Readiness Checklist — Request ID — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/request-id.md — fetched 2026-10-31 (repo master)
[9] Mercari Production Readiness Checklist — Container log format — https://github.com/mercari/production-readiness-checklist/blob/master/docs/references/container-log-format.md — fetched 2026-10-31 (repo master)
[10] Mercari Production Readiness Checklist — SLOs — https://github.com/mercari/production-readiness-checklist/blob/master/docs/concepts/slo.md — fetched 2026-10-31 (repo master)
[11] AWS Builders' Library — Implementing health checks — https://aws.amazon.com/builders-library/implementing-health-checks/ — fetched 2026-10-31 (undated article)
[12] Sentry — Nuxt guide — https://docs.sentry.io/platforms/javascript/guides/nuxt/ — fetched 2026-10-31 (docs for SDK v11; library @sentry/nuxt 11.9.0)
[13] Sentry — Source Maps for Nuxt — https://docs.sentry.io/platforms/javascript/guides/nuxt/sourcemaps/ — fetched 2026-10-31 (docs for SDK v11; library @sentry/nuxt 11.9.0)
[14] Sentry — Options for Nuxt — https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/ — fetched 2026-10-31 (docs for SDK v11; library @sentry/nuxt 11.9.0)
[15] Sentry — Sampling for Nuxt — https://docs.sentry.io/platforms/javascript/guides/nuxt/sampling/ — fetched 2026-10-31 (docs for SDK v11; library @sentry/nuxt 11.9.0)
[16] Sentry — Releases & Health — https://docs.sentry.io/platforms/javascript/configuration/releases/ — fetched 2026-10-31 (current docs)
[17] Sentry — Alerts — https://docs.sentry.io/product/monitors-and-alerts/alerts/ — fetched 2026-10-31 (current docs)
[18] Sentry — Spike Protection — https://docs.sentry.io/pricing/quotas/spike-protection/ — fetched 2026-10-31 (current docs)
[19] OpenTelemetry — Logs concept — https://opentelemetry.io/docs/concepts/signals/logs/ — fetched 2026-10-31 (current docs)
[20] sentry-javascript — MIGRATION.md (v10 to v11) — https://github.com/getsentry/sentry-javascript/blob/11.6.0/MIGRATION.md — fetched 2026-10-31 (tag 11.6.0; library @sentry/nuxt 11.9.0)
