# AGENT — AI-agent tooling hygiene

Hygiene of the AI-agent tooling that builds and reviews Goat It: the root `AGENTS.md`, the skills under `.agents/skills/**` (locally authored and vendored through `skills-lock.json`), the OpenCode agents (`.opencode/agents/*.md`), commands (`.opencode/commands/*.md`) and `opencode.json`, the vendor instruction files (`.github/copilot-instructions.md`, `.coderabbit.yaml` code guidelines), and the GOAT audit checklists themselves. The bar: every instruction an agent reads is true for this repository today, every cross-reference resolves, every tag family and checklist matches its definition, permissions enforce each agent's role (no commit, no destructive action), and no agent rule contradicts `docs/`.

**Decision doc:** `docs/architecture.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** human documentation drift (README, CONTRIBUTING, `docs/**` accuracy, docs index) → DOCS · CI workflows, PR checks and repository settings (including CodeRabbit review gating) → CICD · OpenCode plugin and skill package supply chain → SUP · placement of application files → ARCH · lint and TypeScript rules → CODE · test conventions content and test strategy → TEST · secrets in code or config → SEC

## Contents

- [1. AGENTS.md accuracy](#1-agentsmd-accuracy)
- [2. Skills, commands and agents registration](#2-skills-commands-and-agents-registration)
- [3. Cross-references and tags](#3-cross-references-and-tags)
- [4. Checklist drift](#4-checklist-drift)
- [5. Permission sanity](#5-permission-sanity)
- [6. Consistency between agent rules and docs](#6-consistency-between-agent-rules-and-docs)
- [Sources](#sources)

## 1. AGENTS.md accuracy

- **[AGENT-01] Root AGENTS.md with canonical sections** — Keep one plain-Markdown `AGENTS.md` at the repository root covering project overview and structure, build/run commands, lint/typecheck/test commands (including how to run a single test), code style and conventions, and commit/PR rules; no root `CLAUDE.md` or `GEMINI.md` carries a competing rule set.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `AGENTS.md` · Src: [1], [7]
- **[AGENT-02] AGENTS.md scripts exist** — Every `pnpm run <script>` quoted in `AGENTS.md` (dev, build, preview, lint, typecheck, unit and acceptance test variants, branch-name validation) exists verbatim in `package.json` `scripts`; zero stale script names.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `AGENTS.md`, `package.json` · Src: [1]
- **[AGENT-03] AGENTS.md paths exist** — Every repository path or glob referenced by `AGENTS.md` (for example `configs/vitest/vitest.config.setup-files.constants.ts`, `tests/unit/setup/nuxt/`, `docker/goat-it-api-sandbox/docker-compose.yml`, `.opencode/commands/lint-unit-tests.md`, `docs/*.md`) resolves to an existing path; no moved, renamed or removed file or directory.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `AGENTS.md` · Src: [1]
- **[AGENT-04] AGENTS.md numeric invariants match the repo** — Numbers stated in `AGENTS.md` equal their source of truth: the Vitest project count and names equal the projects of `configs/vitest/vitest.config.ts`, the locale list equals the `app/i18n/locales/*` directories, the coverage threshold equals the Vitest `thresholds` setting, and the skill/command counts equal the files on disk.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `configs/vitest/vitest.config.ts` · Src: [1]

## 2. Skills, commands and agents registration

- **[AGENT-05] Skill name valid and equal to its folder** — Every `.agents/skills/<folder>/SKILL.md` starts with YAML frontmatter whose `name` equals `<folder>`, is 1–64 characters and matches `^[a-z0-9]+(-[a-z0-9]+)*$`; skill names are unique across all discovery locations (`.agents/skills/`, `.opencode/skills/`, `.claude/skills/`) (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.agents/skills/*/SKILL.md` · Src: [2], [3]
- **[AGENT-06] Skill description present and under 1,024 characters** — Every `SKILL.md` frontmatter has a non-empty `description` of 1–1,024 characters that states what the skill does and when to use it (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.agents/skills/*/SKILL.md` · Src: [2], [3]
- **[AGENT-07] Locally authored skills declare a "Use when" trigger** — Every skill not listed in `skills-lock.json` has a third-person `description` that starts with `Use when` followed by concrete triggering conditions; a description that starts with an imperative ("You MUST…") or an internal label ("Internal skill…") fails.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.agents/skills/*/SKILL.md`, `skills-lock.json` · Src: [3], project: .agents/skills/writing-skills/SKILL.md
- **[AGENT-08] skills-lock.json entries resolve** — Every entry of `skills-lock.json` has `source`, `sourceType`, `skillPath` and `computedHash`, and its key names an existing `.agents/skills/<key>/SKILL.md` whose frontmatter `name` equals the key; locally authored skills are absent from the lockfile.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `skills-lock.json`, `.agents/skills/*/SKILL.md` · Src: [2], project: skills-lock.json
- **[AGENT-09] AGENTS.md skills list matches the skill folders** — The `AGENTS.md` "Agent skills" list names exactly the set of `.agents/skills/*/SKILL.md` folders (no missing skill such as `context7` or `goat-audit`, no listed skill without a folder), in alphabetical order.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.agents/skills/*/SKILL.md` · Src: [1], project: AGENTS.md
- **[AGENT-10] AGENTS.md lists every command and agent** — The `AGENTS.md` "OpenCode commands" list names exactly the `.opencode/commands/*.md` files (each with a one-line purpose), and every `.opencode/agents/*.md` agent is named in `AGENTS.md`; every command or agent name in `AGENTS.md` exists as a file or an OpenCode built-in (`build`, `plan`, `general`, `explore`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.opencode/commands/*.md`, `.opencode/agents/*.md` · Src: [1], [4], [6]
- **[AGENT-11] Agent frontmatter valid for OpenCode** — Every `.opencode/agents/*.md` frontmatter has a `description`, a `mode` in `primary`/`subagent`/`all`, uses `steps` (never the deprecated `maxSteps`) and `permission` (never the deprecated `tools`), sets `hidden` only on `mode: subagent`, and gives `question`, `todowrite`, `webfetch`, `websearch` and `doom_loop` a single action string, never a pattern object (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md` · Src: [4], [5]

## 3. Cross-references and tags

- **[AGENT-12] Skill, agent and command references resolve** — Every skill (`` `name` skill ``, `.agents/skills/<name>/SKILL.md`), agent or subagent (`` `name` subagent ``, `task` permission key) and slash command (`/name`) named in `AGENTS.md`, `.opencode/agents/*.md`, `.opencode/commands/*.md`, `opencode.json` (`default_agent`, `agent.*`) or a locally authored skill exists on disk or is an OpenCode built-in; `default_agent` names a `mode: primary` agent (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `AGENTS.md`, `.opencode/agents/*.md`, `.opencode/commands/*.md`, `opencode.json` · Src: [4], [6], [8]
- **[AGENT-13] Rule-tag families match the lint commands** — The tag families cited by `final-reviewer` (hard verdict gate ranges `[U*]`–`[T*]` and `[AU*]`–`[SU*]`, the per-type lists of §10 and §11), `orchestrator` ("Handling final-review feedback" EXTRACT and CONSULT steps) and `plan-writer` (unit-test range `[U1]`–`[T3]`) equal the families defined as `**[TAG<n>]**` in §4 of `.opencode/commands/lint-unit-tests.md` and `.opencode/commands/lint-acceptance-tests.md` (for example a unit `[SC*]` family is listed) plus `[<CODE>-NN]` GOAT IDs; no undefined tag such as `[A]` is cited.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.opencode/agents/final-reviewer.md`, `.opencode/agents/orchestrator.md`, `.opencode/agents/plan-writer.md`, `.opencode/commands/lint-*-tests.md` · Src: project: AGENTS.md
- **[AGENT-14] Section and step references resolve** — Every numbered reference between agent files ("section 4 of `lint-unit-tests.md`", "§3 classification table", "step 8", "`/lint-unit-tests` §11", "final-reviewer §12", "`docs/acceptance-testing.md` §5.4") points to an existing heading whose content matches what the citing file says it contains.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md`, `.agents/skills/*/SKILL.md` · Src: [1], project: AGENTS.md
- **[AGENT-15] Cited GOAT check IDs exist** — Every `[<CODE>-NN]` cited in the `goat-audit` `SKILL.md`, its report and triage templates, the `goat-audit` command, `final-reviewer`, `plan-writer`, `orchestrator` and any `## GOAT audit decisions` entry matches an active or retired check line in `.agents/skills/goat-audit/references/*.md`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/final-reviewer.md`, `.opencode/agents/plan-writer.md`, `.opencode/agents/orchestrator.md` · Src: project: .agents/skills/goat-audit/SKILL.md §4.2

