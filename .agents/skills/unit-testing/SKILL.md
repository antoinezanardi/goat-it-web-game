---
name: unit-testing
description: Use when writing or modifying unit tests in this project. Load this skill before creating any *.spec.ts file. Covers all five Vitest projects, mock patterns, faketories, composable/store/repository test wiring, and coverage requirements.
---

# Unit Testing

Full human-readable reference: `docs/unit-testing.md`
Read it for complete examples. This skill contains the non-negotiable rules and decision trees.
The command `.opencode/commands/lint-unit-tests.md` is the **final audit checklist** — its rule
tags (`[U*]`, `[C*]`, `[P*]`, `[L*]`, `[W*]`, `[CO*]`, `[S*]`, `[R*]`, `[H*]`, `[N*]`, `[T*]`)
are mirrored below so anything written per this skill passes that audit.

---

## Step 0 — Before writing any test

1. Read `docs/unit-testing.md` in full.
2. Identify the **file type** of the source file under test (component, page, layout, composable, store, repository, server handler, server util/mapper/helper, shared helper, i18n translation).
3. Determine the **Vitest project** from the table below.
4. Follow the exact pattern for that file type — no shortcuts.
5. After writing the test, run it: `pnpm run test:unit file.spec.ts`
6. Run coverage to confirm 100%: `pnpm run test:unit:cov`

---

## Vitest project decision tree

| Source file path                                                                | Spec suffix                               | Project        |
|---------------------------------------------------------------------------------|-------------------------------------------|----------------|
| `app/composables/**/*.ts` (excluding helpers/mappers)                           | `.spec.ts`                                | `composables`  |
| `app/**/*.store.ts`                                                             | `.store.spec.ts`                          | `stores`       |
| `app/**/*.repository.ts`                                                        | `.repository.spec.ts`                     | `repositories` |
| `app/**/*.{mappers,helpers,translations}.ts`                                    | `.{mappers,helpers,translations}.spec.ts` | `node`         |
| `server/**/*.{mappers,helpers}.ts`                                              | `.{mappers,helpers}.spec.ts`              | `node`         |
| `shared/**/*.{mappers,helpers}.ts`                                              | `.{mappers,helpers}.spec.ts`              | `node`         |
| Everything else in `app/`, `server/`, `shared/` that does not match a row above | `.spec.ts`                                | `nuxt`         |

The `repositories` and `node` projects have **no Nuxt environment**. No `mountSuspended`, no `mockNuxtImport`, no global `$fetch`.

### Setup files loaded per project

Counts reflect `configs/vitest/vitest.config.constants.ts` — scan it for the authoritative lists (they grow over time).

| Project        | Environment | Setup files                                                                                              |
|----------------|-------------|----------------------------------------------------------------------------------------------------------|
| `nuxt`         | `nuxt`      | 15 base setups + 9 composable mocks + 2 repo mocks                                                       |
| `composables`  | `nuxt`      | 15 base setups + 2 repo mocks (NO composable mocks — tests exercise real composables)                    |
| `stores`       | `nuxt`      | 15 base setups + 9 composable mocks + 2 repo mocks + `stores.nuxt.unit-setup.ts`                         |
| `repositories` | Node        | `dates.nuxt.unit-setup.ts` only                                                                          |
| `node`         | Node        | `dates.nuxt.unit-setup.ts` + `tests/unit/setup/node/` (`nitro-auto-imports.node.unit-setup.ts`, `h3.node.unit-setup.ts`) |

---

## Non-negotiable rules

### Coverage

- 100% threshold on all metrics — no exceptions.
- Every branch (truthy/falsy), every error path, every empty/non-empty array case must be covered.

### Explicit vitest imports [U2]

- `describe`, `it`, `expect`, `vi`, … imported from `"vitest"` in every test file. No reliance on globals.

### Spec location & naming [U1]

- Colocated as `SourceFile.spec.ts`. Exceptions: layouts → `app/layouts/<Layout>/spec/`; i18n → `app/i18n/specs/`.

### Describe labels [U3]

- **Components:** string `"<Name> Component"` — never a direct reference: `describe("MyComponent Component", ...)`.
- **Pages:** string `"<Name> Page"` — e.g. `describe("Home Page", ...)`.
- **Layouts:** string `"<Name> Layout"` — e.g. `describe("DefaultLayout Layout", ...)`.
- **Server handlers:** two-level describe — outer string `"Server Goat It API <Resource> <Method> Handler"`, inner `describe(handlerFn, ...)` with the function reference.
- **Functions / composables / stores / repositories:** pass the symbol reference directly (`describe(myFn, ...)`); free-form string only when no single symbol represents the subject.
- Never a direct component/page/layout reference; never a free-form grouping string wrapping symbol describes.

