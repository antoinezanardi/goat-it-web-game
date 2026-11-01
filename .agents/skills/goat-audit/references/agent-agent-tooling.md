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
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `AGENTS.md` · Src: [1], [7]

## 2. Skills, commands and agents registration

- **[AGENT-02] Skill frontmatter is valid** — Every `.agents/skills/<folder>/SKILL.md` starts with YAML frontmatter whose `name` equals `<folder>`, is 1–64 characters and matches `^[a-z0-9]+(-[a-z0-9]+)*$` (unique across `.agents/skills/`, `.opencode/skills/`, `.claude/skills/`), and whose non-empty `description` of 1–1,024 characters states what the skill does and when to use it — locally authored skills starting with a third-person `Use when …` trigger, never an imperative or an internal label (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.agents/skills/*/SKILL.md` · Src: [2], [3]
- **[AGENT-03] skills-lock.json entries resolve** — Every entry of `skills-lock.json` has `source`, `sourceType`, `skillPath` and `computedHash`, and its key names an existing `.agents/skills/<key>/SKILL.md` whose frontmatter `name` equals the key; locally authored skills are absent from the lockfile.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `skills-lock.json`, `.agents/skills/*/SKILL.md` · Src: [2], project: skills-lock.json
- **[AGENT-04] AGENTS.md lists every command, agent and skill** — The `AGENTS.md` OpenCode commands list names exactly the `.opencode/commands/*.md` files (each with a one-line purpose), every `.opencode/agents/*.md` agent is named in `AGENTS.md`, every command or agent name exists as a file or an OpenCode built-in, and the Agent skills list names exactly the `.agents/skills/*/SKILL.md` folders in alphabetical order (no missing skill, no listed skill without a folder).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.opencode/commands/*.md`, `.opencode/agents/*.md` · Src: [1], [4], [6]
- **[AGENT-05] Agent frontmatter valid for OpenCode** — Every `.opencode/agents/*.md` frontmatter has a `description`, a `mode` in `primary`/`subagent`/`all`, uses `steps` (never the deprecated `maxSteps`) and `permission` (never the deprecated `tools`), sets `hidden` only on `mode: subagent`, and gives `question`, `todowrite`, `webfetch`, `websearch` and `doom_loop` a single action string, never a pattern object (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md` · Src: [4], [5]

## 3. Cross-references and tags

- **[AGENT-06] Cross-references resolve** — Every skill, agent, subagent, slash command, section number, step number, section reference and `[<CODE>-NN]` GOAT check ID named in `AGENTS.md`, `.opencode/agents/*.md`, `.opencode/commands/*.md`, `opencode.json` or a locally authored skill resolves to an existing file, heading, step or active check line (or an OpenCode built-in); a decision note for a removed check carries `(removed)` after its ID and is exempt; `default_agent` names a `mode: primary` agent (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `AGENTS.md`, `.opencode/agents/*.md`, `.opencode/commands/*.md`, `opencode.json` · Src: [4], [6], [8]
- **[AGENT-07] Rule-tag families match the lint commands** — The tag families cited by `final-reviewer` (hard verdict gate ranges `[U*]`–`[T*]` and `[AU*]`–`[SU*]`, the per-type lists of §10 and §11), `orchestrator` ("Handling final-review feedback" EXTRACT and CONSULT steps) and `plan-writer` (unit-test range `[U1]`–`[T3]`) equal the families defined as `**[TAG<n>]**` in §4 of `.opencode/commands/lint-unit-tests.md` and `.opencode/commands/lint-acceptance-tests.md` (for example a unit `[SC*]` family is listed) plus `[<CODE>-NN]` GOAT IDs; no undefined tag such as `[A]` is cited.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.opencode/agents/final-reviewer.md`, `.opencode/agents/orchestrator.md`, `.opencode/agents/plan-writer.md`, `.opencode/commands/lint-*-tests.md` · Src: project: AGENTS.md

## 4. Checklist drift

- **[AGENT-08] Paths and scripts cited in agent files exist** — Every repository path, glob, file suffix and `pnpm run` script cited in `AGENTS.md`, `.opencode/agents/*.md`, `.opencode/commands/*.md` and locally authored skills exists verbatim in the repository or in `package.json` `scripts`, or is declared future by the skill's category index (diff triggers and `(new)` decision docs) — zero stale script names, moved files or removed directories.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md`, `package.json` · Src: [1], project: AGENTS.md
- **[AGENT-09] Restated repository facts match the repo** — Facts and numbers restated in agent prompts, commands and locally authored skills equal the repository: the Vitest project count and names equal `configs/vitest/vitest.config.ts`, the locale list equals `app/i18n/locales/*`, the coverage threshold equals the Vitest `thresholds` setting, the skill and command counts equal the files on disk, and the spec classification types listed by `final-reviewer` §10/§11 equal the §3 tables of the lint commands.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/commands/*.md`, `.opencode/agents/final-reviewer.md`, `configs/vitest/vitest.config.ts` · Src: project: AGENTS.md, project: docs/unit-testing.md
- **[AGENT-10] GOAT references stay healthy** — Every backticked glob in a `Look:` field of `.agents/skills/goat-audit/references/*.md` matches at least one tracked path, and every URL of their `## Sources` lists resolves (final 2xx after redirects); each dead glob or link is reported with its check ID or source number (every `/goat-audit` run).
  Evidence: `command` · Diff: ✗ · Severity: low · Src: project: .agents/skills/goat-audit/SKILL.md §11
- **[AGENT-11] GOAT reference files keep the format and contiguous IDs** — Every check in `.agents/skills/goat-audit/references/*.md` has the line `- **[CODE-NN] Title** — criterion` followed by the indented metadata `Evidence · Diff · [Core ·] Severity · [Look ·] Src` in that order; `Diff: ✓` appears only with `Evidence: static`; every `Src: [n]` exists in the file `## Sources` and every source is cited; each file longer than 100 lines has `## Contents`; each category's IDs form the gap-free set `-01`…`-NN` with no duplicate (a new check takes the number after the last one, so file order may differ until the next removal-driven renumbering, §4.2); the category index's `Core` column equals the number of `Core: ✓` checks in the file and the total is ~200; and every `[CODE-NN]` cited in `SKILL.md`, agents, commands and templates resolves to an active check line.
  Evidence: `static` · Diff: ✓ · Severity: medium · Src: project: .agents/skills/goat-audit/SKILL.md §4.1, project: .agents/skills/writing-skills/anthropic-best-practices.md

## 5. Permission sanity

- **[AGENT-12] Commit and push are denied everywhere** — `opencode.json` `permission.bash` denies `git add`, `git commit` and `git push` with patterns that also match the bare commands (`git commit*`, not only `git commit *`), and no later agent `bash` rule re-allows any of them; every agent prompt and command states that agents never commit and none instructs `git add`, `git commit` or `git push` (creating a branch with `git checkout -b` is allowed), commit messages being only proposed to the user (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `opencode.json`, `.opencode/agents/*.md` · Src: [5], project: docs/architecture.md §10
- **[AGENT-13] Permissions are sound for every agent** — For every agent, the effective `bash` rules start with a `*` catch-all set to `ask` or `deny` so an unmatched command never falls back to OpenCode permissive default; a broad allow (`gh *`, `curl *`, `sed *`, `git *`, `docker compose *`) is followed by denials of its mutating or destructive forms (`gh pr merge*`, `gh release*`, `gh repo delete*`, `gh api * -X *` and its attached form `gh api *-X*`, `gh api * --method *`, `curl * -X *` and `curl *--request*`, `curl * -d *`, `sed -i*`, `git reset*`, `git clean*`, `git push*`, `rm *`) or narrowed to read-only subcommands; every command, tool or subagent a prompt requires is allowed or `ask`, every `task` block starts with a wildcard deny and allows only the subagents the prompt dispatches; and no agent allows `read` on `*.env`/`*.env.*` other than `*.env.example`, the same paths being denied to broad shell readers (`cat *`, `head *`, `tail *`, `rg *`, `grep *`) (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `opencode.json`, `.opencode/agents/*.md` · Src: [5], [4]
- **[AGENT-14] Edit scope matches the agent role** — Review and documentation-fetch agents (`final-reviewer`, `docs-fetcher`) set `edit: deny`; design and planning agents restrict `edit` to a wildcard deny plus their output directories; only implementation-role agents (`implementer`, `gatekeeper`, `debugger`, `orchestrator`, `receiving-code-review`) hold `edit: allow`; and `goat-auditor` sets a wildcard deny followed by allows for exactly `docs/audits/**`, the decision docs of the `goat-audit` category index and `AGENTS.md`, with its `bash` block ending in the denials listed in AGENT-13 plus mutating `gh issue`/`gh api`/`curl` forms, the single advisory `gh api -X POST …/security-advisories --input docs/audits/*` allow placed after those denials, and the `.env` reader guards last (verified: opencode 1.19.5).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.opencode/agents/*.md` · Src: [4], project: docs/architecture.md §10

## 6. Consistency between agent rules and docs

- **[AGENT-15] File-changing agents consult the architecture guide** — Every agent, skill and command that can plan, create, edit or move project files instructs reading `docs/architecture.md` before that work, and none restates a placement rule that differs from it.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.opencode/agents/*.md`, `.opencode/commands/*.md`, `docs/architecture.md` · Src: project: docs/architecture.md §10
- **[AGENT-16] Quality-gate rule is identical everywhere** — The mandatory gate order `pnpm run lint:fix` → `pnpm run typecheck` → `pnpm run test:unit:cov` → `pnpm run test:acceptance` (fresh build) and the per-task "focused checks only" rule read the same in `AGENTS.md`, `.github/copilot-instructions.md`, `orchestrator`, `gatekeeper` and `implementer`; no copy adds, drops or reorders a gate.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `AGENTS.md`, `.github/copilot-instructions.md`, `.opencode/agents/gatekeeper.md`, `.opencode/agents/orchestrator.md` · Src: [1], project: AGENTS.md
- **[AGENT-17] Agent rules never contradict docs** — Where `AGENTS.md`, an agent prompt, a command or a locally authored skill states a rule also stated in `docs/**`, the wording matches or explicitly defers to the doc with no contradiction; `.github/copilot-instructions.md` points to `AGENTS.md` and `docs/architecture.md` as the rule sources and states no rule absent from or different in `AGENTS.md`; and when `.coderabbit.yaml` enables `knowledge_base.code_guidelines`, every `filePatterns` entry matches an existing file and the instruction files it applies contain no rule conflicting with `AGENTS.md`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `AGENTS.md`, `.opencode/commands/*.md`, `docs/unit-testing.md`, `docs/acceptance-testing.md` · Src: [1], [9], [10], project: docs/architecture.md §10

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
