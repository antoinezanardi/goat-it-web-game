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

- **[DOCS-01] README states purpose, setup topics and entry points** — The first screen of `README.md` (before badges overflow it) names the product and gives a one-sentence, jargon-free purpose — a party quiz/trivia web game of the Goat It ecosystem, with what a player does, not only the framework stack; the README has a heading or explicit link for install, run (dev), test (unit and acceptance), build/deploy and an architecture overview, and links the releases page, issue tracker, `.github/CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` and `LICENSE`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md` · Src: [2], [3]
- **[DOCS-02] README prerequisites match the enforced toolchain** — The README installation section names Node.js with the exact version source (`configs/node/.node-version` / `engines.node`), pnpm as the package manager declared in `packageManager`, and Docker for the API sandbox; it does not recommend an alternative package manager (e.g. `npm`) for commands whose lockfile is `pnpm-lock.yaml`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `package.json`, `configs/node/.node-version` · Src: [2], [3]
- **[DOCS-03] Badges and external links are live and truthful** — Every badge and external link in `README.md` resolves (HTTP 200, no invalid or not-found image): the live-demo URL serves the current production release (matching title, `lang` and latest version), workflow badges target existing workflows, the release badge shows the latest tag, the license badge matches `LICENSE`, and no badge is repeated without reason.
  Evidence: `runtime` · Diff: ✗ · Severity: low · Src: [2]
- **[DOCS-04] Community health contacts are real and consistent** — Exactly one contributing guide exists in a GitHub-recognized location (`.github/` takes precedence over root and `docs/`), every link to it targets that path, `CODE_OF_CONDUCT.md` names a working reporting channel (not a template placeholder) equal to the one quoted in CONTRIBUTING, and README or CONTRIBUTING offers at least two contact means (issue tracker plus email or discussions) with an expected response time.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `.github/ISSUE_TEMPLATE/config.yml`, `README.md` · Src: [1], [10]
- **[DOCS-05] Contribution flow is consistent everywhere** — `.github/CONTRIBUTING.md`, `README.md`, the PR template and `scripts/create-pull-request.sh` agree on the flow: fork or branch from `develop`, PR targets `develop`, `main` receives only release PRs; no document instructs a PR to `main`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `README.md`, `scripts/create-pull-request.sh` · Src: [3], [10]
- **[DOCS-06] Issue templates collect actionable data** — Each `.github/ISSUE_TEMPLATE/*.yml` form has `name`, `description` and a `body` with at least one `required: true` field (the bug form requiring reproduction steps, expected and actual behaviour, version or commit and browser/device), and `config.yml` sets `blank_issues_enabled` explicitly with `contact_links` entries whose `name`, `url` and `about` resolve on the default branch.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/ISSUE_TEMPLATE/config.yml` · Src: [10]
- **[DOCS-07] PR template checklist mirrors the enforced gates** — `.github/PULL_REQUEST_TEMPLATE.md` (exact casing, default branch) asks for the linked issue and a description, and its checklist maps one-to-one to the gates CI and `AGENTS.md` enforce (lint, typecheck, unit tests with coverage, acceptance tests, docs updated), with no gate missing and no gate that does not exist.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/PULL_REQUEST_TEMPLATE.md` · Src: [10], [3], project: AGENTS.md
- **[DOCS-08] Project license declared consistently** — The root `LICENSE` text, `package.json` `license` (SPDX `MIT`), the README license section and the README license badge name the same license and copyright holder.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `LICENSE`, `package.json`, `README.md` · Src: [3], [1]

## 2. Docs and config drift

- **[DOCS-09] Every documented command and script is real and documented** — Every `pnpm run <script>` / `pnpm <script>` quoted in `README.md`, `.github/CONTRIBUTING.md` and `docs/*.md` exists verbatim in `package.json` `scripts`; every script has a one-line description somewhere or is explicitly listed as internal; script names follow `verb:object[:modifier]` with one verb per action; and every advertised `.run/*.run.xml` invokes an existing script with an equivalent CLI command documented (zero dead commands, no IDE-only step).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md`, `package.json` · Src: [3], [9]
- **[DOCS-10] Documented versions and counts match the source** — Framework and tool versions in prose (Nuxt 4, Vue 3, Node, the `docs/architecture.md` §11 package line) equal the major.minor in `package.json`/`pnpm-lock.yaml`, and every number stated in prose is recomputed from disk and equal (locale count and codes vs `app/i18n/locales/` and `content/`, the six Vitest projects vs `configs/vitest/`, the 100 % coverage threshold vs the Vitest config, the lint rule count vs the ESLint and Oxlint configs); no stale range or major remains.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `docs/*.md`, `package.json` · Src: [9]
- **[DOCS-11] Paths, anchors and doc reachability resolve** — Every backticked repository path and relative Markdown link in `README.md`, `.github/CONTRIBUTING.md` and `docs/*.md` points to an existing file or directory, every `#fragment` matches an existing heading or anchor, and each maintained `docs/*.md` (excluding the gitignored `docs/superpowers/` and `docs/audits/`) is linked from README, CONTRIBUTING or the `AGENTS.md` useful-docs list.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [2], [9]
- **[DOCS-12] Specialist docs linked, not duplicated, and match the tree** — When `README.md` or `.github/CONTRIBUTING.md` touches a topic owned by a specialist doc it links that doc instead of restating its rules (any unavoidable restatement is identical to the source), and `docs/architecture.md` — linked from CONTRIBUTING and README — describes top-level directories that match the tree.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [9], project: docs/architecture.md §10
- **[DOCS-13] Docs updated in the same change** — When a diff adds, renames or removes a `package.json` script, an environment variable, a config path, a route, a workflow or a documented behaviour, the docs that mention it (`README.md`, `.github/CONTRIBUTING.md`, `docs/*.md`) are updated in the same diff.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `README.md`, `.github/CONTRIBUTING.md`, `docs/*.md` · Src: [9], project: .github/CONTRIBUTING.md, project: .github/PULL_REQUEST_TEMPLATE.md
- **[DOCS-26] Documented executable invocations run** — Every `npx`, `pnpm exec` and `pnpm dlx` invocation quoted in `README.md`, `.github/CONTRIBUTING.md` and `docs/*.md` runs with the installed tool versions and accepts every flag it names (no removed flag, no renamed binary, no missing peer).
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [3], [9]

## 3. Decision records

- **[DOCS-14] Decision records follow the template and show reasoning** — Every entry under a `## GOAT audit decisions` section (always the last H2, opened by the protocol intro line) uses the heading `### [CODE-NN] <title> — <Accepted risk|Not applicable|False positive> (YYYY-MM-DD)` with the six bullets Finding, Decision, Rationale, Revisit when, Checklist change and Recorded by; every documented decision outside those sections states its date or originating issue, the decision, the rationale and its consequences, and decisions that constrain architecture or product behaviour record at least two considered options with their trade-offs.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md`, `.github/CONTRIBUTING.md` · Src: [7]
- **[DOCS-15] Reversed decisions are superseded explicitly** — When a diff changes code or config so that a documented decision no longer holds, the same diff updates the record (marked superseded, revised or removed) instead of leaving a doc that contradicts the code.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `docs/*.md` · Src: [7]

## 4. Changelogs

- **[DOCS-16] CHANGELOG structure is complete and stable** — `CHANGELOG.md` lists releases newest first with the SemVer version (no `v` prefix), a compare link and an ISO-8601 date; release sections use only the change-type headings defined in `configs/semantic-release/` (breaking changes in their own section), and dependency bumps appear once per release as a grouped section or table rather than one bullet per bump.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `CHANGELOG.md` · Src: [4], [5]
- **[DOCS-17] Security fixes named in release notes** — When a release fixes a publicly known vulnerability (CVE or GHSA, in the app or a shipped dependency), its `CHANGELOG.md` section and GitHub Release body (`gh release view v<version>`) name the identifier.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [3], [4]
- **[DOCS-18] End-user changelog exists and is explained** — Every minor or major release from 1.9.0 onward has `content/fr/changelog/<version>.md` whose frontmatter `version` and ISO `date` match the `CHANGELOG.md` heading (other-locale parity is I18N), and README or CONTRIBUTING explains that `CHANGELOG.md` is generated by semantic-release from Conventional Commits while the localized end-user changelog is written before each release and where players see it.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/*/changelog/*.md`, `CHANGELOG.md` · Src: [4], [12]
- **[DOCS-19] End-user changelog written for players** — Each `content/*/changelog/*.md` entry describes user-visible impact under the fixed sections (new features, improvements, fixes) with a player-facing title and description, and contains no commit hash, PR number, package name or developer jargon (e.g. Pinia, SSR, Vitest, Nitro).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `content/*/changelog/*.md` · Src: [4], [3]

## 5. Developer experience

- **[DOCS-20] Fresh clone reaches a running app with documented steps only** — On a fresh clone, following only `README.md` (install, env file, sandbox, dev) yields a working `pnpm run dev` on port 4000 against the sandbox, creating `envs/.env.development` from `envs/.env.example`; the README documents the `docker:api-sandbox:start|stop|restart|reset|update` scripts, the sandbox URL (`http://localhost:9090`, matching the compose file and `.env.example`) and that acceptance tests need the sandbox plus `test:acceptance:prepare` once; no undocumented manual step.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [3]
- **[DOCS-21] Environment variables documented for operators** — Every variable in `envs/.env.example` carries a comment stating its purpose, and `envs/.env.example` or `docs/security.md` "Environment variables" states for each one whether it is required, its default, allowed values and whether it is a secret; the README `docker run` example lists exactly the variables required at runtime.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `envs/.env.example`, `docs/security.md`, `README.md` · Src: [3]
- **[DOCS-22] .editorconfig agrees with linters and the conventions doc** — `.editorconfig` indent (2 spaces), EOL (LF), charset (UTF-8), max line length (150) and final-newline policy per extension equal the ESLint/Oxlint settings and the formatting rules stated in `AGENTS.md`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.editorconfig`, `eslint.config.ts`, `oxlint.config.jsonc` · Src: [3], project: AGENTS.md

## 6. Contribution conventions documentation

- **[DOCS-23] Documented branch pattern equals the validator** — The branch-name regex and type list in `.github/CONTRIBUTING.md` are identical to `pattern` in `configs/validate-branch-name/.validate-branch-namerc.json`, and the documented examples pass or fail it as labelled.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `configs/validate-branch-name/**` · Src: [3], [6]
- **[DOCS-24] Documented commit, hook and gate rules equal the enforced ones** — The commit types, header format, breaking-change syntax and PR-title rule in `.github/CONTRIBUTING.md` match the rules resolved from `configs/commitlint/.commitlintrc.json`; the hook commands quoted there equal `.husky/commit-msg` and `.husky/pre-commit`; the local and CI gate lists name the four `AGENTS.md` gates in order with their prerequisites; and any documentation of `--no-verify` states that CI re-runs the same checks, framing bypass as an exception rather than a copy-paste default.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CONTRIBUTING.md`, `configs/commitlint/**` · Src: [6]
- **[DOCS-25] PR expectations stated and consistent** — `.github/CONTRIBUTING.md` and the PR template agree on PR size, description, linked issue (`Closes #n`) and evidence, including screenshots and an accessibility note for UI changes.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md` · Src: [3]

## Sources

[1] GitHub Docs: Creating a default community health file — https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file — fetched 2026-10-31 (undated live docs)
[2] GitHub Docs: About the repository README file — https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes — fetched 2026-10-31 (undated live docs)
[3] OpenSSF Best Practices: Passing criteria — https://www.bestpractices.dev/en/criteria/0 — fetched 2026-10-31 (version-less live criteria)
[4] Keep a Changelog 1.1.0 — https://keepachangelog.com/en/1.1.0/ — fetched 2026-10-31 (spec 1.1.0)
[5] Semantic Versioning 2.0.0 — https://semver.org/ — fetched 2026-10-31 (SemVer 2.0.0)
[6] Conventional Commits 1.0.0 — https://www.conventionalcommits.org/en/v1.0.0/ — fetched 2026-10-31 (v1.0.0)
[7] ADR Templates (Nygard, MADR 4.0.0) — https://adr.github.io/adr-templates/ — fetched 2026-10-31 (page updated 2026-07-07; MADR 4.0.0)
[9] Diátaxis: Towards a theory of quality in documentation — https://diataxis.fr/quality/ — fetched 2026-10-31 (undated)
[10] GitHub Docs: About issue and pull request templates — https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates — fetched 2026-10-31 (undated live docs)
[12] Opquast Digital Quality Framework, Rules — https://checklists.opquast.com/en/web-quality-assurance/ — fetched 2026-10-31 (Version 5, 2025-2030, 245 rules)
