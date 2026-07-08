---
name: unit-testing
description: Use when writing or modifying unit tests in this project. Load this skill before creating any *.spec.ts file. Covers all five Vitest projects, mock patterns, faketories, composable/store/repository test wiring, and coverage requirements.
---

# Unit Testing

Full human-readable reference: `docs/unit-testing.md`
Read it for complete examples. This skill contains the non-negotiable rules and decision trees.

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

| Project        | Environment | Setup files                                                                          |
|----------------|-------------|--------------------------------------------------------------------------------------|
| `nuxt`         | `nuxt`      | 11 base setups + 4 composable mocks + 1 repo mock                                    |
| `composables`  | `nuxt`      | 11 base setups + 1 repo mock (NO composable mocks — tests exercise real composables) |
| `stores`       | `nuxt`      | 11 base setups + 4 composable mocks + 1 repo mock + `stores.nuxt.unit-setup.ts`      |
| `repositories` | Node        | `dates.nuxt.unit-setup.ts` only                                                      |
| `node`         | Node        | `dates.nuxt.unit-setup.ts` only                                                      |

---

## Non-negotiable rules

### Coverage

- 100% threshold on all metrics — no exceptions.
- Every branch (truthy/falsy), every error path, every empty/non-empty array case must be covered.

### Describe labels

- **Components:** string `"<ComponentName> Component"` — never a direct reference: `describe("MyComponent Component", ...)`.
- **Pages:** string `"<PageName> Page"` — e.g. `describe("Home Page", ...)`.
- **Layouts:** string `"<LayoutName> Layout"` — e.g. `describe("DefaultLayout Layout", ...)`.
- **Functions / composables / stores / repositories:** pass the reference directly (`describe(myFn, ...)`) or a free-form string when no single symbol represents the subject (e.g. `describe("useAppToast", ...)`, `describe("Goat It API Helpers", ...)`).
- **Server handlers:** two-level describe — outer string `"Server Goat It API <Resource> <Method> Handler"`, inner `describe(handlerFn, ...)` with the function reference.
- **Never** use a direct component/page/layout reference as a describe label.

### Test names

- Pattern: `"should <action> when <condition>."` — always end with a period.

### Single-call assertions

- Always use `toHaveBeenCalledExactlyOnceWith(...)` — never combine `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(...)`.

### No hardcoded translations

- `$t` returns the key as-is. Assert the translation key string, never the translated text.

### Dynamic imports in composable and store tests

- `vi.resetModules()` runs automatically before every test (via `vtu-config.nuxt.unit-setup.ts`). You never call it yourself.
- Import the composable/store with `await import(...)` inside `beforeEach` — never at the top level.
- **Exception (Pattern C):** If a composable has **zero** external dependencies (no `mockNuxtImport`, no globally-mocked composables), a static top-level import is safe.

---

## Per-type checklist

### Component (`nuxt` project)

- [ ] Import component from `#components`
- [ ] `describe("MyComponent Component", ...)` — string label, **not** a component reference
- [ ] Default props declared as a `const` at the top of `describe`, before the mount helper
- [ ] Mount helper: `async function mountXxxComponent(options: MountSuspendedOptions<typeof Xxx> = {})`
- [ ] Helper spreads options after defaults so tests can override anything
- [ ] `beforeEach`: mount with defaults, then `mockStore(useXxxStore)` **after** `mountSuspended`
- [ ] No `shallow: true`
- [ ] Assert translation keys, not translated strings
- [ ] Only test props that are **dynamically bound** (prefixed with `:` in the template). Skip static string props without `:` (e.g. `variant="subtle"`, `color="neutral"`)
- [ ] Every named slot in the template must be exercised by at least one test
- [ ] Cover loading/empty/populated states

### Page (`nuxt` project)

- [ ] Import page directly: `import MyPage from "@/pages/my-page.vue"`
- [ ] `describe("Entity Page", ...)` — string label in the form `"<PageName> Page"`
- [ ] `shallow: true` in mount helper
- [ ] Assert `definePageMeta` was called with expected metadata
- [ ] Assert `useHead` via `vi.mocked(useHead).mock.calls[0]?.[0]` — extract and call the function argument
- [ ] Cover conditional render states (loading, empty, etc.)