### Test names

- Pattern: `"should <action> when <condition>."` — always end with a period. Enforced mechanically by `vitest/valid-title` regex.

### Single-call assertions [U4]

- Always use `toHaveBeenCalledExactlyOnceWith(...)` — never combine `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(...)`.

### Error swallowing [U5]

- No `.catch(() => null)` anywhere. Use try/catch with `void error` when asserting side effects of throwing code.

### Translation keys [U6]

- `$t` returns the key as-is. Assert the translation key string, never translated text.

### Type safety [U7]

- No `any`; unsafe assertions need the two-line disable comment — except the accepted cast patterns listed in `docs/unit-testing.md` §10 (documented-example casts, DOM element casts, mock-shape casts, server-helper narrowing, repository shape casts).

### Parameterized tests [U10]

- Pure input duplicates of identical logic must merge into `it.each` — always typed (`it.each<T>([...])`).
- Semantically different conditions/edge cases stay separate tests.

### Positional lookups [U11]

- Never index into `findAllComponents({ name: "..." })` when multiple siblings exist. Address instances via dynamic `data-testid` selectors typed as `findComponent<typeof Component>("[data-testid='…']")`; pin sibling order via a single assertion over the ordered testid list. Count-only usage without indexing is fine.

### Dynamic imports in composable and store tests

- Composable/store under test imported with `await import(...)` inside `beforeEach` whenever it has mocked dependencies (Patterns A/B) — never at top level. This guarantees each test evaluates against that test's freshly created mocks.
- **Exception (Pattern C):** zero-dependency composables may use a static top-level import.

### Test worthiness [W1–W6] (components, pages, layouts)

A worthy test pins behaviour that can vary; an unworthy test pins markup constants. See `docs/unit-testing.md` §6.11.

- **Worthy:** branches (both sides of every `v-if`/`v-else-if`/`v-else`/`v-show`, ternaries and short-circuits in template expressions, function-driven rendering like `{{ formatX(...) }}`, loading/empty/populated/error states) · child-component presence (every child Vue component asserted present ≥once, even unconditionally rendered) · emits with payload · `:`-bound child props via `.props()` (`.attributes()` fallback acceptable when `.props()` is impossible) · every `$t()`/`$tc()` asserted by key (even static) · icons via icon prop (even static) · links via `to` prop (even static) · named slots · reactive updates with `await nextTick()`.
- **Unworthy — asserting these is a violation:** static Tailwind classes never touched by a binding; unbound static props/attributes (`variant="subtle"`, `color="neutral"`); markup constants that cannot vary with props/watch/computed/emits.

### Accepted patterns — do NOT flag or "fix"

- `.attributes()` fallback where `.props()` is impractical (prop falls through to a stub/native element).
- Count-only `findAllComponents({ name: "..." })` without positional indexing.
- `getWrapperVm<T>` asserting derived computed values when rendered output is not observable in happy-dom.
- Environment-coupled server helper specs stubbing `useRuntimeConfig` / h3 globals.

### ESLint-enforced constraints

Enforced by `configs/eslint/flat-configs/eslint-unit-tests.config.ts` (source of truth):

- `vitest/max-expects: 1` — **at most ONE `expect()` call per test body**; split scenarios into separate tests.
- `vitest/require-top-level-describe` — no top-level `it`.
- `vitest/valid-title` — names must match `/^should .+ when .+\S\.$/`.
- `vitest/consistent-each-for` — prefer `it.each` forms.
- `vitest/hoisted-apis-on-top` + `require-hook` (with `mockNuxtImport` whitelisted).

---

## Per-type checklist

Tags match `.opencode/commands/lint-unit-tests.md` §4.

### Component ([C1]–[C8])

