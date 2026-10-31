---
name: goat-audit
description: Use when running /goat-audit, when brainstormer designs a spec, when final-reviewer reviews a diff, when plan-writer plans file changes, or when recording a GOAT audit decision in goat-it-web-game. Defines the 20 GOAT audit categories, [CODE-NN] check IDs, evidence and severity rules, grading, diff triggers, design triggers and the "GOAT audit decisions" notes.
---

# GOAT audit

## 1. Overview

The GOAT audit ("Greatest Of All Time" × Goat It) is a reusable, exhaustive, evidence-based audit of the whole repository across 20 professional dimensions. The bar is a god-tier professional web product, not "no obvious bug". Judge the product, not the polish: evaluate the interface with motion disabled and at low fidelity; polished visuals never mask a missing state, an unreachable control or an unhandled error.

The category checklists in `references/` **are the audit contract**. Each check has a stable ID, one evidence type, a default severity, optional `Look` globs and cited sources. Three consumers read this skill:

| Consumer | Mode | Reads | Output |
|----------|------|-------|--------|
| `goat-auditor` via `/goat-audit` | Full audit | this file, all 20 references, templates, decision docs | `docs/audits/GOAT-AUDIT-*.md`, GitHub artifacts, decision notes |
| `final-reviewer` | Diff | this file, references of triggered categories, mapped decision docs | "GOAT audit (diff mode)" block |
| `plan-writer` | Shift-left | this file, references of triggered categories, mapped decision docs | `GOAT checks:` line per task |

The orchestrator also reads §7 when the maintainer pushes back on a GOAT finding.

## 2. Iron rules

- **(a) Evidence for every claim.** A PASS, FAIL or N/A cites `file:line`, command output, an artifact path or a URL. No evidence, no verdict.
- **(b) No speculation.** A claim that cannot be proven is `⚠️ UNVERIFIED`, never FAIL and never PASS.
- **(c) Read-only.** Auditors never modify project files. The only writes allowed are the report, its run directory, and approved decision notes. Never bypass a permission denial; report it instead.
- **(d) Library facts are verified, not remembered.** Any finding that depends on a library default, API or behaviour is confirmed with `docs-fetcher` (or Context7/`webfetch` when the subagent is unavailable) before it is reported (§8).
- **(e) Decisions are binding.** Read the mapped decision doc in full. Entries in `## GOAT audit decisions` and the documented decisions listed in §7 suppress or reshape checks, until their revisit condition is met.
- **(f) Read `docs/architecture.md`** before any audit, review or plan that touches project files.
- **(g) `Look` hints are starting points, never proof.** A glob tells you where evidence usually lives; the finding still needs `file:line`.

## 3. Modes

- **Full audit** — procedure in `.opencode/commands/goat-audit.md` (agent `goat-auditor`): preflight, evidence tiers, one explorer per category, library verification, adversarial verification, report, triage.
- **Partial audit** — the same procedure restricted to a chosen subset of categories (the run asks for it; full audit is the default). A partial report states the audited set in its header, prints `— not audited` for every other category in the scorecard, computes grades only for audited categories, labels the release verdict `partial (n/20)`, and limits the delta and Appendix B to audited categories.
- **Diff mode** — §10; used by `final-reviewer` on every review.
- **Plan mode (shift-left)** — `plan-writer` matches planned paths against the category index triggers **and the Decision doc column**, reads the triggered references' `Diff: ✓` checks and the mapped decision docs, and writes a `GOAT checks:` line in every task.
- **Design mode (shift-left at spec time)** — `brainstormer` has no paths yet: it maps the feature's design areas to categories (§6 design triggers), reads those references, and writes `## GOAT constraints` (check ID → design decision) and `## Constraints accepted as risks` in the spec, so the plan inherits the category set instead of re-deriving it and the orchestrator can later record decision notes.

A full audit is expensive: 20 explorer dispatches in waves of six, adversarial verification, a production build with coverage and bundle checks, and the opt-in runtime probes. Say so when offering the category choice; a partial audit costs proportionally less.

## 4. Check format, IDs, outcomes

### 4.1 Check line format