### Layout (`nuxt` project)

- [ ] Spec in `spec/` subfolder: `app/layouts/MyLayout/spec/MyLayout.spec.ts`
- [ ] Import directly (not from `#components`)
- [ ] `describe("MyLayout Layout", ...)` — string label in the form `"<LayoutName> Layout"`
- [ ] `shallow: true`

### Composable (`composables` project)

- [ ] **Pattern A** (has mocked dependencies): `mockNuxtImport(...)` at module level for each dependency; dynamic import in `beforeEach`
- [ ] **Pattern B** (only globally-mocked deps): dynamic import in `beforeEach`; no extra `mockNuxtImport` needed
- [ ] **Pattern C** (zero external deps): static top-level import is correct; no dynamic import needed
- [ ] Declare composable type with `import type { useFoo as UseFooType }`
- [ ] `let useFoo: typeof UseFooType` at module level (Patterns A and B)
- [ ] `beforeEach`: recreate mocks (Pattern A), then `({ useFoo } = await import(...))`
- [ ] Test every returned ref, computed, and function

### Store (`stores` project)

- [ ] `mockNuxtImport("useAsyncAction", ...)` to capture `capturedAction` and `capturedOnError`
- [ ] If the store calls `useAsyncAction` multiple times, use a `useAsyncActionCallCount` counter to return distinct mock instances per invocation
- [ ] Reset captured vars (and `useAsyncActionCallCount`) to `undefined` / `0` at the top of each `beforeEach`
- [ ] Dynamic import of store in `beforeEach`
- [ ] Test initial state, reactive getters, action wiring, and error callback
- [ ] Assert `capturedAction` is `toBe(repository($fetch).method)` (strict reference equality)
- [ ] Assert `capturedOnError?.()` triggers `useAppToast().addErrorToast` with the correct i18n key
- [ ] Mutate `useAsyncActionMock.fetchStatus.value` to drive reactive getter assertions (e.g. `isPending`, `isFetching`)
- [ ] `setActivePinia(createPinia())` runs automatically — do NOT call it manually

### Repository (`repositories` project)

- [ ] No Nuxt — plain Node environment
- [ ] `describe(myRepository, ...)` — use the exported symbol; no nested duplicate describe
- [ ] `fetchMock = vi.fn<$Fetch>()` in `beforeEach`
- [ ] Pass `fetchMock as $Fetch` to the factory
- [ ] Test every method: endpoint, HTTP method/options, return value
- [ ] Include a top-level test asserting the repository shape: `expect(repository).toStrictEqual({ getAll: expect.any(Function), ... })`
- [ ] For methods with params (e.g. `getById(id)`, `patch(id, dto)`, `archive(id)`), test the interpolated URL
- [ ] Use `toStrictEqual(value)` for return assertions. If type can't be inferred, use `toStrictEqual<T>(value)` for example `toStrictEqual<QuestionTheme[]>([]);`

### Server handler (`nuxt` project)

- [ ] `vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"))` at module level — uses `import()` expression syntax
- [ ] `vi.mocked($fetch).mockResolvedValue(...)` in `beforeEach`
- [ ] Two-level `describe` pattern: outer string label `"Server Goat It API <Resource> <Method> Handler"`, inner `describe(handlerFn, ...)`
- [ ] Assert `createGoatItApiEndpoint` call
- [ ] Assert `createGoatItApiFetchOptions` call with expected runtime config (`baseUrl: "https://api.goat-it.com"`, `adminKey: "test-admin-key"`)
- [ ] Assert `$fetch` call with correct endpoint + options
- [ ] Assert return value (mapped domain objects)
- [ ] Assert `ZodError` is thrown for invalid API data
- [ ] For `createError` assertions: `vi.mocked(createError).mockImplementation(...)` + `try/catch` to let the throw happen, then assert the call arguments
- [ ] For side-effect assertions on throwing handlers: use `try/catch` with `void error` — **never** `.catch(() => null)`
- [ ] Use `HttpStatusCode` enum from `#server/utils/http/http.enums` for status code values
- [ ] For routes with params: assert `getRouterParam` was called with `(event, "id")`
- [ ] For routes with body: assert `readBody` was called with `(event)`