- [ ] [C1] Import from `#components`. Exceptions: `App.vue` and `OgImage.takumi.vue` direct path
- [ ] [C2] `describe("<Name> Component", ...)` — string label
- [ ] [C3] Typed default-props const at top of describe before mount helper — **required when ≥1 prop even optional**; prefer `as const`, omit only if readonly mismatch prevents compilation
- [ ] [C4] Mount helper: `async function mountXxx(options: MountSuspendedOptions<typeof Xxx> = {})`, options spread after defaults
- [ ] [C5] No `shallow: true` (exception: `App.vue`)
- [ ] [C6] With a store: `createTestingPinia()` plugin, then `mockStore(useXxxStore)` strictly after `mountSuspended`
- [ ] [C7] Shared wrapper lifecycle: module-level `let wrapper`, assigned by the mount helper in `beforeEach`
- [ ] [C8] VM access only via `getWrapperVm<T>` + local type extending `ComponentVm`; never cast wrapper for `setupState`; instance proxy unwraps refs — type ref members as inner values
- [ ] First test: `"should render <Name> when mounted."` asserting `wrapper.exists()` [W3]
- [ ] Every source `data-testid` asserted present ≥once [W4]; every icon via icon prop even static [W5]; every link `to` even static [W6]
- [ ] Assert translation keys [U6]; dynamically-bound props only; no unworthy assertions [W1]; i18n keys covered [W2]
- [ ] Nested thematic describes allowed ("Close button" → "Label")

### Page ([P1]–[P7])

- [ ] [P1] Direct import: `import XxxPage from "@/pages/....vue"`
- [ ] [P2] `shallow: true` in mount helper defaults
- [ ] [P3] String label `"<PageName> Page"`
- [ ] [P4] `definePageMeta` asserted when the page defines metadata
- [ ] [P5] `useHead` via extraction pattern `vi.mocked(useHead).mock.calls[0]?.[0]` + call — assert through `useHead` even when `useSeoMeta` also mocked (established pattern)
- [ ] [P6] Mount helper signature same as components
- [ ] [P7] Shared wrapper lifecycle same as [C7]
- [ ] Worthiness checks [W1]–[W6] apply

### Layout ([L1]–[L5])

- [ ] [L1] Spec in `app/layouts/<Layout>/spec/<Layout>.spec.ts`
- [ ] [L2] Direct path import
- [ ] [L3] String label `"<LayoutName> Layout"`
- [ ] [L4] `shallow: true`
- [ ] [L5] Shared wrapper lifecycle same as [C7]
- [ ] Worthiness checks [W1]–[W6] apply

### Composable ([CO1]–[CO5])

- [ ] [CO1] Dynamic import in `beforeEach` whenever dependencies exist (Patterns A/B); static import only for zero-dependency Pattern C
- [ ] [CO2] `import type { useFoo as UseFooType }` + module-level `let useFoo: typeof UseFooType`
- [ ] [CO3] Each mocked dependency declared at module level with `mockNuxtImport(...)` factory
- [ ] [CO4] Mocks recreated before the dynamic composable import in `beforeEach`
- [ ] [CO5] Harness mounting a store-using component: `createTestingPinia()` first, `mockStore(useXxxStore)` after the mount call
- [ ] Test every returned ref, computed, and function

### Store ([S1]–[S5])

- [ ] [S1] `capturedAction` / `capturedOnError` captured through `mockNuxtImport("useAsyncAction", ...)`
- [ ] [S2] Captured vars reset to `undefined` at top of each `beforeEach`; multi-action stores reset call counter to `0`
- [ ] [S3] Store dynamically imported inside `beforeEach`
- [ ] [S4] No manual `setActivePinia(createPinia())` (runs automatically)
- [ ] [S5] Multi-call stores use a counter returning distinct mock instances per invocation
- [ ] Assert `capturedAction` with `toBe(repository($fetch).method)`; error callback triggers `useAppToast().addErrorToast` with i18n key; mutate `useAsyncActionMock.fetchStatus.value` for reactive getters

### Repository ([R1]–[R5])

- [ ] [R1] No Nuxt mocks — plain Node patterns only
- [ ] [R2] `describe(myRepository, ...)` symbol form
- [ ] [R3] `fetchMock = vi.fn<$Fetch>()` in `beforeEach`; passed cast as `$Fetch`
- [ ] [R4] Top-level shape test: `toStrictEqual({ getAll: expect.any(Function), ... })`
- [ ] [R5] Each method tests endpoint, HTTP options, return value; parametrized methods test interpolated URLs; `toStrictEqual<T>(value)` when type not inferable

### Server handler ([H1]–[H7])

