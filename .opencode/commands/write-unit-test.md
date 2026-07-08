# Write unit test

## Task

Write a complete, passing unit test for the file specified in the prompt (or inferred from context).

## Instructions

### 1. Load the skill and reference

Before writing anything:

1. Load the `unit-testing` skill from `.agents/skills/unit-testing/SKILL.md`.
2. Read `docs/unit-testing.md` in full.

### 2. Identify the source file

If the user specified a file path, use it.
Otherwise, identify the source file that needs a test from context.

### 3. Determine the Vitest project and pattern

Use the decision tree in the skill to determine:

- Which **Vitest project** the spec file belongs to (`nuxt`, `composables`, `stores`, `repositories`, or `node`).
- Which **pattern** to follow for this file type.

### 4. Gather context

Before writing the test:

- Read the source file completely.
- Read any types, interfaces, or constants it imports.
- Check whether a faketory already exists for the domain types involved (look in `tests/unit/utils/faketories/`).
- Check whether mock files already exist for any dependencies (look in `tests/unit/utils/mocks/`).

### 5. Write the test

Follow these rules:

- Place the spec file colocated with the source (exceptions: layouts → `spec/` subfolder, i18n → `app/i18n/specs/`).
- Use the exact pattern from the skill for the file type.
- Describe label: pass the function/component reference directly (`describe(myFn, ...)`). Use a string only when no single symbol applies.
- Test names: `"should <action> when <condition>."` — always end with a period.
- Use `toHaveBeenCalledExactlyOnceWith(...)` for single-call assertions.
- Assert translation keys, not translated strings.
- Cover 100% of branches — truthy/falsy, empty/populated, success/error.
- Never use `any`. Use precise types and `toStrictEqual(value)`. If type can't be inferred, use `toStrictEqual<T>(value)` for example `toStrictEqual<QuestionTheme[]>([]);`

### 6. Create missing infrastructure if needed

If a required faketory or mock does not exist, create it following the patterns in `docs/unit-testing.md` sections 7 and 8 **before** writing the test.

If you create a new composable or repository mock setup file, also register it in `configs/vitest/vitest.config.constants.ts`.

### 7. Verify

Run the test:

```bash
pnpm run test:unit file.spec.ts
```

Fix any failures before proceeding.

Run coverage to confirm 100%:

```bash
pnpm run test:unit:cov
```

If coverage drops below 100%, add the missing test cases.

### 8. Lint

```bash
pnpm run lint:fix && pnpm run lint
```

Fix any lint errors.

### 9. Finish

Report:

- The spec file path created (or updated).
- Any new faketory or mock files created.
- The test count and a summary of what is covered.
- Confirmation that `test:unit` and `lint` pass.
