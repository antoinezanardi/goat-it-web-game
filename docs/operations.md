# Operations

Operational contract for health checking, deployment verification, and shutdown of the Goat It Web Game container.
Architecture and file placement are owned by [Architecture](architecture.md); request hardening is owned by [Security](security.md).

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

## Out of scope

Error tracking, structured application logging, external uptime-monitor configuration, numeric SLOs, and automatic rollback are intentionally not configured here. They are tracked as follow-up work, and this repository claims neither a configured external monitor nor an SLO target.
