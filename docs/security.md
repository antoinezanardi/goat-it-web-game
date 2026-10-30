# Security hardening

Reference for the defensive middleware shipped with the API & client security hardening batch.
Related issues: #455 (rate limiting), #459 (fetch pipeline), #460 (security headers / CSP), #471 (excluded ids cap), #475 (error messages).

## Response headers

`server/middleware/01-security-headers.middleware.ts` applies the following headers to **every** response:

| Header                      | Value                                                                         |
|-----------------------------|-------------------------------------------------------------------------------|
| `X-Content-Type-Options`    | `nosniff`                                                                     |
| `X-Frame-Options`           | `DENY`                                                                        |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                             |
| `Permissions-Policy`        | `camera=(), microphone=(), geolocation=(), fullscreen=(), display-capture=()` |
| `Strict-Transport-Security` | `max-age=31536000`                                                            |

`Strict-Transport-Security` deliberately omits `includeSubDomains` and `preload`, and is ignored by browsers over http.

Every path starting with `/api/` additionally gets:

| Header          | Value               |
|-----------------|---------------------|
| `Cache-Control` | `private, no-store` |
| `Vary`          | `Cookie`            |

The proxy answers per user (the `goat_it_locale` cookie changes the forwarded `Accept-Language`), hence the private, uncacheable response.

## Content Security Policy

`server/utils/security/helpers/security-headers/security-headers.helpers.ts` registers Nuxt's `render:html` hook through `registerCspNonceHook`. For every rendered page it:

1. generates a nonce with `crypto.randomUUID()`;
2. stamps `nonce="…"` on every `<script>` tag lacking one in the head, body-prepend and body-append chunks (body-append only on the buffered render path; the app-rendered body HTML is deliberately left untouched so injected scripts never receive the nonce);
3. sets the policy header.

The Nuxt 4.6 renderer reads the nonce back from the rendered head and reuses it on its own inline scripts (bootstrap, IIFE, payload), so a strict `script-src` does not break hydration.

Policy:

```text
default-src 'self'; script-src 'self' 'wasm-unsafe-eval' 'nonce-…'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;
font-src 'self'; connect-src 'self'; worker-src 'self' blob:; manifest-src 'self'; frame-ancestors 'none';
base-uri 'self'; form-action 'self'; object-src 'none'
```

When a Sentry DSN is configured, the server appends the ingest origin parsed from `NUXT_PUBLIC_SENTRY_DSN` (for example `https://o123.ingest.us.sentry.io`) to `connect-src`. The origin is derived at render time, is never widened to `*.sentry.io`, and no same-origin tunnel is added. With no DSN, the policy keeps `connect-src 'self'`.

`script-src` keeps `'wasm-unsafe-eval'` because Nuxt Content runs its client-side SQLite queries through a WebAssembly module; without it the browser refuses to instantiate the module and the lazy changelog query fails. It only authorises WebAssembly compilation — `eval` and `new Function` stay blocked.

`style-src` keeps `'unsafe-inline'` because a style nonce would cancel it and break the @nuxt/ui runtime styles.

Modes are controlled by `NUXT_SECURITY_CSP_MODE`:

| Mode                | Behaviour                                                                                                              |
|---------------------|------------------------------------------------------------------------------------------------------------------------|
| `enforce` (default) | `Content-Security-Policy` header                                                                                       |
| `report-only`       | `Content-Security-Policy-Report-Only` header — nonces are still stamped so switching to `enforce` needs no HTML change |
| `off`               | no header, no stamping                                                                                                 |

`envs/.env.development` uses `report-only` so dev-only inline scripts (devtools) do not break local development. Production and the acceptance build stay on `enforce`.

## Error tracking (Sentry)

The client and server Sentry entrypoints initialize when `!import.meta.dev`, `public.sentry.disabled` is `false`, the environment label is `production` or `staging`, and a non-empty `NUXT_PUBLIC_SENTRY_DSN` is present. Development never initializes; the `--envName test` acceptance build disables the Sentry module and sets `NUXT_PUBLIC_SENTRY_DISABLED=true`. Boot validation requires a valid HTTPS Sentry ingest DSN and a `production` or `staging` label on a deployed build unless error tracking is explicitly disabled. The client reads `runtimeConfig.public.sentry`; the server config reads `process.env` because it is evaluated before Nuxt runtime config is available. The environment label is derived from `NUXT_SITE_ENV`; only `production` and `staging` labels are supported.

