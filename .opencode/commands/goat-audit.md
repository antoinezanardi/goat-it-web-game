---
description: Run the GOAT audit — exhaustive, evidence-based audit across the 20 categories (the run asks for the scope first), then triage findings into GitHub issues, private security advisories or decision notes. Use "/goat-audit triage [report]" to resume triage.
agent: goat-auditor
---

# GOAT audit

## Task

Run the GOAT audit for the **goat-it-web-game** repository: collect evidence, audit the selected categories of the `goat-audit` skill, verify the findings adversarially, write a gitignored report with a machine-readable findings index, then triage every confirmed finding into a GitHub issue, a private draft security advisory, a comment on a duplicate, or a decision note.

The report lives in `docs/audits/` (gitignored because the repository is public and the report lists unfixed weaknesses). The audit **never fixes anything** and **never commits**.

`$ARGUMENTS` selects the mode:

- empty → ask the scope question (phase 0 step 8). Never assume a full run: 20 categories is the most expensive option, not the default.
- `categories <CODES>` → run restricted to those category codes, comma-separated (e.g. `categories SEC,A11Y,UX`); an unknown code → ask the maintainer.
- `triage` → resume triage on the latest `docs/audits/GOAT-AUDIT-*.md` (latest = greatest date, then greatest suffix).
- `triage <path>` → resume triage on that report.
- anything else → ask the maintainer what they mean.

A full run is expensive: 20 explorer dispatches in waves of six, adversarial verification of every FAIL, a production build with coverage, bundle-size and secrets checks, and the opt-in runtime probes (acceptance suite, Lighthouse, live GETs). State that cost when offering the category choice; a partial run costs proportionally less.

### 0. Mode and preflight

1. Load the `goat-audit` skill; read `docs/architecture.md` and `AGENTS.md`.
2. Query MemPalace (`goat_it_web_game`) for previous audits and decisions.
3. In `triage` mode skip to phase 6 with the selected report; otherwise continue.
4. Snapshot the repository: `git rev-parse HEAD`, `git branch --show-current`, `git status --porcelain=v1` (later to `evidence/git-state.txt`), tool versions (`node --version`, `pnpm --version`, `gh --version`) to `evidence/tool-versions.txt`, `gh auth status`, and the admin right (`gh api repos/antoinezanardi/goat-it-web-game --jq .permissions.admin`).
5. Choose the report name: `GOAT-AUDIT-YYYY-MM-DD` (local date). If `docs/audits/GOAT-AUDIT-YYYY-MM-DD.md` exists, use `-2`, then `-3`, … — **never overwrite**. Create `docs/audits/.work/<report-name>/` with `evidence/`, `categories/`, `verification/`, `issues/`, `advisories/`.
6. Load the previous audit: the latest existing GOAT report, Appendix B findings index. On the first run the delta section says "First GOAT audit".
7. Build `decisions.md` in the run directory: the documented decisions listed in the skill §7 (the only source of `DECIDED`), then the `## GOAT audit decisions` entries of every decision doc with doc path and line, used to annotate findings whose checklist amendment has not landed yet.
8. Ask **one multi-select question** for the scope, smallest bundle first: `Docs & agents (DOCS, AGENT)`, `Security & platform (SEC, SUP, CICD, PLAT, OPS, REL)`, `Product experience (LOGIC, PERF, A11Y, I18N, SEO, PWA)`, `Engineering quality (UX, ARCH, STACK, CODE, TEST, PRIV)`, `All 20 categories (full run — the most expensive option)`, or explicit codes via a custom answer. Never preselect a full run: a partial audit costs proportionally less, and maintainers usually run one. Skip the question when `$ARGUMENTS` already names the categories. Write the selection to `evidence/scope.md` and into the report header.
9. Ask **one multi-select question** (Tier 3): "Acceptance suite (Docker sandbox required)", "Local runtime: headers + Lighthouse", "Live production + staging GETs", "None". If live GETs are chosen, ask one follow-up confirming the base URLs (prefilled from `docs/operations.md`; custom answer allowed). Never ask more than these two questions plus the live-URL confirmation before phase 1.

### 1. Evidence (conductor)

