# Write acceptance test

## Task

Write a complete, passing acceptance test for the page or feature specified in the prompt (or inferred from context).

## Instructions

### 1. Load the skill and reference

Before writing anything:

1. Load the `acceptance-testing` skill from `.agents/skills/acceptance-testing/SKILL.md`.
2. Read `docs/acceptance-testing.md` in full.

### 2. Identify the target

If the user specified a page or feature, use it.
Otherwise, identify the page or feature that needs acceptance tests from context.

Determine:
- The **domain** (e.g., `question-themes`, `home`, `questions`)
- The **action** (e.g., `creation`, `modification`, `archive`, or none for page-level tests)

### 3. Scan existing steps for reuse

Before writing any new step definitions:

- Read all files in `tests/acceptance/features/step-definitions/` to catalog available steps.
- Prioritize reusing generic steps (`navigation`, `element`, `form`, `keyboard`, `text`, `toast`, `modal`, `locale`, `color-mode`, `accessibility`).
- Only create new domain-specific steps when existing ones cannot cover the need.

### 4. Write the feature file

- Create in `tests/acceptance/features/<domain>/<action>/` (or `tests/acceptance/features/<domain>/` for page-level tests)
- Add appropriate tags: `@domain` + `@domain-action`
- Use emoji prefix on Feature and Scenario titles
- Write scenarios covering:
  - Happy path (main functionality)
  - Validation errors (if forms are involved)
  - Edge cases (empty states, modal close without action)
- Use DataTables for form inputs, expected outputs, and validation errors

### 5. Write the accessibility feature file

If the feature has a UI (page, modal, form):

- Create `*-accessibility.feature` alongside the main feature
- Include Scenario Outlines for the full matrix:
  - Light mode: desktop + mobile
  - Dark mode: desktop + mobile
- Use the generic `accessibility` and `color-mode` steps

### 6. Write new step definitions (only if needed)

Follow these rules:
- File naming: `<domain>.<type>-steps.ts` (`given`, `when`, `then`)
- Always type `this: GoatItWorld`
- Regex with named capture groups + `/u` flag
- Import `Given`/`When`/`Then` from `@cucumber/cucumber`
- Import `expect` from `@playwright/test`

### 7. Write helpers (if step logic is complex)

- Extract to `helpers/<domain>.<type>-steps.helpers.ts`
- Pass `Page` or `Locator` as parameters, not `this`

### 8. Write DataTable schemas (if DataTables are used)

- Create `datatables/<domain>.datatables.schemas.ts`
- Use `z.strictObject()` + `zCoerceOptionalString()`
- Export schema constant and inferred type

### 9. Verify

Run acceptance tests:

```bash
pnpm run test:acceptance
```

If tests fail, fix issues and re-run until they pass.

### 10. Finish

Report:

- Feature file(s) path and scenario count
- Accessibility feature file path (if created)
- New step definition files (if any)
- New helper files (if any)
- New DataTable schema files (if any)
- Reused generic steps (list which ones)
- Test run result (pass/fail)