- The DSN is a public ingest identifier, not a secret. It is exposed to the browser through `runtimeConfig.public.sentry`.
- No Sentry auth token is used. Docker builds and runtime configuration carry no Sentry credential.
- Sentry source-map generation and upload are disabled in the build (`sentry.sourcemaps.disable`), so no source-map artifacts are produced for Sentry; client stack traces may be minified. Build-time telemetry is disabled (`sentry.telemetry: false`).
- Sentry tracing, session replay, feedback, and log ingestion are not enabled.
- Sentry v11 `dataCollection` disables `userInfo`, cookies, headers, query parameters, HTTP bodies, and stack-frame variables at the source. `beforeSend` removes `user` and `extra`, strips query strings from the transaction and request URL, attaches a sanitized `errorCode` tag, and drops expected 4xx responses, health-check traffic, and aborted upstream requests. `beforeBreadcrumb` strips query strings from breadcrumb URLs and drops health-check fetch breadcrumbs.
- Exception type, value, mechanism, stack, contexts, breadcrumbs, messages, the query-free request URL, the sanitized `errorCode` tag, and the environment label are kept for diagnosis.
- The Nitro SDK error hook captures unhandled server failures. No second Sentry capture hook is registered.
- Errors deliberately converted into a graceful toast are reported once by the client error-handling boundary only when they are client-only unexpected errors (for example a repository `ZodError` or a runtime error). `FetchError` values, any error carrying an HTTP status, and aborted/timed-out requests are never reported from the client because the server or the SDK already owns them.
- `ignoreErrors` and `denyUrls` rely on the SDK's default `EventFilters` integration, which stays enabled.

## Rate limiting

`server/middleware/02-api-rate-limit.middleware.ts` applies a fixed-window limiter to `/api/goat-it-api/**` only.

| Variable                           | Default | Meaning                                 |
|------------------------------------|---------|-----------------------------------------|
| `NUXT_RATE_LIMIT_MAXIMUM_REQUESTS` | `60`    | requests allowed per window per client  |
| `NUXT_RATE_LIMIT_WINDOW_IN_MS`     | `60000` | window length                           |
| `NUXT_RATE_LIMIT_TRUST_PROXY`      | `false` | trust the first `X-Forwarded-For` entry |

When the budget is exceeded the proxy answers `429 Too Many Requests` with `Retry-After: <seconds>` and `data.errorCode = "rate-limited"`.

### Trust contract

With `NUXT_RATE_LIMIT_TRUST_PROXY=true`, h3 reads the **first** `X-Forwarded-For` entry, which a client can spoof unless the reverse proxy overwrites it. The reverse proxy MUST set:

```nginx
proxy_set_header X-Forwarded-For $remote_addr;
```

Leave the flag off when the app is exposed directly.

### Scale-out footgun

Limiter state is an in-process `Map`: it is correct for the single-container compose deployment, but a multi-instance deployment would give each instance its own budget. Replacing `createFixedWindowRateLimiter` with a shared store (Redis, unstorage) is the intended extension point.

## Request body guard

`server/middleware/03-api-body-guard.middleware.ts` guards `POST /api/goat-it-api/**` **before** the body is buffered:

| Condition                                              | Status | `data.errorCode`  |
|--------------------------------------------------------|--------|-------------------|
| `content-length` missing or not a non-negative integer | `411`  | `invalid-request` |
| `content-length` above `512 KiB`                       | `413`  | `invalid-request` |
| `content-type` not `application/json`                  | `415`  | `invalid-request` |

A real payload is at most ~1000 ids (~27 KB). Chunked uploads without `content-length` are rejected by the 411 rule; the first-party client always sends `Content-Length`.

## Upstream fetch pipeline