## 4. Checklist drift

- **[AGENT-16] Paths and scripts cited in agent files exist** — Every repository path, file suffix pattern target and `pnpm run` script cited in `.opencode/agents/*.md`, `.opencode/commands/*.md` and locally authored skills (for example `configs/validate-branch-name/.validate-branch-namerc.json`, `configs/vitest/vitest.config.setup-files.constants.ts`, `tests/unit/utils/faketories/`, `pnpm run lint:oxlint:check-rules`, `pnpm run validate:branch-name`) exists in the repository or in `package.json` `scripts`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md`, `package.json` · Src: [1], project: AGENTS.md
- **[AGENT-17] Restated repository facts match the repo** — Facts restated in agent prompts, commands and locally authored skills equal the repository: the Vitest project list names all six projects (`nuxt`, `composables`, `stores`, `repositories`, `node`, `dom`), the spec classification types listed by `final-reviewer` §10/§11 equal the §3 tables of the lint commands, the locale list equals `app/i18n/locales/*`, and file-naming examples follow the current suffixes.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/*.md`, `.opencode/agents/final-reviewer.md`, `configs/vitest/vitest.config.ts` · Src: project: AGENTS.md, project: docs/unit-testing.md
- **[AGENT-18] Stale `Look` hints** — Every backticked glob in a `Look:` field of `.agents/skills/goat-audit/references/*.md` matches at least one path in `git ls-files --cached --others --exclude-standard -- ':(glob)<glob>'`; each glob that matches nothing is reported with its check ID (every `/goat-audit` run).
  Evidence: `command` · Diff: ✗ · Severity: low · Src: project: .agents/skills/goat-audit/SKILL.md §11
- **[AGENT-19] Dead source links in GOAT references** — Every URL of the `## Sources` lists in `.agents/skills/goat-audit/references/*.md` resolves (final HTTP status 2xx after redirects, fetched with `curl -sS -L -o /dev/null -w "%{http_code}"`); each dead or moved link is reported with its source number and the check IDs citing it (every `/goat-audit` run).
  Evidence: `command` · Diff: ✗ · Severity: low · Src: project: .agents/skills/goat-audit/SKILL.md §11
- **[AGENT-20] GOAT reference files keep the check format** — Every check in `.agents/skills/goat-audit/references/*.md` has the line `- **[CODE-NN] Title** — criterion` followed by the indented metadata `Evidence · Diff · Severity · [Look ·] Src` in that order; `Diff: ✓` appears only with `Evidence: static`; every `Src: [n]` exists in the file's `## Sources` and every source is cited; each file longer than 100 lines has `## Contents`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Src: project: .agents/skills/goat-audit/SKILL.md §4.1, project: .agents/skills/writing-skills/anthropic-best-practices.md
- **[AGENT-21] GOAT check IDs are append-only** — Across `git log -p -- .agents/skills/goat-audit/references/`, no check ID is renumbered, reused for another criterion or deleted; a removed or materially changed check stays as `- ~~[CODE-NN]~~ Retired YYYY-MM-DD — <reason>` and its replacement takes the next free number.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: project: .agents/skills/goat-audit/SKILL.md §4.2

## 5. Permission sanity

- **[AGENT-22] Commit and push are denied everywhere** — `opencode.json` `permission.bash` denies `git add`, `git commit` and `git push` with patterns that also match the bare commands (`git commit*`, not only `git commit *`), and no agent `bash` rule placed after them re-allows any of them (for example a broad `"git *": "allow"`), because the last matching rule wins (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `opencode.json`, `.opencode/agents/*.md` · Src: [5], project: docs/architecture.md §10
- **[AGENT-23] Unlisted bash commands are never auto-allowed** — For every agent, the effective `bash` rules (global `opencode.json` merged with the agent block) start with a `"*": "ask"` or `"*": "deny"` catch-all, so a command matching no explicit rule never falls back to OpenCode's permissive `allow` default; an agent without a `bash` block relies on a global catch-all (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `opencode.json`, `.opencode/agents/*.md` · Src: [5], [4]
- **[AGENT-24] Broad allows exclude destructive forms** — An agent that allows a broad command family (`gh *`, `curl *`, `sed *`, `git *`, `docker compose *`) also denies, after that allow, its mutating or destructive forms (`gh pr merge*`, `gh release*`, `gh repo delete*`, `gh api -X *`, `gh api * --method *`, `curl * -X *`, `curl * -d *`, `sed -i*`, `git reset*`, `git clean*`, `git push*`, `rm *`) or narrows the allow to read-only subcommands; read-only `gh` usage required by `AGENTS.md` stays allowed (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md`, `opencode.json` · Src: [5], project: AGENTS.md
- **[AGENT-25] Permissions match what the prompt requires** — Every command, tool or subagent an agent prompt (or a command it runs) requires is allowed or `ask` for that agent (for example `git checkout -b` and `pnpm run validate:branch-name` for `orchestrator`, `general` subagents dispatched by `/lint-unit-tests` and `/lint-acceptance-tests` under the agent that runs them), and every `task` block starts with `"*": "deny"` and allows only the subagents the prompt dispatches; an agent that dispatches no subagent sets `task: deny` (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md` · Src: [4], [6]
- **[AGENT-26] Edit scope matches the agent role** — Review and documentation-fetch agents (`final-reviewer`, `docs-fetcher`) set `edit: deny`; design and planning agents restrict `edit` to `"*": "deny"` plus their output directories (`docs/superpowers/specs/**`, `docs/superpowers/plans/**`); only implementation-role agents (`implementer`, `gatekeeper`, `debugger`, `orchestrator`, `receiving-code-review`) hold `edit: allow`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md` · Src: [4], project: docs/architecture.md §10
- **[AGENT-27] GOAT auditor stays read-only** — The `goat-auditor` agent sets `edit` to `"*": "deny"` followed by allows for exactly `docs/audits/**`, the decision docs of the `goat-audit` SKILL.md category index and `AGENTS.md`; its `bash` block ends with denials of `git add|commit|push|checkout|switch|reset|restore|stash|clean|merge|rebase|tag`, package installs, `*--fix*`, `rm`, `mv`, `sed -i`, mutating `gh issue` and `gh api` forms and mutating `curl` forms, with the single advisory `gh api -X POST …/security-advisories --input docs/audits/*` allow placed after them; its `task` block allows only `explore` and `docs-fetcher` (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: high · Src: [5], [4], project: .opencode/agents/goat-auditor.md
- **[AGENT-28] Env files stay behind approval** — No agent sets the `read: allow` shorthand or a `read` pattern that allows `*.env` or `*.env.*` (other than `*.env.example`), so OpenCode's default `ask` for env files is kept for every agent (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md`, `opencode.json` · Src: [5]

## 6. Consistency between agent rules and docs

- **[AGENT-29] File-changing agents consult the architecture guide** — Every agent, skill and command that can plan, create, edit or move project files instructs reading `docs/architecture.md` before that work, and none restates a placement rule that differs from it.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md`, `docs/architecture.md` · Src: project: docs/architecture.md §10
- **[AGENT-30] No prompt instructs a commit** — Every agent prompt and command states that agents never commit, and none instructs `git add`, `git commit` or `git push` (creating a branch with `git checkout -b` / `git checkout --no-track -b` is allowed); commit messages are only proposed to the user.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md`, `AGENTS.md` · Src: project: docs/architecture.md §10, project: AGENTS.md
- **[AGENT-31] Quality-gate rule is identical everywhere** — The mandatory gate order `pnpm run lint:fix` → `pnpm run typecheck` → `pnpm run test:unit:cov` → `pnpm run test:acceptance` (fresh build) and the per-task "focused checks only" rule read the same in `AGENTS.md`, `.github/copilot-instructions.md`, `orchestrator`, `gatekeeper` and `implementer`; no copy adds, drops or reorders a gate.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.github/copilot-instructions.md`, `.opencode/agents/gatekeeper.md`, `.opencode/agents/orchestrator.md` · Src: [1], project: AGENTS.md
- **[AGENT-32] Agent rules do not contradict docs** — Where `AGENTS.md`, an agent prompt, a command or a locally authored skill states a rule also stated in `docs/**` (aliases, naming, layer boundaries, comment policy, Vitest projects, mock registration, describe labels, "Accepted patterns (do not flag)"), the wording matches or explicitly defers to the doc; no contradicting rule exists.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `AGENTS.md`, `.opencode/commands/*.md`, `docs/unit-testing.md`, `docs/acceptance-testing.md` · Src: [1], [9], project: docs/architecture.md §10
- **[AGENT-33] Copilot instructions defer to AGENTS.md** — `.github/copilot-instructions.md` points to `AGENTS.md` and `docs/architecture.md` as the rule sources and states no rule that is absent from or different in `AGENTS.md`; any `.github/instructions/*.instructions.md` file has an `applyTo` frontmatter and the same deference.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/copilot-instructions.md`, `AGENTS.md` · Src: [9], [7]
- **[AGENT-34] CodeRabbit guideline sources resolve** — When `.coderabbit.yaml` enables `knowledge_base.code_guidelines`, every `filePatterns` entry matches at least one existing file and the agent instruction files it applies (auto-detected `AGENTS.md`, `.github/copilot-instructions.md`, `.agents/skills/*/SKILL.md`) contain no rule that conflicts with `AGENTS.md`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.coderabbit.yaml`, `AGENTS.md` · Src: [10]

