# PLAT — Runtime platform (containers, config, deployment)

Runtime platform of the Goat It Web Game: the multi-stage `Dockerfile` that turns the Nuxt 4 SSR app into a Nitro `node-server` image, build-time secret handling and image vulnerability scanning, twelve-factor runtime configuration (`runtimeConfig`, `NUXT_*` variables, boot validation, toolchain versions), process lifecycle and graceful shutdown, the `/healthz` and `/readyz` probe design and the container `HEALTHCHECK`, how images are tagged and run on the VPS (Docker Hub multi-arch images, SSH deploy, single container), and the contract the external nginx reverse proxy must honour.

**Decision doc:** `docs/operations.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** workflow hardening, required checks, deploy credentials, digest promotion → CICD · uptime monitors, runbooks, rollback procedure, post-deploy verification → OPS · SBOM, provenance attestations, dependency audits, Renovate → SUP · app-level security headers (HSTS, CSP), rate-limit keying, secrets in the built bundle → SEC · upstream timeouts and retries inside the app → REL

## Contents

- [1. Dockerfile and image](#1-dockerfile-and-image)
- [2. Build secrets and image scanning](#2-build-secrets-and-image-scanning)
- [3. Twelve-factor configuration](#3-twelve-factor-configuration)
- [4. Lifecycle and shutdown](#4-lifecycle-and-shutdown)
- [5. Health probes](#5-health-probes)
- [6. Runtime deployment](#6-runtime-deployment)
- [7. Reverse-proxy contract](#7-reverse-proxy-contract)
- [Sources](#sources)

## 1. Dockerfile and image

- **[PLAT-01] Base images pinned by exact tag and digest** — Every `FROM` of every stage uses an exact version tag plus digest (`node:<x.y.z>-alpine<a.b>@sha256:<64 hex>`); no `latest`, variant-only (`node:alpine`, `node:lts`) or untagged image (hadolint DL3006/DL3007 clean).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `Dockerfile` · Src: [1], [6]
- **[PLAT-02] Production stage ships only the build output** — The final `production` stage starts from a clean runtime base and copies only `/app/.output` from the `build` stage: no dependency install, no source tree, no `node_modules` at the app root, no compilers (`python3`, `make`, `g++`, `build-base`).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `Dockerfile` · Src: [1], [5], [7]
- **[PLAT-03] Every published platform image boots** — For each platform of the manifest list (`linux/amd64`, `linux/arm64`), `docker run --platform <platform>` starts the server and `GET /healthz` returns 200; any native `.node` binary under `.output/server/node_modules` matches the target architecture and musl libc, because the `build` stage runs on `$BUILDPLATFORM`.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [5], [7], [19]
- **[PLAT-04] Non-root user owns the app files** — The final stage's last `USER` is the non-root `node` user (hadolint DL3002) and every `COPY` into that stage uses `--chown=node:node` (Docker's default owner is UID/GID 0).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `Dockerfile` · Src: [3], [4], [5], [6]
- **[PLAT-05] Complete .dockerignore** — `.dockerignore` excludes at least `.git`, `node_modules`, `.nuxt`, `.output`, `coverage`, `tests`, `docs`, `.github`, `Dockerfile`, `envs` and `.env*`, plus `.npmrc`, `*.pem` and `*.key` whenever such files can exist, so no `COPY` can pull secrets or local artefacts into a layer.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.dockerignore` · Src: [1], [7]
- **[PLAT-06] Cache-friendly layer order** — Dependency manifests (`package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`) and only the files the install/postinstall step needs are copied before `pnpm install`; application sources are copied after it, so a source-only change does not invalidate the install layer.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile` · Src: [1], [7]
- **[PLAT-07] NODE_ENV=production at runtime** — The final stage sets `ENV NODE_ENV=production`; Nuxt requires it at runtime, not only at build time.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile` · Src: [5], [7], [13]
- **[PLAT-08] Exec-form CMD without package-manager wrapper** — The final `CMD`/`ENTRYPOINT` is a JSON array that starts `node` directly on `.output/server/index.mjs`, with no shell form and no `npm start`/`pnpm start` indirection (hadolint DL3025), so the stop signal reaches Node.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile` · Src: [1], [5], [6], [7]
- **[PLAT-09] Init process and stop signal declared** — Node does not run as an unguarded PID 1: the image uses an init entrypoint (`tini`/`dumb-init`) or the documented run configuration sets `--init`/`init: true`; `STOPSIGNAL` is `SIGTERM`, set explicitly or documented as the default.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile`, `docs/operations.md` · Src: [4], [5], [7]
- **[PLAT-10] Dockerfile lint clean** — `hadolint --failure-threshold warning Dockerfile` exits 0 and every inline `# hadolint ignore=` carries a written justification.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [6]