Every command output goes to `evidence/<name>` with a header (`$ <command>`, exit code, ISO timestamp). `evidence/INDEX.md` lists every file with what it proves and which categories use it. A failing or unavailable command is recorded, never retried silently; dependent checks become ⚠️.

**Tier 1 (always):** `pnpm audit --json` → `pnpm-audit.json`; `pnpm audit --prod --json` → `pnpm-audit-prod.json`; `pnpm outdated --format json` → `pnpm-outdated.json`; `pnpm licenses list --json` → `pnpm-licenses.json`; `pnpm dedupe --check` → `pnpm-dedupe-check.txt`; `pnpm ls --depth 0 --json` → `pnpm-ls.json`; `pnpm run lint:oxlint:check-rules` → `oxlint-rules.txt`; `gh api repos/antoinezanardi/goat-it-web-game` → `gh-repo.json`; `gh api repos/antoinezanardi/goat-it-web-game/rulesets` → `gh-rulesets.json`; `gh api repos/antoinezanardi/goat-it-web-game/branches/main/protection` and `…/branches/develop/protection` → `gh-protection-main.json`, `gh-protection-develop.json`; `gh api repos/antoinezanardi/goat-it-web-game/private-vulnerability-reporting` → `gh-pvr.json`; `gh api repos/antoinezanardi/goat-it-web-game/actions/permissions` and `…/actions/permissions/workflow` → `gh-actions-permissions.json`, `gh-actions-workflow-permissions.json`; `gh api repos/antoinezanardi/goat-it-web-game/environments` → `gh-environments.json`; `gh api "repos/antoinezanardi/goat-it-web-game/dependabot/alerts?state=open"` → `gh-dependabot-alerts.json`; `gh api "repos/antoinezanardi/goat-it-web-game/code-scanning/alerts?state=open"` → `gh-code-scanning-alerts.json`; `gh api "repos/antoinezanardi/goat-it-web-game/secret-scanning/alerts?state=open"` → `gh-secret-scanning-alerts.json`; `gh api "repos/antoinezanardi/goat-it-web-game/security-advisories?state=draft"` → `gh-draft-advisories.json`; `gh label list --json name,color,description --limit 200` → `gh-labels.json`; `gh issue list --state open --limit 300 --json number,title,labels,url,body` → `gh-open-issues.json`; `gh run list --limit 30 --json name,conclusion,headBranch,event,createdAt` → `gh-runs.json`.

**Tier 2 (only when the selection includes SEC, PLAT, OPS, PERF, PWA, SEO, CODE, STACK or TEST):** `pnpm run build` → `build.txt`, then `find .output -type f | sort` and `du -ab .output/public | sort -n` → `output-inventory.txt` (the built `sw.js`, manifest, `robots.txt`, `sitemap.xml` are read in place); `pnpm run check:bundle-size` → `bundle-size.json`; `pnpm run check:secrets-in-built-output` → `secrets-scan.txt`; `pnpm run lint` → `lint.txt`; `pnpm run typecheck` → `typecheck.txt`; `pnpm run test:unit:cov` → `unit-coverage.txt`. A partial run whose categories need no build records `Tier 2 skipped (no selected category needs it)` in `evidence/INDEX.md`; dependent checks become `⚠️ UNVERIFIED` only when a command was required and failed.

**Tier 3 (only when opted in):**

- **Acceptance:** `pnpm run test:acceptance` → `acceptance.txt` (requires the Docker API sandbox; unavailable → ⚠️ for dependent checks).
- **Local runtime:** build with `pnpm run test:acceptance:build`, start the built test server exactly as `tests/acceptance/features/support/hooks.ts` does (same command, env file, port), wait for `/healthz`. Then `curl -sS -D - -o /dev/null` on `/`, `/game`, `/rules`, `/offline`, `/api/goat-it-api/question-themes`, `/healthz`, `/readyz`, `/this-page-does-not-exist` and one hashed `/_nuxt/` asset → `local-headers.txt`. Lighthouse: `pnpm dlx lighthouse@13.6.0 <url> --output=json --output-path=<run>/evidence/lighthouse/<page>-<device>-<n>.json --quiet --chrome-flags="--headless"` (`--preset=desktop` for desktop), 3 runs per page (`/`, `/game`, `/rules`) and device (mobile, desktop), median reported → `lighthouse-summary.md`. Stop the server.
- **Live:** for each confirmed base URL (production, staging), `curl -sS -D - -o /dev/null -H "Accept-Encoding: br, gzip"` on `/`, `/game`, `/rules`, `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`, `/.well-known/security.txt`, `/healthz`, `/readyz`, `/api/goat-it-api/question-themes`, `/this-page-does-not-exist`; `curl -sS -o /dev/null -w "%{http_version} %{ssl_verify_result} %{remote_ip}\n"` on `/`; `curl -sS -D - -o /dev/null http://<host>/` → `live-<env>.txt`. Keep live requests under the 60 requests/minute rate limit.