```markdown
- **[SEC-08] Nonce-based `script-src`** — <Pass criterion with exact values, names, thresholds>.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `server/utils/security/**` · Src: [1], project: docs/security.md
```

- **Evidence** — exactly one of: `static` (source/config/docs/grep), `artifact` (built `.output` or generated files), `command` (tool output: `pnpm audit`, `gh api`, lint, tests…), `runtime` (running app: acceptance suite, local server, Lighthouse, live URL), `manual` (needs a human: screen reader, legal confirmation, visual judgment).
- **Diff** — `✓` only when Evidence is `static`; `✗` otherwise.
- **Severity** — the default when the check fails (§5). Auditors may move it **one level** with a written justification in the finding.
- **Look** — optional repository globs; every glob matched at least one path when the file was written.
- **Src** — `[n]` indexes into the file's `## Sources`, and/or `project: <repo path>` (optionally ` §<n>`).
- `(verified: <library> <x.y[.z]>)` marks a library-dependent criterion. Re-verify when the installed major or minor differs.
- A removed check leaves no line (§11); the category's IDs are compacted in the same change.
- **Criterion scope.** A criterion states an outcome that stays true as the product grows: it prescribes no single component, route, screen or feature as the only acceptable implementation, and component or file names belong in `Look` and `Src`, never inside the criterion.

### 4.2 IDs

- Format `<CODE>-<NN>`: two digits, zero-padded (`SEC-07`); three digits from 100 (`SEC-100`).
- IDs are unique per category and form a **gap-free sequence** `-01`…`-NN`: no gap, no duplicate.
- A removal or merge renumbers the category's remaining checks in file order, and every reference to them (this skill, agents, commands, templates, decision notes) is updated in the same change.
- A new check takes the number after the category's last check; the next removal-driven renumbering restores file order.
- Always cite a check as `[SEC-07]` in reports, reviews and decisions.

### 4.3 Outcomes (full audit)

| Outcome | Meaning |
|---------|---------|
| `PASS` | Holds, with cited evidence. |
| `FAIL` | Violated; produces a finding (§9) and a severity. |
| `N/A` | The check does not apply (reason given). |
| `⚠️ UNVERIFIED` | Cannot be proven (e.g. Tier 3 probe skipped); reason given. |
| `DECIDED` | Suppressed by a decision note or a documented decision; cite `doc:line`. |

Every check of every triggered reference gets one of these outcomes. Never omit a check.

## 5. Severity, grading, release verdict, priorities

### 5.1 Severity scale

| Level | Meaning |
|-------|---------|
| critical | Exploitable vulnerability or secret/PII exposure; production outage or data loss/corruption on a core flow; legal non-compliance with direct liability. |
| high | Likely user-visible failure, missing essential control, significant degradation of a core flow (e.g. WCAG level A failure on a core flow, deindexing risk, unbounded resource use reachable by anyone). |
| medium | Real defect or best-practice gap with bounded impact or likelihood; maintainability risk with concrete cost. |
| low | Minor hygiene or polish; cheap improvement. |
| info | Observation or recommendation; no action required; never graded, never triaged. |

### 5.2 Grade per category

Points over CONFIRMED findings (after verification; DECIDED excluded): critical 10, high 5, medium 2, low 0.5, info 0.

| Grade | Rule |
|-------|------|
| A | ≤ 2 points and no high/critical |
| B | ≤ 6 points and no critical |
| C | ≤ 12 points and no critical |
| D | ≤ 25 points and at most 1 critical |
| F | otherwise (> 25 points or ≥ 2 critical) |

Append `⚠️ unverified` when more than 10 % of the category's checks are `⚠️ UNVERIFIED`.

### 5.3 Release verdict and priorities

- Release verdict: any confirmed critical → **Not ship-ready**; else any confirmed high → **Ship with follow-ups**; else **Ship-ready**.
- Roadmap priorities: P0 = critical, P1 = high, P2 = medium, Polish = low. Info findings appear only in their category section.

## 6. Category index

Each check belongs to exactly one category. Diff triggers activate when a changed path matches them. The **Decision doc** column is part of the matching: a changed decision doc triggers every category mapped to it (`docs/security.md` → SEC + SUP, `docs/architecture.md` → ARCH + STACK + CODE + AGENT, `docs/operations.md` → PLAT + OPS + REL, `docs/seo.md` → SEO, `docs/pwa.md` → PWA, `docs/unit-testing.md` and `docs/acceptance-testing.md` → TEST, `.github/CONTRIBUTING.md` → DOCS). Triggers may name paths that do not exist yet; they activate when such a file is added.

| Code | Category | Reference file | Decision doc | Diff triggers |
|------|----------|----------------|--------------|---------------|
| SEC | Application security | `references/sec-application-security.md` | `docs/security.md` | `server/**`, `shared/schemas/**`, `nuxt.config.ts`, `app/**/*.vue`, `app/plugins/**`, `envs/**`, `sentry.*.config.ts`, `public/.well-known/**` |
| SUP | Supply chain & dependencies | `references/sup-supply-chain.md` | `docs/security.md` | `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `.github/renovate.json`, `.npmrc` |
| CICD | CI/CD, release & repository governance | `references/cicd-ci-cd-release.md` | `docs/ci-cd.md` (new) | `.github/**`, `configs/semantic-release/**`, `configs/commitlint/**`, `configs/validate-branch-name/**`, `configs/lint-staged/**`, `.husky/**`, `sonar-project.properties`, `.coderabbit.yaml` |
| PLAT | Runtime platform (containers, config, deployment) | `references/plat-runtime-platform.md` | `docs/operations.md` | `Dockerfile`, `.dockerignore`, `docker/**`, `envs/**`, `configs/node/**`, `server/plugins/**`, `server/routes/**`, `server/utils/env/**`, `server/utils/runtime-config/**`, `nuxt.config.ts`, `scripts/**` |
| OPS | Observability & operations | `references/ops-observability-operations.md` | `docs/operations.md` | `sentry.*.config.ts`, `shared/utils/helpers/sentry/**`, `server/utils/logging/**`, `server/plugins/error-logging/**`, `server/routes/**`, `scripts/post-deploy-health-check.sh`, `.github/workflows/deploy-*.yml`, `.github/actions/health-check/**`, `docs/operations.md` |
| REL | Reliability & resilience | `references/rel-reliability-resilience.md` | `docs/operations.md` | `server/**`, `app/composables/**`, `app/stores/**`, `app/repositories/**`, `shared/schemas/**`, `shared/constants/**`, `shared/types/**` |
| LOGIC | Domain logic & data correctness | `references/logic-domain-logic.md` | `docs/game-logic.md` (new) | `app/composables/domain/**`, `app/stores/**`, `app/pages/**`, `app/components/domain/**`, `shared/**`, `server/api/**`, `server/utils/goat-it-api/**`, `content/*/rules.md` |
| PERF | Performance | `references/perf-performance.md` | `docs/performance.md` (new) | `app/**`, `server/**`, `nuxt.config.ts`, `public/**`, `configs/size-limit/**` |
| A11Y | Accessibility | `references/a11y-accessibility.md` | `docs/accessibility.md` (new) | `app/**/*.vue`, `app/assets/**`, `app/app.config.ts`, `app/config/**`, `app/i18n/locales/**`, `tests/acceptance/features/**/*accessibility*` |
| I18N | Internationalization & localization | `references/i18n-internationalization.md` | `docs/i18n.md` (new) | `app/i18n/**`, `content/**`, `app/**/*.vue`, `nuxt.config.ts`, `shared/utils/helpers/locale/**`, `server/plugins/locale-detector/**`, `shared/utils/helpers/pwa/**` |
| SEO | SEO & social sharing | `references/seo-seo-social.md` | `docs/seo.md` | `app/pages/**`, `app/layouts/**`, `app/App.vue`, `nuxt.config.ts`, `public/**`, `app/i18n/locales/*/seo.json`, `shared/utils/helpers/site/**` |
| PWA | PWA, offline & browser compatibility | `references/pwa-pwa-offline-compatibility.md` | `docs/pwa.md` | `nuxt.config.ts`, `shared/utils/helpers/pwa/**`, `app/pages/offline/**`, `public/pwa/**`, `app/composables/ui/useConnectivityStatus/**`, `app/components/shared/ui/OfflineStatusIndicator/**`, `app/assets/css/**`, `app/App.vue` |
| UX | UX & interaction quality | `references/ux-ux-interaction.md` | `docs/ux.md` (new) | `app/**/*.vue`, `app/app.config.ts`, `app/config/**`, `app/assets/**`, `app/i18n/locales/**`, `app/composables/ui/**` |
| ARCH | Architecture & design | `references/arch-architecture.md` | `docs/architecture.md` | any added, moved or deleted file under `app/`, `server/`, `shared/`, `scripts/`, `tests/`, `configs/`; any changed import statement |
| STACK | Framework & stack correctness | `references/stack-framework-stack.md` | `docs/architecture.md` | `app/**`, `server/**`, `shared/**`, `nuxt.config.ts`, `app/app.config.ts`, `content.config.ts`, `sentry.*.config.ts`, `package.json` |
| CODE | Code quality & conventions | `references/code-code-quality.md` | `docs/architecture.md` | any `*.ts` or `*.vue` file, `tsconfig.json`, `eslint.config.ts`, `configs/eslint/**`, `oxlint.config.jsonc` |
| TEST | Testing & quality assurance | `references/test-testing-qa.md` | `docs/acceptance-testing.md` if the evidence is under `tests/acceptance/**` or concerns E2E/visual/load testing, else `docs/unit-testing.md` | `**/*.spec.ts`, `tests/**`, `configs/vitest/**`, `configs/cucumber/**`, and any change adding or altering user-facing behavior (strategy checks) |
| PRIV | Privacy, compliance & legal | `references/priv-privacy-compliance.md` | `docs/privacy.md` (new) | `app/**/*cookie*`, `shared/enums/cookie.enums.ts`, `sentry.*.config.ts`, `shared/utils/helpers/sentry/**`, `server/utils/logging/**`, `app/pages/**`, `app/layouts/**`, `public/**`, `package.json`, any diff line using `localStorage`, `sessionStorage`, `indexedDB` or `caches` |
| DOCS | Documentation & developer experience | `references/docs-documentation-dx.md` | `.github/CONTRIBUTING.md` | `docs/**`, `README.md`, `.github/*.md`, `.github/ISSUE_TEMPLATE/**`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `envs/.env.example`, `package.json` (scripts) |
| AGENT | AI-agent tooling hygiene | `references/agent-agent-tooling.md` | `docs/architecture.md` | `AGENTS.md`, `.agents/**`, `.opencode/**`, `opencode.json`, `skills-lock.json`, `.github/copilot-instructions.md`, `.coderabbit.yaml` |

Boundaries worth repeating: sustainability → PERF; cost amplification → SEC/REL; duplicate CI runs → CICD; timeout/retry/cancellation → REL; what may be logged (secrets) → SEC while log operation → OPS; Sentry data collection/PII → PRIV.

**Design triggers (spec time).** At spec time no path exists yet: `brainstormer` maps the feature's design areas to categories, states the resulting set in the spec, and reads those references. CODE and STACK are not design triggers — they stay at plan and review time.

| Design area the feature touches | Categories |
|---------------------------------|------------|
| New page, route, layout or navigation entry | A11Y, UX, I18N, SEO, PWA, PERF |
| New component, overlay, form or interactive state | A11Y, UX, PERF |
| New domain rule, state or transition | LOGIC, REL, TEST |
| New server route or upstream call | SEC, REL, PLAT, OPS, LOGIC |
| New persisted value (cookie, storage, cache) | LOGIC, PRIV, SEC |
| New dependency | SUP, ARCH, PERF |
| New environment variable or runtime configuration | PLAT, SEC |
| New workflow or release step | CICD, SUP |
| New document, runbook or decision record | DOCS |
| New agent, skill or command | AGENT |
| Any project-file change | ARCH, TEST |

## 7. Decision-note protocol

**Location.** The category's decision doc (§6), inside a section `## GOAT audit decisions` that is always the **last H2** of the doc. The section is created with the first note, with this intro line:

`Recorded GOAT audit decisions. /goat-audit, final-reviewer and plan-writer honor these entries until their revisit condition is met.`

**New decision docs.** `docs/ci-cd.md`, `docs/game-logic.md`, `docs/performance.md`, `docs/accessibility.md`, `docs/i18n.md`, `docs/ux.md`, `docs/privacy.md` are created on the first decision with: an H1 title (`# CI/CD and release`, `# Game logic`, `# Performance`, `# Accessibility`, `# Internationalization`, `# UX`, `# Privacy and compliance`), one scope paragraph, and the `## GOAT audit decisions` section. The writer also adds one line for the doc to the `AGENTS.md` "Useful docs (`docs/`)" list.

**Entry template.**

```markdown
### [A11Y-20] Shortcuts never fire while typing — Accepted risk (2026-10-31)

- **Finding:** <one sentence, including the original evidence `file:line` or resource>
- **Decision:** <what was decided>
- **Rationale:** <why>
- **Revisit when:** <observable trigger or date, e.g. "a text input is added to the game page" / "2027-04-30">
- **Recorded by:** /goat-audit (GOAT-AUDIT-2026-10-31) | orchestrator final review (<branch>)
```

**Kinds.** **Accepted risk** (valid finding consciously not fixed) · **Not applicable** (the check does not apply to this product; scope reason) · **False positive** (the finding was wrong; explain so the check is evaluated correctly next time).

**Matching.** A FAIL is suppressed (`DECIDED`) when an entry has the same check ID **and** the same subject (same evidence path or resource). Several entries may share an ID with different subjects. If the entry's "Revisit when" condition is observably met, evaluate the check normally and add `decision revisit triggered — <doc>:<line>` to the finding.

**Existing documented decisions are binding too** (cite `file:line`, outcome `DECIDED`): `docs/seo.md` "Decision (date)" entries, `docs/security.md` "Known limitation" and deliberate choices (e.g. HSTS without `includeSubDomains`/`preload`, `'wasm-unsafe-eval'`, `style-src 'unsafe-inline'`, in-process rate limiter, uncapped upstream response size), `docs/operations.md` "Out of scope" and "Reliability targets", `docs/pwa.md` "by design" limitations, `docs/architecture.md` named exceptions, and the "Accepted patterns (do not flag)" sections of `docs/unit-testing.md` and `docs/acceptance-testing.md`. Auditors therefore read each decision doc **in full**, not only its GOAT section.

## 8. Library verification and 🔒 sensitivity

- **Library verification.** A FAIL whose reasoning depends on a library's default, API or behaviour is confirmed by `docs-fetcher` (one dispatch per library, parallel allowed) before it is reported; the finding cites the documentation URL. A check carrying `(verified: <library> <version>)` is re-verified when the installed version differs in major or minor. A refuted claim discards the finding and is logged in "Discarded false positives".
- **🔒 sensitive finding.** Mark a finding 🔒 when it describes (a) an exploitable weakness with a concrete attack path today, (b) exposure of a secret, credential or personal data, or (c) a missing or misconfigured control whose public write-up would give an attacker a usable roadmap. Hardening/hygiene items without a concrete exploit path stay public (e.g. "pin actions by SHA", "add SECURITY.md"). Any category can produce a 🔒 finding. The maintainer can override the mark per finding during triage. Never publish 🔒 details in a public issue, comment or commit.

## 9. Finding formats

**Full report** (inside the category section):

```markdown
#### [SEC-08] Nonce-based script-src — HIGH 🔒

- **Evidence:** `server/utils/security/security-headers.constants.ts:22-35` — <quoted fact>; `evidence/live-production.txt` line 14
- **Impact:** <concrete consequence for this product>
- **Remediation:** <concrete steps>
- **References:** [SEC-08] sources; <docs-fetcher URL when relevant>
- **Verification:** CONFIRMED by verifier <batch id> | ADJUSTED high → medium: <reason>
```

**Diff mode** (`final-reviewer`): `` `[SEC-08]` `file:line` — expected pattern (severity) ``. For `Diff: ✗` checks whose `Look` matches a changed file: `` ⚠️ `[PERF-10]` `file` — verify in next /goat-audit (requires artifact) ``.

## 10. Diff-mode procedure (final-reviewer)

1. List changed paths (commit range, or `git status` + `git diff HEAD` when no commits exist).
2. Match paths against the diff triggers **and the Decision doc column** (§6) → triggered categories; always state them in the report.
3. For each triggered category: read its reference file **in full**, then the decision doc (GOAT section + documented decisions).
4. Evaluate the `Diff: ✓` checks **whose `Look` globs match a changed path**, plus the category-wide `Diff: ✓` checks that carry no `Look`, against the changed files and the code directly affected inside them. For `Diff: ✗` checks whose `Look` globs match a changed file, emit a non-blocking ⚠️ "verify in next /goat-audit".
5. Library-behavior claims → `docs-fetcher` (§8).
6. TEST in diff mode applies only checks tagged `(strategy)` in their title; per-file test conventions stay with final-reviewer §10/§11.
7. Static analysis only; never run builds, tests or servers.
8. Map severities: critical → Critical, high → Important, medium/low/info → Minor. Only Critical and Important force "Needs changes before merge".

## 11. Maintaining the checklists

- Adding a check: take the number after the category's last check, all fields, a fetched source (never training data), `Look` globs that exist.
- Removing or merging a check: delete its line entirely, renumber the category's remaining checks in file order, and update every reference to a shifted ID in the same change; a decision note attached to a shifted check is updated to its new ID.
- Rewriting a check: rewrite the criterion in place; the ID moves only through a removal-driven renumbering. When a decision note is attached to the old criterion, the next run reports `decision revisit triggered — <doc>:<line>` so the maintainer re-decides it.
- Every `/goat-audit` run reports stale `Look` hints and dead source links as [AGENT-10].