## 2. Build secrets and image scanning

- **[PLAT-11] No credential in ARG or ENV** — No `ARG`/`ENV` of any stage carries a token, key or password (only non-secret build values such as `NUXT_PUBLIC_DEFAULT_LOCALE`, `NUXT_PUBLIC_SITE_URL`, `NUXT_SITE_ENV`; hadolint DL3064); a build step that needs a credential uses `RUN --mount=type=secret,id=<id>,required=true`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `Dockerfile`, `.github/workflows/deploy-*.yml` · Src: [2], [4], [6]
- **[PLAT-12] No secret in image history** — `docker history --no-trunc <image>` contains no token, `_authToken=`, Goat It API game key value or key material.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: critical · Src: [2], [7]
- **[PLAT-13] No secret files in the final image** — `docker run --rm --entrypoint sh <image> -c 'find / -xdev \( -name ".env*" -o -name ".npmrc" -o -name "*.pem" -o -name "*.key" \) 2>/dev/null'` prints nothing.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: critical · Src: [7]
- **[PLAT-14] Blocking image vulnerability scan** — Every pushed image is scanned before deployment by a scanner that fails the build on HIGH or CRITICAL vulnerabilities (for example `trivy image --severity HIGH,CRITICAL --exit-code 1`; unfixed findings are waived only through a PLAT-15 waiver, never filtered out by default); the default scanner settings must not be left non-blocking.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/*.yml` · Src: [3], [16]
- **[PLAT-15] Scan waivers are scoped and expire** — When an image scan exists, its step never sets `continue-on-error: true`, no blanket ignore file is used, and each `.trivyignore`/`trivyignore.yaml` waiver names one finding with `expired_at` and a statement.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/*.yml` · Src: [15]
- **[PLAT-16] Base image not end-of-life** — `trivy image --exit-on-eol 1 <image>` passes: the Node major and the Alpine release of the runtime base are still supported, and the image is rebuilt from a freshly pulled base at least monthly.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [1], [16]

## 3. Twelve-factor configuration

- **[PLAT-17] Runtime-overridable keys declared in runtimeConfig** — Every setting the deployment changes without a rebuild is a `runtimeConfig` key in `nuxt.config.ts` overridden by its matching `NUXT_*` variable (e.g. `goatItApi.gameKey` ↔ `NUXT_GOAT_IT_API_GAME_KEY`); no `runtimeConfig` default reads a differently named `process.env` variable, which only works at build time (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `nuxt.config.ts` · Src: [23]
- **[PLAT-18] String settings survive destr casting** — Boot validation rejects non-string values for string settings (game key, base URL, Sentry DSN), because Nitro casts `NUXT_*` values with `destr` (`4848e0` becomes a number), and the env documentation tells operators to quote numeric- or JSON-looking strings (verified: nuxt 4.6.3).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/env/**`, `envs/.env.example` · Src: [23]
- **[PLAT-19] Boot validation covers every key outside dev** — `server/plugins/env-validation/` validates the whole runtime config (`goatItApi`, `rateLimit`, `security`, `logger`, `public.defaultLocale`, `public.sentry`) whenever the server is not in dev mode, and no server code reads `process.env.*` directly at request time.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `server/plugins/env-validation/**`, `server/utils/env/**`, `server/utils/runtime-config/**` · Src: [11]
- **[PLAT-20] Invalid config fails fast at boot** — Starting the production image with a missing or invalid required variable (e.g. empty `NUXT_GOAT_IT_API_GAME_KEY` or a non-https `NUXT_GOAT_IT_API_BASE_URL`) exits non-zero within seconds and the log names the offending variable.
  Evidence: `runtime` · Diff: ✗ · Severity: high · Src: [9], [11]
- **[PLAT-21] .env.example parity and build/runtime markers** — `envs/.env.example` lists every `NUXT_*` variable the app or build reads (each `runtimeConfig` key plus every Docker build arg) with a placeholder, marks each one build-time (Docker build arg) or runtime, and lists no stale variable.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `envs/.env.example`, `nuxt.config.ts`, `Dockerfile` · Src: [11], [17]
- **[PLAT-22] Secure configuration defaults** — `runtimeConfig` defaults ship no credential, keep proxy trust off, CSP in enforce mode and rate limiting enabled, and no file sets `NODE_TLS_REJECT_UNAUTHORIZED=0`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `nuxt.config.ts`, `envs/.env.example` · Src: [11]
- **[PLAT-23] Build-time values consistent at runtime** — Variables consumed at build time (`NUXT_SITE_ENV`, `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_DEFAULT_LOCALE`) come from per-environment Docker build args, and a variable also read at runtime (`NUXT_SITE_ENV`, which resolves the Sentry environment label) is re-declared in the `production` stage from the same build arg so client and server agree.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile`, `.github/workflows/deploy-*.yml` · Src: [17], project: docs/operations.md
- **[PLAT-24] One Node and pnpm version source** — `configs/node/.node-version`, `package.json` `engines.node`, every Dockerfile `FROM node:` tag and CI `setup-node` resolve to the same exact Node version, and the pnpm version installed in the Dockerfile equals `package.json` `packageManager`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/node/.node-version`, `package.json`, `Dockerfile`, `.github/actions/install-project/**` · Src: [1], [5]
- **[PLAT-25] Node supports the native SQLite connector** — When `content.experimental.sqliteConnector` is `"native"`, the runtime image's Node version is 22.5.0 or newer (`node:sqlite`) (verified: @nuxt/content 3.16.2).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `nuxt.config.ts`, `Dockerfile` · Src: [24]
- **[PLAT-26] Port binding from the environment** — The image sets `HOST=0.0.0.0` and `PORT` (Nitro reads `NITRO_PORT`/`PORT`, default 3000, and `NITRO_HOST`/`HOST`), and `EXPOSE`, the `HEALTHCHECK` URL and `docs/operations.md` use that same port value (verified: nitropack 2.13.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile`, `docs/operations.md` · Src: [4], [12], [22]

## 4. Lifecycle and shutdown

- **[PLAT-27] Graceful shutdown left enabled** — No image, env file or doc sets `NITRO_SHUTDOWN_DISABLED=true`; `NITRO_SHUTDOWN_SIGNALS` is unset or includes `SIGTERM` (default `'SIGINT SIGTERM'`) and `NITRO_SHUTDOWN_FORCE` is unset or `true` (verified: nitropack 2.13.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile`, `envs/.env.example`, `docs/operations.md` · Src: [12], project: docs/operations.md
- **[PLAT-28] Host stop grace exceeds the Nitro shutdown timeout** — The staging and production container runtimes allow more than `NITRO_SHUTDOWN_TIMEOUT` (default 30000 ms) between SIGTERM and SIGKILL, about 35 s (`stop_grace_period: 35s` or `docker stop --time 35`), never Docker's 10 s default (verified: nitropack 2.13.5).
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [9], [12], project: docs/operations.md
- **[PLAT-29] SIGTERM drains in-flight requests** — `docker stop` during a slow SSR page or proxied `/api/goat-it-api/**` request lets the response complete, accepts no new connection, and the process exits with code 0 before the shutdown timeout.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [9], [12]
- **[PLAT-30] In-process state is single-instance safe** — The deployment runs exactly one app container per environment, or every in-process store (rate limiter, readiness cache) is replaced by a shared store before scaling out.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/utils/rate-limit/**`, `docs/security.md` · Src: [14], project: docs/security.md
- **[PLAT-31] Heap sized to the container memory limit** — When the container has a memory limit, `--max-old-space-size` (via `NODE_OPTIONS`) is about 70–80 % of it (e.g. 384 MB for 512 MB), or the cgroup-aware default is verified under load without OOM kills.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [3], [5]
- **[PLAT-32] No runtime writes outside tmpfs** — With `docker run --read-only --tmpfs /tmp` the production image boots and serves `/`, `/rules` and `/api/goat-it-api/**` for 10 minutes without an EROFS error; when `@nuxt/content` needs a writable SQLite file, `content.database.filename` points to a tmpfs path or `:memory:` (verified: @nuxt/content 3.16.2).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [3], [14], [24]

## 5. Health probes

- **[PLAT-33] Liveness never touches dependencies** — The `/healthz` handler returns 200 `{ "status": "ok" }` without calling the Goat It API, reading upstream state or awaiting I/O, so an upstream outage cannot fail liveness.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `server/routes/healthz/**` · Src: [8], project: docs/operations.md
- **[PLAT-34] Readiness probes the upstream with a bounded call** — `/readyz` performs one `GET` to `<NUXT_GOAT_IT_API_BASE_URL>/health` with a 3 s timeout, no retry and no game key, and answers 200 `{ "status": "ready" }` or 503 `{ "status": "not_ready" }` without upstream status, URL, body or error text.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `server/routes/readyz/**` · Src: [8], project: docs/operations.md
- **[PLAT-35] Readiness cache and single flight** — The readiness result, success or failure, is cached in-process for 5 s and concurrent cache misses share one in-flight upstream probe, bounding upstream calls to one per 5 s per process.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/routes/readyz/**` · Src: [8], project: docs/operations.md
- **[PLAT-36] Readiness reflects an outage after the TTL** — With the Goat It API stopped, `GET /readyz` returns 503 at most 5 s plus one probe timeout after the last successful probe, and returns 200 again within the same delay after recovery.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [8]
- **[PLAT-37] Probe responses are uncacheable status signals** — Both probes answer only 200 or 503 (no redirect, no 401, no 200 with an error body) and send `Cache-Control: no-store`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `server/routes/**` · Src: [4], [8], project: docs/operations.md
- **[PLAT-38] Probes bypass the rate limiter** — The rate limiter only matches `/api/goat-it-api/**`, so a burst of 100 requests in 10 s on `/healthz` or `/readyz` never returns 429.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/middleware/**` · Src: [8], project: docs/operations.md
- **[PLAT-39] Container HEALTHCHECK targets liveness** — The final stage `HEALTHCHECK` performs a real `GET` on `http://localhost:<PORT>/healthz`, never `/readyz`, with a tool present in the runtime image (BusyBox `wget` or `node`); `--timeout` is lower than `--interval`, `--retries` is at least 3, and `--start-period` covers the measured cold-boot time.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `Dockerfile` · Src: [4], [8], project: docs/operations.md

## 6. Runtime deployment

- **[PLAT-40] Immutable release tags** — Each production release pushes an immutable `vX.Y.Z` tag next to any moving tag (`latest`, `develop`), and staging images also receive a unique, never reused tag (e.g. `sha-<short sha>`).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/workflows/docker-build-and-push.yml` · Src: [17]
- **[PLAT-41] Hosts run a pinned image** — The staging and production update scripts pull and run a version tag or digest, never only `latest` or `develop`, so the running image is identifiable and can be redeployed.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [17]
- **[PLAT-42] Multi-arch manifest matches the hosts** — `docker buildx imagetools inspect <image>:<tag>` lists `linux/amd64` and `linux/arm64` manifests for every pushed tag, including the architecture of each deployment host.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [19]
- **[PLAT-43] Staging and production build parity** — Staging and production images are built from the same Dockerfile target with the same build-arg names and platforms; only values (`NUXT_SITE_ENV`, site URL, default locale) differ.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/deploy-*.yml` · Src: [18]
- **[PLAT-44] Container supervision documented** — The restart policy, stop grace period, environment injection and published port of the staging and production containers are versioned in the repository or documented in `docs/operations.md` with the external file they live in.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md` · Src: [9]
- **[PLAT-45] Least privilege at runtime** — The production container runs with all capabilities dropped (`cap_drop: [ALL]` or `--cap-drop=ALL`) and `no-new-privileges:true`, never `--privileged`.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [3]
- **[PLAT-46] Container resource limits** — The production container has memory, CPU and pids limits (`--memory`, `--cpus`, `--pids-limit` or `deploy.resources.limits`).
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [3], [5]
- **[PLAT-47] No Docker socket exposure** — No compose file, deploy script or workflow bind-mounts `/var/run/docker.sock` into a container.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `docker/**`, `.github/**` · Src: [3]

## 7. Reverse-proxy contract

- **[PLAT-48] TLS terminates at the proxy** — No image, env file or deploy configuration sets `NITRO_SSL_CERT`/`NITRO_SSL_KEY`; Nitro's in-process HTTPS is meant for testing behind a TLS-terminating reverse proxy (verified: nitropack 2.13.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile`, `envs/.env.example` · Src: [12], [13]
- **[PLAT-49] HTTP redirects to HTTPS** — Requests to the production and staging hosts over plain HTTP answer 301 or 308 with an `https://` `Location`.
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [20]
- **[PLAT-50] Host and scheme forwarded** — nginx sets `proxy_set_header Host $host;` and `proxy_set_header X-Forwarded-Proto $scheme;`, so Nuxt emits `https://` absolute URLs for the public hostname.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [20]
- **[PLAT-51] Proxy body size and timeouts fit the app** — nginx sets `client_max_body_size` explicitly (default `1m`) at or above the app's 512 KiB `POST /api/goat-it-api/**` limit, `proxy_read_timeout` (default 60 s) above the worst-case SSR plus upstream latency, and a short `proxy_connect_timeout` (about 5 s).
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [20], [21], project: docs/security.md
- **[PLAT-52] Proxy contract documented** — A repository doc lists every directive the external nginx must apply (TLS, HTTP redirect, forwarded headers, body size, timeouts, upstream port) or an audited copy of the configuration is versioned, so production drift is detectable.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/operations.md`, `docs/security.md` · Src: [20]

## Sources

[1] Docker — Building best practices — https://docs.docker.com/build/building/best-practices/ — fetched 2026-10-31 (undated)
[2] Docker — Build secrets — https://docs.docker.com/build/building/secrets/ — fetched 2026-10-31 (undated)
[3] OWASP — Docker Security Cheat Sheet — https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html — fetched 2026-10-31 (rolling content)
[4] Docker — Dockerfile reference — https://docs.docker.com/reference/dockerfile/ — fetched 2026-10-31 (current; `--start-interval` requires Engine 25.0+)
[5] nodejs/docker-node — Docker and Node.js Best Practices — https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md — fetched 2026-10-31 (main branch)
[6] Hadolint — Rules — https://github.com/hadolint/hadolint#rules — fetched 2026-10-31 (master, DL3000–DL4006)
[7] Snyk — 10 best practices to containerize Node.js web applications with Docker — https://snyk.io/blog/10-best-practices-to-containerize-nodejs-web-applications-with-docker/ — fetched 2026-10-31 (2022-09-14)
[8] Kubernetes — Liveness, Readiness, and Startup Probes — https://kubernetes.io/docs/concepts/workloads/pods/probes/ — fetched 2026-10-31 (Kubernetes docs v1.37)
[9] The Twelve-Factor App — IX. Disposability — https://12factor.net/disposability — fetched 2026-10-31 (last updated 2017)
[11] The Twelve-Factor App — III. Config — https://12factor.net/config — fetched 2026-10-31 (last updated 2017)
[12] Nitro — Node.js runtime (node_server preset) — https://github.com/nitrojs/nitro/blob/v2.13.5/docs/2.deploy/10.runtimes/1.node.md — fetched 2026-10-31 (library nitropack 2.13.5)
[13] Nuxt — Deployment — https://nuxt.com/docs/4.x/getting-started/deployment — fetched 2026-10-31 (Nuxt 4.x docs)
[14] The Twelve-Factor App — VI. Processes — https://12factor.net/processes — fetched 2026-10-31 (last updated 2017)
[15] Trivy — Filtering — https://trivy.dev/latest/docs/configuration/filtering/ — fetched 2026-10-31 (v0.67.x docs)
[16] Trivy — trivy image CLI reference — https://trivy.dev/latest/docs/references/configuration/cli/trivy_image/ — fetched 2026-10-31 (v0.67.x docs)
[17] The Twelve-Factor App — V. Build, release, run — https://12factor.net/build-release-run — fetched 2026-10-31 (last updated 2017)
[18] The Twelve-Factor App — X. Dev/prod parity — https://12factor.net/dev-prod-parity — fetched 2026-10-31 (last updated 2017)
[19] Docker — Multi-platform builds — https://docs.docker.com/build/building/multi-platform/ — fetched 2026-10-31 (undated)
[20] nginx — Module ngx_http_proxy_module — https://nginx.org/en/docs/http/ngx_http_proxy_module.html — fetched 2026-10-31 (nginx 1.29.x)
[21] nginx — Module ngx_http_core_module — https://nginx.org/en/docs/http/ngx_http_core_module.html — fetched 2026-10-31 (current; `client_max_body_size` default 1m)
[22] The Twelve-Factor App — VII. Port binding — https://12factor.net/port-binding — fetched 2026-10-31 (last updated 2017)
[23] Nuxt — Runtime Config — https://nuxt.com/docs/4.x/guide/going-further/runtime-config — fetched 2026-10-31 (library nuxt 4.6.3)
[24] Nuxt Content — Configuration — https://content.nuxt.com/docs/getting-started/configuration — fetched 2026-10-31 (library @nuxt/content 3.16.2)
