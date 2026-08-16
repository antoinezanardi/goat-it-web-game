---
name: context7
description: Internal skill for the docs-fetcher agent. Fetches version-aware library documentation via Context7 MCP and synthesizes problem-contextual structured summaries. Never rely on training data — always fetch current docs.
---

This skill is used by the `docs-fetcher` subagent to fetch up-to-date, version-aware documentation for libraries via Context7 MCP. Each `docs-fetcher` dispatch handles **exactly one library** — the caller dispatches it once per library (parallel dispatches OK). It receives a problem description + one library and returns a structured summary explaining how that library serves the use case.

## Version Resolution

**Always determine the correct version before fetching docs.**

1. Read `package.json` — scan `dependencies` and `devDependencies`.
2. **Installed library:**
   - Strip range prefix (`^`, `~`, `>=`, etc.) to extract the exact version.
   - Use that version when matching against Context7's available versions.
3. **Not installed library:**
   - Target `"latest"`. No version matching needed — use the library ID as-is.

## Resolving the Library ID

Call `resolve-library-id` with:

- `libraryName`: The library name as it appears in `package.json` (e.g., `@nuxt/ui`, `vueuse`, `zod`).
- `query`: A short description of what to look up — this improves Context7's relevance ranking.

**If a call returns no relevant match (or only plugins/forks), DO NOT conclude the library is missing.** You have up to 3 resolve calls for this session — budget them as retries for the session's single library:

1. Retry with the **human-readable product name** instead of the package name (e.g., `Tailwind` / `Tailwind CSS` for `tailwindcss`, `ESLint` for `eslint`).
2. Retry with the **official docs site name** (e.g., `tailwindcss.com`).
3. Retry with a query that names the product explicitly and neutrally (e.g., `"Tailwind CSS core framework documentation"`) — avoid feature keywords (`@theme`, `configuration`) that can steer ranking toward plugins.

Only after **all 3 calls** fail to surface the core library may you state it is not in the index — and then suggest refinements, never just report absence.

From the results, select the best match:
- **Highest Source Reputation** (High > Medium > Low).
- **Version-specific ID** if the resolution step returned a version matching (or close to) the installed version.
- **Highest Benchmark Score** as a tiebreaker.
- **Core product beats name substring.** A result titled with the exact product name (e.g., "Tailwind CSS") describing the framework itself outranks any repo whose ID merely *contains* the package name (e.g., `fluid-tailwindcss`). Flag plugin-style results (description containing "plugin", "for", "collection of") for exclusion when searching for a core framework.
- **Prefer official docs-site IDs** — `/tailwindlabs/<project>`, `/websites/<project>`, `/vercel/<project>` with High reputation are the primary sources over community forks.

## Matching Versions

When the resolution returns version-specific IDs (e.g., `/nuxt/ui` with `v2.22.0, v3.3.0, v4.0.1`):

1. Compare the installed version against the available versions.
2. Use **semver-aware nearest match** — prioritize major.minor proximity.
   - Installed `4.10.0`, available `v4.0.1` and `v3.3.0` → match `v4.0.1` (same major).
   - Installed `3.1.0`, available `v3.3.0` and `v4.0.1` → match `v3.3.0` (same major).
3. Determine status:
   - ✅ **exact match** — installed version equals fetched version.
   - ⚠️ **gap (x.y.z → a.b.c)** — versions differ. Flag it. Note potential API changes for major gaps.
   - 🆕 **latest (no install)** — library not in `package.json`.

If no version-specific ID is available (the resolution returns a single base ID), use the base ID and note that the version could not be verified.

Docs-site IDs (e.g., `/tailwindlabs/tailwindcss.com`) may expose branch-style labels like `__branch__v4-beta-docs`; treat these as "latest" unless the installed version matches a labeled version.

## Fetching Documentation

Call `query-docs` with:

- `libraryId`: The selected Context7 library ID (including version if applicable, e.g., `/nuxt/ui/v4.0.1`).
- `query`: What to look up, scoped to a single concept.

**Hard budget: at most 3 `query-docs` calls per session.** Context7 caps its query tool at 3 calls per question, and one `docs-fetcher` dispatch is one question. This budget covers the session's single library. Plan your queries before calling:

- **One library per dispatch** — the caller re-dispatches you for each additional library.
- **Map the budget to the categories below** — one call per relevant category, up to 3 calls total.

**Query categories** — fetch one query per relevant category:

| Category           | Example Query                                 |
|--------------------|-----------------------------------------------|
| **API Reference**  | `"UButton component all props API reference"` |
| **Usage Patterns** | `"UButton common usage patterns examples"`    |
| **Configuration**  | `"UButton theme configuration app.config.ts"` |

Only fetch categories that are relevant to the problem. If the caller only needs API signatures, skip Usage Patterns and Configuration.

**If the problem needs more than 3 concepts for this library:** pick the 3 most relevant and add the rest to the summary under a "Not fetched — re-dispatch" note. Never exceed the budget.

**Split multi-topic queries** — make separate `query-docs` calls per concept (within budget). Combined queries dilute ranking and return shallow results.

## Synthesizing the Structured Summary

After fetching all docs, assemble them into the output format. The output is a single markdown document.

### Output Template

```markdown
# Documentation Summary — YYYY-MM-DD

## library-name (installed: x.y.z, fetched: a.b.c ✅ exact match)

### Relevance to Use Case
Explain WHY this library serves the problem and HOW its specific APIs
fit into the caller's design. Connect each API to the problem statement.

### API Reference
- **FunctionName(args)** → ReturnType — description.
  [Source](https://github.com/...)
  ```code example```

### Usage Patterns
- Pattern description — when to use, gotchas.
  [Source](https://github.com/...)
  ```code example```

### Configuration
- Config option — description.
  [Source](https://github.com/...)
  ```
```

### Version Status

| Status | Format | Meaning |
|---|---|---|
| ✅ exact match | `(installed: 4.10.0, fetched: 4.10.0 ✅ exact match)` | Versions match. |
| ⚠️ gap | `(installed: 4.10.0, fetched: 4.0.1 ⚠️ gap)` | Versions differ. Note major-gap API risks. |
| 🆕 latest | `(installed: N/A, fetched: 3.3.0 🆕 latest)` | Not installed. Fetched latest available. |

### Version Gap Notes

When a gap exists:
- **Major version gap** (e.g., 4.x → 3.x): include a warning that APIs may be significantly different.
- **Minor/patch gap** (e.g., 4.10.0 → 4.0.1): note the gap but indicate minor versions rarely break APIs.

## Guidelines

- **One library per dispatch** — if the caller lists multiple libraries, handle the first (or the one explicitly requested) and report that the others need separate dispatches. Never exceed the 3-call `query-docs` budget.
- **Source URLs are mandatory** — every claim, code example, and API signature must link to its Context7 source.
- **Problem-contextual output** — never return a generic API dump. The summary must explain how the library serves the specific problem described in the input.
- **One query per concept** — split multi-concept needs into separate `query-docs` calls.
- **Prefer official sources** — when multiple matches exist, prefer official/primary packages over community forks.
- **Library name input format** — use the package name exactly as it appears in `package.json` (e.g., `@nuxt/ui`, not `nuxt-ui`). For core frameworks that share their name with many plugins (e.g., `tailwindcss`, `eslint`), switch to the human-readable product name on retry.
- **Never report a library as missing from Context7 after fewer than 3 resolve attempts with varied names** (package name → product name → docs site name).
