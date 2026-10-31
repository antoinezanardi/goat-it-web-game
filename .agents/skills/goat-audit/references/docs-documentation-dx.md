# DOCS — Documentation & developer experience

Covers the human-facing documentation and contributor experience of the Goat It Web Game repository: the GitHub community health files (`README.md`, `.github/CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `LICENSE`, issue forms, `.github/PULL_REQUEST_TEMPLATE.md`), drift between `docs/*.md` / README / CONTRIBUTING and the real configuration (commands, counts, versions, paths, links), decision records (`docs/seo.md` decisions, `docs/security.md` known limitations, `## GOAT audit decisions` sections), the generated developer changelog (`CHANGELOG.md`) and the localized end-user changelog (`content/*/changelog/*.md`), first-run onboarding with the Goat It API sandbox and `package.json` script discoverability, and the documentation of contribution conventions (branch names, Conventional Commits, Husky hooks, local gates, PR expectations).

**Decision doc:** `.github/CONTRIBUTING.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** `.env.example` ↔ runtime-config parity, Node/pnpm version parity across config files → PLAT · `SECURITY.md`, private vulnerability reporting → SEC · `AGENTS.md`, `.agents/**`, `.opencode/**` accuracy → AGENT · release automation, tags, rulesets, CODEOWNERS, hook and commitlint enforcement, release-process documentation → CICD · end-user changelog locale parity and translation quality → I18N · changelog claims matching game behaviour → LOGIC · operational runbooks → OPS · test-guide drift against test configuration → TEST · third-party license inventory → SUP / PRIV

## Contents

- [1. Community health files](#1-community-health-files)
- [2. Docs and config drift](#2-docs-and-config-drift)
- [3. Decision records](#3-decision-records)
- [4. Changelogs](#4-changelogs)
- [5. Developer experience](#5-developer-experience)
- [6. Contribution conventions documentation](#6-contribution-conventions-documentation)
- [Sources](#sources)

## 1. Community health files

- **[DOCS-01] README states the product purpose first** — The first screen of `README.md` (before badges overflow it) names the product and gives a one-sentence, jargon-free purpose: a party quiz/trivia web game of the Goat It ecosystem, with what a player does, not only the framework stack.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md` · Src: [2], [3]
- **[DOCS-02] Live demo link serves the current app** — The live-demo URL in `README.md` (`https://goat-it.fr/`) returns HTTP 200 and serves the current production release (page title and `lang` match the app, footer or changelog version equals the latest `CHANGELOG.md` version).
  Evidence: `runtime` · Diff: ✗ · Severity: medium · Src: [2]
- **[DOCS-03] README prerequisites match the enforced toolchain** — The README installation section names Node.js with the exact version source (`configs/node/.node-version` / `engines.node`), pnpm as the package manager declared in `packageManager`, and Docker for the API sandbox; it does not recommend an alternative package manager (e.g. `npm`) for commands whose lockfile is `pnpm-lock.yaml`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `package.json`, `configs/node/.node-version` · Src: [2], [3]
- **[DOCS-04] README covers the five essential topics** — `README.md` has a heading or explicit link for each of: install, run (dev), test (unit and acceptance), build/deploy (Docker image and runtime variables), and an architecture overview (link to `docs/architecture.md`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md` · Src: [2], [3]
- **[DOCS-05] README routes users to obtain, report and contribute** — `README.md` links the releases page, the issue tracker, `.github/CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` and `LICENSE`, so a visitor can obtain the app, give feedback and contribute from the README alone.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md` · Src: [3], [11]
- **[DOCS-06] Badges are live and truthful** — Every badge in `README.md` resolves (HTTP 200, no "invalid"/"not found" image) and reflects current state: workflow badges target workflows that exist in `.github/workflows/`, the release badge shows the latest tag, the license badge matches `LICENSE`, and the same badge is not repeated in several sections without reason.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [2]
- **[DOCS-07] One CONTRIBUTING in a recognized location** — Exactly one contributing guide exists, in a GitHub-recognized location (`.github/`, root or `docs/`; `.github/` takes precedence), and every link to it (README, issue chooser `contact_links`) targets that path.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/config.yml`, `README.md` · Src: [1], [10]
- **[DOCS-08] Contribution flow is consistent everywhere** — `.github/CONTRIBUTING.md`, `README.md`, the PR template and `scripts/create-pull-request.sh` agree on the flow: fork or branch from `develop`, PR targets `develop`, `main` receives only release PRs; no document instructs a PR to `main`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `README.md`, `scripts/create-pull-request.sh` · Src: [3], [10]
- **[DOCS-09] Code of Conduct has a real enforcement contact** — `CODE_OF_CONDUCT.md` exists at a recognized location, names a working reporting channel (not a template placeholder such as `[INSERT CONTACT METHOD]`), and the contact equals the one quoted in `.github/CONTRIBUTING.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `CODE_OF_CONDUCT.md`, `.github/CONTRIBUTING.md` · Src: [1], [3]
- **[DOCS-10] Issue forms collect actionable data** — Each `.github/ISSUE_TEMPLATE/*.yml` form has `name`, `description` and a `body` with at least one `required: true` field; the bug form requires reproduction steps, expected and actual behaviour, and the version or commit plus browser/device, so a report can be reproduced without follow-up.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/ISSUE_TEMPLATE/*.yml` · Src: [10], [3]
- **[DOCS-11] Issue chooser configured deliberately** — `.github/ISSUE_TEMPLATE/config.yml` sets `blank_issues_enabled` explicitly and every `contact_links` entry has `name`, `url` and `about`, with URLs that resolve to existing files or pages on the default branch.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/ISSUE_TEMPLATE/config.yml` · Src: [10]
- **[DOCS-12] PR template checklist mirrors the enforced gates** — `.github/PULL_REQUEST_TEMPLATE.md` (exact casing, default branch) asks for the linked issue and a description, and its checklist maps one-to-one to the gates CI and `AGENTS.md` enforce (lint, typecheck, unit tests with coverage, acceptance tests, docs updated), with no gate missing and no gate that does not exist.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/PULL_REQUEST_TEMPLATE.md` · Src: [10], [3], project: AGENTS.md
- **[DOCS-13] Project license declared consistently** — The root `LICENSE` text, `package.json` `license` (SPDX `MIT`), the README license section and the README license badge name the same license and copyright holder.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `LICENSE`, `package.json`, `README.md` · Src: [3], [1]
- **[DOCS-14] Community profile complete** — `gh api repos/{owner}/{repo}/community/profile` reports a description, README, code of conduct, contributing guide, license, issue template and pull-request template as present (the security policy item is judged by SEC).
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [11]

## 2. Docs and config drift

- **[DOCS-15] Every documented command exists** — Every `pnpm run <script>` / `pnpm <script>` quoted in `README.md`, `.github/CONTRIBUTING.md` and `docs/*.md` exists verbatim in `package.json` `scripts`, and every quoted `npx`/`pnpm exec` invocation and flag works with the installed tool (zero dead commands).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md`, `package.json` · Src: [3], [9]
- **[DOCS-16] Every script is discoverable** — Each `package.json` script (e.g. `check:secrets-in-built-output`, `check:bundle-size`, `lint:oxlint:check-rules`, `test:unit:timing`, `test:acceptance:skip-build`, `script:create-release-changelog`) has a one-line description in `README.md`, `.github/CONTRIBUTING.md` or a `docs/*.md` guide, or is explicitly listed as internal (`prepare`, `postinstall`, `*:staged*` hook scripts); no undocumented script with side effects.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [3], [9]
- **[DOCS-17] Documented invariants match the source** — Every number stated in prose is recomputed from disk and equal: locale count and codes (6: de, en, es, fr, it, pt) vs `app/i18n/locales/` and `content/`, Vitest project count (six) vs `configs/vitest/`, coverage threshold (100 %) vs the Vitest config, lint rule count ("over 500") vs the ESLint and Oxlint configs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md`, `configs/vitest/**`, `oxlint.config.jsonc` · Src: [9], [3]
- **[DOCS-18] Documented versions match installed versions** — Framework and tool versions in prose (Nuxt 4, Vue 3, Node, the `docs/architecture.md` §11 "Nuxt package line" range) equal the major.minor in `package.json` / `pnpm-lock.yaml`; no stale range or major (e.g. a "Nuxt 3" claim) remains.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `docs/*.md`, `package.json` · Src: [9]
- **[DOCS-19] Paths and anchors in docs resolve** — Every backticked repository path and relative Markdown link in `README.md`, `.github/CONTRIBUTING.md` and `docs/*.md` points to an existing file or directory, and every `#fragment` (tables of contents, cross-doc section links such as `docs/unit-testing.md §6.11`) matches an existing heading or `<a name>` anchor.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [2], [9]
- **[DOCS-20] Every maintained doc is reachable** — Each tracked `docs/*.md` (excluding the gitignored `docs/superpowers/` and `docs/audits/`) is linked from `README.md`, `.github/CONTRIBUTING.md` or the `AGENTS.md` "Useful docs" list, within two clicks of the README; no orphan doc.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `README.md`, `.github/CONTRIBUTING.md` · Src: [8]
- **[DOCS-21] Each doc has one Diátaxis mode** — Each `docs/*.md` is classifiable as tutorial, how-to guide, reference or explanation (e.g. `docs/operations.md` reference, `docs/seo.md` explanation and decisions); a doc mixing modes separates them into clearly titled sections, and step-by-step procedures are not buried inside reference tables.
  Evidence: `manual` · Diff: ✗ · Severity: low · Src: [8], [9]
- **[DOCS-22] Specialist docs linked, not duplicated** — When `README.md` or `.github/CONTRIBUTING.md` touches a topic owned by a specialist doc (architecture, security, SEO, PWA, operations, testing guides), it links that doc instead of restating its rules; any unavoidable restatement is identical to the source.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [9], project: docs/architecture.md §10
- **[DOCS-23] Architecture guide linked and matches the tree** — `docs/architecture.md` is linked from `.github/CONTRIBUTING.md` and `README.md`, and the top-level directories it describes (`app/`, `server/`, `shared/`, `content/`, `configs/`, `scripts/`, `tests/`, `modules/`, `docs/`, `public/`) match the directories that exist.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/architecture.md`, `.github/CONTRIBUTING.md`, `README.md` · Src: [8], project: docs/architecture.md §9
- **[DOCS-24] Docs updated in the same change** — When a diff adds, renames or removes a `package.json` script, an environment variable, a config path, a route, a workflow or a documented behaviour, the docs that mention it (`README.md`, `.github/CONTRIBUTING.md`, `docs/*.md`) are updated in the same diff.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [9], project: .github/CONTRIBUTING.md, project: .github/PULL_REQUEST_TEMPLATE.md

## 3. Decision records

- **[DOCS-25] GOAT decision notes follow the template** — Every entry under a `## GOAT audit decisions` section (always the last H2 of its doc, opened by the protocol intro line) has a heading `### [CODE-NN] <title> — <Accepted risk|Not applicable|False positive> (YYYY-MM-DD)` and the five bullets Finding (with evidence path), Decision, Rationale, Revisit when (observable trigger or date) and Recorded by.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `.github/CONTRIBUTING.md` · Src: [7]
- **[DOCS-26] Existing decisions are dated and reasoned** — Each documented decision outside GOAT sections (`docs/seo.md` "Decision (YYYY-MM-DD)" entries, `docs/security.md` "Known limitation" and deliberate choices, `docs/operations.md` "Out of scope", `docs/pwa.md` "by design" limits) states its date or originating issue, the decision, the rationale and its consequences or compensating controls.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/seo.md`, `docs/security.md`, `docs/operations.md`, `docs/pwa.md` · Src: [7], project: docs/seo.md
- **[DOCS-27] Significant decisions show considered options** — Decisions that constrain architecture or product behaviour (e.g. `no_prefix` locale strategy, in-process rate limiter, no API runtime caching) record at least two considered options with their trade-offs, as in MADR's "Considered Options".
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `docs/seo.md`, `docs/security.md`, `docs/pwa.md` · Src: [7]
- **[DOCS-28] Reversed decisions are superseded explicitly** — When a diff changes code or config so that a documented decision no longer holds, the same diff updates the record (marked superseded, revised or removed) instead of leaving a doc that contradicts the code.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md` · Src: [7]

## 4. Changelogs

- **[DOCS-29] CHANGELOG release headings are complete** — `CHANGELOG.md` lists releases newest first; each release heading carries the SemVer version (`MAJOR.MINOR.PATCH`, no `v` prefix), a compare link to the previous tag and an ISO-8601 `YYYY-MM-DD` release date.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `CHANGELOG.md` · Src: [4], [5]
- **[DOCS-30] Change-type sections are a fixed vocabulary** — `CHANGELOG.md` release sections use only the change-type headings defined by the release configuration in `configs/semantic-release/` (Conventional Commit types mapped to fixed titles, breaking changes in their own section), never ad-hoc buckets.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `CHANGELOG.md`, `configs/semantic-release/**` · Src: [4], [6]
- **[DOCS-31] Dependency noise grouped** — Dependency bumps appear once per release as a grouped section or table (package, version), not as one commit bullet per bump, so feature and fix entries stay readable.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `CHANGELOG.md`, `configs/semantic-release/**` · Src: [4]
- **[DOCS-32] Security fixes named in release notes** — When a release fixes a publicly known vulnerability (CVE or GHSA, in the app or a shipped dependency), its `CHANGELOG.md` section and GitHub Release body (`gh release view v<version>`) name the identifier.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [3], [4]
- **[DOCS-33] End-user changelog exists for each user-facing release** — Every minor or major release from 1.9.0 onward has `content/fr/changelog/<version>.md` whose frontmatter `version` equals the release version and whose `date` (ISO `YYYY-MM-DD`) equals the `CHANGELOG.md` heading date; other-locale parity is judged by I18N.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/*/changelog/*.md`, `CHANGELOG.md` · Src: [4], [12]
- **[DOCS-34] End-user changelog written for players** — Each `content/*/changelog/*.md` entry describes user-visible impact under the fixed sections (new features, improvements, fixes) with a player-facing title and description, and contains no commit hash, PR number, package name or developer jargon (e.g. Pinia, SSR, Vitest, Nitro).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/*/changelog/*.md` · Src: [4], [3]
- **[DOCS-35] Both changelogs are explained** — `README.md` or `.github/CONTRIBUTING.md` explains that `CHANGELOG.md` is generated by semantic-release from Conventional Commits and that the localized end-user changelog under `content/<locale>/changelog/` is written before each release (via `/write-release-changelog`), and where players see it.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `README.md`, `.github/CONTRIBUTING.md` · Src: [4], project: .opencode/commands/write-release-changelog.md

## 5. Developer experience

- **[DOCS-36] Fresh clone reaches a running app with documented steps only** — On a fresh clone, following only `README.md` (install, env file, sandbox, dev) yields a working `pnpm run dev` on port 4000 against the sandbox, including creating `envs/.env.development` (the `dev` script's dotenv, not tracked) from `envs/.env.example`; no undocumented manual step.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [3]
- **[DOCS-37] Environment variables documented for operators** — Every variable in `envs/.env.example` carries a comment stating its purpose, and `envs/.env.example` or `docs/security.md` "Environment variables" states for each one whether it is required, its default, allowed values and whether it is a secret; the README `docker run` example lists exactly the variables required at runtime.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `envs/.env.example`, `docs/security.md`, `README.md` · Src: [3]
- **[DOCS-38] API sandbox documented end to end** — `README.md` documents the `docker:api-sandbox:start|stop|restart|reset|update` scripts, the sandbox URL the dev env must use (`http://localhost:9090`, matching `docker/goat-it-api-sandbox/docker-compose.yml` and `envs/.env.example`), and that acceptance tests need the sandbox running plus `test:acceptance:prepare` once.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `docker/goat-it-api-sandbox/**`, `envs/.env.example` · Src: [3]
- **[DOCS-39] Script names follow one grammar** — `package.json` script names follow `verb:object[:modifier]` with one verb per action (no `check:*` / `validate:*` / `lint:*:check-rules` synonyms for the same kind of verification without a documented distinction).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `package.json` · Src: [3]
- **[DOCS-40] .editorconfig agrees with linters and the conventions doc** — `.editorconfig` indent (2 spaces), EOL (LF), charset (UTF-8), max line length (150) and final-newline policy per extension equal the ESLint/Oxlint settings and the formatting rules stated in `AGENTS.md`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.editorconfig`, `eslint.config.ts`, `oxlint.config.jsonc` · Src: [3], project: AGENTS.md
- **[DOCS-41] IDE run configurations mirror the scripts** — Every `.run/*.run.xml` configuration (which README advertises) invokes an existing `package.json` script, and documentation never requires an IDE: each run configuration has an equivalent CLI command documented.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.run/*.run.xml`, `README.md`, `package.json` · Src: [3]
- **[DOCS-42] Pre-commit cost is documented and bounded** — A pre-commit run on a one-file change completes within the budget stated in `.github/CONTRIBUTING.md` (or 10 s for staged-only linters and tests when none is stated); full-project steps run by `.husky/pre-commit` (e.g. `typecheck`) have their cost documented.
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [3]

## 6. Contribution conventions documentation

- **[DOCS-43] Documented branch pattern equals the validator** — The branch-name regex and type list in `.github/CONTRIBUTING.md` are identical to `pattern` in `configs/validate-branch-name/.validate-branch-namerc.json`, and the documented examples pass or fail it as labelled.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `configs/validate-branch-name/**` · Src: [3], [6]
- **[DOCS-44] Documented commit and PR-title rules equal commitlint** — The commit types, header format, breaking-change syntax (`!` before `:` and the `BREAKING CHANGE:` footer) and PR-title rule in `.github/CONTRIBUTING.md` match the rules resolved from `configs/commitlint/.commitlintrc.json`, and the documented local validation command runs as written.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `configs/commitlint/**` · Src: [6]
- **[DOCS-45] Documented hooks equal the hook files** — The hook commands quoted in `.github/CONTRIBUTING.md` (commit-msg, pre-commit, package-manager selection) equal the contents of `.husky/commit-msg` and `.husky/pre-commit`, without placeholders that hide the real invocation.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `.husky/*` · Src: [3]
- **[DOCS-46] Documented local gates equal the mandatory gates** — The "local checks" of `.github/CONTRIBUTING.md` list the four `AGENTS.md` quality gates in order (`lint:fix`, `typecheck`, `test:unit:cov`, `test:acceptance`) with their prerequisites, and the "CI & merging" list names the same gates.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md` · Src: [3], project: AGENTS.md
- **[DOCS-47] Hook bypass never presented as routine** — Any documentation of `--no-verify` states that CI re-runs the same checks and frames bypass as an exception; no doc gives a copy-paste bypass command as the default path.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/CONTRIBUTING.md` · Src: [3]
- **[DOCS-48] PR expectations stated and consistent** — `.github/CONTRIBUTING.md` and the PR template agree on PR size, description, linked issue (`Closes #n`) and evidence, including screenshots and an accessibility note for UI changes.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md` · Src: [3]
- **[DOCS-49] Contact means and response time stated** — `README.md` or `.github/CONTRIBUTING.md` offers at least two contact means (issue tracker plus email or discussions) and states an expected response time for questions and reports.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `README.md`, `.github/CONTRIBUTING.md` · Src: [12], [3]

## Sources

[1] GitHub Docs: Creating a default community health file — https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file — fetched 2026-10-31 (undated live docs)
[2] GitHub Docs: About the repository README file — https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes — fetched 2026-10-31 (undated live docs)
[3] OpenSSF Best Practices: Passing criteria — https://www.bestpractices.dev/en/criteria/0 — fetched 2026-10-31 (version-less live criteria)
[4] Keep a Changelog 1.1.0 — https://keepachangelog.com/en/1.1.0/ — fetched 2026-10-31 (spec 1.1.0)
[5] Semantic Versioning 2.0.0 — https://semver.org/ — fetched 2026-10-31 (SemVer 2.0.0)
[6] Conventional Commits 1.0.0 — https://www.conventionalcommits.org/en/v1.0.0/ — fetched 2026-10-31 (v1.0.0)
[7] ADR Templates (Nygard, MADR 4.0.0) — https://adr.github.io/adr-templates/ — fetched 2026-10-31 (page updated 2026-07-07; MADR 4.0.0)
[8] Diátaxis — https://diataxis.fr/ — fetched 2026-10-31 (undated)
[9] Diátaxis: Towards a theory of quality in documentation — https://diataxis.fr/quality/ — fetched 2026-10-31 (undated)
[10] GitHub Docs: About issue and pull request templates — https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates — fetched 2026-10-31 (undated live docs)
[11] GitHub Docs: About community profiles for public repositories — https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories — fetched 2026-10-31 (undated live docs)
[12] Opquast Digital Quality Framework, Rules — https://checklists.opquast.com/en/web-quality-assurance/ — fetched 2026-10-31 (Version 5, 2025-2030, 245 rules)
