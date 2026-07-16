---
name: writing-plans
description: Use when you have a spec or requirements for a multi-step task, before touching code
---

# Writing Implementation Plans

Write comprehensive implementation plans from an approved spec. Bite-sized tasks (2-5 min steps) with complete code in every step. Assume the executor knows TypeScript but nothing about this codebase's conventions.

You're a senior engineer who knows the codebase's conventions and writes code that is simple, elegant, and reviewable. The produced plan should be executable by a junior engineer without further guidance.

**Save plans to:** `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## Skills to Load **(MANDATORY)**

- `unit-testing` — 5 Vitest projects, 100% coverage, faketories, mocks, naming conventions
- `acceptance-testing` — Cucumber + Playwright step definitions, DataTable schemas, tags
- `nuxt` — project structure, auto-imports, composables, server routes
- `nuxt-ui` — @nuxt/ui v4 components, Tailwind theming
- `vueuse` — @vueuse/core composables, browser API reactivity, state persistence

## Scope Check

If the spec covers multiple independent subsystems, stop and suggest breaking into separate plans — one per subsystem. Each plan should produce working, testable software on its own.

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for. This locks in decomposition decisions.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- Files that change together should live together. Split by responsibility, not by technical layer.
- Follow existing patterns. If a file has grown unwieldy, including a split in the plan is reasonable.

## Task Right-Sizing

A task is the smallest unit that carries its own test cycle and is worth a reviewer's gate. Fold setup, configuration, and scaffolding into the task whose deliverable needs them. Split only where a reviewer could meaningfully reject one task while approving its neighbor.

## Bite-Sized Task Granularity

Each step is one action (2-5 minutes). Pattern: "Write implementation" → "Write test" → "Run to verify pass."

If a task contains only types, interfaces, or constants, it may be a single step. If it contains logic, it must have a test step.

## Plan Document Header

Every plan MUST start with:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]

**Architecture:** [2-3 sentences]

**Tech Stack:** Nuxt 4, Vue 3, Pinia, @nuxt/ui v4, TypeScript

## Global Constraints

[Spec's project-wide requirements — one line each, verbatim from the spec.]

---
```

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `app/components/domain/<entity>/<Entity>Form.vue`
- Modify: `app/pages/<entity>/index.vue`
- Test: `app/pages/<entity>/index.spec.ts`

**Interfaces:**
- Consumes: [what this task uses from earlier tasks — exact signatures]
- Produces: [what later tasks rely on — exact function, parameter, return types]

- [ ] **Step 1: Write the implementation**

```vue
<!-- full implementation code -->
```

- [ ] **Step 2: Write the test**

```ts
// full test code (colocated *.spec.ts)
```

- [ ] **Step 3: Run test to verify it passes**

Run: `pnpm run test:unit path/to/file.spec.ts`
Expected: PASS
````

When acceptance (BDD) scenarios are part of the task, use `--tags`:

````markdown
- [ ] **Step 4: Run acceptance tests to verify it passes**

Run: `pnpm run test:acceptance --tags "@feature-tag"`
Expected: The tagged scenario passes
````

## No Placeholders

Every step must contain the actual content an engineer needs. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

## Remember

- Exact file paths always
- Complete code in every step — if a step changes code, show the code
- Exact commands with expected output
- Follow project conventions, don't invent them, scan the codebase for patterns if you need to
- DRY, YAGNI, you must write a senior engineer's code : simple and elegant

## Self-Review

After writing the complete plan, run this checklist:

1. **Spec coverage:** Skim each spec requirement. Can you point to a task that implements it? List any gaps.
2. **Placeholder scan:** Search the plan for any pattern from the "No Placeholders" section. Fix them.
3. **Type consistency:** Do the types, method signatures, and property names in later tasks match earlier tasks?
4. **Test coverage:** Every task with logic has explicit tests for its own files. Tasks with only types, interfaces, or constants may omit tests. No full `pnpm run test:unit:cov` run in any task. 100% coverage for files that have tests.

If you find issues, fix them inline. If a spec requirement has no task, add the task.

## Project-Specific Conventions

- **Components:** PascalCase `.vue` in `app/components/<domain|shared|layouts>/`
- **Composables:** `use*.ts` in `app/composables/<core|domain|ui>/<name>/`
- **Stores:** `<entity>.store.ts` in `app/stores/domain/<entity>/`
- **Repositories:** `<resource>.repository.ts` in `app/repositories/goat-it-api/<resource>/`
- **Server handlers:** `<resource>.<method>.handler.ts` in `server/api/.../handlers/`
- **Tests:** Colocated `*.spec.ts` — `describe(functionName, ...)` for functions, `describe("<ComponentName> Component", ...)` for components
- **Faketories:** `<entity>.<layer>.faketory.ts` in `tests/unit/utils/faketories/`
- **Mocks:** `<composable|repository>.mock.ts` triplet in `tests/unit/utils/mocks/`
- **Vitest projects:** 5 projects (nuxt, composables, stores, repositories, node) — pick the right one per source path
- **TypeScript:** No `any`, explicit return types, `import type { ... }` for type-only imports
- **No `console.log`:** Use `useAppToast` for UI feedback
- **i18n:** Assert keys, not translated strings. Texts must be translated into the six locales of this project.
- **Quality gates (NOT in plan steps — orchestrator runs them):** `lint:fix` → `typecheck` → `test:unit:cov` → `test:acceptance`
