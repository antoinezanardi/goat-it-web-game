# Acceptance Testing Guide

This document is the complete reference for writing acceptance tests in this repository.
It covers the test infrastructure, feature file patterns, step definition conventions, Playwright integration, and common pitfalls.

---

## Table of contents

1. [Overview and tooling](#1-overview-and-tooling)
2. [Configuration](#2-configuration)
3. [Running tests](#3-running-tests)
4. [Infrastructure (hooks, world, sandbox)](#4-infrastructure-hooks-world-sandbox)
5. [Feature file patterns](#5-feature-file-patterns)
  - [Naming and organization](#51-naming-and-organization)
  - [Tags](#52-tags)
  - [Scenarios and Scenario Outlines](#53-scenarios-and-scenario-outlines)
  - [Background blocks](#54-background-blocks)
  - [DataTables](#55-datatables)
  - [Accessibility features](#56-accessibility-features)
6. [Step definition patterns](#6-step-definition-patterns)
  - [File organization](#61-file-organization)
  - [Given steps](#62-given-steps)
  - [When steps](#63-when-steps)
  - [Then steps](#64-then-steps)
  - [Helpers](#65-helpers)
  - [Constants](#66-constants)
  - [DataTable schemas](#67-datatable-schemas)
7. [Playwright integration](#7-playwright-integration)
  - [Page interactions](#71-page-interactions)
  - [Locators and selectors](#72-locators-and-selectors)
  - [Assertions](#73-assertions)
  - [Accessibility scanning (axe-core)](#74-accessibility-scanning-axe-core)
8. [Support utilities](#8-support-utilities)
  - [World class (GoatItWorld)](#81-world-class-goatitworld)
  - [Navigation helpers](#82-navigation-helpers)
  - [DataTable helpers](#83-datatable-helpers)
  - [Format helpers](#84-format-helpers)
  - [Table helpers](#85-table-helpers)
9. [Sandbox management](#9-sandbox-management)
  - [Docker compose setup](#91-docker-compose-setup)
  - [MongoDB reset](#92-mongodb-reset)
  - [Health check](#93-health-check)
10. [Adding new features (step-by-step)](#10-adding-new-features-step-by-step)
11. [Naming conventions](#11-naming-conventions)
12. [Common pitfalls](#12-common-pitfalls)

---

## 1. Overview and tooling

| Tool                                                                                                 | Purpose                                             |
|------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| [Cucumber.js](https://cucumber.io/docs/cucumber/)                                                    | BDD test runner (Gherkin feature files)             |
| [Playwright](https://playwright.dev)                                                                 | Browser automation                                  |
| [`@nuxt/test-utils/e2e`](https://nuxt.com/docs/getting-started/testing)                              | Nuxt server lifecycle + Playwright browser creation |
| [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright) | Accessibility scanning (WCAG compliance)            |
| [Zod](https://zod.dev)                                                                               | DataTable row validation                            |
| [Docker](https://www.docker.com)                                                                     | API sandbox (MongoDB + Goat It API)                 |

Acceptance tests use **Cucumber.js** with **Gherkin** syntax for feature files and **Playwright** for browser automation. The test runner is configured via `configs/cucumber/cucumber.json`. The Nuxt server is started automatically before tests via `@nuxt/test-utils/e2e`'s `createTest()`.

---

## 2. Configuration

### Cucumber config

Location: `configs/cucumber/cucumber.json`

```json
{
  "default": {
    "paths": [
      "tests/acceptance/features/**/*.feature"
    ],
    "import": [
      "tests/acceptance/features/**/*.ts"
    ],
    "parallel": 4,
    "publish": false,
    "format": [
      "progress-bar",
      "json:tests/acceptance/reports/report.json",
      "junit:tests/acceptance/reports/junit.xml"
    ]
  }
}
```

- **`paths`** — Glob for `.feature` files
- **`import`** — Glob for step definitions, hooks, and support files (all `.ts` under `features/`)
- **`parallel: 4`** — Tests run in 4 parallel workers (IDs 0–3), each targeting its own API sandbox on ports 9090–9093 (calculated as 9090 + worker ID)
- **`format`** — Summary to stdout + JSON and JUnit report files

### Import alias

The `#acceptance/` import alias maps to `tests/acceptance/`. Use it in all acceptance test TypeScript files:

```ts
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
```

### Reports

Reports are generated in `tests/acceptance/reports/`:

- `report.json` — Cucumber JSON report
- `junit.xml` — JUnit XML report
- `screenshots/` — Failure screenshots (one per failed scenario)

---

## 3. Running tests

```bash
# Full acceptance test run: builds Nuxt once + runs all workers (CI and first run)
pnpm run test:acceptance

# Skip build: re-run tests against existing build (fast local iteration)
pnpm run test:acceptance:skip-build

# Build only: pre-build Nuxt for tests without running them
pnpm run test:acceptance:build

# Install Playwright (run once after fresh checkout)
pnpm run test:acceptance:prepare

# Run a specific feature file (skip build for fast iteration)
pnpm run test:acceptance:skip-build tests/acceptance/features/home/home.feature

# Run a specific scenario by line number
pnpm run test:acceptance:skip-build tests/acceptance/features/home/home.feature:8

# Run by scenario name
pnpm run test:acceptance:skip-build --name "should display"

# Run by tag
pnpm run test:acceptance:skip-build --tags "@question-theme-creation"

# Multiple tags (OR)
pnpm run test:acceptance:skip-build --tags "@home or @questions"

# Exclude tag
pnpm run test:acceptance:skip-build --tags "not @accessibility"

# Multiple tags (AND)
pnpm run test:acceptance:skip-build --tags "@question-themes and @accessibility"
```

**Prerequisites:**

1. Docker must be running with the API sandbox: `docker compose -f docker/goat-it-api-sandbox/docker-compose.yml up -d`
2. Playwright must be installed: `pnpm run test:acceptance:prepare`

---

## 4. Infrastructure (hooks, world, sandbox)

### Hook lifecycle

The hooks in `tests/acceptance/features/support/hooks.ts` manage the full test lifecycle:

| Hook        | Timeout | What it does                                                                                        |
|-------------|---------|-----------------------------------------------------------------------------------------------------|
| `BeforeAll` | 360s    | Cleans screenshot directory (worker 0 only), waits for API sandbox health check, starts Nuxt server |
| `Before`    | 60s     | Resets MongoDB sandbox data, creates a new Playwright page and browser context                      |
| `After`     | —       | Takes screenshot on failure (attached to report), closes browser context                            |
| `AfterAll`  | —       | Tears down Nuxt server                                                                              |

```ts
// hooks.ts — simplified structure
const rootDirectory = fileURLToPath(new URL("../../../..", import.meta.url));
const workerId = getWorkerId();
const sandboxBaseUrl = getSandboxBaseUrl();
const {
  beforeEach,
  afterEach,
  afterAll,
  beforeAll
} = createTest({
  runner: "cucumber",
  build: false,
  server: true,
  env: {
    NUXT_GOAT_IT_API_BASE_URL: sandboxBaseUrl,
    NUXT_GOAT_IT_API_ADMIN_KEY: SANDBOX_ADMIN_KEY,
  },
  browserOptions: {
    type: "chromium",
    launch: {
      headless: true,
      ignoreDefaultArgs: ["--hide-scrollbars"],
    },
  },
  rootDir: rootDirectory,
  nuxtConfig: {
    buildDir: SHARED_BUILD_DIR,
    nitro: {
      output: {
        dir: path.resolve(rootDirectory, SHARED_BUILD_DIR, "output"),
      },
    },
    i18n: { defaultLocale: ACCEPTANCE_TESTS_DEFAULT_LOCALE },
  },
});

BeforeAll({ timeout: BEFORE_ALL_TIMEOUT }, async () => {
  if (workerId === 0) {
    removeAcceptanceTestsReportsScreenshotsDirectory();
  }
  await waitForSandboxHealthCheck();
  await beforeAll();
});

Before({ timeout: BEFORE_TIMEOUT }, async function (this: GoatItWorld) {
  resetSandboxData();
  beforeEach();
  this.page = await createPage();
  this.context = this.page.context();
});

After(async function (this: GoatItWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    await generateScreenshotOnScenarioFailure(this, scenario);
  }
  afterEach();
  await this.context.close();
});

AfterAll(async () => {
  await afterAll();
});
```

### World class

```ts
// tests/acceptance/features/support/types/world.types.ts
class GoatItWorld extends World {
  public page!: Page;
  public context!: BrowserContext;
  public openedTabPage?: Page;
}
```

- **`page`** — The main Playwright `Page` instance for the scenario
- **`context`** — The Playwright `BrowserContext` wrapping the page
- **`openedTabPage`** — Set when a step opens a new browser tab (e.g., clicking a link with `target="_blank"`). Used by steps that need to assert content on the newly opened tab.

Every step function must type `this` as `GoatItWorld`:

```ts
Given(/^the user is on (?<page>.+) page$/u, async function (this: GoatItWorld, page: string) {
  // this.page, this.context, and this.openedTabPage are available
});
```

### Key constants

| Constant                          | Value                              | Location                                                         |
|-----------------------------------|------------------------------------|------------------------------------------------------------------|
| `BEFORE_ALL_TIMEOUT`              | `360_000` (360s)                   | `tests/acceptance/features/support/constants/hooks.constants.ts` |
| `BEFORE_TIMEOUT`                  | `60_000` (60s)                     | `tests/acceptance/features/support/constants/hooks.constants.ts` |
| `ACCEPTANCE_TESTS_DEFAULT_LOCALE` | `"en"`                             | `tests/acceptance/features/support/constants/hooks.constants.ts` |
| `SANDBOX_BASE_PORT`               | `9090`                             | `tests/acceptance/features/support/constants/hooks.constants.ts` |
| `SANDBOX_ADMIN_KEY`               | `"test_admin_api_key_for_testing"` | `tests/acceptance/features/support/constants/hooks.constants.ts` |
| `SANDBOX_MONGODB_DATABASE_NAME`   | `"goat-it-sandbox"`                | `tests/acceptance/features/support/constants/hooks.constants.ts` |
| `SHARED_BUILD_DIR`                | `".nuxt/test"`                     | `tests/acceptance/features/support/constants/hooks.constants.ts` |

---

## 5. Feature file patterns

### 5.1 Naming and organization

Feature files are organized by domain entity and action (where applicable):

```
tests/acceptance/features/
├── home/
│   ├── home.feature
│   └── home-accessibility.feature
├── question-themes/
│   ├── question-themes.feature
│   ├── question-themes-accessibility.feature
│   ├── archive/
│   │   ├── question-theme-archive.feature
│   │   └── question-theme-archive-accessibility.feature
│   ├── creation/
│   │   ├── question-theme-creation.feature
│   │   └── question-theme-creation-accessibility.feature
│   ├── filter/
│   │   └── question-theme-filter.feature
│   ├── modification/
│   │   ├── question-theme-modification.feature
│   │   └── question-theme-modification-accessibility.feature
│   └── translation/
│       └── question-theme-translations.feature
└── questions/
    ├── questions.feature
    ├── questions-accessibility.feature
    ├── creation/
    │   ├── question-creation.feature
    │   └── question-creation-accessibility.feature
    └── modification/
        ├── question-modification.feature
        ├── question-modification-accessibility.feature
        └── question-theme-assignment/
            └── question-theme-assignment.feature
```

- **Top-level pages** get a directory: `home/`, `question-themes/`, `questions/`
- **Actions** within a domain get subdirectories: `creation/`, `modification/`, `archive/`, `filter/`, `translation/`
- **Sub-features** within an action get nested subdirectories: `modification/question-theme-assignment/`
- **Accessibility tests** are always in separate `*-accessibility.feature` files alongside the main feature

### 5.2 Tags

Tags are placed at the top of the feature file, before the `Feature:` keyword:

**For page-level features** (no action subdirectory):

```gherkin
@home-page
Feature: 🏡 Home Page
```

**For action-specific features** (within an action subdirectory):

```gherkin
@question-themes @question-theme-creation
Feature: 🎨 Question Theme Creation
```

**For sub-feature features** (nested action subdirectory):

```gherkin
@questions @question-theme-assignment-modification
Feature: 🏷️ Question Theme Assignment Modification
```

- **Page-level**: Single tag (`@<domain>-page`, e.g., `@home-page`, `@questions-page`)
- **Action-specific**: Domain tag + action tag (`@<domain>` + `@<domain>-<action>`, e.g., `@question-themes` + `@question-theme-creation`)
- **Sub-feature**: Domain tag + sub-feature-action tag (e.g., `@questions` + `@question-theme-assignment-modification`)
- Tags use `kebab-case`
- Tags enable selective test runs: `--tags "@question-theme-creation"`

### 5.3 Scenarios and Scenario Outlines

**Scenario naming:** Emoji prefix matching the Feature + descriptive name.

```gherkin
Scenario: 🎨 Question Theme is created and displayed in the list
```

**Scenario Outline:** Used for parameterized tests (e.g., accessibility across viewports):

```gherkin
Scenario Outline: 🎨 Question Theme Creation Form should not contain accessibility issues in light <View> mode
Given the user is on question-themes page
When the user clicks on the button with name "Create a new theme"
Then the page should not contain accessibility issues in <View> mode

Examples:
| View    |
| desktop |
| mobile  |
```

### 5.4 Background blocks

**Use `Background:` when 3 or more scenarios in a feature share identical Given/When/Then steps at the beginning.** Background steps run before every scenario in the feature, reducing duplication.

**Rule:** Only use `Background:` when at least 3 scenarios share the exact same initial steps. For 2 scenarios, repeat the steps in each — the duplication is acceptable and keeps scenarios self-contained.

**Example — `question-modification.feature`:**

```gherkin
@questions @question-modification
Feature: ❓ Question Modification

  Background:
    Given the user is on question-themes page
    And a question theme exists with the following attributes:
      | label     | slug      | description       | aliases |
      | Geography | geography | A geography theme | geo     |
    And the user is on questions page
    And a question exists with the following attributes:
      | statement                      | answer | difficulty | category | themes    | sourceUrls                      |
      | What is the capital of France? | Paris  | easy       | Trivia   | Geography | https://en.wikipedia.org/France |
    When the user clicks on the button with name "Edit the question"
    Then the heading with exact name "Edit question" should be visible

  Scenario: ❓ Question statement is modified and success toast is displayed
    When the user fills the input with name "Statement*" with text "What is the capital of Germany?"
    And the user fills the input with name "Answer*" with text "Berlin"
    And the user clicks on the button with name "Edit"
    Then the toast with exact text "Question modified successfully" should be visible

  Scenario: ❓ Question modification modal opens with pre-filled fields
    Then the button with name "Edit" should be enabled

  Scenario: ❓ Question modification modal closes without saving when clicking close button in the modal header
    When the user clicks on the close button in the modal header
    Then the heading with exact name "Edit question" should be hidden
```

**Key points:**

- Background can contain `Given`, `And`, `When`, and `Then` steps
- Scenarios in a file with a Background can add more `Given`/`And` steps after the Background using `And` as their first keyword
- Keep Background steps minimal — only include what truly applies to ALL scenarios in the feature
- If a scenario needs extra preconditions beyond the Background, add them using `And` at the start of that scenario

**Without Background (fewer than 3 scenarios sharing steps):**

```gherkin
Scenario: ❓ Question is created and displayed successfully
Given the user is on question-themes page
And a question theme exists with the following attributes:
| label     | slug      | description       | aliases |
| Geography | geography | A geography theme | geo     |
And the user is on questions page
When the user clicks on the button with name "Create a new question"
...
```

### 5.5 DataTables

DataTables pass structured data to steps. They are used for:

**Form inputs:**

```gherkin
When the user fills the question theme form with the following attributes:
| label                 | slug                  | description                    | aliases | color  |
| Acceptance Test Theme | acceptance-test-theme | A theme for acceptance testing | test    | FF5733 |
```

**Expected table data:**

```gherkin
Then the question theme table should contain a row with the following attributes:
| label                 | slug                  | description                    | aliases | status |
| Acceptance Test Theme | acceptance-test-theme | A theme for acceptance testing | test    | Active |
```

**Validation errors:**

```gherkin
Then the question theme form should display the following errors:
| field       | error                                             |
| Label       | Too small: expected string to have >=1 characters |
| Description | Too small: expected string to have >=1 characters |
```

DataTable columns that may be empty use `zCoerceOptionalString()` in their Zod schema (see [Section 6.7](#67-datatable-schemas)).

### 5.6 Accessibility features

Every page and modal with a UI gets an accessibility feature file testing the WCAG compliance matrix:

- Light mode + desktop viewport
- Light mode + mobile viewport
- Dark mode + desktop viewport
- Dark mode + mobile viewport

```gherkin
@question-themes @accessibility @question-theme-creation
Feature: 🎨 Question Theme Creation Form Accessibility

  Scenario Outline: 🎨 Question Theme Creation Form should not contain accessibility issues in light <View> mode
    Given the user is on question-themes page
    When the user clicks on the button with name "Create a new theme"
    Then the page should not contain accessibility issues in <View> mode

    Examples:
      | View    |
      | desktop |
      | mobile  |

  Scenario Outline: 🎨 Question Theme Creation Form should not contain accessibility issues in dark <View> mode
    Given the user is on question-themes page
    When the user switches to dark mode
    And the user clicks on the button with name "Create a new theme"
    Then the page should not contain accessibility issues in <View> mode

    Examples:
      | View    |
      | desktop |
      | mobile  |
```

---

## 6. Step definition patterns

### 6.1 File organization

Step definitions live in `tests/acceptance/features/step-definitions/` organized by domain:

```
step-definitions/
├── accessibility/          # Generic accessibility steps
│   ├── accessibility.steps.constants.ts
│   └── accessibility.then-steps.ts
├── color-mode/             # Dark/light mode switching
│   └── color-mode.when-steps.ts
├── element/                # Generic element interactions
│   ├── element.steps.constants.ts
│   ├── element.then-steps.ts
│   ├── element.when-steps.ts
│   └── helpers/
│       └── element.when-steps.helpers.ts
├── form/                   # Form input interactions
│   └── form.when-steps.ts
├── keyboard/               # Keyboard actions
│   └── keyboard.when-steps.ts
├── locale/                 # Locale switching
│   ├── locale.then-steps.ts
│   └── locale.when-steps.ts
├── modal/                  # Modal interactions
│   └── modal.when-steps.ts
├── navigation/             # Page navigation
│   ├── navigation.given-steps.ts
│   ├── navigation.then-steps.ts
│   ├── navigation.when-steps.ts
│   └── helpers/
│       └── navigation.given-steps.helpers.ts
├── question-theme/         # Question theme domain steps
│   ├── datatables/
│   │   └── question-theme.datatables.schemas.ts
│   ├── helpers/
│   │   ├── question-theme.given-steps.helpers.ts
│   │   └── question-theme.when-steps.helpers.ts
│   ├── question-theme.given-steps.ts
│   ├── question-theme.then-steps.ts
│   └── question-theme.when-steps.ts
├── question/               # Question domain steps
│   ├── datatables/
│   │   └── question.datatables.schemas.ts
│   ├── helpers/
│   │   ├── question.given-steps.helpers.ts
│   │   └── question.when-steps.helpers.ts
│   ├── question.given-steps.ts
│   ├── question.then-steps.ts
│   ├── question.when-steps.ts
│   └── source-url-tag/     # Sub-feature step grouping
│       ├── question-source-url-tag.then-steps.ts
│       └── question-source-url-tag.when-steps.ts
├── text/                   # Text content steps
│   ├── text.then-steps.ts
│   └── text.when-steps.ts
└── toast/                  # Toast notification steps
    └── toast.then-steps.ts
```

**Naming convention:** `<domain>.<step-type>-steps.ts` where `<step-type>` is `given`, `when`, or `then`.

Steps are split into **generic** (reusable across all domains) and **domain-specific** categories:

| Category        | Domains                                                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------------------|
| Generic         | `accessibility`, `color-mode`, `element`, `form`, `keyboard`, `locale`, `modal`, `navigation`, `text`, `toast` |
| Domain-specific | `question-theme`, `question`                                                                                   |

**Sub-feature step grouping:** When a domain has a distinct sub-feature with its own unique steps (e.g., source URL tag interactions within questions), those steps are grouped in a subdirectory: `step-definitions/question/source-url-tag/`. The naming follows `<domain>-<sub-feature>.<step-type>-steps.ts`.

**Always check generic steps before writing new domain-specific ones.** Most UI interactions (clicking, typing, navigating, asserting visibility) are already covered by generic steps.

### 6.2 Given steps

Given steps set up preconditions. They typically navigate to a page or create test data through the UI.

```ts
import { Given } from "@cucumber/cucumber";
import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

// Simple navigation
Given(/^the user is on (?<page>.+) page$/u, async function (this: GoatItWorld, page: string): Promise<void> {
  const pageName = page === "home" ? "" : page;
  await goOnPage(this, pageName);
});

// Creating test data via UI
Given(/^a question exists with the following attributes:$/u, async function (this: GoatItWorld, dataTable: DataTable): Promise<void> {
  const row = validateDataTableAndGetFirstRow(dataTable, QUESTION_FORM_ROW_SCHEMA);
  await createQuestionViaUi(this.page, row);
},);
```

#### Key rules

- Always type `this: GoatItWorld`
- Use regex with named capture groups and `/u` flag
- Import `Given` from `@cucumber/cucumber`
- Extract complex setup logic to helper functions

### 6.3 When steps

When steps describe user actions. They interact with the page via Playwright locators.

```ts
import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

// Filling a form input
When(/^the user fills the input with name "(?<name>[^"]*)" with text "(?<text>[^"]*)"$/u, async function (this: GoatItWorld, name: string, text: string): Promise<void> {
  const locator = this.page.getByRole("textbox", { name });
  await expect(locator).toBeVisible();
  await locator.fill(text);
},);

// Using dynamic regex with role alternation
When(new RegExp(`^the user clicks on the (?<role>${ROLE_ALTERNATION_PATTERN}) with(?<exact> exact)? name "(?<name>[^"]*)"$`, "u"), async function (this: GoatItWorld, role: LocatorRole, exact: string | undefined, name: string): Promise<void> {
  await clickOnRoleWithText(this, role, name, exact !== undefined);
},);
```

#### Key rules

- Always `await expect(locator).toBeVisible()` before interacting with an element
- Import `expect` from `@playwright/test`
- Use `this.page` for all Playwright interactions
- Extract complex interaction sequences to helper functions

### 6.4 Then steps

Then steps assert outcomes. They use Playwright's `expect` for assertions.

```ts
import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

// Visibility assertion with role
Then(new RegExp(`^the (?<role>${ROLE_ALTERNATION_PATTERN}) with(?<exact> exact)? name "(?<name>[^"]*)" should be visible$`, "u"), async function (this: GoatItWorld, role: LocatorRole, exact: string | undefined, name: string): Promise<void> {
  const locator = this.page.getByRole(role, {
    name,
    exact: exact !== undefined
  });
  await expect(locator).toBeVisible();
},);

// Toast assertion — scoped to Notifications region
Then(/^the toast with(?<exact> exact)? text "(?<text>[^"]*)" should be visible$/u, async function (this: GoatItWorld, exact: string | undefined, text: string): Promise<void> {
  const toastRegion = this.page.getByRole("region", { name: "Notifications" });
  const toast = toastRegion.getByText(text, { exact: exact !== undefined });
  await expect(toast).toBeVisible();
},);
```

#### Key rules

- Use Playwright's `expect(locator)` for all assertions — never raw `assert`
- Common assertions: `.toBeVisible()`, `.toBeHidden()`, `.toBeDisabled()`, `.toBeEnabled()`, `.toHaveLength()`
- For table row matching, use the `doesTableContainRowMatchingAttributes` helper

### 6.5 Helpers

Complex step logic is extracted to helper files. There are two categories with distinct placement rules:

#### Domain helpers (step-type-specific)

Location: `step-definitions/<domain>/helpers/<domain>.<step-type>-steps.helpers.ts`

**One file per step type** — helpers for Given steps go in `<domain>.given-steps.helpers.ts`, helpers for When steps go in `<domain>.when-steps.helpers.ts`. Never create a generic `<domain>.steps.helpers.ts` file.

```
step-definitions/question-theme/
├── helpers/
│   ├── question-theme.given-steps.helpers.ts    # Helpers for Given steps
│   └── question-theme.when-steps.helpers.ts     # Helpers for When steps

step-definitions/question/
├── helpers/
│   ├── question.given-steps.helpers.ts          # Helpers for Given steps
│   └── question.when-steps.helpers.ts           # Helpers for When steps
```

Domain helper functions receive `Page`, `Locator`, or `GoatItWorld` as parameters — they never access `this` directly:

```ts
// question-theme.given-steps.helpers.ts
import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

async function createQuestionThemeViaUi(page: Page, row: QuestionThemeFormRow): Promise<void> {
  const createButton = page.getByRole("button", { name: "Create a new theme" });
  await expect(createButton).toBeVisible();
  await createButton.click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await fillQuestionThemeForm(dialog, row);

  const submitButton = dialog.getByRole("button", { name: "Create" });
  await expect(submitButton).toBeEnabled();
  await submitButton.click();
  await expect(dialog).toBeHidden();
}
```

```ts
// question-theme.when-steps.helpers.ts
import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

async function fillQuestionThemeForm(dialog: Locator, row: QuestionThemeFormRow): Promise<void> {
  if (row.label !== undefined) {
    await dialog.getByRole("textbox", { name: "Label*" }).fill(row.label);
  }
  if (row.slug !== undefined) {
    await dialog.getByRole("textbox", { name: "Slug*" }).fill(row.slug);
  }
  // ... etc.
}
```

#### Cross-step shared helpers

Location: `tests/acceptance/features/support/helpers/`

Functions used across **multiple step types or domains** live in `support/helpers/`. These are never placed in domain-specific helper directories.

```ts
// support/helpers/navigation.helpers.ts
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function waitForPageLoadStates(world: GoatItWorld): Promise<void> {
  await world.page.waitForLoadState("load");
}

async function waitForPageUrl(world: GoatItWorld, pageUrl: string): Promise<void> {
  await world.page.waitForURL(currentUrl => new URL(currentUrl).pathname === pageUrl);
}

export { waitForPageLoadStates, waitForPageUrl };
```

These cross-step helpers are consumed by domain-specific helpers:

```ts
// navigation/helpers/navigation.given-steps.helpers.ts
import { url } from "@nuxt/test-utils/e2e";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { waitForPageLoadStates } from "#acceptance/features/support/helpers/navigation.helpers.ts";

async function goOnPage(world: GoatItWorld, pageName: string): Promise<void> {
  const pagePath = pageName === "" ? "/" : `/${pageName}`;
  const pageUrl = url(pagePath);
  await world.page.goto(pageUrl);
  await waitForPageLoadStates(world);
}

export { goOnPage };
```

#### Helper placement decision tree

| Scenario                                         | Placement                                                           |
|--------------------------------------------------|---------------------------------------------------------------------|
| Used only by Given steps in one domain           | `step-definitions/<domain>/helpers/<domain>.given-steps.helpers.ts` |
| Used only by When steps in one domain            | `step-definitions/<domain>/helpers/<domain>.when-steps.helpers.ts`  |
| Used by both Given AND When steps in same domain | Move to `support/helpers/`                                          |
| Used across multiple domains                     | Move to `support/helpers/`                                          |

### 6.6 Constants

Shared regex patterns and other constants live in `<domain>.steps.constants.ts`:

```ts
// element.steps.constants.ts
const VALID_LOCATOR_ROLES: ReadonlySet<string> = new Set([
  "button",
  "img",
  "heading",
  "navigation",
  "link",
  "region",
  "paragraph",
  "tab",
  "alertdialog",
  "dialog",
  "progressbar",
]);

const ROLE_ALTERNATION_PATTERN = [...VALID_LOCATOR_ROLES].join("|");
```

The `ROLE_ALTERNATION_PATTERN` is used to build dynamic regex patterns for steps that accept any ARIA role:

```ts
new RegExp(`^the (?<role>${ROLE_ALTERNATION_PATTERN}) with name "(?<name>[^"]*)" should be visible$`, "u")
```

### 6.7 DataTable schemas

DataTable rows are validated with Zod schemas in `datatables/<domain>.datatables.schemas.ts`:

```ts
// question-theme.datatables.schemas.ts
import { z } from "zod";
import { zCoerceOptionalString } from "#acceptance/features/support/helpers/datatable.helpers.ts";

const QUESTION_THEME_FORM_ROW_SCHEMA = z.strictObject({
  label: zCoerceOptionalString(),
  slug: zCoerceOptionalString(),
  description: zCoerceOptionalString(),
  aliases: zCoerceOptionalString(),
  color: zCoerceOptionalString(),
});

type QuestionThemeFormRow = z.infer<typeof QUESTION_THEME_FORM_ROW_SCHEMA>;
```

#### Key rules

- Use `z.strictObject()` — not `z.object()` — to catch unexpected columns
- Use `zCoerceOptionalString()` for columns that may be absent or empty
- Use `z.string()` for columns that must always be present
- Export both the schema constant and the inferred type
- Name schemas `<DOMAIN>_<PURPOSE>_ROW_SCHEMA` in `UPPER_SNAKE_CASE`
- Name types `<Domain><Purpose>Row` in `PascalCase`

---

## 7. Playwright integration

### 7.1 Page interactions

All interactions go through `this.page` (a Playwright `Page` instance):

```ts
// Navigate
await this.page.goto(url);
await this.page.reload();

// Click
await this.page.getByRole("button", { name: "Create" }).click();

// Fill input
await this.page.getByRole("textbox", { name: "Label*" }).fill("My Value");

// Clear input
await this.page.getByRole("textbox", { name: "Label*" }).clear();

// Press key
await this.page.keyboard.press("Tab");
await this.page.keyboard.press("Escape");
await this.page.keyboard.press("Enter");

// Scroll
await this.page.getByRole("heading", { name: "Section" }).scrollIntoViewIfNeeded();

// Hover
await this.page.getByRole("button", { name: "Actions" }).hover();

// Viewport resize
await this.page.setViewportSize({
  width: 1920,
  height: 800
});

// Wait for load
await this.page.waitForLoadState("load");
await this.page.waitForLoadState("networkidle");

// Wait for URL change
await this.page.waitForURL(currentUrl => new URL(currentUrl).pathname === "/questions");

// Open new tab (via context event)
const [openedTabPage] = await Promise.all([
  this.context.waitForEvent("page"),
  tagLink.click(),
]);
await openedTabPage.waitForLoadState();
this.openedTabPage = openedTabPage;
```

### 7.2 Locators and selectors

**Preference order** (most preferred first):

1. **`getByRole()`** — Best for accessibility, matches ARIA roles:
   ```ts
   this.page.getByRole("button", { name: "Create" });
   this.page.getByRole("textbox", { name: "Label*" });
   this.page.getByRole("heading", { name: "Question Themes" });
   this.page.getByRole("dialog");
   this.page.getByRole("table");
   this.page.getByRole("listbox");
   this.page.getByRole("option", { name: "English" });
   this.page.getByRole("switch", { name: "Switch to dark mode" });
   this.page.getByRole("region", { name: "Notifications" });
   ```

2. **`getByTestId()`** — When role-based selection is ambiguous:
   ```ts
   this.page.getByTestId("locale-select");
   this.page.getByTestId("question-theme-form-label-field");
   dialog.getByTestId("default-modal-footer-primary-button");
   dialog.getByTestId("question-source-urls-input");
   ```

3. **`getByText()`** — For text content assertions:
   ```ts
   this.page.getByText("Question theme created successfully", { exact: true });
   ```

4. **CSS selectors** — Avoid; use only as last resort.

### 7.3 Assertions

Use `expect` from `@playwright/test` — never from Vitest or other libraries:

```ts
import { expect } from "@playwright/test";

// Visibility
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();

// Enabled/disabled state
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();

// Count
expect(results.violations).toHaveLength(0);

// Boolean
expect(wasFound).toBe(true);

// CSS class
await expect(badge).toHaveClass(/text-success/u);
```

### 7.4 Accessibility scanning (axe-core)

Accessibility tests use `AxeBuilder` from `@axe-core/playwright`:

```ts
import { AxeBuilder } from "@axe-core/playwright";

const results = await new AxeBuilder({ page: this.page })
  .setLegacyMode()
  .withTags([...AXE_TAGS])
  .exclude("input[data-hidden]")
  .analyze();

expect(results.violations).toHaveLength(0);
```

**Tags tested:** `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `best-practice`, `ACT`

**Viewports:**

| Mode    | Width | Height |
|---------|-------|--------|
| Desktop | 1920  | 800    |
| Mobile  | 375   | 667    |

The `input[data-hidden]` exclusion handles hidden file inputs that are implementation details and not user-facing.

---

## 8. Support utilities

### 8.1 World class (GoatItWorld)

Location: `tests/acceptance/features/support/types/world.types.ts`

```ts
class GoatItWorld extends World {
  public page!: Page;
  public context!: BrowserContext;
  public openedTabPage?: Page;
}
```

Every step function must use `this: GoatItWorld` as its first parameter type:

```ts
Given(/^.../u, async function (this: GoatItWorld, ...args): Promise<void> {
  // this.page is available here
});
```

### 8.2 Navigation helpers

Location: `tests/acceptance/features/support/helpers/navigation.helpers.ts`

These are **cross-step** helpers used by multiple step-definition domains:

| Function                         | Purpose                                             |
|----------------------------------|-----------------------------------------------------|
| `waitForPageLoadStates(world)`   | Waits for the page `"load"` state                   |
| `waitForPageUrl(world, pageUrl)` | Waits until the page pathname matches the given URL |

```ts
import { waitForPageLoadStates, waitForPageUrl } from "#acceptance/features/support/helpers/navigation.helpers.ts";

await waitForPageLoadStates(world);
await waitForPageUrl(world, "/questions");
```

### 8.3 DataTable helpers

Location: `tests/acceptance/features/support/helpers/datatable.helpers.ts`

| Function                                                | Purpose                                                           |
|---------------------------------------------------------|-------------------------------------------------------------------|
| `validateDataTableAndGetRows<T>(dataTable, schema)`     | Validates all rows against a Zod schema, returns `T[]`            |
| `validateDataTableAndGetFirstRow<T>(dataTable, schema)` | Validates and returns only the first row as `T`                   |
| `zCoerceOptionalString()`                               | Zod transformer: empty string → `undefined`, non-empty → `string` |

```ts
// Usage in a step
const row = validateDataTableAndGetFirstRow(dataTable, QUESTION_THEME_FORM_ROW_SCHEMA);
const rows = validateDataTableAndGetRows(dataTable, QUESTION_THEME_TABLE_ROW_SCHEMA);
```

### 8.4 Format helpers

Location: `tests/acceptance/features/support/helpers/format.helpers.ts`

| Function                 | Purpose                                                               |
|--------------------------|-----------------------------------------------------------------------|
| `prettyStringify(value)` | `JSON.stringify` with 2-space indent — used for readable error output |

### 8.5 Table helpers

Location: `tests/acceptance/features/support/helpers/table.helpers.ts`

| Function                                                          | Purpose                                                  |
|-------------------------------------------------------------------|----------------------------------------------------------|
| `doesTableContainRowMatchingAttributes(page, expectedAttributes)` | Checks if any table row matches all expected cell values |

```ts
const wasFound = await doesTableContainRowMatchingAttributes(this.page, {
  label: "My Theme",
  slug: "my-theme",
  status: "Active",
});
expect(wasFound).toBe(true);
```

---

## 9. Sandbox management

### 9.1 Docker compose setup

Location: `docker/goat-it-api-sandbox/docker-compose.yml`

The sandbox provides a local Goat It API instance backed by MongoDB. The compose file defines 4 API + MongoDB pairs for parallel execution (one per Cucumber worker). Start them before running acceptance tests:

```bash
docker compose -f docker/goat-it-api-sandbox/docker-compose.yml up -d
```

Each worker targets its own sandbox instance at `http://localhost:<9090 + worker ID>`.

### 9.2 MongoDB reset

Before each scenario, the `Before` hook calls `resetSandboxData()` which runs a `mongosh` command via `docker compose ... exec` against the worker's MongoDB container (`goat-it-api-sandbox-mongodb-<workerId>`) to execute `db.dropDatabase()` for the sandbox database. This ensures each test starts with a clean state.

The reset uses `execSync` with a timeout of `RESET_SANDBOX_DATA_TIMEOUT_IN_MS` (10s).

### 9.3 Health check

The `BeforeAll` hook calls `waitForSandboxHealthCheck()` which polls `http://localhost:<9090 + workerId>/health` with:

- Max retries: `SANDBOX_HEALTH_CHECK_MAX_RETRIES` (10)
- Interval: `SANDBOX_HEALTH_CHECK_INTERVAL_IN_MS` (2000ms)

If the sandbox is not healthy after all retries, the test suite fails immediately.

---

## 10. Adding new features (step-by-step)

1. **Identify the domain and action.** Determine where the feature file belongs:
  - **Page-level** (no action): `tests/acceptance/features/<domain>/<feature-name>.feature`
  - **Action-specific**: `tests/acceptance/features/<domain>/<action>/<feature-name>.feature`
  - **Sub-feature**: `tests/acceptance/features/<domain>/<action>/<sub-feature>/<feature-name>.feature`

2. **Check existing generic steps.** Scan the generic step definitions to see what's already available:

   | Domain          | Available steps                                                                                         |
      |-----------------|---------------------------------------------------------------------------------------------------------|
   | `navigation`    | Given: navigate to page. When: reload page. Then: assert current page.                                  |
   | `element`       | When: click, hover, scroll (by role + name). Then: visible, hidden, disabled, enabled (by role + name). |
   | `form`          | When: fill input, clear input (by accessible name).                                                     |
   | `keyboard`      | When: press any key.                                                                                    |
   | `text`          | When: click on text. Then: text visible/hidden.                                                         |
   | `toast`         | Then: toast with text visible (scoped to Notifications region).                                         |
   | `modal`         | When: close modal (header button or footer button).                                                     |
   | `locale`        | When: switch locale. Then: locale completion status.                                                    |
   | `color-mode`    | When: switch to dark mode.                                                                              |
   | `accessibility` | Then: page has no accessibility issues (desktop/mobile).                                                |

3. **Write the feature file.** Create it in the correct directory with proper tags, emoji-prefixed Feature/Scenario titles, and DataTables. Consider using `Background:` if 3+ scenarios share identical initial steps.

4. **Write the accessibility feature file.** Create a `*-accessibility.feature` with Scenario Outlines for the light/dark + desktop/mobile matrix.

5. **Create domain-specific step definitions** (only for steps not covered by generic ones):
  - `<domain>.given-steps.ts` — Setup / preconditions
  - `<domain>.when-steps.ts` — User actions
  - `<domain>.then-steps.ts` — Assertions
  - `<domain>/<sub-feature>/<domain>-<sub-feature>.<step-type>-steps.ts` — Sub-feature steps

6. **Create DataTable schemas** if the feature uses DataTables:
  - `datatables/<domain>.datatables.schemas.ts`
  - Use `z.strictObject()` + `zCoerceOptionalString()`
  - Export schema and inferred type

7. **Extract helpers** for complex interaction sequences:
  - Domain helpers: `helpers/<domain>.<step-type>-steps.helpers.ts` (one file per step type)
  - Cross-step shared functions: `support/helpers/<name>.helpers.ts`

8. **Run tests:**
   ```bash
   pnpm run test:acceptance
   ```

---

## 11. Naming conventions

| Element               | Convention                                  | Example                                         |
|-----------------------|---------------------------------------------|-------------------------------------------------|
| Feature file          | `kebab-case.feature`                        | `question-theme-creation.feature`               |
| Accessibility feature | `*-accessibility.feature`                   | `question-theme-creation-accessibility.feature` |
| Feature directory     | `kebab-case/`                               | `question-themes/creation/`                     |
| Feature title         | Emoji + description                         | `Feature: 🎨 Question Theme Creation`           |
| Scenario title        | Emoji + description                         | `Scenario: 🎨 Question Theme is created...`     |
| Tag                   | `@kebab-case`                               | `@question-theme-creation`                      |
| Step definition file  | `<domain>.<type>-steps.ts`                  | `navigation.given-steps.ts`                     |
| Sub-feature steps     | `<domain>-<sub>.<type>-steps.ts`            | `question-source-url-tag.when-steps.ts`         |
| Step helper file      | `<domain>.<type>-steps.helpers.ts`          | `question-theme.given-steps.helpers.ts`         |
| Cross-step helper     | `<name>.helpers.ts` (in `support/helpers/`) | `navigation.helpers.ts`                         |
| Step constants file   | `<domain>.steps.constants.ts`               | `element.steps.constants.ts`                    |
| DataTable schema file | `<domain>.datatables.schemas.ts`            | `question-theme.datatables.schemas.ts`          |
| Schema constant       | `UPPER_SNAKE_CASE`                          | `QUESTION_THEME_FORM_ROW_SCHEMA`                |
| Schema type           | `PascalCase`                                | `QuestionThemeFormRow`                          |

---

## 12. Common pitfalls

### Forgetting `async`/`await`

Every Playwright interaction and assertion is async. Missing `await` causes flaky tests or silent failures:

```ts
// BAD — assertion not awaited
expect(locator).toBeVisible();

// GOOD
await expect(locator).toBeVisible();
```

### Not asserting visibility before interaction

Always check that an element is visible before clicking, filling, or hovering:

```ts
// BAD — may fail if element is not yet rendered
await locator.click();

// GOOD
await expect(locator).toBeVisible();
await locator.click();
```

### Using CSS selectors instead of role-based locators

Prefer `getByRole()` for accessibility and resilience:

```ts
// BAD
this.page.locator(".btn-primary");

// GOOD
this.page.getByRole("button", { name: "Create" });
```

### Not typing `this: GoatItWorld`

Every step function must explicitly type `this`:

```ts
// BAD — this.page is untyped
Given(/^.../u, async function (page) { ...
});

// GOOD
Given(/^.../u, async function (this: GoatItWorld, page: string) { ...
});
```

### Missing `/u` flag on regex patterns

All regex patterns must use the unicode flag:

```ts
// BAD
Given(/^the user is on (?<page>.+) page$/, ...);

// GOOD
Given(/^the user is on (?<page>.+) page$/u, ...);
```

### Creating new steps when generic ones exist

Check the generic steps table in [Section 10](#10-adding-new-features-step-by-step) before writing new steps. Most UI interactions are already covered.

### Using `assert` instead of Playwright's `expect`

```ts
// BAD
import { strict as assert } from "node:assert";

assert.strictEqual(text, "expected");

// GOOD
import { expect } from "@playwright/test";

await expect(locator).toHaveText("expected");
```

### Forgetting to use `.first()` for ambiguous locators

When multiple elements match (e.g., multiple close buttons in nested dialogs), use `.first()`:

```ts
const dialog = this.page.getByRole("dialog").first();
const closeButton = dialog.getByRole("button", { name: "Close" }).first();
```

### Using `no-await-in-loop` without proper disable comment

When sequential `await` in loops is required (e.g., iterating Playwright locators), use the standard disable format:

```ts
for (const row of rows) {
  // Acceptable as Playwright assertions require sequential evaluation
  // oxlint-disable-next-line eslint/no-await-in-loop
  await expect(errorText).toBeVisible();
}
```

### Creating a generic `<domain>.steps.helpers.ts` file

Never create a catch-all helpers file. Always split by step type:

```ts
// BAD — do not create
helpers / question - theme.steps.helpers.ts

// GOOD — one file per step type
helpers / question - theme.given - steps.helpers.ts
helpers / question - theme.when - steps.helpers.ts
```

If a helper is needed by multiple step types within the same domain, move it to `support/helpers/`.
