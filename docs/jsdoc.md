# JSDoc Guide

This document defines where JSDoc is required in this repository, what it must say, and what it must not say.
It exists so that IDE hovers, code review, and onboarding describe the parts of a contract that TypeScript cannot express:
side effects, lifecycle, invariants, failure behavior, units, and fallbacks.

For file placement and dependency direction, see [`docs/architecture.md`](architecture.md).
For test conventions, see [`docs/unit-testing.md`](unit-testing.md).

---

## 1. Scope

JSDoc is required on the **public logic APIs** listed below.
Scaffolding, framework entrypoints, tests, and presentation contracts are intentionally out of scope.

| Surface | Files | Required blocks |
|---|---|---|
| Composable | `app/composables/**/use[A-Z]*.ts` (excluding specs) | Function block |
| Composable type | `app/composables/**/use-*.types.ts` | Return-type summary; non-obvious members |
| Composable helper | `app/composables/**/helpers/**/*.helpers.ts` | Every exported function |
| Composable helper type | `app/composables/**/helpers/**/*.types.ts` | Type block; non-obvious fields |
| Store | `app/stores/**/*.store.ts` | Store block; every action; every exposed state/getter |
| Store type | `app/stores/**/*.types.ts` | Type block; non-obvious fields |
| Repository | `app/repositories/**/*.repository.ts` | Factory block; method signatures |
| Server helper | `server/utils/**/*.helpers.ts` | Every exported function |
| Server mapper | `server/utils/**/*.mappers.ts` | Every exported mapper |
| Server domain type | `server/utils/**/*.types.ts` | Type block; non-obvious fields |
| Shared helper | `shared/utils/**/*.helpers.ts` | Every exported function |
| App helper | `app/utils/**/*.helpers.ts` | Every exported function |
| Shared type | `shared/types/**/*.types.ts` | Type block; non-obvious fields |
| App logic type | `app/utils/**/*.types.ts` | Type block; non-obvious fields |

Exported trivial predicates still get a one-line block.
Composable return types get the one-line summary described in §2; `*Options` aliases may rely on their member docs.
Keep every block factual and do not invent meaning.

### Not documented in this pass

- Component prop/emit/slot/exposed contracts (`app/components/**/*.types.ts`).
- Server handlers, middleware, and Nitro plugins.
- Pages, layouts, `nuxt.config.ts`, `content.config.ts`, `app.config.ts`, `app/config/*.config.ts`.
- i18n resources, unit/acceptance tests, faketories, mocks, and setup files.
- Exported constants and enums unless a future decision explicitly adds them.
- Private helper functions: do not add blocks in this pass; existing blocks for genuinely non-obvious behavior may stay.

---

## 2. Style: concise TSDoc

- Place the block immediately above the declaration it documents.
- Start with a one-sentence summary in the present tense, ending with a period.
- Leave one blank line between the summary and any additional paragraph.
- Document **semantics**, not syntax. If the name and type already say it, do not repeat it.
- Use tags only when they add information:

| Tag        | When to use                                                                 |
|------------|-----------------------------------------------------------------------------|
| `@param`   | Only for non-obvious parameters (units, constraints, side effects, defaults) |
| `@returns` | Only when the meaning of the result is not obvious from the signature        |
| `@throws`  | On functions that throw; describe when and what the caller must handle      |
| `@remarks` | Invariants, lifecycle, SSR/client constraints, mutation boundaries          |
| `@example` | Only on the few APIs whose wiring is not obvious from the signature         |
| `@see`     | Cross-links to related docs or APIs                                         |

- Never put types in tags (`@param {string}`, `@returns {number}`). TypeScript already carries them.
- Do not use `@author`, `@since`, `@file`, `@type`, or decorative separators.
- Keep every line within the 150-character project limit.
- In `.types.ts`, document non-obvious members on the line directly above the member.
  Use `@default` only when the default value matters to the caller.
- Give each exported composable return type a one-line summary.
  `*Options` aliases may omit it when the name and member docs already explain the contract.
- For composables, the function block describes purpose, side effects, and lifecycle.
  The option and return members are documented once, in the colocated `.types.ts` — do not duplicate them in the function block.
- For stores, each action describes the state change, persistence, and result. Omit `@param` when the parameter is self-describing.
- For repositories, the factory documents the injected `$Fetch` dependency;
  each method documents the internal route it calls and any parameter constraints.
- For server helpers, describe security-sensitive behavior and use `@throws` when the helper never returns.
- For shared and app helpers, describe fallbacks, sentinels, and domain rules that the implementation encodes.

---

## 3. Examples

### Composable and its types