- `redirect: "error"` — the upstream can never redirect the proxy to a third party, so the `goat-it-api-key` header cannot leak through a followed cross-origin redirect.
- Retry is method-aware: `GET` retries twice, `POST` never retries (`retry: 0`).
- The request signal is `AbortSignal.any([disconnect, AbortSignal.timeout(10s)])`. ofetch ignores its own `timeout` option when a `signal` is present, so the timeout is composed here; the client disconnect aborts the upstream call only when the response has not already been sent.
- `createGoatItApiEndpoint` percent-encodes every slash-separated path segment.
- Responses tolerate additive upstream fields: when every response schema issue is `unrecognized_keys`, those keys are stripped from a structured clone and the payload is re-parsed. Contract drift of any other kind is a `502 upstream-error`.
- The client-side 15 s timeout (`GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS`) is enforced by `useAsyncAction`, which aborts the request signal; it stays above the ~10 s server worst case.

### Known limitation

The **response** size from the upstream is not capped. A `Content-Length` guard is cosmetic against chunked responses, and undici's `maxResponseSize` lives on dispatchers (a version-risky extra dependency). The mitigations are the pinned, env-validated `baseUrl`, the refused redirects and the 10 s timeout.

## Service worker and offline fallback

`/sw.js` is generated by `@vite-pwa/nuxt`, served same-origin with scope `/`, and precaches the offline shell
(the prerendered `/offline` document, the entry stylesheet, and the self-hosted fonts) rather than every
hashed app chunk. No API response is cached (the locale cookie cannot be partitioned by
Cache Storage), and no cross-origin scripts are imported. `/offline` is excluded from indexing
(`robots: false`), and `@nuxtjs/sitemap` filters robots-blocked routes, so it is excluded from the sitemap as well.
See [PWA](pwa.md) for the full contract.

## Error contract

Every error the proxy emits carries `data.errorCode`:

| Status                        | `errorCode`        |
|-------------------------------|--------------------|
| `400` / `411` / `413` / `415` | `invalid-request`  |
| `429`                         | `rate-limited`     |
| `502`                         | `upstream-error`   |
| `504`                         | `upstream-timeout` |
| `500`                         | `internal-error`   |

Forwarded upstream `4xx` keep their status and carry the upstream `errorCode` when the body provides one. The client resolves `errors.goatItApi.<code>` in the six locales and falls back on the HTTP status when no code is present.

## Structured server logs

`server/utils/logging/` owns a server-only Pino logger that writes newline-delimited JSON to stdout. It has no file output, worker transport, or remote sink.

| Variable            | Default | Validated                                                    |
|---------------------|---------|--------------------------------------------------------------|
| `NUXT_LOGGER_LEVEL` | `info`  | `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent` |

Logged metadata is limited to an event name, HTTP status, method, query-free path, error class name, and error code. Request/response bodies, cookies, authorization headers, query strings, API/game keys, h3 error `data`, and source IPs are never logged. Redaction paths are defense in depth; the mapping layer already omits those fields.

The Nitro error hook skips expected 4xx responses and proxy failures already handled by the Goat It API error path. It never calls Sentry and never throws; a logger write failure is caught and falls back to `console.error`.

## Environment variables

| Variable                           | Required        | Default   | Validated                                                 |
|------------------------------------|-----------------|-----------|-----------------------------------------------------------|
| `NUXT_GOAT_IT_API_BASE_URL`        | yes             | —         | valid URL; https in production (loopback/internal exempt) |
| `NUXT_GOAT_IT_API_GAME_KEY`        | yes             | —         | non-empty                                                 |
| `NUXT_PUBLIC_DEFAULT_LOCALE`       | yes             | `en`      | supported locale                                          |
| `NUXT_RATE_LIMIT_MAXIMUM_REQUESTS` | no              | `60`      | integer ≥ 1                                               |
| `NUXT_RATE_LIMIT_WINDOW_IN_MS`     | no              | `60000`   | integer ≥ 1                                               |
| `NUXT_RATE_LIMIT_TRUST_PROXY`      | no              | `false`   | boolean                                                   |
| `NUXT_SECURITY_CSP_MODE`           | no              | `enforce` | `enforce` \| `report-only` \| `off`                       |
| `NUXT_PUBLIC_SENTRY_DSN`           | deployed builds unless disabled | — | valid HTTPS Sentry ingest URL                  |
| `NUXT_PUBLIC_SENTRY_DISABLED`      | no              | `false`   | boolean; `true` explicitly disables tracking              |
| `NUXT_LOGGER_LEVEL`                | no              | `info`    | supported Pino level                                      |

Invalid values fail the Nitro boot (values are never logged).