### Server util / mapper / helper (`node` project)

- [ ] Pure function tests — no mocking
- [ ] Import with `#server/utils/...`
- [ ] Cover all branches and edge cases

### Shared helper (`node` project)

- [ ] Import with `#shared/utils/...`
- [ ] Test all branches including edge cases (empty string, undefined, etc.)

### i18n translation parity (`node` project)

- [ ] Spec in `app/i18n/specs/` (NOT colocated)
- [ ] Use `crush` from `radashi` to flatten keys
- [ ] Assert `toSorted()` EN keys equal `toSorted()` FR keys

---

## Mock infrastructure quick reference

| Utility                                | Path                                                                                                          | Purpose                                                           |
|----------------------------------------|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `ToMock<T>`                            | `~~/tests/unit/utils/types/mock.types`                                                                        | Types a mock object matching interface `T`                        |
| `MockedPiniaStore<T>`                  | `~~/tests/unit/utils/types/mock.types`                                                                        | Types a mocked Pinia store                                        |
| `mockStore(useStore)`                  | `~~/tests/unit/utils/mocks/stores/store.mock`                                                                 | Returns `useStore()` as `MockedPiniaStore<T>`                     |
| `MountSuspendedOptions<C>`             | `~~/tests/unit/utils/types/mount.types`                                                                       | Type for the options arg of `mountSuspended`                      |
| `ComponentVm`                          | `~~/tests/unit/utils/types/vtu.types`                                                                         | Base VM type with `$emit` — extend for exposed properties         |
| `getWrapperVm<T>(wrapper)`             | `~~/tests/unit/utils/helpers/vtu.helpers`                                                                     | Typed extraction of `wrapper.vm` (VTU workaround)                 |
| `createFetchMock()`                    | `~~/tests/unit/utils/mocks/composables/nuxt/useFetch/useFetch.mock`                                           | Creates `vi.fn<$Fetch>()` — used internally by fetch setup        |
| `createUseFetchStatusMock()`           | `~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock`                               | Mock factory for `useFetchStatus`                                 |
| `createUseAsyncActionMock()`           | `~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock`                               | Mock factory for `useAsyncAction`                                 |
| `createUseAppToastMock()`              | `~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock`                                       | Mock factory for `useAppToast`                                    |
| `createUseColorModeMock()`             | `~~/tests/unit/utils/mocks/composables/nuxt/useColorMode/useColorMode.mock`                                   | Mock factory for `useColorMode` (reactive, not spy-based)         |
| `createUseI18nMock()`                  | `~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock`                                             | Mock factory for `useI18n`                                        |
| `createUseRouterMock()`                | `~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock`                                         | Mock factory for `useRouter`                                      |
| `createUseToastMock()`                 | `~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock`                                           | Mock factory for `useToast`                                       |
| `createCreateErrorMock()`              | `~~/tests/unit/utils/mocks/composables/nuxt/createError/createError.mock`                                     | Mock factory for `createError`                                    |
| `createGetRouterParamMock()`           | `~~/tests/unit/utils/mocks/composables/nuxt/h3/h3.mock`                                                       | Mock factory for H3 `getRouterParam`                              |
| `createReadBodyMock()`                 | `~~/tests/unit/utils/mocks/composables/nuxt/h3/h3.mock`                                                       | Mock factory for H3 `readBody`                                    |
| `createQuestionThemesRepositoryMock()` | `~~/tests/unit/utils/mocks/repositories/goat-it-api/questionThemesRepository/question-themes-repository.mock` | Mock factory (5 methods: getAll, getById, create, patch, archive) |

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
2. Create setup file at `tests/unit/setup/nuxt/composables/use-xxx.nuxt.unit-setup.ts` — use `mockNuxtImport`
3. Add path to `VITEST_COMPOSABLES_MOCK_SETUP_FILES` in `configs/vitest/vitest.config.constants.ts`

### Adding a new repository mock

