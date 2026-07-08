# 🐐 Goat It Web Game

![TypeScript](https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=2F73BF)
![Nuxt](https://img.shields.io/badge/-Nuxt-black?style=for-the-badge&logoColor=white&logo=nuxt&color=00DC82)
![Vue](https://img.shields.io/badge/-Vue-black?style=for-the-badge&logoColor=white&logo=vue.js&color=42B883)

[![⚙️ Build Workflow](https://github.com/antoinezanardi/goat-it-web-game/actions/workflows/build.yml/badge.svg)](https://github.com/antoinezanardi/goat-it-web-game/actions/workflows/build.yml)
[![⛵️ Deploy To Staging Workflow](https://github.com/antoinezanardi/goat-it-web-game/actions/workflows/deploy-to-staging.yml/badge.svg)](https://github.com/antoinezanardi/goat-it-web-game/actions/workflows/deploy-to-staging.yml)
[![🚀 Deploy To Production Workflow](https://github.com/antoinezanardi/goat-it-web-game/actions/workflows/deploy-to-production.yml/badge.svg)](https://github.com/antoinezanardi/goat-it-web-game/actions/workflows/deploy-to-production.yml)

[![GitHub release](https://img.shields.io/github/release/antoinezanardi/goat-it-web-game.svg)](https://GitHub.com/antoinezanardi/goat-it-web-game/releases/)
[![semantic-release: conventional commits](https://img.shields.io/badge/semantic--release-conventional%20commits-1A7DBD?logo=semantic-release&color=1E7FBF)](https://github.com/semantic-release/semantic-release)
[![GitHub license](https://img.shields.io/github/license/antoinezanardi/goat-it-web-game.svg)](https://github.com/antoinezanardi/goat-it-web-game/blob/main/LICENSE)
![Dependencies](https://img.shields.io/badge/-dependencies-black?style=flat-square&logoColor=white&logo=pnpm&color=B76507)

[![Tests count](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-count)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-count)
[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fantoinezanardi%2Fgoat-it-web-game%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/antoinezanardi/goat-it-web-game/main)
[![Scenarios count](https://byob.yarr.is/antoinezanardi/goat-it-web-game/scenarios)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/scenarios)

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)

## 📖 Table of Contents

- [🐐 What is this project ?](#what-is-this-project)
- [🔨 Installation](#installation)
- [🚀 Build](#build)
- [🐳 Docker](#docker)
- [💯 Tests](#tests)
- [☑️ Code analysis and consistency](#code-analysis-and-consistency)
- [📈 Releases & Changelog](#versions)
- [✨ Misc commands](#misc-commands)
- [©️ License](#license)
- [❤️ Contributors](#contributors)

## <a name="what-is-this-project">🐐 What is this project ?</a>

Goat It Web Game is a web game built with Nuxt 4 and Vue 3, part of the Goat It app ecosystem.

## <a name="installation">🔨 Installation</a>

To install this project, you will need to have on your machine :

![Node](https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=white&logo=node.js&color=339933)
![PNPM](https://img.shields.io/badge/-pnpm-black?style=for-the-badge&logoColor=white&logo=pnpm&color=B76507)
![Docker](https://img.shields.io/badge/-Docker-black?style=for-the-badge&logoColor=white&logo=docker&color=004EA2)

👆 _Click on the badges above to go to the corresponding website._

We recommend using the node version specified in the **[.node-version](configs/node/.node-version)** file or in the **[Dockerfile](Dockerfile)**.

**If you don't have `pnpm` installed, you can still use `npm` for all commands below, but we recommend to use `pnpm` for faster and more reliable installations.**

Then, run the following commands :

```bash
# Install dependencies and Husky hooks
pnpm install

# Run the app in dev mode
pnpm run dev
```

The above command will start the app in development mode and watch for local changes.

You may want to have an API running to test the app. You can use the Goat It API sandbox for that, which is available as a Docker image. Check the **[Docker section](#docker)** for more details.

## <a name="build">🚀 Build</a>

![Nuxt](https://img.shields.io/badge/-Nuxt-black?style=for-the-badge&logoColor=white&logo=nuxt&color=00DC82)

The app is built using `Nuxt` to provide a fast and optimized production output.

To build the app for production, run the following command :

```bash
# Build the app
pnpm run build

# Run the app in production mode
pnpm run start:prod
```

## <a name="docker">🐳 Docker</a>

![Docker](https://img.shields.io/badge/-Docker-black?style=for-the-badge&logoColor=white&logo=docker&color=004EA2)

This app is Docker ready!

The **[Dockerfile](Dockerfile)** is available at the root of the project. It uses a multi-stage build to optimize the image size and performance.

```bash
# Build the app using Docker
pnpm run docker:build

# Build the app using Docker on linux/arm64
pnpm run docker:build:linux/arm64

# Build the app using Docker on linux/amd64
pnpm run docker:build:linux/amd64
```

### 🐐💽 Goat It API sandbox

For development or testing purposes, you can run the Goat It API sandbox with the following command :

```bash
# Run the Goat It API sandbox using Docker
pnpm run docker:api-sandbox:start

# Stop the Goat It API sandbox
pnpm run docker:api-sandbox:stop

# Restart the Goat It API sandbox (stops and starts again)
pnpm run docker:api-sandbox:restart

# Reset the Goat It API sandbox (stops, removes data, and starts fresh)
pnpm run docker:api-sandbox:reset

# Update the Goat It API sandbox image (pulls the latest develop image from Docker Hub) and restart the sandbox with the new image
pnpm run docker:api-sandbox:update
```

## <a name="tests">💯 Tests</a>

### 🧪 Unit tests

![Vitest](https://img.shields.io/badge/-Vitest-black?style=for-the-badge&logoColor=white&logo=vitest&color=green)

[![Tests count](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-count)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-count)

[![Covered Statements](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-statements)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-statements)
[![Covered Branches](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-branches)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-branches)

[![Covered Functions](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-functions)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-functions)
[![Covered Lines](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-lines)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/unit-tests-covered-lines)

This project uses `Vitest` for unit tests, with coverage thresholds set to `100%` for all files included in coverage.

All related test files are located in the **[app/](app/)** directory, alongside the code they test, suffixing the file name with `.spec.ts`.

```bash
# Run unit tests
pnpm run test:unit

# Run unit tests in watch mode
pnpm run test:unit:watch

# Run unit tests in coverage mode – used in CI pipelines
pnpm run test:unit:cov
```

### 👽 Mutation testing

![Stryker](https://img.shields.io/badge/-Stryker-black?style=for-the-badge&logoColor=white&logo=stryker&color=7F1B10)

[![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fantoinezanardi%2Fgoat-it-web-game%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/antoinezanardi/goat-it-web-game/main)

This project uses `Stryker` for mutation testing with `100%` coverage (mutation score).

```bash
# Run mutation tests
pnpm run test:mutation

# Run mutation tests without incremental file (can be longer)
pnpm run test:mutation:force
```

### 🥒 Acceptance tests

![Playwright](https://img.shields.io/badge/-Playwright-black?style=for-the-badge&logoColor=white&logo=playwright&color=2EAD33)
![Cucumber](https://img.shields.io/badge/-Cucumber-black?style=for-the-badge&logoColor=white&logo=cucumber&color=23D96C)

[![Scenarios count](https://byob.yarr.is/antoinezanardi/goat-it-web-game/scenarios)](https://byob.yarr.is/antoinezanardi/goat-it-web-game/scenarios)

This project uses `Playwright` and `Cucumber` for BDD acceptance tests.

Features are written in Gherkin and located in **[tests/acceptance/features/](tests/acceptance/features/)**.

The acceptance tests require the **Goat It API sandbox** to be running. The sandbox is automatically reset at the start of each test run to ensure clean state. See the **[Docker section](#docker)** for details on sandbox commands.

```bash
# Install Playwright Chromium browser binary (required before first run)
pnpm run test:acceptance:prepare

# Run acceptance tests
pnpm run test:acceptance
```

## <a name="code-analysis-and-consistency">☑️ Code analysis and consistency</a>

### 🔍 Code linting & formatting

![Oxlint](https://img.shields.io/badge/-Oxlint-black?style=for-the-badge&logoColor=white&logo=oxc&color=EF4444)
![ESLint](https://img.shields.io/badge/-ESLint-black?style=for-the-badge&logoColor=white&logo=eslint&color=341BAB)

This project uses `Oxlint` and `ESLint` for code linting and formatting with over `500` rules activated.

```bash
# Run code linting with both Oxlint and ESLint
pnpm run lint

# Run code linting with Oxlint only
pnpm run lint:oxlint

# Run code linting with ESLint only
pnpm run lint:eslint

# Run code linting with Oxlint and ESLint and fix issues
pnpm run lint:fix

# Inspect ESLint configuration
pnpm run lint:eslint:inspect-config
```

### 🥇 Project quality scanner

Multiple tools are set up to maintain the best code quality and to prevent vulnerabilities :

![CodeQL](https://img.shields.io/badge/-CodeQL-black?style=for-the-badge&logoColor=white&logo=github&color=2781FE)

You can check the **[CodeQL analysis report here](https://github.com/antoinezanardi/goat-it-web-game/security/code-scanning)**.

![SonarCloud](https://img.shields.io/badge/-SonarCloud-black?style=for-the-badge&logoColor=white&logo=sonarcloud&color=F37A3A)

SonarCloud summary is available **[detailed metrics](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)**.

[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=coverage)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)

[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=antoinezanardi_goat-it-web-game&metric=bugs)](https://sonarcloud.io/summary/new_code?id=antoinezanardi_goat-it-web-game)

## <a name="versions">📈 Releases & Changelog</a>

Releases on the **main** branch are generated and published automatically by :

![Semantic Release](https://img.shields.io/badge/-Semantic%20Release-black?style=for-the-badge&logoColor=white&logo=semantic-release&color=000000)

It uses the **[conventional commit](https://www.conventionalcommits.org/en/v1.0.0/)** strategy.

Each change when a new release comes up is listed in the **[Changelog](CHANGELOG.md)**.

Also, you can keep up with changes by watching releases via the **Watch GitHub button** at the top of this page.

### 🏷️ <a href="https://github.com/antoinezanardi/goat-it-web-game/releases" target="_blank">All releases for this project are available here</a>.

## <a name="misc-commands">✨ Misc commands</a>

### 🔀 Create a git branch with a conventional name

```shell
pnpm run script:create-branch
```

### ⤴️ Create pull request against the `develop` branch from current branch

```shell
pnpm run script:create-pull-request
```

### 🧹 Clean PR description from numbered diffhunk links

```shell
pnpm run script:clean-pr-description <pr-number>
```

This script removes numbered diffhunk links (e.g., `[[1]](diffhunk://...)`) from a PR description. These links are automatically generated by GitHub Copilot but can clutter the summary. A GitHub Actions workflow automatically runs this script when PRs targeting `develop` are opened or edited.

### 📣 To all IntelliJ IDEs users (IntelliJ, Webstorm, PHPStorm, etc.)

All the above commands are available in the **[.run/](.run/)** directory as run configurations.

You can add them as **run configurations** in your IDE.

## <a name="license">©️ License</a>

[![GitHub license](https://img.shields.io/github/license/antoinezanardi/goat-it-web-game.svg)](https://github.com/antoinezanardi/goat-it-web-game/blob/main/LICENSE)

This project is licensed under the **[MIT License](./LICENSE)**.

## <a name="contributors">❤️ Contributors</a>

There is no contributor yet. Want to be the first?

Don't hesitate to browse the **[issues](https://github.com/antoinezanardi/goat-it-web-game/issues)** and **[pull requests](https://github.com/antoinezanardi/goat-it-web-game/pulls)** to see what's coming up next.

If you want to contribute to this project, please read the **[CONTRIBUTING.md](.github/CONTRIBUTING.md)** file for guidelines.
