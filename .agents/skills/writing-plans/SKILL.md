---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Implementation Plans

Write comprehensive implementation plans as bite-sized tasks (2-5 minutes each) with full code in every step. No TDD red-green-refactor — use `implementation → test → verify` per step. Assume the implementer is a skilled developer who knows TypeScript/Vitest but needs exact file paths, complete code, and project conventions.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## Skills to Load (MANDATORY)

Load these project-specific skills before writing:

- `unit-testing` — 5 Vitest projects, faketories, mocks, 100% coverage
- `acceptance-testing` — Cucumber + Playwright, `--tags` scoping
- `nuxt` — Nuxt 4 routing, composables, server routes, auto-imports
- `nuxt-ui` — @nuxt/ui v4 components
- `vueuse` — Check before writing custom composables

You're a senior engineer who knows the codebase's conventions from `AGENTS.md`. Reference it for file naming, store patterns, repository structure, i18n rules, and import aliases.

## Scope Check

If the spec covers multiple independent subsystems, suggest breaking this into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- Prefer smaller, focused files over large ones that do too much.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns from neighboring files.
- Nuxt file conventions: PascalCase components in `app/components/<domain|shared|layouts>/`, `use*` composables in `app/composables/<core|domain|ui>/<name>/`, Pinia stores in `app/stores/domain/<entity>/`, repositories in `app/repositories/goat-it-api/<resource>/`, server handlers in `server/api/.../handlers/`.

This structure informs the task decomposition. Each task should produce self-contained changes that make sense independently.

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a fresh reviewer's gate. Fold setup, configuration, scaffolding, and documentation steps into the task whose deliverable needs them. Each task ends with an independently testable deliverable.

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**
- Implementation step (write the code)
- Test step (write the test)
- Verify step (run tests and verify pass)
- Commit step

## Plan Document Header

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** Nuxt 4 + Vue 3 + Pinia + @nuxt/ui v4 + Vitest + Cucumber/Playwright

## Global Constraints

[The spec's project-wide requirements — version floors, dependency limits,
naming and copy rules, platform requirements — one line each, with exact
values copied verbatim from the spec. Every task's requirements implicitly
include this section.]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.spec.ts`

**Interfaces:**
- Consumes: [what this task uses from earlier tasks — exact signatures]
- Produces: [what later tasks rely on — exact function names, parameter
  and return types]

- [ ] **Step 1: Write implementation**

```typescript
export function myFunction(input: string): string {
  return input.toUpperCase()
}
```

- [ ] **Step 2: Write test**

```typescript
import { describe, expect, it } from 'vitest'
import { myFunction } from './my-function'

describe(myFunction, () => {
  it('should return uppercase string when given lowercase input.', () => {
    const result = myFunction('hello')
    expect(result).toBe('HELLO')
  })
})
```

- [ ] **Step 3: Run test to verify it passes**

Run: `pnpm run test:unit path/to/test.spec.ts`
Expected: PASS

When acceptance (BDD) scenarios are part of the task, use `--tags`:
Run: `pnpm run test:acceptance --tags "@feature-tag"`
Expected: The tagged scenario passes

- [ ] **Step 4: Commit**

```bash
git add tests/path/test.spec.ts src/path/file.ts
git commit -m "feat: add specific feature"
```
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — the engineer may be reading tasks out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Remember
- Exact file paths always
- Complete code in every step — if a step changes code, show the code
- Exact commands with expected output
- DRY, YAGNI, frequent commits (no TDD pattern)

## Self-Review

After writing the complete plan, look at the spec with fresh eyes and check the plan against it:

1. **Spec coverage:** Skim each section/requirement in the spec. Can you point to a task that implements it? List any gaps.
2. **Placeholder scan:** Search your plan for red flags — any of the patterns from "No Placeholders" above. Fix them.
3. **Type consistency:** Do the types, method signatures, and property names you used in later tasks match what you defined in earlier tasks?
4. **Quality gates:** Ensure no task runs the full `test:unit:cov` or full suite (orchestrator handles that). Tasks should use focused `pnpm run test:unit <path>`.

If you find issues, fix them inline. No need to re-review — just fix and move on. If you find a spec requirement with no task, add the task.

## Project-Specific Conventions (summary)

See `AGENTS.md` for the canonical reference. Key points for plan writing:
- Components: PascalCase `.vue` in `app/components/<domain|shared|layouts>/`
- Composables: `use*.ts` in `app/composables/<core|domain|ui>/<name>/`
- Stores: `<entity>.store.ts` in `app/stores/domain/<entity>/`, store ID from `StoreNames` enum
- Repositories: `<resource>.repository.ts` in `app/repositories/goat-it-api/<resource>/`
- Server handlers: `<resource>.<method>.handler.ts` in `server/api/.../handlers/`
- Tests: `*.spec.ts` colocated with source
- Faketories: `<entity>.<layer>.faketory.ts` in `tests/unit/utils/faketories/`
- Mocks: `<composable|repository>.mock.ts` triplet
- i18n: keys in `fr/` first, all 6 locales populated, no hardcoded strings
- TypeScript: `any` is forbidden; use `unknown` + narrowing
- No `console.log` in production; use `useAppToast` for user-facing messages
- 100% test coverage (line, branch, function)
- Import aliases: `@/`/`~/` → `app/`, `~~/` → repo root, `#shared/` → `shared/`