### 2. Category fan-out

- Dispatch one `explore` subagent per **selected** category, waves of at most 6, in this order: [SEC, SUP, CICD, PLAT, OPS, REL], [LOGIC, PERF, A11Y, I18N, SEO, PWA], [UX, ARCH, STACK, CODE, TEST, PRIV], [DOCS, AGENT].
- Explorer prompt (template in `references/triage-templates.md` §Explorer): category code; paths of `SKILL.md`, the category reference file (read **in full**), `decisions.md`, `evidence/INDEX.md`; the rules: evaluate **every** check of the file with an outcome and evidence; verify each `Look` glob still exists (missing → note for AGENT); tag library-behavior claims `needs-docs: <library>`; never modify any file except `categories/<CODE>.md`; if writing fails return the full result inline; reply in ≤ 150 words (path + outcome counts).
- If the conductor receives an inline result, it writes `categories/<CODE>.md` itself.

### 3. Library verification

Collect every `needs-docs` claim from FAIL findings, group by library, dispatch `docs-fetcher` once per library (parallel) with the exact claims to confirm. Confirmed → the finding cites the URL. Refuted → the finding moves to "Discarded false positives" with the docs URL. If the subagent is unavailable, verify with the Context7 tools or `webfetch` and cite the URL.

### 4. Adversarial verification

Dispatch fresh `explore` verifiers, ≤ 8 FAIL findings per verifier, grouped by category, waves ≤ 6. Verifier contract (template in `references/triage-templates.md` §Verifier): try to **refute** each finding; re-read every cited `file:line` and confirm the line exists (line number ≤ file length) and says what the finding claims; check the criterion really applies; check `decisions.md`; check the severity. Outcome per finding: `CONFIRMED` · `REFUTED: <reason>` · `ADJUSTED: <from> → <to>, <reason>` (one level max) · `DECIDED: <doc>:<line>`. Output `verification/<CODE>-<n>.md`. The conductor applies outcomes; REFUTED findings go to "Discarded false positives".

### 5. Synthesis and report

1. Compute grades, release verdict and priorities (skill §5) from confirmed findings, over the audited categories only; a partial run labels the release verdict `partial (n/20)`.
2. Delta against the previous Appendix B: fingerprint = `<ID>::<subject>` where the subject is the normalized primary evidence path without line numbers (repo-relative) or a resource key (`gh:rulesets`, `live:production:/`, `artifact:.output/public/sw.js`). Statuses: **Resolved** (was FAIL, now PASS/N/A), **Still open**, **New**, **Regressed** (was Resolved in an earlier report or PASS previously, now FAIL), **Newly decided** (now DECIDED).
3. Assemble `docs/audits/<report-name>.md` from `references/full-audit-report-template.md`; category sections are taken from `categories/<CODE>.md` (adjusted by verification) for the audited categories only, and every other category stays a `— not audited` row in the scorecard. Immediately before writing, check again that the path does not exist; if it does, take the next suffix.
4. Print in chat: release verdict, scorecard table, counts, report path.

### 6. Triage (also the `triage` mode entry point)

