# Full audit report template

Skeleton of `docs/audits/GOAT-AUDIT-YYYY-MM-DD[-N].md`. Replace every `<…>` placeholder, keep the headings and their order, and never overwrite an existing report.

**Kind:** report skeleton, not a category checklist. **Diff triggers:** none — read by `/goat-audit` only. **Decision docs:** the category decision docs listed in the `goat-audit` SKILL.md index.

## Contents

- [Template](#template)

## Template

````markdown
# Goat It Web Game — GOAT Audit — YYYY-MM-DD[-N]

> **Branch / commit:** `<branch>` @ `<short-sha>` · **Working tree:** clean | <n> uncommitted entries · **Tiers:** T1 ✓ · T2 ✓ · T3 acceptance ✓/✗ · local runtime ✓/✗ · live ✓/✗
> **Tools:** node `<x.y.z>` · pnpm `<x.y.z>` · gh `<x.y.z>` · **Method:** <n> category explorers (audited: <codes>), <n> verifiers, <n> docs-fetcher dispatches
> **Previous audit:** <report name or "none">

## 0. Verdict

<One paragraph: what the audit covered, the state of the product, the dominant risk theme.>

**Release verdict:** Ship-ready | Ship with follow-ups | Not ship-ready (prefixed `partial (<n>/20):` when the run covered a subset)

### Global scorecard

| Code | Category | Grade | Critical | High | Medium | Low | Info | Unverified | Comment |
|------|----------|-------|----------|------|--------|-----|------|------------|---------|
| SEC | Application security | <🐐 GOAT / 🏆 A / ✅ B / ⚠️ C / 🟠 D / ❌ F[ ⚠️ unverified]> | n | n | n | n | n | n | <one line> |
| … (all 20 rows, category order of the skill; a category not audited in this run shows `— not audited` in place of its grade and counts) |

> **Grades:** 🐐 GOAT = 0 points, no finding of any severity and nothing unverified · 🏆 A · ✅ B · ⚠️ C · 🟠 D · ❌ F · `— not audited` for a category outside the run scope.

## 1. Top findings (P0 and P1)

<Findings ordered by severity then category, each with its `[ID]` link to §4.>

## 2. Remediation roadmap

### P0 — critical
- `[ID]` <one line>

### P1 — high
- `[ID]` <one line>

### P2 — medium
- `[ID]` <one line>

### Polish — low
- `[ID]` <one line>

## 3. Changes since last audit

- **Resolved:** `[ID]` <title> (was FAIL on YYYY-MM-DD)
- **Still open:** `[ID]` <title>
- **New:** `[ID]` <title>
- **Regressed:** `[ID]` <title> (PASS/Resolved in <report>)
- **Newly decided:** `[ID]` <title> → <doc>:<line>

<On the first run: "First GOAT audit.">

## 4. Findings by category

### 4.1 SEC — Application security — <grade icon + letter>

<Counts line: PASS n · FAIL n · N/A n · UNVERIFIED n · DECIDED n, then finding blocks in the skill's §9 format, then the N/A, unverified and decided lists with reasons.>

### 4.2 SUP — Supply chain & dependencies — <grade icon + letter>

…

### 4.20 AGENT — AI-agent tooling hygiene — <grade icon + letter>

…

## 5. Strengths

- <Concrete practice worth preserving, with evidence.>

## 6. Honored decisions

<Documented decisions honored as DECIDED. A GOAT decision note whose checklist amendment already landed no longer appears here: the rewritten criterion passes on its own and the note stays in the doc as history.>

| Check | Subject | Decision | Doc |
|-------|---------|----------|-----|
| `[ID]` | `<path or resource>` | Accepted risk / Not applicable / False positive | `docs/…md:<line>` |

## 7. Discarded false positives

| Check | Claim | Why it was refuted |
|-------|-------|--------------------|
| `[ID]` | <claim> | <verification source> |

## 8. Unverified checks

| Check | Why | How to verify |
|-------|-----|---------------|
| `[ID]` | Tier 3 skipped / probe unavailable | <command or manual step> |

## 9. Measured data

- **Build:** `pnpm run build` — <exit code, duration, warnings> (`evidence/build.txt`)
- **Bundle sizes:** <size-limit output summary> (`evidence/bundle-size.json`)
- **Coverage:** <statements/branches/functions/lines> (`evidence/unit-coverage.txt`)
- **Lighthouse medians:** `/` mobile <n>/<n>/<n>/<n> · `/game` … (LCP, CLS, INP, TBT / scores)
- **Local headers:** <notable headers from `evidence/local-headers.txt`, with deviations>
- **Live headers:** <production/staging summary or "not probed">

## 10. GitHub follow-up log

| Finding | Decision | Artifact / decision doc | Date |
|---------|----------|------------------------|------|
| `[SEC-09]` | issue / advisory / comment / accepted-risk / not-applicable / false-positive / skipped | `#612` · `GHSA-xxxx-xxxx-xxxx` · `docs/security.md:210` · `null` | YYYY-MM-DD |

## Appendix A — Check status matrix

### SEC
- PASS: `[SEC-01]`, `[SEC-02]`, …
- FAIL: `[SEC-09]`, …
- N/A: `[SEC-…]` (<reason>)
- UNVERIFIED: `[SEC-…]` (<reason>)
- DECIDED: `[SEC-…]` (`docs/security.md:<line>`)

<One block per category, category order of the skill. Every check of every reference appears exactly once.>

## Appendix B — Findings index (machine-readable)

```json
[
  {
    "id": "SEC-09",
    "fingerprint": "SEC-09::server/utils/security/security-headers.constants.ts",
    "title": "Nonce-based script-src",
    "severity": "high",
    "status": "confirmed",
    "private": true,
    "decision": "advisory",
    "artifact": "GHSA-xxxx-xxxx-xxxx"
  }
]
```

Field rules:

- `fingerprint` = `<ID>::<subject>`; the subject is the normalized primary evidence path without line numbers (repo-relative) or a resource key (`gh:rulesets`, `live:production:/`, `artifact:.output/public/sw.js`).
- `status`: `confirmed` | `decided` | `discarded`.
- `private`: `true` when the finding carries 🔒. A 🔒 finding never pairs with `decision: issue` or `comment`; only `advisory`, `accepted-risk`, `not-applicable`, `false-positive`, `skipped` or `pending` are valid, and public handling requires the maintainer to clear the mark first (command §6).
- `decision`: `issue` | `advisory` | `comment` | `accepted-risk` | `not-applicable` | `false-positive` | `skipped` | `pending`.
- `artifact`: `#612` | `GHSA-xxxx-xxxx-xxxx` | `docs/security.md:210` | `null`.
- Delta computation against the previous report compares fingerprints: **Resolved** (was FAIL, now PASS/N/A), **Still open**, **New**, **Regressed** (Resolved in an earlier report or PASS previously, now FAIL), **Newly decided** (now DECIDED).
````

## Sources

[1] Keep a Changelog — https://keepachangelog.com/en/1.1.0/ — fetched 2026-10-31 (1.1.0)
[2] GitHub Docs — Creating a repository security advisory — https://docs.github.com/en/rest/security-advisories/repository-advisories#create-a-repository-security-advisory — fetched 2026-10-31 (current)
