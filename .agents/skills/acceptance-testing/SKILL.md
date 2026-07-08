---
name: acceptance-testing
description: Use when writing or modifying acceptance tests in this project. Load this skill before creating any *.feature file or step definition. Covers Cucumber + Playwright patterns, step definitions, DataTable schemas, and infrastructure rules.
---

# Acceptance Testing

Full human-readable reference: `docs/acceptance-testing.md`
Read it for complete examples. This skill contains the non-negotiable rules and quick-reference tables.

---

## Step 0 — Before writing any acceptance test

1. Read `docs/acceptance-testing.md` in full.
2. Ensure the Docker sandbox is running: `docker compose -f docker/goat-it-api-sandbox/docker-compose.yml up -d`
3. Scan existing step definitions in `tests/acceptance/features/step-definitions/` for reusable steps.
4. Identify the **domain** and **action** for the feature.
5. After writing the test, run it: `pnpm run test:acceptance`

---

## Feature file rules

- **Location:** `tests/acceptance/features/<domain>[/<action>]/<feature-name>.feature`
- **Tags:** `@domain-page` for page-level features, `@domain` + `@domain-action` for action-specific features
- **Feature title:** Emoji prefix + description (e.g., `Feature: 🎨 Question Theme Creation`)
- **Scenario title:** Same emoji prefix + description
- **Scenario Outline:** Use for parameterized tests (accessibility viewport matrix)
- **Background:** Use when 3+ scenarios share identical initial Given steps (see below)
- **Accessibility:** Separate `*-accessibility.feature` file with light/dark + desktop/mobile matrix
- **DataTables:** Use for form inputs, expected data, and validation errors

### Background blocks

**Rule:** Use `Background:` when 3 or more scenarios in a feature share identical initial steps. For fewer than 3, repeat the steps — duplication is acceptable.

```gherkin
Background:
  Given the user is on question-themes page
  And a question theme exists with the following attributes:
    | label     | slug      | description       | aliases |
    | Geography | geography | A geography theme | geo     |

Scenario: ❓ First scenario
  And the user is on questions page
  ...
```

- Background runs before EACH scenario, not once per feature
- Scenarios can add more steps via `And` after the Background
- Keep Background minimal — only what applies to ALL scenarios

---

## Step definition rules

| Rule              | Detail                                                                                          |
|-------------------|-------------------------------------------------------------------------------------------------|
| File naming       | `<domain>.<step-type>-steps.ts` (given, when, then)                                             |
| World typing      | `this: GoatItWorld` on every step function                                                      |
| Regex pattern     | Named capture groups + `/u` flag always                                                         |
| Imports           | `Given`/`When`/`Then` from `@cucumber/cucumber`, `expect` from `@playwright/test`               |
| Helpers           | Extract to `helpers/<domain>.<step-type>-steps.helpers.ts` (one file per step type, never shared) |
| Cross-step helpers | Move to `support/helpers/` if used by multiple step types                                       |
| Constants         | Shared patterns in `<domain>.steps.constants.ts`                                                |
| DataTable schemas | Zod `strictObject` in `datatables/<domain>.datatables.schemas.ts`                               |
| Sub-feature steps | Group in subdirectory within domain (e.g., `question/source-url-tag/`)                          |

### Helper placement rules

| Scenario                          | Location                                                  |
|-----------------------------------|-----------------------------------------------------------|
| Used by ONE step type only        | `step-definitions/<domain>/helpers/<domain>.<step-type>-steps.helpers.ts` |
| Used by MULTIPLE step types       | `support/helpers/<domain>.helpers.ts`                     |

**Never** create `<domain>.steps.helpers.ts` (without step-type). Always split per step type or move to support.

### Step function template

```ts
import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user does something with "(?<param>[^"]*)"$/u,
  async function(this: GoatItWorld, param: string): Promise<void> {
    const locator = this.page.getByRole("button", { name: param });
    await expect(locator).toBeVisible();
    await locator.click();
  },
);
```

### DataTable step template