- [ ] [H1] `vi.mock(import("#server/utils/..."))` — `import()` expression form, module level
- [ ] [H2] Two-level describe: outer string label + inner `describe(handlerFn, ...)`
- [ ] [H3] `vi.mocked($fetch).mockResolvedValue/mockRejectedValue` — never re-mocked from scratch
- [ ] [H4] Zod path: `ZodError` thrown for invalid API data
- [ ] [H5] Throw side-effects via try/catch + `void error` — never `.catch(() => null)`
- [ ] [H6] Status codes from `HttpStatusCode` enum (`#server/utils/http/http.enums`)
- [ ] [H7] Params assert `getRouterParam(event, "id")`; bodies assert `readBody(event)`; `createGoatItApiFetchOptions` asserted with `(event)`; runtime config carries `gameKey: "test-game-key"` as `goat-it-api-key` header

### Server util / mapper / helper ([N1]–[N2])

- [ ] [N1] Pure tests — no mocking of unit or collaborators. Exceptions: time-control utilities (`vi.useFakeTimers()`, `vi.advanceTimersByTime(...)`); environment-coupled server helper specs stubbing `useRuntimeConfig`/h3 globals (established)
- [ ] [N2] Aliases: server helpers `#server/utils/...`; shared helpers `#shared/utils/...`; app-local helper/mapper specs `@/`

### i18n translation parity ([T1]–[T3])

- [ ] [T1] Specs live in `app/i18n/specs/`, never colocated
- [ ] [T2] Uses `crush` from `radashi`
- [ ] [T3] Single typed `it.each<[string, typeof frX]>` iterating every non-FR locale; sorted keys compared against the **French reference keys** (`fr` is source of truth)

---

## Mock infrastructure quick reference

Paths under `~~/tests/unit/utils/mocks/composables/`. Scan directories for the current inventory.

| Utility                                   | Path                                                | Purpose                                                            |
|-------------------------------------------|-----------------------------------------------------|--------------------------------------------------------------------|
| `ToMock<T>`                               | `~~/tests/unit/utils/types/mock.types`              | Types a mock object matching interface `T`                          |
| `MockHolder<T>`                           | `~~/tests/unit/utils/types/mock.types`              | Mutable holder for globally-mocked composable instances             |
| `MockedPiniaStore<T>`                     | `~~/tests/unit/utils/types/mock.types`              | Types a mocked Pinia store                                          |
| `mockStore(useStore)`                     | `~~/tests/unit/utils/mocks/stores/store.mock`       | Returns `useStore()` as `MockedPiniaStore<T>`                       |
| `MountSuspendedOptions<C>`                | `~~/tests/unit/utils/types/mount.types`             | Type for the options arg of `mountSuspended`                        |
| `ComponentVm`                             | `~~/tests/unit/utils/types/vtu.types`               | Base VM type with `$emit` — extend for exposed properties           |
| `getWrapperVm<T>(wrapper)`                | `~~/tests/unit/utils/helpers/vtu.helpers`           | Typed extraction of `wrapper.vm` (VTU workaround)                   |
| `createFetchMock()`                       | `nuxt/useFetch/useFetch.mock`                       | Creates `vi.fn<$Fetch>()` — used internally by fetch setup          |
| `createUseFetchStatusMock()`              | `core/useFetchStatus/useFetchStatus.mock`           | Mock factory for `useFetchStatus`                                   |
| `createUseAsyncActionMock()`              | `core/useAsyncAction/useAsyncAction.mock`           | Mock factory for `useAsyncAction`                                   |
| `createUseAppToastMock()`                 | `ui/useAppToast/useAppToast.mock`                   | Mock factory for `useAppToast`                                      |
| `createUseGoatItApiErrorToastMock()`      | `domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock` | Mock factory for `useGoatItApiErrorToast`                   |
| `createUseGSAPMock()`                     | `nuxt/useGsap/useGsap.mock`                         | Mock factory for `useGSAP`                                          |
| `createUseOverlayMock()`                  | `nuxt-ui/useOverlay/useOverlay.mock`                | Mock factory for `useOverlay`                                       |
| `createUseWindowScrollMock()`             | `core/useWindowScroll/useWindowScroll.mock`         | Mock factory for `useWindowScroll`                                  |
| `createUsePreferredReducedMotionMock()`   | `core/usePreferredReducedMotion/usePreferredReducedMotion.mock` | Mock factory for `usePreferredReducedMotion`            |
| `createCreateErrorMock()`                 | `nuxt/createError/createError.mock`                 | Mock factory for `createError`                                      |
| `createGetRouterParamMock()` / `createReadBodyMock()` | `nuxt/h3/h3.mock`                        | H3 utility mocks                                                    |
| `createQuestionThemesRepositoryMock()`    | `~~/tests/unit/utils/mocks/repositories/goat-it-api/questionThemesRepository/question-themes-repository.mock` | 5 methods |
| `createQuestionsRepositoryMock()`         | `~~/tests/unit/utils/mocks/repositories/goat-it-api/questions/questions.repository.mock` | 1 method (`getRandom`)     |

