# SEC — Application security

Security of the running Goat It web game: HTTP response headers and browser isolation, the nonce-based Content Security Policy, XSS and
injection risks in Vue/Nuxt rendering, validation of every input reaching the Nitro proxy, the outbound pipeline to the Goat It API,
secret and configuration exposure in the client bundle and `.output`, abuse and cost amplification (rate limiting, client-IP trust,
fan-out, ReDoS), cookie flags and client storage, error leakage, security event logging, vulnerability disclosure, third-party resources
and remaining web risks (CORS, open redirect, CSRF, Host header, prototype pollution).

**Decision doc:** `docs/security.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** dependency vulnerabilities, pnpm, Renovate, `.env*` in git → SUP · workflows → CICD · image and build secrets → PLAT · Sentry data collection, cookie consent → PRIV · timeouts, retries, cancellation → REL · alerting, log shipping, structured log schema → OPS · Cache Storage and runtime caching scope → PWA

## Contents

- [1. Headers and browser isolation](#1-headers-and-browser-isolation)
- [2. Content Security Policy](#2-content-security-policy)
- [3. XSS and injection in Vue and Nuxt](#3-xss-and-injection-in-vue-and-nuxt)
- [4. Server input validation and API contract](#4-server-input-validation-and-api-contract)
- [5. Outbound calls, SSRF and upstream pipeline](#5-outbound-calls-ssrf-and-upstream-pipeline)
- [6. Secrets and configuration exposure](#6-secrets-and-configuration-exposure)
- [7. Abuse, DoS and cost amplification](#7-abuse-dos-and-cost-amplification)
- [8. Cookies and client storage](#8-cookies-and-client-storage)
- [9. Error handling and information leakage](#9-error-handling-and-information-leakage)
- [10. Security logging](#10-security-logging)
- [11. Vulnerability disclosure](#11-vulnerability-disclosure)
- [12. Third-party resources](#12-third-party-resources)
- [13. Other web risks](#13-other-web-risks)
- [Sources](#sources)

## 1. Headers and browser isolation

- **[SEC-01] Security headers on every response** — On the production build, every HTML route, every API route, a static asset, a health probe and an unknown path (404) each return `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and `Strict-Transport-Security` with the values documented in `docs/security.md`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Look: `server/middleware/**`, `tests/acceptance/features/security/**` · Src: [8], [30], project: docs/security.md
- **[SEC-02] HSTS max-age** — `Strict-Transport-Security` carries `max-age` ≥ `31536000`; `includeSubDomains` and `preload` are added only once every subdomain is HTTPS-only and the domain is submitted to the preload list, otherwise their omission is documented.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/security/**` · Src: [8], [4], project: docs/security.md
- **[SEC-03] nosniff everywhere** — The global header middleware sets `X-Content-Type-Options: nosniff` for every path, including `/api/**` JSON and error responses, and every handler answers with an explicit, correct `Content-Type`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/middleware/**`, `server/utils/security/**` · Src: [8], [19]
- **[SEC-04] Explicit Referrer-Policy** — `Referrer-Policy` is `strict-origin-when-cross-origin` or stricter (`same-origin`, `no-referrer`), so outbound question source links never receive in-app paths or query strings.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `server/utils/security/**` · Src: [8], [4]
- **[SEC-05] Legacy framing fallback** — `X-Frame-Options: DENY` is sent alongside CSP `frame-ancestors 'none'` ([SEC-11]) for browsers without CSP Level 2; `SAMEORIGIN` or `ALLOW-FROM` is a finding.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/security/**` · Src: [8], [4]
- **[SEC-06] Permissions-Policy deny-list** — `Permissions-Policy` disables every powerful feature the game never uses, at least `camera=()`, `microphone=()`, `geolocation=()`, `display-capture=()`, `payment=()` and `usb=()`; no feature is granted to `*`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `server/utils/security/**` · Src: [8], [13]
- **[SEC-07] Cross-origin opener and resource policies** — Documents send `Cross-Origin-Opener-Policy: same-origin` and responses send `Cross-Origin-Resource-Policy: same-origin` (or `same-site`); `Cross-Origin-Embedder-Policy` is added only when a feature requires cross-origin isolation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/security/**`, `server/middleware/**` · Src: [8], [19], [4]

## 2. Content Security Policy

- **[SEC-08] Nonce-based `script-src`** — `script-src` is `'self'` plus a per-render `'nonce-…'` (optionally `'strict-dynamic'`), with no `'unsafe-inline'`, no `*`, `https:`, `http:` or `data:` source and no third-party host; eval-class allowances are checked in SEC-19.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/security/**` · Src: [9], [20], [4], project: docs/security.md
- **[SEC-09] Nonce on every rendered script** — On every HTML route of the production build, including the 404 page, each `<script>` element of the rendered document carries the nonce from the response CSP header, and the browser reports zero CSP violations.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Look: `tests/acceptance/features/security/**` · Src: [20], [9], project: docs/security.md
- **[SEC-10] CSP baseline directives** — The enforced policy contains `default-src 'self'`, `object-src 'none'`, `base-uri 'self'` (or `'none'`), `form-action 'self'` and `frame-ancestors 'none'`, and is delivered as an HTTP header, never only through `<meta http-equiv>` (which cannot carry `frame-ancestors` or reporting).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/security/**` · Src: [9], [4], [19]
- **[SEC-11] CSP violation reporting** — When violation reporting is configured, the policy declares `report-to <group>` with a matching `Reporting-Endpoints` header targeting a same-origin endpoint that accepts `application/reports+json`, answers `204`, is rate limited and logs reports in a bounded form; otherwise the check is N/A.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `server/utils/security/**`, `server/routes/**` · Src: [9], [4], [7]
- **[SEC-12] Enforced CSP on every HTML response** — Every HTML response of the production build, including 404 and 500 error pages, carries `Content-Security-Policy`, not only `Content-Security-Policy-Report-Only`.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Look: `tests/acceptance/features/security/**` · Src: [8], [9], [4]
- **[SEC-13] Enforce mode in deployed environments** — The CSP is enforced in every deployed environment; report-only is limited to non-deployed environments and `off` is never deployed. When a mode switch exists, it accepts only enforce, report-only and off.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `envs/**`, `server/utils/env/**`, `nuxt.config.ts` · Src: [9], project: docs/security.md
- **[SEC-14] Nonce entropy** — The nonce is generated per render by a CSPRNG (Web Crypto or `node:crypto`) with at least 128 bits of entropy, base64-encoded, and never derived from time, a counter or request data.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/security/**` · Src: [9], [20]
- **[SEC-15] Nonce freshness** — Two consecutive requests to the same SSR route return different nonces in both header and HTML; no cache, ISR or SWR route rule serves HTML whose nonce was minted for an earlier response.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [9], [20]
- **[SEC-16] No nonce baked into prerendered pages** — When a route is prerendered (`routeRules` `prerender: true`, e.g. `/offline`), it renders with `noScripts: true` or uses a hash-based policy, never a nonce frozen at build time.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `nuxt.config.ts` · Src: [9], [20]
- **[SEC-17] Nonce stamping scope** — The nonce is attached only to framework-emitted script markup; app-rendered body HTML is never rewritten, so an injected `<script>` cannot inherit the nonce.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/security/**`, `server/plugins/csp-nonce/**` · Src: [9], project: docs/security.md
- **[SEC-18] No eval-class allowances** — `'unsafe-eval'` is absent from `script-src`; `'wasm-unsafe-eval'` is present only while Nuxt Content's client-side SQLite WebAssembly queries require it, with that reason documented.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/security/**` · Src: [9], [2], project: docs/security.md
- **[SEC-19] No `new Function`-based parsers in client code** — Client code never calls `z.compile()`, which builds its parser with `new Function` and is blocked by a CSP without `'unsafe-eval'`; externally generated parsers are installed with `z.withParser()` instead (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.ts`, `shared/**/*.ts` · Src: [26], [9]
- **[SEC-20] `style-src` scope** — `style-src` is `'self'` plus `'unsafe-inline'` only with its documented reason (@nuxt/ui runtime styles); no style nonce or hash is mixed in (it would cancel `'unsafe-inline'`) and no third-party style host is listed.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `server/utils/security/**` · Src: [9], project: docs/security.md
- **[SEC-21] Minimal fetch directives** — `connect-src` is `'self'` plus only the exact Sentry ingest origin derived from a valid DSN (never `*.sentry.io`, `https:` or `*`), and every other fetch directive lists only the origins the app actually uses, with no wildcard, scheme-only or third-party source.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/security/**`, `shared/utils/helpers/sentry/**` · Src: [9], [19], project: docs/security.md

## 3. XSS and injection in Vue and Nuxt

- **[SEC-22] No `v-html` on untrusted data** — No `v-html` (or `innerHTML` render-function prop) receives any untrusted value — upstream API data, route or query values, cookie or storage values, parameterised locale messages or content data; any remaining use renders a compile-time constant or server-sanitized HTML, because Vue escapes interpolations and attribute bindings but renders `v-html` raw (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue` · Src: [21], [10], [2]
- **[SEC-23] No dangerous DOM sinks** — `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `srcdoc` and `Range.createContextualFragment` are absent from `app/**` and `shared/**`, or receive only constants.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.ts`, `app/**/*.vue`, `shared/**/*.ts` · Src: [10], [2], [21]
- **[SEC-24] URL-scheme allowlist for bound URLs** — Every data-driven URL bound to navigation or resource attributes (`:href`, `:src`, `:action`, `:formaction`, link `to`) is validated with an explicit scheme allowlist before render, because a generic URL validator accepts `javascript:` and `data:` schemes (verified: zod 4.6.7) and Vue does not sanitize URL schemes (verified: vue 3.5.44); `z.httpUrl()` or `z.url({ protocol: /^https?$/ })` satisfy it.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `shared/schemas/**`, `shared/utils/helpers/question/**`, `app/**/*.vue` · Src: [25], [21], [2], [10]
- **[SEC-25] Safe external links** — Every `target="_blank"` link renders a `rel` containing `noopener` (preferably `noopener noreferrer`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [21]
- **[SEC-26] Constrained style bindings** — `:style` uses object syntax with fixed property names; no API or user string is bound as a whole CSS declaration or rendered inside a `<style>` element (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/**/*.vue` · Src: [21]
- **[SEC-27] Plain-text locale messages** — Values in `app/i18n/locales/**` contain no HTML markup, no translated message is rendered through `v-html`, and message keys are never built from API or user input.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/i18n/locales/**`, `app/**/*.vue` · Src: [2], [10]
- **[SEC-28] Trusted markdown sources only** — Content collections load only repository files under `content/**` (no remote source, no user-authored markdown); any non-repository source adds a sanitizing rehype plugin, because the content pipeline ships no built-in HTML sanitizer (verified: @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `content.config.ts`, `nuxt.config.ts`, `content/**` · Src: [27], [2], [10]
- **[SEC-29] SSR payload escaping** — With a stubbed upstream returning question text containing `</script><script>alert(1)</script>`, `<!--` and U+2028/U+2029, the rendered HTML and the hydration payload keep the text escaped: no markup breakout and no script execution.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [2], [4]
- **[SEC-30] No runtime template compilation** — No `compile()` call, no `template` option built from data, no alias to the Vue build that bundles the template compiler, no `<component :is>` fed an API or user string, and Vue is never mounted on server-rendered user content (verified: vue 3.5.44).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.vue`, `app/**/*.ts`, `nuxt.config.ts` · Src: [21]
- **[SEC-31] No string-evaluated code** — `eval`, `new Function`, string-form `setTimeout`/`setInterval` and data bound to `on*` attributes are absent from `app/**`, `server/**` and `shared/**`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.ts`, `server/**`, `shared/**/*.ts` · Src: [12], [2], [21], [32]

## 4. Server input validation and API contract

- **[SEC-32] Schema-validated handler inputs** — Every API handler validates its query, body and path parameters with a Zod schema before use, through the project's validated-read helpers; no raw query, body or router-param value reaches the upstream call (verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/api/**`, `server/utils/goat-it-api/**` · Src: [3], [13], [12], [23]
- **[SEC-33] Explicit unknown-key policy on request schemas** — Each request schema, including those imported from `@goat-it/schemas`, sets its unknown-key policy deliberately: `z.strictObject()`/`.strict()` to reject or `z.object()` to strip (the default); `z.looseObject()`, `.passthrough()` or `.catchall()` never forward unknown keys upstream (verified: zod 4.6.7).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/api/**`, `shared/schemas/**` · Src: [25], [3]
- **[SEC-34] Explicit request body-size guard** — Because h3 v1 `readBody`, `readRawBody` and `readValidatedBody` buffer the whole body and expose no size-limit option (verified: h3 1.15.11), a middleware rejects every body-bearing `/api/**` request (`POST`, and `PUT`/`PATCH`/`DELETE` once such routes exist) before buffering: missing or invalid `content-length` → `411`, above `512 KiB` → `413`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/middleware/**`, `server/utils/security/**` · Src: [23], [12], [16], [31], project: docs/security.md
- **[SEC-35] JSON-only request bodies** — Body-bearing API routes accept only `application/json` and answer `415` otherwise, because h3 `readBody` also parses `application/x-www-form-urlencoded` (verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/middleware/**`, `server/utils/security/**` · Src: [23], [13]
- **[SEC-36] Repeated query parameters rejected** — Query schemas declare each parameter as a scalar or an explicit array, so a repeated parameter (`?limit=1&limit=2`, which h3's ufo-based `getQuery` returns as an array) fails with `400` instead of reaching the upstream as an unexpected type (verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/api/**` · Src: [23], [3]
- **[SEC-37] Numeric and collection bounds** — `limit` is clamped to `FIND_QUESTIONS_QUERY_LIMIT_MAXIMUM`, and every array input (`excludedIds`, theme and category filters) and string input has an explicit maximum length in its schema.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/api/**`, `server/utils/goat-it-api/**`, `shared/constants/**` · Src: [3], [12]
- **[SEC-38] Validation failures are 400** — Schema failures answer `400` with a fixed `statusMessage` and `data.errorCode = "invalid-request"`, without Zod issue text or echoed input, and never fall through to `500`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**` · Src: [12], [15], project: docs/security.md
- **[SEC-39] Method allowlist** — Every API and server route file is method-suffixed (`*.get.ts`, `*.post.ts`); no method-less or catch-all (`[...].ts`) handler accepts arbitrary verbs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/api/**`, `server/routes/**` · Src: [13], [5]
- **[SEC-40] Private, uncacheable API responses** — Every `/api/**` response carries `Cache-Control: private, no-store` and `Vary: Cookie`, because the locale cookie changes the forwarded `Accept-Language`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/middleware/**`, `server/utils/security/**` · Src: [8], [13], project: docs/security.md

## 5. Outbound calls, SSRF and upstream pipeline

- **[SEC-41] Validated upstream base URL** — `NUXT_GOAT_IT_API_BASE_URL` is required, parsed as an absolute URL, `https:` in production (loopback and internal hosts exempt), and an invalid value aborts the Nitro boot.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/env/**`, `server/plugins/env-validation/**` · Src: [11], [3], [6], project: docs/security.md
- **[SEC-42] Fixed upstream destination** — Server code issues outbound requests only through `createGoatItApiEndpoint` and `createGoatItApiFetchOptions` against the configured `baseURL`; no handler fetches a URL, host, port or scheme derived from request data (no image proxy, link preview or webhook).
  Evidence: `static` · Diff: ✓ · Severity: critical · Look: `server/api/**`, `server/utils/goat-it-api/**` · Src: [11], [6]
- **[SEC-43] Encoded upstream path segments** — Upstream paths are built from resource enums and constants with every slash-separated segment percent-encoded; no request value is concatenated into the path, so `..`, `%2e%2e` and `//` cannot escape the API prefix.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**` · Src: [11], [2], project: docs/security.md
- **[SEC-44] Redirects refused** — Upstream calls set `redirect: "error"`, so the `goat-it-api-key` header can never follow a cross-origin redirect.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**` · Src: [11], project: docs/security.md
- **[SEC-45] Outbound header allowlist** — The upstream request carries only the API key header and a validated `Accept-Language`; client `Cookie`, `Authorization`, `Host` and `X-Forwarded-*` headers are never forwarded wholesale.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**` · Src: [11], [14]
- **[SEC-46] Upstream failures not reflected** — Upstream status text, body, headers and messages are never forwarded verbatim; upstream `401`/`403` become `502` with `errorCode = "upstream-error"` and no detail, and only a schema-validated upstream `errorCode` (plus `Retry-After` on `429`) passes through.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**` · Src: [15], [14], project: docs/security.md
- **[SEC-47] Upstream responses validated** — Every upstream payload is parsed with its DTO schema before mapping; only `unrecognized_keys` drift is stripped, and any other mismatch becomes `502 upstream-error`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**`, `server/api/**` · Src: [3], [13], project: docs/security.md
- **[SEC-48] Upstream response size** — The upstream response body is size-capped before parsing, or the uncapped size is documented as a known limitation with its compensating controls (pinned env-validated `baseUrl`, refused redirects, request timeout).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/goat-it-api/**` · Src: [11], [12], project: docs/security.md

## 6. Secrets and configuration exposure

- **[SEC-49] Server-only secrets in runtime config** — `goatItApi.gameKey` and `goatItApi.baseUrl` live in private `runtimeConfig`; `runtimeConfig.public` holds only non-secret values (default locale, Sentry DSN, environment and disabled flag), and no secret is read from a `NUXT_PUBLIC_*` variable or a client-imported constant.
  Evidence: `static` · Diff: ✓ · Severity: critical · Look: `nuxt.config.ts`, `server/utils/runtime-config/**`, `envs/**` · Src: [14], [6]
- **[SEC-50] No secret in the client artifact** — After a production build, searching `.output/public/**`, rendered HTML and payloads for the game-key value, `goat-it-api-key`, `gameKey`, `Authorization` and `SENTRY_AUTH_TOKEN` returns zero hits.
  Evidence: `artifact` · Diff: ✗ · Severity: critical · Src: [14], [6]
- **[SEC-51] Source maps not published (config)** — Production keeps client source maps disabled (`sourcemap: false`), or uses `sourcemap: { client: 'hidden' }` with `sentry.sourcemaps.filesToDeleteAfterUpload` covering `.output/**/public/**/*.map` (verified: @sentry/nuxt 11.9.0).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [28], [6]
- **[SEC-52] No source map in the public output** — `.output/public/**/*.map` matches no file and no built JS chunk ends with a `sourceMappingURL` comment.
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [28], [6]
- **[SEC-53] Env validation never echoes values** — Missing or invalid environment values abort the Nitro boot with messages naming the variable only, never its value.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/env/**`, `server/plugins/env-validation/**` · Src: [14], [7], project: docs/security.md
- **[SEC-54] Payload free of server-only data** — The SSR payload (`__NUXT__`, `_payload.json`) and `useState` values contain no private runtime config, upstream URL, request headers or raw upstream error bodies.
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [14], [6]

