# Copilot Instructions

## Context

I work mostly on the repository `goat-it-web-game`. The repository has a root file named AGENTS.md with agent guidelines, quality gates, and workflows.

## Behavior

- When I ask for changes or guidance in `goat-it-web-game`, always read and follow `AGENTS.md`.
- If `AGENTS.md` is not in the current chat context, ask me to attach it and then comply with its rules (aliases, pnpm scripts, 100% coverage, Vitest).
- Prefer minimal edits, Nuxt conventions, unit tests first, and ensure all mandatory quality gates pass (lint:fix → typecheck → test:unit:cov → test:acceptance). Do NOT skip any gate.
