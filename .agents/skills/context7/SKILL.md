---
name: context7
description: Internal skill for the docs-fetcher agent. Fetches version-aware library documentation via Context7 MCP and synthesizes problem-contextual structured summaries. Never rely on training data — always fetch current docs.
---

This skill is used by the `docs-fetcher` subagent to fetch up-to-date, version-aware documentation for libraries via Context7 MCP. The docs-fetcher receives a problem description + list of libraries and returns a structured summary that explains how each library serves the use case.

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

From the results, select the best match:
- **Highest Source Reputation** (High > Medium > Low).
- **Version-specific ID** if the resolution step returned a version matching (or close to) the installed version.
- **Highest Benchmark Score** as a tiebreaker.

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

## Fetching Documentation

Call `query-docs` with:

- `libraryId`: The selected Context7 library ID (including version if applicable, e.g., `/nuxt/ui/v4.0.1`).
- `query`: What to look up, scoped to a single concept.

**Query categories** — for each library, fetch one query per relevant category:

| Category | Example Query |
|---|---|
| **API Reference** | `"UButton component all props API reference"` |
| **Usage Patterns** | `"UButton common usage patterns examples"` |
| **Configuration** | `"UButton theme configuration app.config.ts"` |

Only fetch categories that are relevant to the problem. If the caller only needs API signatures, skip Usage Patterns and Configuration.

**Split multi-topic queries** — make separate `query-docs` calls per concept. Combined queries dilute ranking and return shallow results.

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

- **Source URLs are mandatory** — every claim, code example, and API signature must link to its Context7 source.
- **Problem-contextual output** — never return a generic API dump. Every library's section must explain how it serves the specific problem described in the input.
- **One query per concept** — split multi-concept needs into separate `query-docs` calls.
- **Prefer official sources** — when multiple matches exist, prefer official/primary packages over community forks.
- **Library name input format** — use the package name exactly as it appears in `package.json` (e.g., `@nuxt/ui`, not `nuxt-ui`).
