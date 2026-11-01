# Operations

Operational contract for health checking, deployment verification, and shutdown of the Goat It Web Game container.
Architecture and file placement are owned by [Architecture](architecture.md); request hardening and error-tracking data collection are owned by [Security](security.md).

## Health endpoints

Both endpoints are public, unauthenticated, and answer `GET` at the site root. Neither passes through the rate limiter, which only guards `/api/goat-it-api/**`.

| Endpoint | Meaning | Success | Failure |
| --- | --- | --- | --- |
| `/healthz` | Liveness: the Nitro web process is up and serving. It never calls the Goat It API. | `200` with `{ "status": "ok" }` | — |
| `/readyz` | Readiness: the web process is up **and** the Goat It API health endpoint answers. | `200` with `{ "status": "ready" }` | `503` with `{ "status": "not_ready" }` |

Both responses send `Cache-Control: no-store`. Clients, browsers, and intermediaries must not cache them.

### Readiness contract

`/readyz` calls the configured Goat It API base URL (`NUXT_GOAT_IT_API_BASE_URL`) at its `/health` path:

- The probe is a single `GET` with a 3-second timeout and no retry, and it does not send the game key.
- Any non-200 status, connection failure, or timeout produces the same `503` body. Upstream status, URL, headers, body, and exception text are never returned.
- The result, success or failure, is cached in-process for 5 seconds. Concurrent cache misses share a single in-flight probe, so a burst of requests cannot fan out to the upstream.
- Each server process owns its cache, so a state transition can take up to 5 seconds to appear in readiness.
- An unexpected local failure (for example an invalid runtime configuration) propagates instead of being reported as ready or not ready.

Use `/readyz` for dependency monitoring and `/healthz` for process liveness. Never point a container liveness probe at `/readyz`: an upstream outage would then restart a healthy web process.

## Container health check

The `Dockerfile` production stage probes `http://localhost:3002/healthz` with a real `GET` every 20 seconds, with a 5-second timeout and 3 retries. The container reports unhealthy only when the web process stops answering.

## Graceful shutdown

Nitro handles `SIGTERM` and `SIGINT` itself and keeps its 30-second default shutdown timeout. The application registers no custom close hook because it owns no long-lived database, queue, or socket resource.

**External deployment requirement:** the container runtime must allow about 35 seconds between `SIGTERM` and `SIGKILL`, so Nitro's 30-second budget is never cut short. Docker on Linux defaults to a 10-second stop grace, so the Compose/runtime configuration supplied outside this repository must raise it (for example `stop_grace_period: 35s` in Compose, or `docker stop --time 35`). This is not a Dockerfile instruction: `HEALTHCHECK` and `STOPSIGNAL` do not set the stop grace period.

## Post-deploy smoke verification

The staging and production workflows run the `health-check` composite action as a separate step after the SSH deploy step. The action executes `scripts/post-deploy-health-check.sh` against `<site-url>/healthz`:

- 5 attempts, 5 seconds apart, with a 3-second request timeout each;
- only HTTP `200` passes; every other status, timeout, or connection error keeps retrying;
- after the last failed attempt the step exits non-zero and fails the deployment job.

The gate proves the deployed web server answers. It does not prove that the Goat It API is ready, does not verify a build SHA, and does not roll back. It uses the existing `PREPRODUCTION_SITE_URL` and `PRODUCTION_SITE_URL` repository variables, so no new secret or variable is required.

## Error tracking

