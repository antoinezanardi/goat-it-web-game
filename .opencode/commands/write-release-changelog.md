# Write release changelog

## Task

Guide the end-user release changelog workflow for the upcoming release:

1. Discover the release version from the unique open `Release vX.Y.Z` pull request.
2. Create a safe `feat/release-changelog-X.Y.Z` feature branch from `origin/develop`.
3. Review every change since the latest reachable release tag, using GitHub pull-request context.
4. Draft the English entry, get explicit approval, translate it to the other five locales, and present all six entries for final review.

This command creates Markdown content only. It **never commits, never pushes, and never changes application code**.

Reference repository: `antoinezanardi/goat-it-web-game`.

## Instructions

### 1. Preflight and release PR discovery

1. Require a clean Git worktree: run `git status --porcelain`. If the output is not empty, **stop immediately**. Never stash, move, or carry existing changes.
2. Require a working GitHub CLI: run `gh auth status` and `gh repo view antoinezanardi/goat-it-web-game --json name`. If either fails, report the missing prerequisite and stop.
3. Query the open pull requests with structured output (never scrape HTML or human-formatted terminal output):

   ```bash
   gh pr list --repo antoinezanardi/goat-it-web-game --state open --limit 100 \
     --json number,title,baseRefName,headRefName,url
   ```

4. Select the release PR by exact title prefix `Release v`. Validate that there is **exactly one** open PR where:
   - the title matches `^Release v\d+\.\d+\.\d+$` (valid semantic version),
   - the base branch is `main`,
   - the head branch is `develop`.

   Stop and ask the user for clarification when there is no match, more than one match, or any metadata mismatch. Do not guess.
5. Extract the version `X.Y.Z` (without the leading `v`). Use it for the changelog filename, frontmatter, and feature branch suffix.
6. Determine the intended release date: if the prompt contains a valid ISO `YYYY-MM-DD` date, use it; otherwise ask the user with the question tool and require a valid ISO `YYYY-MM-DD` date.
7. Check all six target paths for this version:

   ```
   content/en/changelog/X.Y.Z.md
   content/fr/changelog/X.Y.Z.md
   content/de/changelog/X.Y.Z.md
   content/es/changelog/X.Y.Z.md
   content/it/changelog/X.Y.Z.md
   content/pt/changelog/X.Y.Z.md
   ```

   If **any** of the six files already exists, stop before writing anything. Never overwrite and never create a partial locale set.

The open release PR supplies the target version only. Its compare diff is **not** the release changeset boundary.

### 2. Safe feature branch setup

1. Fetch the current remote Git state: `git fetch origin --tags`.
2. Confirm the local worktree is still clean (`git status --porcelain` empty). Stop if not.
3. Determine the highest semantic-version tag `vX.Y.Z` reachable from the fetched `origin/develop` commit:

   ```bash
   git tag --merged origin/develop --list 'v*' --sort=-v:refname \
     | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -n 1
   ```

   Stop if no such tag exists.
4. Compare the PR version with the latest tag. The PR version must be **newer**; otherwise stop and ask the user for clarification instead of producing a duplicate or backward release entry.
5. Check the feature branch `feat/release-changelog-X.Y.Z` in both local and remote refs:

   ```bash
   git branch --list feat/release-changelog-X.Y.Z
   git ls-remote --heads origin feat/release-changelog-X.Y.Z
   ```

   If either returns a result, **stop and ask the user**. Never switch to, reuse, overwrite, or auto-suffix an existing branch.
6. Create the branch from `origin/develop` **without** upstream tracking:

   ```bash
   git checkout --no-track -b feat/release-changelog-X.Y.Z origin/develop
   ```

   The `--no-track` flag is mandatory: the local branch must not track `origin/develop`.

The changelog change range is the selected latest reachable version tag through `origin/develop` (exclusive start, inclusive end): `<latest-tag>..origin/develop`.

### 3. Complete changeset and PR context

1. Enumerate every commit in the release range:

   ```bash
   git log --format='%H %s' <latest-tag>..origin/develop
   ```

2. For each commit SHA, use GitHub's commit-associated-pull-request API to identify the associated PR or PRs:

   ```bash
   gh api --paginate repos/antoinezanardi/goat-it-web-game/commits/<sha>/pulls
   ```

   Deduplicate PRs by number while retaining the commit-to-PR associations.