```ts
import { When } from "@cucumber/cucumber";
import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { validateDataTableAndGetFirstRow } from "#acceptance/features/support/helpers/datatable.helpers.ts";
import { MY_SCHEMA } from "#acceptance/features/step-definitions/my-domain/datatables/my-domain.datatables.schemas.ts";

When(
  /^the user fills the form with:$/u,
  async function(this: GoatItWorld, dataTable: DataTable): Promise<void> {
    const row = validateDataTableAndGetFirstRow(dataTable, MY_SCHEMA);
    // use row fields...
  },
);
```

---

## DataTable patterns

### Schema template

```ts
import { z } from "zod";
import { zCoerceOptionalString } from "#acceptance/features/support/helpers/datatable.helpers.ts";

const MY_DOMAIN_FORM_ROW_SCHEMA = z.strictObject({
  requiredField: z.string(),
  optionalField: zCoerceOptionalString(),
});

type MyDomainFormRow = z.infer<typeof MY_DOMAIN_FORM_ROW_SCHEMA>;

export { MY_DOMAIN_FORM_ROW_SCHEMA };
export type { MyDomainFormRow };
```

### Rules

- Always use `z.strictObject()` — catches unexpected columns
- Use `zCoerceOptionalString()` for columns that may be empty or absent
- Export both schema (`UPPER_SNAKE_CASE`) and inferred type (`PascalCase`)
- One schema file per domain: `datatables/<domain>.datatables.schemas.ts`

---

## Available generic steps (reuse before writing new)

| Domain          | Given            | When                                         | Then                                                     |
|-----------------|------------------|----------------------------------------------|----------------------------------------------------------|
| `navigation`    | Navigate to page | Reload page                                  | Assert current page URL, assert new tab URL              |
| `element`       | —                | Click, hover, scroll (by role + name)        | Visible, hidden, disabled, enabled (by role + name)      |
| `form`          | —                | Fill input, clear input (by accessible name) | —                                                        |
| `keyboard`      | —                | Press any key                                | —                                                        |
| `text`          | —                | Click on text                                | Text visible/hidden                                      |
| `toast`         | —                | —                                            | Toast with text visible (scoped to notification region)  |
| `modal`         | —                | Close modal (header or footer button)        | —                                                        |
| `locale`        | —                | Switch locale                                | Locale completion status                                 |
| `color-mode`    | —                | Switch to dark mode                          | —                                                        |
| `accessibility` | —                | —                                            | Page has no a11y issues (desktop/mobile)                 |

---

## Playwright locator preference

1. `getByRole()` — first choice for all elements
2. `getByTestId()` — when role-based is ambiguous
3. `getByText()` — for text content
4. CSS selectors — avoid

---

## Adding a new domain (checklist)

- [ ] Feature file created in `tests/acceptance/features/<domain>[/<action>]/` (action directory optional)
- [ ] Tags added (`@domain-page` for page-level, `@domain` + `@domain-action` for actions)
- [ ] Feature and Scenario titles use emoji prefix
- [ ] Scenarios use existing generic steps where possible
- [ ] Background blocks used where 3+ scenarios share identical initial steps
- [ ] Accessibility feature file created with light/dark + desktop/mobile matrix
- [ ] New step definition files follow `<domain>.<type>-steps.ts` naming
- [ ] Sub-feature steps grouped in subdirectory when applicable
- [ ] `this: GoatItWorld` typed on every step function
- [ ] Regex patterns use named capture groups + `/u` flag
- [ ] Helpers extracted per step type (never shared `<domain>.steps.helpers.ts`)
- [ ] Cross-step helpers placed in `support/helpers/`
- [ ] DataTable schemas use `z.strictObject()` + `zCoerceOptionalString()`
- [ ] Tests pass: `pnpm run test:acceptance`

---

## Common pitfalls

- Missing `await` on Playwright assertions → flaky or silently passing tests
- Not asserting visibility before interacting → element not yet rendered
- Using CSS selectors instead of `getByRole()` → fragile, not accessible
- Missing `this: GoatItWorld` typing → `this.page` is untyped
- Missing `/u` flag on regex → lint error
- Creating new steps when generic ones exist → duplication
- Using `assert` instead of Playwright's `expect` → wrong assertion library
- Missing `.first()` for ambiguous locators → Playwright strict mode error
- Missing lint disable comment for `no-await-in-loop` in Playwright loops
- Not scoping toast assertions to notification container → overlaps with generic text step
- Putting cross-step helpers in domain helper files → violates step-type separation rule