## Sources

[1] AGENTS.md — https://agents.md/ — fetched 2026-10-31 (undated; stewarded by the Agentic AI Foundation, Linux Foundation)
[2] OpenCode — Agent Skills — https://opencode.ai/docs/skills — fetched 2026-10-31 (page updated 2026-10-30; opencode 1.19.5 installed)
[3] Agent Skills — Specification — https://agentskills.io/specification — fetched 2026-10-31 (undated)
[4] OpenCode — Agents — https://opencode.ai/docs/agents — fetched 2026-10-31 (page updated 2026-10-30; opencode 1.19.5 installed)
[5] OpenCode — Permissions — https://opencode.ai/docs/permissions — fetched 2026-10-31 (page updated 2026-10-30; opencode 1.19.5 installed)
[6] OpenCode — Commands — https://opencode.ai/docs/commands — fetched 2026-10-31 (page updated 2026-10-30)
[7] OpenCode — Rules — https://opencode.ai/docs/rules — fetched 2026-10-31 (page updated 2026-10-30)
[8] OpenCode — Config (default_agent) — https://opencode.ai/docs/config — fetched 2026-10-31 (opencode 1.19.5 installed)
[9] GitHub Docs — Adding repository custom instructions for GitHub Copilot — https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions — fetched 2026-10-31 (undated)
[10] CodeRabbit — Code Guidelines — https://docs.coderabbit.ai/knowledge-base/code-guidelines — fetched 2026-10-31 (undated)