1. Create mock file at `tests/unit/utils/mocks/repositories/goat-it-api/<Resource>/xxx-repository.mock.ts`
2. Create setup file at `tests/unit/setup/nuxt/repositories/xxx-repository.nuxt.unit-setup.ts` — use `vi.mock(...)` (NOT `mockNuxtImport`)
3. Add path to `VITEST_REPOSITORIES_MOCK_SETUP_FILES` in `configs/vitest/vitest.config.constants.ts`

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

- Location: `tests/unit/utils/faketories/<entity-name>/entity/` and `…/dto/`
- Shared faketories: `tests/unit/utils/faketories/shared/locale/` (e.g. `createFakeLocalizedText`, `createFakeLocalizedTexts`)
- Always accept `Partial<T> = {}` and spread it last
- DTOs use ISO strings for dates; entities use `Date` objects

---

## Global setup summary (what is pre-mocked for you)

In `nuxt`, `composables`, and `stores` projects, the following are available without any setup in your test file:

- `$t(key)` → returns `key` unchanged (global Vue mock)
- `$tc(key, count)` → returns `key` unchanged (global Vue mock)
- `<u-tooltip>` is stubbed globally (via VTU config)
- `vi.resetModules()` runs automatically in each `beforeEach` (via `vtu-config.nuxt.unit-setup.ts`)
- `definePageMeta` → Vitest spy (accessible globally)
- `useI18n()` → mock returning `{ t: (key) => key, locale: ref("en"), localeCodes: ref(["en","fr"]), locales: ref([...]), setLocale: vi.fn() }`
- `useRouter()` → mock returning `{ getRoutes, currentRoute, push, afterEach, beforeResolve, beforeEach, onError }`
- `$fetch` → `vi.fn<$Fetch>()` spy (recreated each `beforeEach` via `createFetchMock()`)
- `useToast()` → mock returning `{ add, remove, clear }`
- `getRouterParam` → global stub
- `readBody` → global stub
- `createError` → mock via `vi.hoisted`
- `useHead` → `vi.fn()` spy via `vi.hoisted` + `mockNuxtImport` — access via `vi.mocked(useHead)`
- `callOnce` → `vi.fn()` spy via `vi.hoisted` + `mockNuxtImport`
- `questionThemesRepository` → `vi.mock(...)` mock (nuxt + composables + stores projects)
- fake timers pinned to `2026-04-14` UTC (`TZ=UTC`)
- `onConsoleLog` filter suppresses `<Suspense> is an experimental feature` and Pinia duplicate provider warnings
- **Globally-mocked composables** (nuxt + stores projects only) — the list grows over time.
  Scan `tests/unit/setup/nuxt/composables/` to get the current authoritative list; each file there registers one global mock.
  Currently: `useFetchStatus`, `useAsyncAction`, `useAppToast`, `useColorMode`

In the `stores` project additionally:

- `setActivePinia(createPinia())` runs before each test

In component tests that use stores (not the `stores` project):

- Use `createTestingPinia()` from `@pinia/testing` and pass as plugin: `{ global: { plugins: [pinia] } }`
- Call `mockStore(useXxxStore)` **after** `mountSuspended` to get a typed store reference

### Accessing and mutating a globally-mocked composable in a component/store test

Because these mocks are registered globally, you do **not** need `mockNuxtImport` in your spec file.
Call the composable directly in the test body — you get back the same mock instance the component received.
Mutate it, then `await nextTick()` to let the template react.

```ts
import { nextTick } from "vue";

it("should show dark tooltip when color mode is light.", async () => {
  const colorMode = useColorMode();
  colorMode.value = "light";
  await nextTick();

  expect(wrapper.find("#my-tooltip").attributes("text")).toBe("navigation.switchOnDarkMode");
});
```

This pattern applies to any composable listed in `tests/unit/setup/nuxt/composables/` (e.g. `useColorMode`, `useAsyncAction`, `useAppToast`, `useFetchStatus`, …).

> **Pitfall:** Do NOT add `mockNuxtImport("useFoo", ...)` in a component spec when `useFoo` is already globally mocked. Just call `useFoo()` directly in the test body.

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
// Primary — always use data-testid (add it to the source .vue file if missing)
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
