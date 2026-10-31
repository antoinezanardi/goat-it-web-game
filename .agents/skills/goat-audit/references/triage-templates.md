# Triage and agent return templates

Copy-paste formats for `/goat-audit`: the explorer and verifier return contracts, the public issue body, the private advisory payload, the decision note and the follow-up log row.

**Kind:** triage and agent return templates, not a category checklist. **Diff triggers:** none — read by `/goat-audit` only.

## Contents

- [Explorer return](#explorer-return)
- [Verifier return](#verifier-return)
- [Public issue body](#public-issue-body)
- [Private advisory payload](#private-advisory-payload)
- [Decision note](#decision-note)
- [Follow-up log row](#follow-up-log-row)
- [Sources](#sources)

## Explorer return

One `explore` subagent per category writes `categories/<CODE>.md` in the run directory:

````markdown
# <CODE> — <Category> — results

Counts: PASS n · FAIL n · N/A n · UNVERIFIED n · DECIDED n

| ID | Outcome | Evidence or reason |
|----|---------|--------------------|
| [SEC-01] | PASS | `server/middleware/01-security-headers.middleware.ts:3-8` |
| [SEC-02] | N/A | no upload endpoint exists |

## Findings

<one block per FAIL in the report format of the skill (§9), without the Verification line>

## Needs docs

- [SEC-25] needs-docs: zod — <claim to verify>

## Stale Look hints

- [SEC-61] `server/utils/foo/**` matches nothing
````

Explorer prompt contract:

- Give it: the category code, the paths of `SKILL.md`, the category reference file (read **in full**), `decisions.md`, `evidence/INDEX.md`, and the repository root.
- Rules: evaluate **every** check of the reference with an outcome and evidence; verify each `Look` glob still exists (missing → "Stale Look hints"); tag library-behavior claims `needs-docs: <library>`; never modify any file except `categories/<CODE>.md`; if writing fails, return the full result inline; reply in ≤ 150 words (path + outcome counts).

If the conductor receives an inline result, it writes `categories/<CODE>.md` itself.

## Verifier return

One fresh `explore` verifier per batch of ≤ 8 FAIL findings of one category writes `verification/<CODE>-<n>.md`. One line per finding:

````markdown
[SEC-09] CONFIRMED
[SEC-14] REFUTED: the middleware sets the default in `server/utils/security/security-headers.constants.ts:12`
[SEC-21] ADJUSTED: high → medium, the policy is enforce-mode by default and the risk is bounded
[SEC-02] DECIDED: docs/security.md:18
````

Verifier prompt contract: try to **refute** each finding; re-read every cited `file:line` and confirm the line exists (line number ≤ file length) and says what the finding claims; check the criterion really applies; check `decisions.md`; check the severity. Outcome per finding: `CONFIRMED` · `REFUTED: <reason>` · `ADJUSTED: <from> → <to>, <reason>` (one level max) · `DECIDED: <doc>:<line>`.

## Public issue body

Written to `issues/<ID>.md` and published with `gh issue create --title "<title>" --body-file … --label "<type label>" --label "🐐 goat-audit"`. Self-contained: the report is local and gitignored, so the issue must never depend on it.

````markdown
## Context

GOAT audit `<report-name>` on `<branch>` @ `<short-sha>` — **[<ID>] <check title>** (<CATEGORY>, severity **<level>**).

<Finding statement.>

**Evidence**
- `<file:line>` — <fact>
- <command/artifact excerpt>

## Impact

<Concrete impact.>

## Proposed fix

- <step>

## Acceptance criteria

- [ ] <verifiable criterion derived from the check's pass criterion>
- [ ] The GOAT audit check [<ID>] passes.

## References

- GOAT audit check [<ID>] — `.agents/skills/goat-audit/references/<file>.md`
- <source URLs>
````

**Type mapping** (title prefix → label): `fix` → `🐛 bug` (defect) · `feat` → `🚀 feature` (missing capability) · `perf` → `⚡️ perf` · `refactor` → `🔩 refactor` · `test` → `✅ test` · `docs` → `📖 docs` · `ci` → `🔁 ci` · `chore` → `🧹 chore`. Title: lowercase imperative subject, no trailing period, scope = domain (`security`, `a11y`, `seo`, `pwa`, `i18n`, `game`, `docker`, `deps`, …).

## Private advisory payload

Written to `advisories/<ID>.json`, then `gh api -X POST repos/antoinezanardi/goat-it-web-game/security-advisories --input docs/audits/.work/<report-name>/advisories/<ID>.json`. Record the returned `ghsa_id` and `html_url`. Drafts stay private until published — required because the repository is public and private vulnerability reporting is disabled.

```json
{
  "summary": "<title>",
  "description": "<the same Context / Impact / Proposed fix / Acceptance criteria / References sections as the issue body, in Markdown>",
  "severity": "critical|high|medium|low",
  "vulnerabilities": [
    {
      "package": { "ecosystem": "other", "name": "goat-it-web-game" },
      "vulnerable_version_range": null,
      "patched_versions": null,
      "vulnerable_functions": null
    }
  ],
  "cwe_ids": ["CWE-79"]
}
```

Omit `cwe_ids` when no CWE is known. Requires admin or security-manager in the repository.

## Decision note

Appended to the mapped decision doc, inside its trailing `## GOAT audit decisions` section:

````markdown
### [A11Y-20] Shortcuts never fire while typing — Accepted risk (2026-10-31)

- **Finding:** `<file:line>` binds `usingInput: true` on the answer keys, so typing in any input can award an answer.
- **Decision:** Accepted for the current game page, which has no free-text input.
- **Rationale:** No text field exists on `/game`; adding one would recreate the bug, hence the revisit trigger.
- **Revisit when:** a text input is added to the game page.
- **Recorded by:** /goat-audit (GOAT-AUDIT-2026-10-31)
````

Kinds: **Accepted risk** · **Not applicable** · **False positive** (see the skill §7). When the decision doc does not exist yet, create it with its H1 title and one scope paragraph, and register it in the `AGENTS.md` "Useful docs (`docs/`)" list.

## Follow-up log row

Appended to the report §10 after every decision (this is what makes triage resumable):

````markdown
| [SEC-09] | advisory | GHSA-xxxx-xxxx-xxxx | 2026-10-31 |
````

Also update the Appendix B item's `decision` and `artifact` fields in the same edit.

## Sources

[1] GitHub Docs — Creating a repository security advisory — https://docs.github.com/en/rest/security-advisories/repository-advisories#create-a-repository-security-advisory — fetched 2026-10-31 (current)
[2] GitHub Docs — Repository security advisories — https://docs.github.com/en/code-security/security-advisories/working-with-repository-security-advisories/about-repository-security-advisories — fetched 2026-10-31 (current)