## 7. Abuse, DoS and cost amplification

- **[SEC-55] API rate limiter** — `/api/goat-it-api/**` is rate limited with an explicit window and budget (defaults `60` requests per `60000` ms), both env-validated integers ≥ 1.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/middleware/**`, `server/utils/rate-limit/**` · Src: [12], [16], [13], project: docs/security.md
- **[SEC-56] Client IP trust model** — Proxy trust defaults to off; when enabled, the client key is taken from the forwarded header only behind a proxy that controls it, through h3 documented safe accessor, and the documented trust contract requires the proxy to overwrite `X-Forwarded-For`; a request whose client IP cannot be resolved is limited under a shared fallback key or its exemption is documented with a compensating control (verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/rate-limit/**` · Src: [23], [12], [5], project: docs/security.md
- **[SEC-57] Reverse proxy overwrites X-Forwarded-For** — Whenever production runs with `NUXT_RATE_LIMIT_TRUST_PROXY=true`, the maintainer confirms the reverse proxy sets `proxy_set_header X-Forwarded-For $remote_addr;` (overwrite, not append).
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [12], project: docs/security.md
- **[SEC-58] 429 contract** — Throttled responses answer `429` with `Retry-After` in seconds and `data.errorCode = "rate-limited"`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `server/middleware/**` · Src: [16], [13], project: docs/security.md
- **[SEC-59] Limiter state scope documented** — The in-process limiter is documented as single-instance only, and any multi-replica deployment replaces it with a shared store.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/rate-limit/**` · Src: [16], project: docs/security.md
- **[SEC-60] No upstream fan-out** — One client request triggers at most one upstream call plus the bounded GET retries (`1 + GOAT_IT_API_REQUEST_RETRY_COUNT` calls), POST never multiplies calls, and no handler loops over a user-supplied array issuing upstream requests.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/api/**`, `server/utils/goat-it-api/**` · Src: [16], [6], project: docs/security.md
- **[SEC-61] ReDoS-safe patterns** — Regular expressions applied to request headers, query values, cookies or upstream strings (e.g. `CONTENT_LENGTH_PATTERN`, `JSON_CONTENT_TYPE_PATTERN`, locale parsing) have no nested or overlapping quantifiers and run on length-bounded input.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/**`, `shared/utils/**` · Src: [12], [16]
- **[SEC-62] Slow-request protection at the edge** — The maintainer confirms the production reverse proxy sets `client_header_timeout`, `client_body_timeout`, `send_timeout`, `keepalive_timeout` and a `limit_req` zone in front of Nitro (configuration not in the repository).
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [16]

## 8. Cookies and client storage

- **[SEC-63] Explicit SameSite** — Every cookie sets `sameSite` to `"lax"` or `"strict"` explicitly, through shared defaults or per-cookie options; `"none"` only with `secure` and a written reason.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/constants/**`, `shared/enums/**`, `app/composables/**` · Src: [17], [4]
- **[SEC-64] Secure flag** — Every cookie is set with `secure: true` in production.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `shared/constants/**`, `app/composables/**` · Src: [17], [4]
- **[SEC-65] Least-privilege cookie scope** — Cookies set no `domain` attribute (host-only), use `path: "/"` or narrower, and any cookie client code never reads is `httpOnly: true` (client-read preference cookies are the documented exception).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `shared/constants/**`, `app/composables/**` · Src: [17], [4]
- **[SEC-66] Cookie values validated on read** — Every cookie value is treated as untrusted input: enumerated values are checked against their allowed set before use or forwarding (the locale cookie before building `Accept-Language`), and JSON cookies are parsed with a Zod schema and fall back to defaults on failure.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `app/composables/**`, `server/utils/goat-it-api/**`, `server/plugins/locale-detector/**` · Src: [3], [17]
- **[SEC-67] No secrets in client storage** — `localStorage`, `sessionStorage`, IndexedDB and cookies hold no token, API key or personal data, and every key written is enumerable from source.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.ts` · Src: [17], [10]

## 9. Error handling and information leakage

- **[SEC-68] Client-visible error fields** — `createError` calls put only fixed, client-safe text in `statusMessage` and `data` (both reach the client), keep diagnostics in `message` or `cause` (not propagated to the client), and never pass upstream or user text to `statusMessage` or `setResponseStatus` (verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/**` · Src: [24], [15], [7]
- **[SEC-69] Generic unexpected-error response** — Non-HTTP errors in API handlers become `500` with `data.errorCode = "internal-error"`; no raw `Error` escapes with its message (h3 turns a thrown `Error` into a `500`, verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/goat-it-api/**` · Src: [24], [15], project: docs/security.md
- **[SEC-70] Production error responses leak nothing** — Forcing a 404 and a 500 on an HTML route and on an API route of the production build returns no stack trace, file path, framework or version, environment name or upstream body.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Look: `tests/acceptance/features/security/**` · Src: [15], [7]
- **[SEC-71] Minimal health probes** — `/healthz` and `/readyz` return only a status and readiness result, with no upstream URL, error message, dependency version or environment name.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/routes/**`, `server/utils/goat-it-api/**` · Src: [6], [15]
- **[SEC-72] No dev or test routes in production** — The built `.output/server` exposes no devtools endpoint, playground, test, seed, reset or debug handler; its routes are only `/api/goat-it-api/**`, `/healthz`, `/readyz`, pages and static assets.
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [6], [1]

## 10. Security logging

- **[SEC-73] Security events logged** — Rate-limit rejections, body-guard rejections (`411`, `413`, `415`), validation failures, upstream `401`/`403`, refused redirects and schema drift each emit a named server log event (aggregated or sampled when noisy).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `server/middleware/**`, `server/utils/goat-it-api/**` · Src: [7], [33], [16]
- **[SEC-74] Logged-field allowlist** — Server logs carry only the event name, status, method, query-free path and format-checked error class and code; never request or response bodies, cookies, authorization headers, query strings, API or game keys, h3 error `data` or source IPs.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/logging/**`, `server/plugins/error-logging/**` · Src: [7], [14], project: docs/security.md
- **[SEC-75] Redaction paths as defense in depth** — The logger `redact` paths cover `authorization`, `cookie`, `apiKey`, `gameKey`, `token`, `password` and the upstream key header `goat-it-api-key`, at top level and under `headers` and `request.headers`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**` · Src: [14], [7]
- **[SEC-76] Log-injection safe** — User and upstream values are logged as structured fields, never concatenated into message strings, and free-text fields pass a format check so CR/LF cannot forge log entries.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/logging/**`, `server/utils/goat-it-api/**` · Src: [7]

## 11. Vulnerability disclosure

- **[SEC-77] Security policy file** — A `SECURITY.md` at the repository root or in `.github/` names the supported versions, a private reporting channel (GitHub private vulnerability reporting or a security mailbox) and the expected response time.
  Evidence: `static` · Diff: ✓ · Severity: medium · Src: [22], [29]
- **[SEC-78] Private vulnerability reporting enabled** — `gh api repos/{owner}/{repo}/private-vulnerability-reporting` returns `{"enabled": true}`, or `SECURITY.md` names another private channel.
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [29]
- **[SEC-79] security.txt served and valid** — `GET https://<host>/.well-known/security.txt` returns `200` with `Content-Type: text/plain; charset=utf-8` over HTTPS (not the Nuxt HTML catch-all or 404 page); when the file exists it has at least one `Contact:` URI matching `SECURITY.md`, exactly one future `Expires:` in RFC 3339 under one year ahead, and a `Canonical:` equal to its retrieval URI.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [22]

## 12. Third-party resources

- **[SEC-80] Third-party origin inventory** — Every third-party origin the browser contacts (today only the Sentry ingest origin) is listed in `docs/security.md` and matches the CSP and the rendered HTML; fonts, images and scripts are self-hosted.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/security.md`, `nuxt.config.ts`, `public/**` · Src: [4], [9]
- **[SEC-81] SRI on external assets** — When an externally hosted `<script>` or stylesheet is added, it carries `integrity="sha384-…"`, `crossorigin` and a version-pinned URL.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `app/**/*.vue` · Src: [4], [9]
- **[SEC-82] Sentry SDK bundled first-party** — The Sentry browser SDK is bundled from npm through `sentry.client.config.ts`, not loaded from a CDN loader snippet or an inline script without a nonce, and it sends events only to the DSN-derived ingest origin.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `sentry.*.config.ts`, `shared/utils/helpers/sentry/**` · Src: [9], [20], project: docs/security.md

## 13. Other web risks

- **[SEC-83] No open redirect** — No `redirect`, `returnTo`, `next` or `url` query or cookie value reaches `navigateTo`, `sendRedirect` or `window.location` without a same-origin allowlist, and `navigateTo(…, { external: true })` receives constants only.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `app/**/*.ts`, `app/**/*.vue`, `server/**` · Src: [4]
- **[SEC-84] No CORS headers** — The same-origin app emits no `Access-Control-Allow-*` header (no `cors: true` route rule, no `handleCors` or `appendCorsHeaders`), and never reflects `Origin` or sends `Access-Control-Allow-Credentials: true`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `server/**` · Src: [13], [4]
- **[SEC-85] CSRF posture** — State-changing endpoints require `application/json` (a non-CORS-safelisted content type) and no cookie is the sole authorization for a write (verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/middleware/**`, `server/api/**` · Src: [13], [4], [23]
- **[SEC-86] Host and forwarded-header trust** — Canonical URLs, redirects and absolute links use the configured site URL, never a request-derived host; no security decision trusts a request-derived host or protocol unless the reverse proxy overwrites `X-Forwarded-Host`/`X-Forwarded-Proto` (h3 trusts the protocol header by default; verified: h3 1.15.11).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/**`, `nuxt.config.ts` · Src: [23], [4], [5]
- **[SEC-87] Prototype-pollution-safe handling** — Request and upstream JSON is consumed only as Zod-parsed output and never deep-merged into configuration or state; dynamic-key collections use `Map` or `Object.create(null)`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/**`, `app/stores/**`, `shared/utils/**` · Src: [18], [12]

## Sources

[1] OWASP Top 10 A02:2025 Security Misconfiguration — https://owasp.org/Top10/2025/A02_2025-Security_Misconfiguration/ — fetched 2026-10-31 (2025 release)
[2] OWASP ASVS 5.0 V1 Encoding and Sanitization — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md — fetched 2026-10-31 (ASVS 5.0.0)
[3] OWASP ASVS 5.0 V2 Validation and Business Logic — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x11-V2-Validation-and-Business-Logic.md — fetched 2026-10-31 (ASVS 5.0.0)
[4] OWASP ASVS 5.0 V3 Web Frontend Security — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x12-V3-Web-Frontend-Security.md — fetched 2026-10-31 (ASVS 5.0.0)
[5] OWASP ASVS 5.0 V4 API and Web Service — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x13-V4-API-and-Web-Service.md — fetched 2026-10-31 (ASVS 5.0.0)
[6] OWASP ASVS 5.0 V13 Configuration — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x22-V13-Configuration.md — fetched 2026-10-31 (ASVS 5.0.0)
[7] OWASP ASVS 5.0 V16 Security Logging and Error Handling — https://raw.githubusercontent.com/OWASP/ASVS/master/5.0/en/0x25-V16-Security-Logging-and-Error-Handling.md — fetched 2026-10-31 (ASVS 5.0.0)
[8] OWASP HTTP Security Response Headers Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html — fetched 2026-10-31 (current)
[9] OWASP Content Security Policy Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html — fetched 2026-10-31 (current)
[10] OWASP Cross Site Scripting Prevention Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html — fetched 2026-10-31 (current)
[11] OWASP Server-Side Request Forgery Prevention Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html — fetched 2026-10-31 (current)
[12] OWASP Nodejs Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html — fetched 2026-10-31 (current)
[13] OWASP REST Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html — fetched 2026-10-31 (current)
[14] OWASP Secrets Management Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html — fetched 2026-10-31 (current)
[15] OWASP Error Handling Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html — fetched 2026-10-31 (current)
[16] OWASP Denial of Service Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html — fetched 2026-10-31 (current)
[17] OWASP Session Management Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html — fetched 2026-10-31 (current)
[18] OWASP Prototype Pollution Prevention Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Prototype_Pollution_Prevention_Cheat_Sheet.html — fetched 2026-10-31 (current)
[19] web.dev Security headers quick reference — https://web.dev/articles/security-headers — fetched 2026-10-31 (current)
[20] web.dev Mitigate cross-site scripting with a strict CSP — https://web.dev/articles/strict-csp — fetched 2026-10-31 (current)
[21] Vue.js Security guide — https://vuejs.org/guide/best-practices/security — fetched 2026-10-31 (current docs; vue 3.5.44)
[22] RFC 9116 A File Format to Aid in Security Vulnerability Disclosure — https://www.rfc-editor.org/rfc/rfc9116 — fetched 2026-10-31 (March 2022)
[23] h3 v1 Request utilities (body, query, IP, host, protocol) — https://github.com/h3js/h3/blob/v1.15.5/docs/2.utils/1.request.md — fetched 2026-10-31 (h3 1.15.x docs; installed h3 1.15.11 source checked)
[24] h3 v1 Event handler and error handling — https://github.com/h3js/h3/blob/v1.15.5/docs/1.guide/2.event-handler.md — fetched 2026-10-31 (h3 1.15.x docs; installed h3 1.15.11)
[25] Zod API reference (URLs, object unknown keys) — https://github.com/colinhacks/zod/blob/v4.6.5/packages/docs/content/api.mdx — fetched 2026-10-31 (zod 4.6.5 docs; behaviour re-checked on installed zod 4.6.7)
[26] Zod 4.6 release notes (`z.compile()`, `z.withParser()`) — https://github.com/colinhacks/zod/blob/v4.6.5/packages/docs/content/blog/zod-4-6.mdx — fetched 2026-10-31 (zod 4.6)
[27] Nuxt Content configuration (markdown remark and rehype plugins) — https://github.com/nuxt/content/blob/v3.16.2/docs/content/docs/1.getting-started/3.configuration.md — fetched 2026-10-31 (@nuxt/content 3.16.2)
[28] Sentry Nuxt source maps — https://docs.sentry.io/platforms/javascript/guides/nuxt/sourcemaps/ — fetched 2026-10-31 (@sentry/nuxt 11.x docs)
[29] GitHub REST API — Check if private vulnerability reporting is enabled for a repository — https://docs.github.com/en/rest/repos/repos#check-if-private-vulnerability-reporting-is-enabled-for-a-repository — fetched 2026-10-31 (API version 2026-03-10)
[30] MDN HTTP Observatory: Tests and scoring — https://developer.mozilla.org/en-US/observatory/docs/tests_and_scoring — fetched 2026-10-31 (current)
[31] Nuxt Security documentation (parity benchmark, module not used) — https://nuxt-security.vercel.app/ — fetched 2026-10-31 (current)
[32] OWASP Top 10 A05:2025 Injection — https://owasp.org/Top10/2025/A05_2025-Injection/ — fetched 2026-10-31 (2025 release)
[33] OWASP Top 10 A09:2025 Security Logging and Alerting Failures — https://owasp.org/Top10/2025/A09_2025-Security_Logging_and_Alerting_Failures/ — fetched 2026-10-31 (2025 release)
