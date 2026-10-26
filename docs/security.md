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

`script-src` keeps `'wasm-unsafe-eval'` because Nuxt Content runs its client-side SQLite queries through a WebAssembly module; without it the browser refuses to instantiate the module and the lazy changelog query fails. It only authorises WebAssembly compilation — `eval` and `new Function` stay blocked.

`style-src` keeps `'unsafe-inline'` because a style nonce would cancel it and break the @nuxt/ui runtime styles.

Modes are controlled by `NUXT_SECURITY_CSP_MODE`:

| Mode                | Behaviour                                                                                                              |
|---------------------|------------------------------------------------------------------------------------------------------------------------|
| `enforce` (default) | `Content-Security-Policy` header                                                                                       |
| `report-only`       | `Content-Security-Policy-Report-Only` header — nonces are still stamped so switching to `enforce` needs no HTML change |
| `off`               | no header, no stamping                                                                                                 |

`envs/.env.development` uses `report-only` so dev-only inline scripts (devtools) do not break local development. Production and the acceptance build stay on `enforce`.

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
- Client repositories time out after 15 s (`GOAT_IT_API_CLIENT_REQUEST_TIMEOUT_IN_MS`), above the ~10 s server worst case.

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

## Environment variables

| Variable                           | Required | Default   | Validated                                                 |
|------------------------------------|----------|-----------|-----------------------------------------------------------|
| `NUXT_GOAT_IT_API_BASE_URL`        | yes      | —         | valid URL; https in production (loopback/internal exempt) |
| `NUXT_GOAT_IT_API_GAME_KEY`        | yes      | —         | non-empty                                                 |
| `NUXT_PUBLIC_DEFAULT_LOCALE`       | yes      | `en`      | supported locale                                          |
| `NUXT_RATE_LIMIT_MAXIMUM_REQUESTS` | no       | `60`      | integer ≥ 1                                               |
| `NUXT_RATE_LIMIT_WINDOW_IN_MS`     | no       | `60000`   | integer ≥ 1                                               |
| `NUXT_RATE_LIMIT_TRUST_PROXY`      | no       | `false`   | boolean                                                   |
| `NUXT_SECURITY_CSP_MODE`           | no       | `enforce` | `enforce` \| `report-only` \| `off`                       |

Invalid values fail the Nitro boot (values are never logged).