```ts
/**
 * Tracks the lifecycle of an async operation and always resolves to a
 * discriminated result instead of throwing.
 *
 * @example
 * const { execute, isPending } = useAsyncAction(fetchQuestions);
 * const result = await execute();
 * if (!result.ok) {
 *   // Surface `result.error`
 * }
 */
function useAsyncAction<TResult, TArguments extends unknown[] = []>(
  action: (...arguments_: TArguments) => Promise<TResult>,
  onError?: (error: unknown) => void,
): UseAsyncAction<TResult, TArguments> {
```

```ts
/**
 * Contract returned by `useAsyncAction`: the executable and its lifecycle flags.
 */
type UseAsyncAction<TResult, TArguments extends unknown[]> = {
  /** Executes the wrapped action; never rejects. */
  execute: (...arguments_: TArguments) => Promise<AsyncResult<TResult>>;
  /** True while the wrapped action is in flight. */
  isPending: ComputedRef<boolean>;
};
```

### Store action

```ts
/**
 * Persists the adult-content preference to the settings cookie.
 *
 * Consumers must use this action instead of mutating `settings`.
 */
function setAdultContentEnabled(value: boolean): void {
```

### Repository factory

```ts
type QuestionsRepository = (fetch: $Fetch) => {
  /** Fetches questions by id through `GET /api/goat-it-api/questions`. */
  getByIds: (ids: string[]) => Promise<Question[]>;
};

/**
 * Creates the repository for the internal question proxy routes.
 *
 * @param fetch - Request-aware fetch instance, usually `useRequestFetch()`.
 */
export const questionsRepository: QuestionsRepository = (fetch: $Fetch) => ({
  async getByIds(ids: string[]): Promise<Question[]> {
```

### Server helper with a failure contract

```ts
/**
 * Converts an upstream failure into a sanitized proxy error.
 *
 * Upstream 401/403 responses become 502 and their messages are never forwarded.
 *
 * @throws Always; the caller must not rely on a return value.
 */
function throwGoatItApiError(error: unknown): never {
```

### Shared helper with fallback semantics

```ts
/**
 * Reconciles saved theme ids with the active catalog.
 *
 * Returns `undefined` when no theme filter should be sent, the saved ids when
 * they still intersect the catalog, and all active ids when the saved selection
 * is stale or empty.
 */
function resolveSelectedThemeIds(savedThemeIds: readonly string[] | undefined, activeThemeIds: readonly string[]): string[] | undefined {
```

---

## 4. Anti-patterns

```ts
/** Fetches questions. */
function fetchQuestions(): void {
```

Restates the name. Document the non-obvious part instead: which endpoint, which failure behavior, which cache policy.

```ts
/**
 * @param {string} id - The id.
 * @returns {Question} The question.
 */
```

Duplicates the type system and adds no information. Remove the tags or replace them with semantics.

```ts
// This function fetches the questions and maps them.
```

Plain source comments are forbidden. Use JSDoc on a public surface, or say nothing.
Inline comments inside an `@example` code sample are part of the sample and are allowed.

```ts
/**
 * Fetches questions.
 */
type UseQuestions = {
  /** Fetches questions. */
  fetchQuestions: () => Promise<Question[]>;
};
```

Repeating the same sentence in the composable block and its type file. State each fact once, in the place the reader will look first.

---

## 5. Enforcement and review

Oxlint validates the shape of every JSDoc block through its `jsdoc` plugin:
tag and property names, blank blocks, and missing descriptions on `@param`, `@returns`, `@throws`, and `@yields` tags.
`@remarks` is enabled through `definedTags` in `oxlint.config.jsonc`;
if `check-tag-names` rejects another standard tag, add it there.
The same quality rules apply to pre-existing blocks in tests and other out-of-scope files;
fix malformed tags when `pnpm run lint:oxlint` surfaces them.
Presence is enforced by review, not by a `require-jsdoc` rule: oxlint has no presence rule, so an undocumented export will not fail the gate.
If a hard gate is wanted later, use `eslint-plugin-jsdoc`'s `require-jsdoc` or a custom check.
See `oxlint.config.jsonc` for the exact rule list.

Before requesting review, confirm:

- [ ] Every function surface has a block; every composable return type has a one-line summary; `*Options` aliases may rely on member docs.
- [ ] Every non-trivial block adds semantics; trivial predicates are allowed a factual one-liner.
- [ ] No `{Type}` annotations, no `@author`/`@since`/`@file`, and no plain `//` comments outside `@example` samples.
- [ ] No duplicated sentences between a composable block and its `.types.ts` members.
- [ ] `pnpm run lint:oxlint` passes.
