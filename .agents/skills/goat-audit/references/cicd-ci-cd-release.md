# CICD — CI/CD, release & repository governance

Covers how code reaches production for this Nuxt 4 quiz game: GitHub Actions workflows (`.github/workflows/*.yml`) and composite actions (`.github/actions/*/action.yml`), the pull-request quality gates listed in `AGENTS.md`, rulesets and `CODEOWNERS`, semantic-release versioning with the `develop` → `main` release flow, the SSH deployment to the staging and production VPS (`deploy-to-*.yml` + `.github/actions/deploy`), CI efficiency, and the Husky/commitlint/branch-name/PR-title enforcement chain.

**Decision doc:** `docs/ci-cd.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** dependencies, pnpm install controls, Renovate, secret scanning, SBOM and attestation generation → SUP · image content, Dockerfile, image scanning → PLAT · post-deploy verification content, rollback procedure, monitors → OPS · changelog readability, contribution docs → DOCS · `SECURITY.md`, private vulnerability reporting → SEC · CI test infrastructure (flakiness, browser matrix) → TEST · agent guideline files → AGENT

## Contents

- [1. Workflow hardening](#1-workflow-hardening)
- [2. CI completeness](#2-ci-completeness)
- [3. Rulesets and CODEOWNERS](#3-rulesets-and-codeowners)
- [4. Release engineering](#4-release-engineering)
- [5. Deploy safety and credentials](#5-deploy-safety-and-credentials)
- [6. CI efficiency](#6-ci-efficiency)
- [7. Hooks and commit, branch and PR-title enforcement](#7-hooks-and-commit-branch-and-pr-title-enforcement)
- [Sources](#sources)

## 1. Workflow hardening

- **[CICD-01] Actions pinned to full commit SHAs** — Pin every remote `uses:` reference in `.github/workflows/*.yml` and in the composite actions `.github/actions/*/action.yml` (including sub-path actions such as `github/codeql-action/init` and `actions/cache/restore`) to a full 40-hex commit SHA followed by a version comment (`# v7`, `# v2.2.0`); only local `./.github/...` references are exempt, and no tag or branch ref (`@v4`, `@main`) remains.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/*.yml`, `.github/actions/*/action.yml` · Src: [2], [4], [7]
- **[CICD-02] Read-only top-level permissions** — Every workflow declares a top-level `permissions:` block set to `{}` or `contents: read`, so no job inherits the repository default token scope.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/*.yml` · Src: [2], [4], [8]
- **[CICD-03] Write scopes granted per job** — Grant write scopes (`contents: write`, `pull-requests: write`, `issues: write`, `security-events: write`, `id-token: write`) only at job level on the jobs that call the matching API; never at workflow level and never `write-all`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/*.yml` · Src: [4], [8]
- **[CICD-04] Read-only default workflow token** — `gh api repos/{owner}/{repo}/actions/permissions/workflow` returns `default_workflow_permissions: "read"` and `can_approve_pull_request_reviews: false`.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [2], [4]
- **[CICD-05] No dangerous triggers** — No workflow uses `pull_request_target` or `issue_comment`, and pull-request automation runs on `pull_request`, whose token is read-only for forks; a `workflow_run` trigger exists only with a documented reason and checks out the trusted default branch, never the triggering PR head.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `.github/workflows/*.yml` · Src: [2], [4], [8]
- **[CICD-06] No template injection in run steps** — No `run:` body or `actions/github-script` `script:` interpolates `${{ github.event.* }}` strings, `${{ github.head_ref }}`, `${{ inputs.* }}`, `${{ env.* }}` or step outputs directly, in workflows and composite actions alike; values flow through `env:` and are used as quoted shell variables (`"$PR_TITLE"`).
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/*.yml`, `.github/actions/*/action.yml` · Src: [4], [8]
- **[CICD-07] Checkout credentials not persisted** — Every `actions/checkout` step sets `persist-credentials: false`, except in a job that pushes (release, `main` → `develop` sync), where `persist-credentials: true` or an explicit `token:` is written deliberately.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/*.yml` · Src: [4], [8]
- **[CICD-08] Secrets scoped to the consuming step** — Set `GITHUB_TOKEN`, `GH_TOKEN`, `SEMANTIC_RELEASE_TOKEN` and other secrets in the `env:`/`with:` of the step that uses them, not in workflow-level or job-level `env:` where every step (including third-party actions such as `pnpm/action-setup`) receives them; reusable-workflow calls pass an explicit `secrets:` map, never `secrets: inherit`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/*.yml` · Src: [1], [4], [8]
- **[CICD-09] No production credentials in pull-request jobs** — Jobs triggered by `pull_request` never receive production secrets (e.g. `PRODUCTION_GOAT_IT_API_GAME_KEY`, `PRODUCTION_GOAT_IT_API_BASE_URL`); PR builds use staging or sandbox values, and production secrets are reachable only from `main`/release workflows or a `production` environment.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/build.yml` · Src: [1], [4]
- **[CICD-10] Personal access tokens minimized** — `SEMANTIC_RELEASE_TOKEN` and `BYOB_TOKEN` are fine-grained, single-repository, expiring tokens limited to the scopes their job needs, and `GITHUB_TOKEN` is used wherever it suffices.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [1], [4]
- **[CICD-11] Release content isolated from caches** — Workflows that publish or write repository state (release, release-PR, deploy) never feed files restored by the cache into release content, PR bodies or images; data passes between jobs through run-scoped artifacts or job outputs, and caches those jobs restore cannot be seeded by pull-request runs.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/upsert-pr-release.yml`, `.github/workflows/release-creation.yml` · Src: [8]
- **[CICD-12] Run-scoped, short-lived artifacts** — Artifacts exchanged between jobs carry a run scope (`${{ github.run_id }}-${{ github.run_attempt }}`), set `retention-days` ≤ 2, and the consumer fails on a missing or duplicate artifact (`if-no-files-found: error`; the manifest merge aborts when a platform digest is missing).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/build.yml`, `.github/workflows/docker-build-and-push.yml` · Src: [8]
- **[CICD-13] Bot conditions not spoofable** — Conditions that skip or trust bots test `github.event.pull_request.user.login` or an app id, never `github.actor` (e.g. `if: github.actor != 'renovate[bot]'`).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/workflows/build.yml` · Src: [8]
- **[CICD-14] Third-party actions vetted** — Every non-GitHub-owned action is not archived and still maintained (`gh api repos/<owner>/<repo>`) and receives only the token it needs.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [1], [2]
- **[CICD-15] Workflow lint and security audit in CI** — A pull-request job runs a workflow linter and a workflow security auditor over `.github/workflows/**` and `.github/actions/**` and fails on any finding (for example actionlint with shellcheck plus zizmor); linting alone does not cover security audits.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/build.yml` · Src: [8]
- **[CICD-16] Every job has a timeout** — Every job that runs steps declares `timeout-minutes`; jobs that only call a reusable workflow rely on the callee's job timeouts.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/workflows/*.yml` · Src: [8]

## 2. CI completeness

- **[CICD-17] PR CI runs every AGENTS.md quality gate** — Pull requests to `develop` and `main` run the CI equivalents of the four `AGENTS.md` gates — `pnpm run lint` (ESLint and Oxlint), `pnpm run typecheck`, `pnpm run test:unit:cov`, `pnpm run test:acceptance` — each in a job that blocks the merge.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/build.yml`, `.github/actions/*/action.yml`, `AGENTS.md` · Src: [9], project: AGENTS.md
- **[CICD-18] Gate failures fail the job** — No gate step is neutralized by `continue-on-error: true`, `|| true` or `set +e` unless a later step of the same job exits non-zero on `steps.<id>.outcome != 'success'`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/actions/*/action.yml`, `.github/workflows/*.yml` · Src: [1], project: AGENTS.md
- **[CICD-19] CodeQL on every PR and on main** — CodeQL (`javascript,typescript`) runs on every pull request to `develop` and `main` and on push to `main`, with `security-events: write` granted only to that job.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/build.yml`, `.github/workflows/release-creation.yml`, `.github/actions/code-ql/action.yml` · Src: [2], [9]
- **[CICD-20] Scheduled CI run** — A `schedule:` trigger (at least weekly) runs CodeQL and the build, lint and test gates against the default branch, so analysis-rule updates and toolchain drift surface without pull-request activity (the scheduled dependency scan itself belongs to SUP).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/*.yml` · Src: [2], [9]
- **[CICD-21] Scripts referenced by CI exist** — Every `pnpm run <script>` and `scripts/*` path invoked from workflows, composite actions and `.husky/*` hooks exists in `package.json` `scripts` or on disk.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/*/action.yml`, `.github/workflows/*.yml`, `.husky/*`, `package.json` · Src: project: AGENTS.md
- **[CICD-22] Sonar analyses coverage from the same commit** — SonarCloud reads `tests/unit/coverage/lcov.info` produced by the same workflow run (artifact or job dependency), not a cache restored through a broad `restore-keys` prefix that can return another branch's coverage.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/sonarcloud/action.yml`, `sonar-project.properties` · Src: [8], project: AGENTS.md

## 3. Rulesets and CODEOWNERS

- **[CICD-23] Rulesets protect main and develop** — `gh api repos/{owner}/{repo}/rulesets` shows active branch rulesets targeting `refs/heads/main` and `refs/heads/develop` that block deletion and non-fast-forward pushes and require a pull request, since anyone able to push to a semantic-release branch can publish a release.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [2], [6], [14]
- **[CICD-24] Required status checks match real jobs** — The rulesets require every blocking job of the pull-request workflow (including CodeQL, workflow lint, codebase lint, dependency audit, build, Docker build per platform, unit and acceptance tests), the PR-title lint and, for `main`, the main-branch protection job, with `strict_required_status_checks_policy: true`; no required context names a renamed or deleted job.
  Evidence: `command` · Diff: ✗ · Core: ✓ · Severity: high · Src: [2], [6]
- **[CICD-25] Required review enforced** — The rulesets require at least one approving review, code-owner review, dismissal of stale approvals on push and approval of the last push; a single-maintainer exception is recorded as a decision.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [2], [6]
- **[CICD-26] No ruleset bypass actors** — The bypass list of every branch ruleset is empty; Scorecard treats any bypass actor as protections not enforced for admins.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [2], [6]
- **[CICD-27] Signed commits required** — The rulesets on `main` and `develop` require signed commits; a merge queue on `main` is optional.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [6]
- **[CICD-28] CODEOWNERS has no errors** — `gh api repos/{owner}/{repo}/codeowners/errors` returns an empty `errors` array, because GitHub silently skips invalid lines.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [12]
- **[CICD-29] Sensitive paths have explicit owners** — `.github/CODEOWNERS` assigns owners to the workflow and action definitions, the CODEOWNERS file itself, container and dependency-policy files and the release configuration, with these patterns after any catch-all because the last matching pattern wins.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/CODEOWNERS` · Src: [12]
- **[CICD-30] Bus factor documented** — At least two people can approve pull requests and publish a release, or the single-maintainer situation and its continuity plan are recorded.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [9], [12]

## 4. Release engineering

- **[CICD-31] Release branches match release workflows** — `branches` in `configs/semantic-release/release.config.mjs` lists only branches on which a workflow runs semantic-release or a documented dry-run version preview (`script:create-release-changelog` on `develop`), and the release step's `--extends` path points to that file (verified: semantic-release 25.0.9).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/semantic-release/**`, `.github/workflows/release-creation.yml`, `.github/workflows/upsert-pr-release.yml` · Src: [14]
- **[CICD-32] Release gated by green gates** — The semantic-release job `needs:` the blocking quality jobs of the same run (at least CodeQL and the unit and acceptance tests), so a red `main` never publishes a tag, a GitHub Release or a production deploy.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: high · Look: `.github/workflows/release-creation.yml` · Src: [1], [9]
- **[CICD-33] Commit types map to SemVer** — `releaseRules` keep `feat` → minor, `fix` → patch and breaking changes (`!` or a `BREAKING CHANGE:` footer) → major; any extra patch-releasing type (`docs`, `style`, `refactor`, `test`, `ci`, `chore`) is a documented choice.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/semantic-release/**` · Src: [10], [11], [14]
- **[CICD-34] Tag equals manifest version** — Every release tag follows `tagFormat` `v${version}` (semantic-release default), is strict SemVer and unique, equals the `package.json` `version` of the tagged commit and the matching `CHANGELOG.md` heading, and has a GitHub Release (verified: semantic-release 25.0.9).
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [9], [10], [14]
- **[CICD-35] Release tags protected** — A tag ruleset on `refs/tags/v*` restricts creation, update and deletion of release tags to the release automation identity.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [6], [9]
- **[CICD-36] Main merged back into develop after release** — After a published release (`new-release-published == 'true'`), the release workflow merges `main` into `develop` with a Conventional `chore:` message, and a merge conflict fails the job instead of force-pushing.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/release-creation.yml` · Src: [1], [11], project: .github/CONTRIBUTING.md
- **[CICD-37] Release process documented end to end** — `docs/ci-cd.md` or `.github/CONTRIBUTING.md` describes the chain Conventional commit → release PR (`upsert-pr-release.yml`) → merge to `main` → semantic-release tag and changelog → image build → production deploy, states who may release, and links the rollback procedure.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/CONTRIBUTING.md` · Src: [9], [13]

## 5. Deploy safety and credentials

- **[CICD-38] Deploy jobs use GitHub environments** — The staging and production SSH deploy jobs declare `environment:` (`staging`, `production`) and read the SSH key, user, address, update-script path and `known_hosts` from environment-scoped secrets, not repository secrets.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml` · Src: [4], [17]
- **[CICD-39] Environment protection rules** — `gh api repos/{owner}/{repo}/environments/production` shows a required reviewer or wait timer, deployment branches and tags restricted to release tags (`v*`), and administrator bypass disallowed; `staging` is restricted to `develop`.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [17]
- **[CICD-40] Deploy by immutable digest** — The deploy step passes the `sha256:` digest produced by the same run's image job to the update script, so the server pulls `image@sha256:…` instead of the mutable `latest` or `develop` tags.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/deploy-*.yml`, `.github/workflows/docker-build-and-push.yml` · Src: [1], [3]
- **[CICD-41] Provenance verified before deploy** — When the image is attested, the deploy job runs `gh attestation verify oci://<image>@sha256:<digest>` (or a cosign signature check) and fails before the SSH step if verification fails.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/deploy-*.yml` · Src: [3], [5]
- **[CICD-42] Pinned SSH host key** — The deploy action connects with `StrictHostKeyChecking=yes` and a `known_hosts` entry supplied from a reviewed secret, never generated by `ssh-keyscan` at deploy time; no staging or production workflow passes `strict-host-key-checking: "no"`.
  Evidence: `static` · Diff: ✓ · Core: ✓ · Severity: critical · Look: `.github/actions/deploy/action.yml`, `.github/workflows/deploy-*.yml` · Src: [4]
- **[CICD-43] SSH inputs passed safely** — The deploy action passes user, host and update-script path through `env:` and quotes them (`ssh "$SSH_USER@$SSH_HOST"`), with no `${{ inputs.* }}` interpolated into the `run:` body or the SSH heredoc.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/deploy/action.yml` · Src: [8]
- **[CICD-44] Key material contained** — The private key is written with `chmod 600` and never echoed to logs, `set -x` is absent from secret-handling steps, and an `if: always()` step deletes the key file and kills `ssh-agent`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/deploy/action.yml` · Src: [4]
- **[CICD-45] Restricted deploy identity on the VPS** — The SSH deploy user can run only the update script (`authorized_keys` `command=`/`from=` restrictions, or sudoers `NOPASSWD` limited to that absolute path) and cannot read repository or registry credentials.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [1], [4]
- **[CICD-46] Deploy keys typed, per environment, rotated** — Deploy keys are ed25519, distinct for staging and production, and rotated at least every 90 days and immediately when an operator leaves.
  Evidence: `manual` · Diff: ✗ · Severity: medium · Src: [1], [4]
- **[CICD-47] Scoped registry credentials** — The CI `DOCKER_HUB_PASSWORD` secret holds a Docker Hub access token limited to the image repository, not the account password, and the VPS holds a pull-only credential.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [1], [4]
- **[CICD-48] Serialized release and deploy runs** — Release, release-PR and deploy workflows use a stable concurrency group per branch or environment (e.g. `deploy-production`), not a `github.run_id` fallback that never serializes, and set `cancel-in-progress: false` so a running release or deploy is never cut midway.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/deploy-*.yml`, `.github/workflows/release-creation.yml`, `.github/workflows/upsert-pr-release.yml` · Src: [8], [16]

## 6. CI efficiency

- **[CICD-49] Superseded PR runs cancelled** — Every `pull_request`-triggered workflow declares `concurrency` with group `${{ github.workflow }}-${{ github.head_ref || github.run_id }}` and `cancel-in-progress: true`.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/workflows/*.yml` · Src: [8], [16]
- **[CICD-50] No duplicate CI runs** — A commit runs each gate once per trigger: workflows that share a trigger do not repeat the same job, and the release branch re-runs only the jobs whose outputs it consumes.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `.github/workflows/*.yml` · Src: [16]

## 7. Hooks and commit, branch and PR-title enforcement

- **[CICD-51] commit-msg hook runs commitlint** — The `commit-msg` hook runs commitlint with the repository configuration on the edited message, and that configuration extends `@commitlint/config-conventional`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.husky/*`, `configs/commitlint/**` · Src: [11], [15]
- **[CICD-52] pre-commit gates installed and scoped** — The `pre-commit` hook validates the branch name, lints and fixes staged files, type-checks and runs the unit tests affected by the staged files; the `prepare` script installs the hooks outside CI.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.husky/*`, `configs/lint-staged/**`, `package.json` · Src: [9], project: .github/CONTRIBUTING.md
- **[CICD-53] CI re-enforces hook rules** — Because `--no-verify` skips hooks, a pull-request job runs `pnpm run validate:branch-name` on the head branch and commitlint over the PR commit range (`commitlint --from <base-sha> --to <head-sha>`).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/*.yml`, `configs/validate-branch-name/**` · Src: [11], [15], project: .github/CONTRIBUTING.md
- **[CICD-54] PR titles linted on every merge target** — PR titles are validated on `opened`, `edited`, `reopened` and `synchronize` for every base branch whose PR title becomes a commit header (`develop`, and `main` when release PRs are squash-merged), including the 100-character `header-max-length` (verified: @commitlint/config-conventional 21.2.4).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/lint-pr-name-into-develop.yml` · Src: [11], [15]
- **[CICD-55] One commit-type list everywhere** — The allowed types are identical across commitlint `type-enum` (`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`), the PR-title regex, the branch-name pattern (plus bot prefixes `copilot` and `renovate`), the `.coderabbit.yaml` title requirement and semantic-release `releaseRules`; no type (e.g. `tech`) is accepted in one place and rejected in another (verified: @commitlint/config-conventional 21.2.4).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `configs/commitlint/**`, `configs/validate-branch-name/**`, `configs/semantic-release/**`, `.github/workflows/lint-pr-name-into-develop.yml`, `.coderabbit.yaml` · Src: [11], [15]

## Sources

[1] OWASP Top 10 CI/CD Security Risks (CICD-SEC-1…10) — https://owasp.org/www-project-top-10-ci-cd-security-risks/ — fetched 2026-10-31 (live page)
[2] OpenSSF Scorecard check documentation — https://github.com/ossf/scorecard/blob/main/docs/checks.md — fetched 2026-10-31 (main branch)
[3] SLSA v1.2 Build track basics (L0–L3) — https://slsa.dev/spec/v1.2/build-track-basics — fetched 2026-10-31 (SLSA v1.2)
[4] GitHub Docs: Security hardening for GitHub Actions — https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions — fetched 2026-10-31 (live docs)
[5] GitHub Docs: Using artifact attestations to establish provenance for builds — https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds — fetched 2026-10-31 (live docs)
[6] GitHub Docs: About rulesets — https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets — fetched 2026-10-31 (live docs)
[7] Renovate: GitHub Actions manager — https://docs.renovatebot.com/modules/manager/github-actions/ — fetched 2026-10-31 (docs for Renovate 44.198.3)
[8] zizmor: Audit Rules — https://docs.zizmor.sh/audits/ — fetched 2026-10-31 (docs including v1.31.0 changes)
[9] OpenSSF Best Practices: Passing criteria — https://www.bestpractices.dev/en/criteria/0 — fetched 2026-10-31 (live criteria)
[10] Semantic Versioning 2.0.0 — https://semver.org/ — fetched 2026-10-31 (SemVer 2.0.0)
[11] Conventional Commits 1.0.0 — https://www.conventionalcommits.org/en/v1.0.0/ — fetched 2026-10-31 (v1.0.0)
[12] GitHub Docs: About code owners — https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners — fetched 2026-10-31 (live docs)
[13] Google SRE book, Appendix E: Launch Coordination Checklist — https://sre.google/sre-book/launch-checklist/ — fetched 2026-10-31 (book text 2017)
[14] semantic-release: Configuration — https://semantic-release.gitbook.io/semantic-release/usage/configuration — fetched 2026-10-31 (semantic-release 25.0.9 installed; page superseded by semantic-release.org)
[15] commitlint: @commitlint/config-conventional README — https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional/README.md — fetched 2026-10-31 (@commitlint/config-conventional 21.2.4 installed)
[16] GitHub Docs: Control the concurrency of workflows and jobs — https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency — fetched 2026-10-31 (live docs)
[17] GitHub Docs: Deployments and environments — https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments — fetched 2026-10-31 (live docs)
