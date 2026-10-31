# SUP — Supply chain & dependencies

Third-party code that enters the repository, the CI install and the shipped Nitro server: how dependencies are classified,
inventoried and kept current, how vulnerabilities are detected and governed, which pnpm install-time controls
(`pnpm-workspace.yaml`, no `.npmrc` today) protect the install, how the Docker image carries provenance and an SBOM, how
secrets are kept out of git history, how licenses of shipped packages are tracked, and how Renovate and OpenSSF Scorecard
keep the supply chain observable. Every package of this app is a `devDependency` (no `dependencies` key) because Nitro
bundles or copies the runtime code into `.output/server/node_modules`, so scope checks always compare tool coverage
with what the build output ships.

**Decision doc:** `docs/security.md` (section `## GOAT audit decisions`). **Diff triggers:** see SKILL.md category index.

**Not in this category:** workflow hardening, action SHA pinning, `permissions`, rulesets, required status checks,
digest promotion and deploy-time verification → CICD · image vulnerability scanning, `FROM` digest, `.dockerignore`,
single Node/pnpm version source → PLAT · secrets in the client bundle or `.output` (`check-secrets-in-built-output.sh`),
`SECURITY.md`, private vulnerability reporting, `security.txt` → SEC

## Contents

- [1. Inventory & hygiene](#1-inventory--hygiene)
- [2. Vulnerability management](#2-vulnerability-management)
- [3. pnpm install-time controls](#3-pnpm-install-time-controls)
- [4. Provenance, SBOM & attestations](#4-provenance-sbom--attestations)
- [5. Secret-leak prevention](#5-secret-leak-prevention)
- [6. Licenses](#6-licenses)
- [7. Renovate, bots & Scorecard](#7-renovate-bots--scorecard)
- [Sources](#sources)

## 1. Inventory & hygiene

- **[SUP-01] Runtime/dev classification explicit** — `package.json` either declares the packages that ship in `.output/server/node_modules` under `dependencies`, or the repository documents that every package is a `devDependency` and that audit, license and SBOM scope is derived from the build output instead of `--prod`.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json` · Src: [5], [9]
- **[SUP-02] Shipped runtime set inventoried** — After `pnpm run build`, the packages under `.output/server/node_modules` are enumerated (name@version list or image SBOM) into a non-empty inventory; a zero-package result from a `--prod` tool run is treated as a failure, not as a clean result.
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [5], [6], [9]
- **[SUP-03] No phantom dependencies** — Every bare-specifier import in `app/`, `server/`, `shared/` and `modules/` resolves to a package declared in `package.json`; code never relies on a transitive package that pnpm's isolated `node_modules` happens to expose.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `package.json`, `app/**`, `server/**`, `shared/**`, `modules/**` · Src: [2]
- **[SUP-04] No unused dependencies** — A dependency checker (knip or depcheck) reports zero unused and zero undeclared packages, or each remaining entry is justified (Nuxt module, CLI-only tool, peer requirement).
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [2]
- **[SUP-05] Outdated-major budget** — `pnpm outdated` reports no direct dependency more than one major version behind and no package untouched for more than 12 months without a documented exception.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [7]
- **[SUP-06] No deprecated packages** — `pnpm install` emits no deprecation warning, and every `allowedDeprecatedVersions` entry in `pnpm-workspace.yaml` (which mutes the warning) names an owner and a removal issue (verified: pnpm 12.16.1).
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [3]
- **[SUP-07] No duplicate resolved versions** — `pnpm dedupe --check` exits 0 against the committed `pnpm-lock.yaml` (verified: pnpm 12.16.1).
  Evidence: `command` · Diff: ✗ · Severity: low · Src: [3]
- **[SUP-08] Prerelease hygiene** — `pnpm-lock.yaml` resolves no `-alpha`, `-beta`, `-rc` or `-next` version unless the package is explicitly justified in the PR or decision doc.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-lock.yaml` · Src: [7]
- **[SUP-09] Overrides justified** — Every `overrides` entry (including `"-"` removals) and every `peerDependencyRules.allowedVersions` entry in `pnpm-workspace.yaml` links to an advisory or upstream issue and states its exit condition (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [1], [3]

## 2. Vulnerability management

- **[SUP-10] Audit not limited to `--prod`** — While `package.json` has no `dependencies` key, no audit step relies only on `pnpm audit --prod`, which audits only `dependencies` and `optionalDependencies` and therefore scans nothing here (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/actions/audit-dependencies/**`, `package.json` · Src: [5]
- **[SUP-11] Audit scope covers the shipped set** — Every package present in `.output/server/node_modules` after a production build is inside the scope of the CI vulnerability audit (full `pnpm audit` or an SBOM scan of the image).
  Evidence: `artifact` · Diff: ✗ · Severity: high · Src: [5], [9]
- **[SUP-12] Full audit clean at high** — `pnpm audit --audit-level=high` without `--prod` exits 0, or every remaining advisory is ignored per [SUP-16].
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [5]
- **[SUP-13] Audit on every pull request** — The dependency audit job runs on every pull request targeting a protected branch.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/build.yml`, `.github/actions/audit-dependencies/**` · Src: [5], [13]
- **[SUP-14] Scheduled audit** — A workflow with a `schedule:` trigger runs the dependency audit (full scope or image SBOM) so new advisories against unchanged code are detected without a pull request.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/workflows/**` · Src: [5], [9]
- **[SUP-15] No silent audit escapes** — No audit invocation uses `--ignore-registry-errors` (exits 0 on a registry failure), and `--ignore-unfixable` is absent or paired with a tracked, dated exception (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/actions/**`, `.github/workflows/**`, `package.json` · Src: [5]
- **[SUP-16] Ignore-list governance** — When advisories are ignored, they live in `audit.ignore` of `pnpm-workspace.yaml` as GHSA IDs only (CVE IDs and `auditConfig.ignoreCves` are not recognized), each with an owner and expiry comment, and `audit.ignorePrune: true` is set (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [5]
- **[SUP-17] Registry signatures verified** — A CI step runs `pnpm audit signatures`, which fails on an invalid signature or on an unsigned package from a registry that publishes signing keys (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/actions/**`, `.github/workflows/**` · Src: [5]
- **[SUP-18] Dependency review on pull requests** — A dependency-review check runs on every pull request and fails it when the pull request introduces a high-severity advisory (for example `actions/dependency-review-action` with `fail-on-severity: high`) and reports what it found.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/**` · Src: [14]
- **[SUP-19] Dependabot alerts enabled** — GitHub Dependabot alerts are enabled for the repository (`gh api`), so Renovate's vulnerability PRs have an advisory signal.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [7], [8]
- **[SUP-20] Patch SLA observed** — No medium-or-higher advisory against the shipped package set stays open for more than 60 days.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [12]
- **[SUP-21] Two-document lockfile parsed** — When a third-party scanner or SBOM generator reads `pnpm-lock.yaml`, it parses both YAML documents and reports a non-zero package count; a tool reading only the first document reports no dependencies and no vulnerabilities.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [1]

## 3. pnpm install-time controls

- **[SUP-22] Settings location** — pnpm install settings live in `pnpm-workspace.yaml`; when an `.npmrc` is added it holds only registry and authentication entries, never install-policy settings.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `pnpm-workspace.yaml` · Src: [2]
- **[SUP-23] Build approvals pinned per version** — Every `allowBuilds` key approving a build is `name@<exact version(s)>` (or a git URL/commit for git dependencies); a bare package name approves every future version's install scripts (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [4]
- **[SUP-24] No blanket build approval** — `dangerouslyAllowAllBuilds` is absent or `false`, and `ignoreScripts: true` is not used to bypass the `allowBuilds` review (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `pnpm-workspace.yaml` · Src: [4]
- **[SUP-25] Strict dependency builds kept** — `strictDepBuilds` is not set to `false` (default `true`: an unreviewed install script fails the install instead of warning) (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [4]
- **[SUP-26] Release-age floor** — `minimumReleaseAge` in `pnpm-workspace.yaml` is at least `10080` minutes (7 days), or a lower value (e.g. `4320`) is backed by a recorded risk acceptance.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [1], [3], [7]
- **[SUP-27] Release-age exclusion hygiene** — `minimumReleaseAgeExclude` holds exact `name@version` entries; a bare name or scope pattern exempts every version and carries a written justification, and entries added by `pnpm audit --fix` are reviewed (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [3], [5]
- **[SUP-28] Stale exclusions pruned** — `minimumReleaseAgeExcludePrune: true` is set (default `false`), so version entries disappear once the lockfile no longer resolves them (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `pnpm-workspace.yaml` · Src: [3]
- **[SUP-29] Strict release-age enforcement** — `minimumReleaseAgeStrict` is not set to `false`, so resolution fails instead of falling back to a too-young version (strict by default only when `minimumReleaseAge` is configured explicitly) (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [3]
- **[SUP-30] Missing publish time fails closed** — `minimumReleaseAgeIgnoreMissingTime: false` is set (default `true` silently skips the age and trust checks when registry metadata omits `time`) (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [3]
- **[SUP-31] Trust policy enabled** — `trustPolicy: no-downgrade` is set (default `off`), and any `trustPolicyExclude` entry is an exact `name@version` with a justification (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `pnpm-workspace.yaml` · Src: [1], [3]
- **[SUP-32] Exotic subdependencies blocked** — `blockExoticSubdeps` is not set to `false` (default `true`: only direct dependencies may come from git or tarball URLs) (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [1], [3]
- **[SUP-33] No exotic resolutions in the lockfile** — `pnpm-lock.yaml` contains no transitive `git+` or direct tarball URL resolution.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `pnpm-lock.yaml` · Src: [1], [3]
- **[SUP-34] Registry pinned** — Packages resolve only from HTTPS `registry.npmjs.org` (or a declared mirror); any additional registry is declared in `registries` so lockfile keys are registry-qualified and substitution is detectable (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml`, `pnpm-lock.yaml` · Src: [1], [3]
- **[SUP-35] Frozen installs everywhere** — Every CI install and the Docker build run `pnpm install --frozen-lockfile`; no workflow or `Dockerfile` step runs `pnpm add` or `pnpm install <pkg>`.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/actions/install-project/**`, `.github/workflows/**`, `Dockerfile` · Src: [13]
- **[SUP-36] Lockfile re-verified** — `trustLockfile` is absent or `false`, so `minimumReleaseAge` and `trustPolicy` are re-applied to every lockfile entry on install (verified: pnpm 12.16.1).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `pnpm-workspace.yaml` · Src: [3]

## 4. Provenance, SBOM & attestations

- **[SUP-37] Build provenance attestation** — The image publishing job attests the pushed image digest (for example with `actions/attest` or `attest-build-provenance`) and publishes the attestation to the registry.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/docker-build-and-push.yml`, `.github/actions/docker-build/**` · Src: [10]
- **[SUP-38] Provenance verifiable** — When the image is attested, `gh attestation verify oci://<image>@<digest>` succeeds for the latest published production and staging images.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [10]
- **[SUP-39] SBOM attestation attached** — The buildx build runs with `--attest type=sbom` (or `sbom: true`) so an SPDX attestation is attached to the pushed digest.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/docker-build-and-push.yml`, `.github/actions/docker-build/**` · Src: [9]
- **[SUP-40] Build-stage SBOM coverage** — When an SBOM attestation is generated, `Dockerfile` declares `ARG BUILDKIT_SBOM_SCAN_STAGE=true` so builder-stage dependencies are scanned, not only the final `.output` stage.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `Dockerfile` · Src: [9]
- **[SUP-41] SBOM published and non-empty** — The SBOM of the latest published image is retrievable from the registry attestation or a release asset and lists the Node packages shipped in `.output/server/node_modules`.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [9], [13]

## 5. Secret-leak prevention

- **[SUP-42] Secret scanning enabled** — `gh api repos/{owner}/{repo}` reports `security_and_analysis.secret_scanning.status == "enabled"`.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [11]
- **[SUP-43] Push protection enabled** — `security_and_analysis.secret_scanning_push_protection.status == "enabled"` for the repository (repository-level push protection is off by default).
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [11]
- **[SUP-44] Custom push-protection patterns** — Push protection (built-in plus custom patterns) covers every credential type the project uses: registry access tokens, GitHub tokens, SSH private keys and CI scanner tokens.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [11]
- **[SUP-45] Push-protection bypasses reviewed** — No unreviewed push-protection bypass occurred in the last 90 days; every bypass is resolved and its reason recorded.
  Evidence: `command` · Diff: ✗ · Severity: medium · Src: [11]
- **[SUP-46] Full-history secret scan** — A gitleaks or trufflehog scan of the whole git history (including deleted `.env*` files and keys) reports no live secret.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [12]
- **[SUP-47] Leaked secrets rotated** — Every secret ever found in history has been rotated at its provider, not only deleted from the tree.
  Evidence: `manual` · Diff: ✗ · Severity: high · Src: [12]
- **[SUP-48] Env files ignored** — `.gitignore` ignores env files (`.env`, `.env.*`) and re-includes only the committed templates and test fixtures.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.gitignore` · Src: [12]
- **[SUP-49] No other env file tracked** — `git ls-files` lists no env file other than the committed templates and test fixtures — no force-added local, staging or production env file.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `envs/**` · Src: [12]
- **[SUP-50] Tracked env files hold no live credentials** — Committed env templates and test fixtures contain only placeholders or sandbox values; no production or staging key, DSN token or password appears in them.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `envs/**` · Src: [12]

## 6. Licenses

- **[SUP-51] Shipped-license inventory** — A license listing of the shipped set (`pnpm licenses list --json` restricted to `.output/server/node_modules` packages, or the image SBOM licenses) is non-empty and reviewed; `pnpm licenses list --prod` alone returns nothing while there is no `dependencies` key.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [6], [9]
- **[SUP-52] No unapproved copyleft** — No GPL, AGPL or SSPL license appears in the shipped set, transitive packages included, without a documented legal exception.
  Evidence: `command` · Diff: ✗ · Severity: high · Src: [6]
- **[SUP-53] CI license gate** — A CI step parses `pnpm licenses list --json` against a license allowlist and fails on an unknown or copyleft license.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/**`, `.github/actions/**` · Src: [6]
- **[SUP-54] Third-party notices** — A generated third-party notices file lists the shipped packages with their licenses and is published with the release or the image.
  Evidence: `artifact` · Diff: ✗ · Severity: medium · Src: [12]
- **[SUP-55] Project license consistent** — `package.json` `"license"` (`MIT`) matches the root `LICENSE` file.
  Evidence: `static` · Diff: ✓ · Severity: low · Look: `package.json`, `LICENSE` · Src: [6], [12]

## 7. Renovate, bots & Scorecard

- **[SUP-56] Best-practices preset** — Renovate extends a curated preset set that pins digests and devDependencies, enables abandonment and release-age security checks, and schedules weekly lockfile maintenance (for example `config:best-practices`).
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json` · Src: [7]
- **[SUP-58] Vulnerability alerts not disabled** — `vulnerabilityAlerts` is not disabled in `.github/renovate.json`, so Renovate opens security PRs from GitHub advisory alerts.
  Evidence: `static` · Diff: ✓ · Severity: high · Look: `.github/renovate.json` · Src: [7], [8]
- **[SUP-59] OSV vulnerability alerts** — `osvVulnerabilityAlerts: true` is set in `.github/renovate.json` to add OSV advisories and malicious-package detection.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json` · Src: [7], [8]
- **[SUP-60] Automerge guardrails** — When Renovate automerge is enabled for third-party packages, those rules wait `minimumReleaseAge` of at least `14 days` and merge through required checks or a merge queue.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json` · Src: [7]
- **[SUP-61] Off-manifest versions tracked** — Every version pinned outside `package.json` and the lockfile (e.g. `npm install -g pnpm@x.y.z` in `Dockerfile`, `packageManager`, `configs/node/.node-version`) is updated by a built-in Renovate manager or a `customManagers` entry.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/renovate.json`, `Dockerfile` · Src: [8]
- **[SUP-62] OpenSSF Scorecard wired** — A Scorecard workflow runs on a schedule with `publish_results: true`, and a target score is recorded and tracked.
  Evidence: `static` · Diff: ✓ · Severity: medium · Look: `.github/workflows/**` · Src: [13]

## Sources

[1] pnpm: Mitigating supply chain attacks — https://pnpm.io/supply-chain-security — fetched 2026-10-31 (pnpm 12 docs; installed pnpm 12.16.1)
[2] pnpm: Settings (pnpm-workspace.yaml) — https://pnpm.io/settings — fetched 2026-10-31 (pnpm 12 docs; installed pnpm 12.16.1)
[3] pnpm: Dependency Resolution Settings — https://pnpm.io/settings/dependency-resolution — fetched 2026-10-31 (pnpm 12 docs; installed pnpm 12.16.1)
[4] pnpm: Build Settings — https://pnpm.io/settings/build — fetched 2026-10-31 (pnpm 12 docs; installed pnpm 12.16.1)
[5] pnpm audit — https://pnpm.io/cli/audit — fetched 2026-10-31 (pnpm 12 docs; installed pnpm 12.16.1)
[6] pnpm licenses — https://pnpm.io/cli/licenses — fetched 2026-10-31 (pnpm 12 docs; installed pnpm 12.16.1)
[7] Renovate: Upgrade best practices — https://docs.renovatebot.com/upgrade-best-practices/ — fetched 2026-10-31 (docs for Renovate 44.198.3)
[8] Renovate: Configuration options — https://docs.renovatebot.com/configuration-options/ — fetched 2026-10-31 (docs for Renovate 44.198.3)
[9] Docker Docs: SBOM attestations — https://docs.docker.com/build/metadata/attestations/sbom/ — fetched 2026-10-31 (accessed 2026-10-31)
[10] GitHub Docs: Using artifact attestations to establish provenance for builds — https://docs.github.com/en/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds — fetched 2026-10-31 (accessed 2026-10-31)
[11] GitHub Docs: About push protection — https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection — fetched 2026-10-31 (accessed 2026-10-31)
[12] OpenSSF Best Practices: Passing criteria — https://www.bestpractices.dev/en/criteria/0 — fetched 2026-10-31 (accessed 2026-10-31)
[13] OpenSSF Scorecard check documentation — https://github.com/ossf/scorecard/blob/main/docs/checks.md — fetched 2026-10-31 (main branch)
[14] GitHub Docs: Security hardening for GitHub Actions — https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions — fetched 2026-10-31 (accessed 2026-10-31)