### Mock constants

| Constant                | Path                                                                            | Value                                                                                         |
|-------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| `DEFAULT_MOCKED_LOCALE` | `~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.constants`     | `"en"`                                                                                        |
| `MOCKED_LOCALE_CODES`   | `~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.constants`     | `["en", "fr"]`                                                                                |
| `MOCKED_LOCALES`        | `~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.constants`     | `[{ code: "en", name: "English", dir: "ltr" }, { code: "fr", name: "Français", dir: "ltr" }]` |
| `DEFAULT_MOCKED_ROUTE`  | `~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock.constants` | `{ path: "/", name: "home", meta: { titleKey, icon, order } }`                                |
| `MOCKED_ROUTES`         | `~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock.constants` | Array of 4 `RouteMock` entries (home, questions, settings, question/:id)                      |

### Adding a new composable mock

1. Create mock file at `tests/unit/utils/mocks/composables/<category>/<ComposableName>/useXxx.mock.ts`
2. Create setup file at `tests/unit/setup/nuxt/composables/use-xxx.nuxt.unit-setup.ts` — `mockNuxtImport` + exported `MockHolder`
3. Register in `VITEST_COMPOSABLES_MOCK_SETUP_FILES` (`configs/vitest/vitest.config.constants.ts`)

### Adding a new repository mock

1. Create mock file at `tests/unit/utils/mocks/repositories/goat-it-api/<Resource>/xxx-repository.mock.ts` (+ optional `.mock.types.ts`)
2. Create setup file at `tests/unit/setup/nuxt/repositories/xxx-repository.nuxt.unit-setup.ts` — `vi.mock(...)` (**not** `mockNuxtImport`)
3. Register in `VITEST_REPOSITORIES_MOCK_SETUP_FILES`

---

## Faketory quick reference

```ts
// Entity faketory pattern
function createFakeMyEntity(myEntity: Partial<MyEntity> = {}): MyEntity {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    status: faker.helpers.arrayElement(MY_ENTITY_STATUSES),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(), ...myEntity,  // must be last
  };
}
```

- Location: `tests/unit/utils/faketories/<domain>/<entity>.entity.faketory.ts` (flat file per entity); shared project fakes under `tests/unit/utils/faketories/shared/` (e.g. `shared/h3/h3-event.faketory.ts`)
- DTO faketories always come from `@goat-it/schemas/testing/{question,question-theme,shared}` — never local DTO faketories [U8]
- Always accept `Partial<T> = {}` and spread it last
- DTOs use ISO strings for dates; entities use `Date` objects

---

## Global setup summary (what is pre-mocked for you)

In `nuxt`, `composables`, and `stores` projects, available without any setup in your spec:

- `$t(key)` / `$tc(key, count)` → return the key unchanged (global Vue mocks)
- `<u-tooltip>` stubbed globally; `renderStubDefaultSlot: true` (VTU config)
- `definePageMeta` → global spy
- `useI18n()` → mock returning `{ t: (key) => key, locale: ref("en"), localeCodes: ref(["en","fr"]), locales: ref([...]), setLocale: vi.fn() }`
- `useRouter()` → mock returning `{ getRoutes, currentRoute, push, afterEach, beforeResolve, beforeEach, onError }`
- `$fetch` → `vi.fn<$Fetch>()` spy (recreated each `beforeEach`)
- `useToast()` → mock returning `{ add, remove, clear }`
- `useSeoMeta`, `callOnce`, `defineOgImage`, `useHead` → `vi.fn()` spies
- `getRouterParam` / `readBody` → global stubs; `createError` → mock
- Fake timers pinned to `2026-04-14` UTC (`TZ=UTC`)
- Element geometry mocked (`virtualizer` setup) and reka-ui `DismissableLayer` recursion patched
- Repositories globally mocked via `vi.mock`: `questionThemesRepository`, `questionsRepository` (nuxt + composables + stores)
- Runtime config injected: `{ goatItApi: { baseUrl: "https://api.goat-it.com", gameKey: "test-game-key" } }`