1. Preconditions: `gh auth status`; admin right (if not admin, 🔒 findings can only be skipped or decided). Ensure the label exists: if `🐐 goat-audit` is absent from `gh label list`, create it once with `gh label create "🐐 goat-audit" --color D4A72C --description "Created from a GOAT audit finding"`.
2. Order: critical → high → medium → low; within a severity, by category order of the skill §6. Info findings are never triaged. In `triage` mode, findings whose Appendix B `decision` is not `pending` are skipped.
3. Duplicate search per finding: `gh issue list --state open --label "🐐 goat-audit" --search "<ID>" --json number,title,url`, then `gh issue list --state open --search "<3–5 keywords>" --limit 10 --json number,title,url`; for 🔒 findings also scan `gh-draft-advisories.json` for the ID.
4. **One question per finding** (never batched) showing: ID, title, severity, 🔒 mark, a 2–3 line evidence summary, the proposed artifact (public issue title `type(scope): imperative subject` + type label, or "private draft advisory"), and duplicate matches. Options:
   - **Create** — public issue for a public finding, private draft advisory for a 🔒 finding (recommended default);
   - **Create as draft advisory** (available for any finding: the maintainer prefers a private channel);
   - **Create as public issue** (only when the finding is not 🔒);
   - **Comment on #N** (only when a duplicate exists and the finding is not 🔒);
   - **Clear the 🔒 mark, then publish** (only when the maintainer states why publication is safe; record the override and the new `private` value in the report, then re-offer the public options);
   - **Push back — Accepted risk**;
   - **Deny — False positive / Not applicable**;
   - **Skip (decide later)**;
   - **Stop triage here** (resume later with `/goat-audit triage`).
5. Push back and Deny ask **one** follow-up question (custom answer) for the rationale, the "Revisit when" trigger and the checklist change (criterion rewrite, or removal with its renumbering), then append the decision note (skill §7) to the mapped doc (creating the doc and its `AGENTS.md` line when new) and write the ready-to-apply checklist patch to `checklist-amendments.md` in the run directory — never apply it (skill §2(c)).
6. Public issue: body written to `issues/<ID>.md` from the template; `gh issue create --title "<title>" --body-file docs/audits/.work/<report-name>/issues/<ID>.md --label "<type label>" --label "🐐 goat-audit"`.
7. Private advisory: payload written to `advisories/<ID>.json`; `gh api -X POST repos/antoinezanardi/goat-it-web-game/security-advisories --input docs/audits/.work/<report-name>/advisories/<ID>.json`; record the returned `ghsa_id` and `html_url`. 🔒 details never appear in a public issue, comment or commit.
8. After **every** decision, update the report's §10 follow-up log and the Appendix B `decision`/`artifact` fields (resumability).

**Type mapping** (title prefix → label): `fix` → `🐛 bug` · `feat` → `🚀 feature` · `perf` → `⚡️ perf` · `refactor` → `🔩 refactor` · `test` → `✅ test` · `docs` → `📖 docs` · `ci` → `🔁 ci` · `chore` → `🧹 chore`. Title: lowercase imperative subject, no trailing period, scope = domain.

### 7. Finish

1. `git status --porcelain=v1` compared with the phase-0 snapshot: only appends to decision docs and `AGENTS.md` (new doc registration) are allowed; any other difference is reported as a violation in chat and in the report header. Checklist amendments stay in the run directory, unapplied.
2. Chat summary: verdict, grades, counts (issues, advisories, comments, decisions, skipped, checklist amendments pending), links.
3. MemPalace diary entry (agent `goat-auditor`, wing `goat_it_web_game`): report name, verdict, grades, counts.
4. Remind: decision notes are uncommitted; the maintainer commits; fixes go through the normal orchestrator cycle.

### 8. Lessons learned

After the finish report, run a short retrospective and offer to improve **this command and the skill**:

1. **Collect findings:** checks that could not be evaluated (missing evidence, ambiguous criterion), stale `Look` hints and dead sources, explorer/verifier friction, triage questions the maintainer found unclear, false positives that survived verification, boundary disputes between categories.
2. **Propose improvements** as a table (improvement → lessons addressed): new check IDs, removals and merges (with the renumbering they imply), command protocol edits, template fixes. Ask via the question tool which to apply (multi-select plus custom answers).
3. **Never modify the skill, its references or this command.** The auditor is read-only (skill §2(c)): the only write paths are the report and its run directory, the decision docs and `AGENTS.md`.
4. **Hand off approved edits.** Produce a ready-to-apply payload — exact file, check ID or section, BEFORE/AFTER text, and the structural rules to respect (IDs stay gap-free after any removal, `Diff ✓` only with `static`, sources resolve, `Look` globs exist) — and tell the maintainer to run it through the normal orchestrator cycle. Do not apply it yourself.