3. For each distinct PR, read its title and body (`gh pr view <number> --repo antoinezanardi/goat-it-web-game --json number,title,body,url`), and inspect the actual changed files/diffs for the release range (`git diff --stat <latest-tag>..origin/develop`, then targeted `git diff`). PR descriptions provide context but do **not** replace verification against the code changes.
4. If any commit has no associated PR, or its associated PR description is empty or lacks enough context to determine the change's purpose and user impact, **stop and ask the user** how to handle that commit before drafting. Never silently skip it and never substitute assumptions from commit messages.
5. Summarize only changes with an **end-user-visible effect**. Exclude internal maintenance, routine dependency updates, refactors, and build changes unless they create a meaningful user-facing improvement or fix.
6. Draft concise, friendly English release notes. Do not expose internal implementation details, PR numbers, or commit hashes in the customer-facing prose.

The three categories are `New`, `Improved`, and `Fixed`. Place each user-facing change in the most accurate category and avoid duplicate bullets. A category without an applicable change is **omitted** from the body rather than rendered as an empty heading.

### 4. English draft and approval loop

Create only `content/en/changelog/X.Y.Z.md` before English approval, following the frozen template in section 6. Present the complete draft to the user with the question tool and request review:

- If the user requests wording changes, update the English file, show the revised full entry, and ask again.
- Do **not** write any translated file until the user explicitly approves the English entry.
- If the user declines or pauses approval, leave the English draft as-is for editing and stop the workflow. Do not continue to translation.

### 5. Translation and final review

After explicit English approval:

1. Translate the approved title, description, headings, bullet titles, and bullet sentences into `fr`, `de`, `es`, `it`, and `pt`.
2. Preserve the approved release meaning, version, date, section membership, bullet order, and Markdown formatting. Do not add or remove release claims during translation.
3. Create the five localized entries using the same metadata and content structure as the English source. All six paths were checked in step 1.7 before the English draft was created.
4. Validate all six files:
   - correct path and filename,
   - matching version and date across locales,
   - valid frontmatter fields in the frozen order,
   - locale-appropriate section headings (section 6 table),
   - same section membership and bullet counts/order as the approved English entry,
   - expected bold-title/em-dash bullet format.
5. Present all six complete entries for final human review. If the user asks for wording changes, apply them to the relevant locale files, re-run the consistency checks, and present the updated six entries again. Repeat until the user confirms the final review.

When finished, report the six file paths and offer the suggested commit subject:

```
docs(changelog): add end-user changelog for vX.Y.Z
```

Substitute the release version in the suggested subject. Do **not** create the commit and do **not** push the branch.

### 6. Frozen changelog entry structure

Every locale file uses this YAML frontmatter in this field order, with quoted string values:

```yaml
---
version: "X.Y.Z"
date: "YYYY-MM-DD"
title: "<localized friendly release title>"
description: "<localized concise release summary>"
---
```

The body uses the existing locale-specific emoji headings in this order, including only headings with one or more bullets:

| Locale | New | Improved | Fixed |
| --- | --- | --- | --- |
| en | `## ✨ New` | `## 🛠️ Improved` | `## 🐛 Fixed` |
| fr | `## ✨ Nouveautés` | `## 🛠️ Améliorations` | `## 🐛 Corrections` |
| de | `## ✨ Neu` | `## 🛠️ Verbessert` | `## 🐛 Behoben` |
| es | `## ✨ Nuevo` | `## 🛠️ Mejoras` | `## 🐛 Correcciones` |
| it | `## ✨ Novità` | `## 🛠️ Miglioramenti` | `## 🐛 Correzioni` |
| pt | `## ✨ Novo` | `## 🛠️ Melhorado` | `## 🐛 Corrigido` |

Each bullet follows the established style:

```markdown
- **<Short localized title>** — <One concise localized user-facing sentence.>
```

English `title` and `description` must be friendly and concise, naming the release and communicating its overall benefit. Their translations must retain those meanings. Use the existing entries under `content/<locale>/changelog/1.9.0.md` as the reference example.

### 7. Failure and safety behavior

- Any failed `git` or `gh` command stops the workflow; never infer missing data.
- Ambiguous release PR discovery, invalid release metadata, missing tags, unmatched commits, or unusable PR descriptions require user clarification.
- A dirty worktree, an existing local/remote feature branch, or an existing target changelog file stops the workflow without destructive changes. All six target paths are checked before writing the English draft so the workflow never creates a partial locale set due to a file collision.
- No automatic stash, checkout to an existing branch, branch suffixing, file overwrite, commit, or push is allowed.
- English approval is a hard gate before translation; final locale review is a hard gate before reporting completion.
- This command changes Markdown content only. Do not modify application code, content schema, release automation, or existing changelog entries.