Sentry captures client and server failures for the production and staging deployments. One Sentry project is used; events are separated by the `production` and `staging` environment labels. Collection, scrubbing, and drop rules are owned by [Security](security.md#error-tracking-sentry).

- The DSN is provided through `NUXT_PUBLIC_SENTRY_DSN`. It is an ingest identifier, not a credential.
- Sentry initializes when `!import.meta.dev`, `public.sentry.disabled` is `false`, the environment label is `production` or `staging`, and the DSN is non-empty. Development never initializes; the `$test` build disables the Sentry module and sets `NUXT_PUBLIC_SENTRY_DISABLED=true`, so automated tests never contact Sentry.
- A deployed production/staging build fails boot when error tracking is enabled (`disabled=false`) but the environment label or the HTTPS Sentry ingest DSN is missing or invalid. The DSN must include a public key and a numeric project id. Setting `NUXT_PUBLIC_SENTRY_DISABLED=true` explicitly disables error tracking.
- The environment label comes from `public.sentry.environment`, resolved from `NUXT_SITE_ENV` at build time for the client and from `NUXT_SITE_ENV` at runtime for the server. Only `production` and `staging` labels exist; `NUXT_PUBLIC_SENTRY_ENVIRONMENT` is not used.
- No release label is configured by the application; release-based regression tracking is not part of the current monitoring contract.
- No Sentry auth token is used. Sentry source-map generation and upload are disabled in the build (`sentry.sourcemaps.disable`), so no source-map artifacts are produced for Sentry; client stack traces can therefore be minified and less readable. Build-time telemetry is also disabled (`sentry.telemetry: false`).

## Structured server logs

Nitro writes newline-delimited JSON to stdout through Pino. No file, worker-thread transport, or remote log sink is configured; collect the container's stdout with the platform's existing logging driver. Safe-field, redaction, and privacy rules are owned by [Security](security.md#structured-server-logs).

- `NUXT_LOGGER_LEVEL` controls the minimum level (`fatal`, `error`, `warn`, `info`, `debug`, `trace`, or `silent`); the default is `info`.
- Upstream API failures and additive schema drift are logged as warnings; unexpected 5xx failures that no specific path already logged are logged as errors.
- A logging failure must never fail the request: Pino writes locally, logger write errors are caught, and the Nitro error hook never throws. A caught logging failure falls back to `console.error`.

Inspect a container's JSON logs with:

```bash
docker logs <container> 2>&1 | jq -R 'fromjson? // empty | select(.level >= 40)'
```

Nitro and consola also emit non-JSON lines (for example the listening banner); the `fromjson?` filter skips them.

## External uptime monitoring

Four UptimeRobot Free HTTP monitors are configured in the provider account. The repository contains no API token, sync script, or automatic provisioning.

| Environment | Monitor   | Method       | URL                                  | Expected result                          | Cadence   |
|-------------|-----------|--------------|--------------------------------------|------------------------------------------|-----------|
| Production  | Liveness  | GET, keyword | `https://goat-it.fr/healthz`         | 2xx and body contains `"status":"ok"`    | 5 minutes |
| Production  | Readiness | GET, keyword | `https://goat-it.fr/readyz`          | 2xx and body contains `"status":"ready"` | 5 minutes |
| Staging     | Liveness  | GET, keyword | `https://staging.goat-it.fr/healthz` | 2xx and body contains `"status":"ok"`    | 5 minutes |
| Staging     | Readiness | GET, keyword | `https://staging.goat-it.fr/readyz`  | 2xx and body contains `"status":"ready"` | 5 minutes |

The monitors use UptimeRobot's free keyword monitor with GET, alert-on-keyword-present semantics, and a five-minute interval. Email and/or mobile push notifications available on the free tier are configured. Monitor names include the environment and probe type so liveness and readiness incidents stay distinct. The free plan supports up to 50 monitors at a five-minute cadence, limits notification channels, and excludes features such as maintenance windows.

## Reliability targets

No numeric SLO is defined. Liveness and readiness have different meanings and different owners. Observed uptime is reviewed after a monitoring baseline exists before availability targets are set.

## Out of scope

Source-map upload, Sentry auth tokens, Sentry release tagging, remote log shipping, general access/request logging, numeric SLOs, automated UptimeRobot provisioning, and migration of browser-only diagnostic console calls to Pino are intentionally not implemented. Automatic rollback remains out of scope.