**Globally-mocked composables** (nuxt + stores projects only — the list grows; scan `tests/unit/setup/nuxt/composables/` for the authoritative set):
`useFetchStatus`, `useAsyncAction`, `useAppToast`, `useGoatItApiErrorToast`, `useGSAP`, `useGame`, `useOverlay`, `useWindowScroll`, `usePreferredReducedMotion`

In the `stores` project additionally:

- `setActivePinia(createPinia())` runs before each test

In component tests that use stores (not the `stores` project):

- Use `createTestingPinia()` passed as plugin: `{ global: { plugins: [pinia] } }`
- Call `mockStore(useXxxStore)` **after** `mountSuspended`

### Accessing and mutating a globally-mocked composable in a component/store test

Because these mocks are registered globally, you do **not** need `mockNuxtImport` in your spec file [U9].
Import the composable's `MockHolder` export from its setup file and mutate `.instance` before mount.
Call the composable directly in the test body to read it; mutate then `await nextTick()` when mutating after mount.

```ts
import { nextTick } from "vue";
import { useGameMock } from "~~/tests/unit/setup/nuxt/composables/use-game.nuxt.unit-setup";

it("should render GamePlaying when gameState is playing.", async () => {
  useGameMock.instance.gameStateRef.value = "playing";
  useGameMock.instance.questionsRef.value = [createFakeQuestion()];
  const wrapper = await mountGamePage();

  expect(wrapper.findComponent({ name: "GamePlaying" }).exists()).toBeTruthy();
});
```

For composables with `vi.fn()` methods, override implementations before mount: `useGameMock.instance.initialize.mockRejectedValue(new Error("fail"))`.

> **Pitfall:** Do NOT add `mockNuxtImport("useFoo", ...)` in a component/spec when `useFoo` is already globally mocked — import the holder instead. Always access the current mock through the holder reference (`useGameMock.instance`), never destructured at module scope.

---

## Component VTU helpers quick reference

### `getWrapperVm<T>` — emit events from / read properties of child components

```ts
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";

// Emit an event from a child component
const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='question-theme-form-modal-footer']");
getWrapperVm(footer).$emit("closeModal");

// Access exposed properties — extend ComponentVm with a local type
type MyFormVm = ComponentVm & { isFormValid: boolean };
const vm = getWrapperVm<MyFormVm>(wrapper);
expect(vm.isFormValid).toBeFalsy();

// Set template refs to null to test null-guard branches
const vm = getWrapperVm<MyFormVm>(wrapper);
vm.$.refs.form = null;
await vm.triggerFormSubmit();
expect(wrapper.emitted("submitCreation")).toBeUndefined();
```

### `wrapper.emitted()` — assert emitted events

```ts
expect(wrapper.emitted("update:open")).toBeDefined();           // was emitted
expect(wrapper.emitted("update:open")).toBeUndefined();        // was NOT emitted
expect(wrapper.emitted("submit")).toStrictEqual([[fakeData]]); // emitted with payload
```

### `wrapper.setProps()` — mutate props reactively after mount

```ts
await wrapper.setProps({ isCreating: true });
```

### `flushPromises` — wait for all async operations

```ts
import { flushPromises } from "@vue/test-utils";

getWrapperVm(footer).$emit("primaryButtonClick");
await flushPromises();
expect(wrapper.emitted("submitCreation")).toBeDefined();
```

### Finding components and elements

```ts
// Primary — data-testid, always typed
const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='my-modal-footer']");
const form = wrapper.getComponent<typeof MyForm>("[data-testid='my-form']");

// DOM elements by data-testid, ID, CSS selector
wrapper.find("[data-testid='my-button']");
wrapper.find("#some-id");

// Fallback — { name: "..." } only for third-party stubs (e.g. UColorPicker) whose source cannot be edited
const colorPicker = wrapper.findComponent<typeof UColorPicker>({ name: "UColorPicker" });

// Dynamic data-testid in v-for (in the .vue source)
// :data-testid="`alias-pill-${alias}`"
// → in spec: wrapper.findComponent("[data-testid='alias-pill-my-value']")

// Trigger DOM events
await wrapper.find("form").trigger("submit");
```
