# Unit Testing Guide

This document is the complete reference for writing unit tests in this repository.
It covers the test infrastructure, every file type that needs tests, exact patterns to follow, and common pitfalls.

---

## Table of contents

1. [Overview and tooling](#1-overview-and-tooling)
2. [Vitest projects](#2-vitest-projects)
3. [Coverage policy](#3-coverage-policy)
4. [Global test setup](#4-global-test-setup)
5. [Running tests](#5-running-tests)
6. [Test patterns by file type](#6-test-patterns-by-file-type)
   - [Components](#61-components)
   - [Pages](#62-pages)
   - [Layouts](#63-layouts)
   - [Composables](#64-composables)
   - [Stores](#65-stores)
   - [Repositories](#66-repositories)
   - [Server handlers](#67-server-handlers)
   - [Server utils / mappers / helpers](#68-server-utils--mappers--helpers)
   - [Shared helpers](#69-shared-helpers)
   - [i18n translation parity](#610-i18n-translation-parity)
7. [Component test utilities](#7-component-test-utilities)
   - [getWrapperVm and ComponentVm](#71-getwrappervmt-and-componentvm)
   - [wrapper.emitted()](#72-wrapperemitted)
   - [wrapper.setProps()](#73-wrappersetprops)
   - [flushPromises](#74-flushpromises)
   - [Finding elements and components](#75-finding-elements-and-components)
8. [Mock infrastructure](#8-mock-infrastructure)
   - [ToMock type](#81-tomockt-type)
   - [MockedPiniaStore type](#82-mockedpiniastoretstoredefinition-type)
   - [mockStore helper](#83-mockstore-helper)
   - [MountSuspendedOptions type](#84-mountsuspendedoptionscomponent-type)
   - [Composable mock files](#85-composable-mock-files)
   - [Repository mock files](#86-repository-mock-files)
   - [Registering new mocks](#87-registering-new-mocks)
9. [Faketories](#9-faketories)
10. [Naming conventions](#10-naming-conventions)
11. [Common pitfalls](#11-common-pitfalls)

---

## 1. Overview and tooling

| Tool                                                                | Purpose                                                        |
|---------------------------------------------------------------------|----------------------------------------------------------------|
| [Vitest](https://vitest.dev)                                        | Test runner                                                    |
| [`@nuxt/test-utils`](https://nuxt.com/docs/getting-started/testing) | Nuxt-aware test utilities (`mountSuspended`, `mockNuxtImport`) |
| [`@vue/test-utils`](https://test-utils.vuejs.org)                   | Vue component mounting                                         |
| [`happy-dom`](https://github.com/capricorn86/happy-dom)             | DOM environment                                                |
| [`@pinia/testing`](https://pinia.vuejs.org/cookbook/testing.html)   | Pinia testing utilities                                        |
| [`@faker-js/faker`](https://fakerjs.dev)                            | Fake data generation                                           |

All tests use the standard **Vitest APIs** (`describe`, `it`, `expect`, `vi`, `beforeEach`, etc.). Vitest is configured with `globals: true`, but by convention you must still import these from `vitest` in every test file. No auto-imports.

The `onConsoleLog` filter in Vitest config suppresses two known warnings:

- `"<Suspense> is an experimental feature"` — Vue Suspense experimental notice
- `"[Vue warn]: App already provides property with key \"Symbol(pinia)\""` — duplicate Pinia provider when using `createTestingPinia`

---

## 2. Vitest projects

There are **five Vitest projects**, each covering a different layer. The project is determined automatically by the spec file path.

| Project        | Spec file pattern                                                                                                                   | Setup files loaded                                                                  |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|
| `nuxt`         | `app/**/*.spec.ts`, `server/**/*.spec.ts`, `shared/**/*.spec.ts` (excludes patterns claimed by other projects)                      | All nuxt setups + composable mocks + repository mocks                               |
| `composables`  | `app/composables/**/*.spec.ts` (excludes helpers/mappers claimed by `node`)                                                         | All nuxt setups + repository mocks (NOT composable mocks — tests real composables)  |
| `stores`       | `app/**/*.store.spec.ts`                                                                                                            | All nuxt setups + composable mocks + repository mocks + `stores.nuxt.unit-setup.ts` |
| `repositories` | `app/**/*.repository.spec.ts`                                                                                                       | `dates.nuxt.unit-setup.ts` only (plain Node, no Nuxt environment)                   |
| `node`         | `app/**/*.{mappers,helpers,translations}.spec.ts`, `server/**/*.{mappers,helpers}.spec.ts`, `shared/**/*.{mappers,helpers}.spec.ts` | `dates.nuxt.unit-setup.ts` only                                                     |

The `repositories` and `node` projects use a plain Vitest environment (no Nuxt, no happy-dom).
All other projects use `environment: "nuxt"` (happy-dom + Nuxt runtime).

> **Note:** The `composables` project does NOT load composable mock setup files. That is intentional — composable tests exercise the real composable implementation; their dependencies are mocked individually inside the test file.

---

## 3. Coverage policy

- **Provider:** V8
- **Threshold:** 100% across all metrics (lines, branches, functions, statements)
- **Collected for:** `app/**/*.ts`, `app/**/*.vue`, `server/**/*.ts`, `shared/**/*.ts`
- **Excluded from coverage:**
  - `**/*.constants.ts`
  - `**/*.enums.ts`
  - `**/*.types.ts`
  - `**/*.d.ts`
  - `**/*.config.ts`
  - `**/*.spec.ts`
  - `server/api/**/*.{get,post,put,patch,delete}.ts` (thin route wrappers)

Every line of every non-excluded source file must be reachable by at least one test.

---

## 4. Global test setup

These setup files run automatically before tests in the relevant projects. You do not need to import them.

### Common to all nuxt/composables/stores projects

| File                                  | What it does                                                                                                                                                                                                   |
|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `vtu-config.nuxt.unit-setup.ts`       | Sets `renderStubDefaultSlot: true`; stubs `u-tooltip: true`; adds `$t` and `$tc` global mocks (return the key as-is); runs `vi.resetModules()` automatically in each `beforeEach` (you never call it yourself) |
| `dates.nuxt.unit-setup.ts`            | Sets `process.env.TZ = "UTC"`; enables fake timers pinned to `2026-04-14`                                                                                                                                      |
| `define-page-meta.nuxt.unit-setup.ts` | Mocks `definePageMeta` via `vi.hoisted` + `mockNuxtImport`; exposes as global `definePageMeta` spy                                                                                                             |
| `use-i18n.nuxt.unit-setup.ts`         | Mocks `useI18n` via `mockNuxtImport`; see [useI18n mock details](#usei18n-mock) below                                                                                                                          |
| `use-router.nuxt.unit-setup.ts`       | Mocks `useRouter` via `mockNuxtImport`                                                                                                                                                                         |
| `fetch.nuxt.unit-setup.ts`            | Stubs `$fetch` globally with a `vi.fn<$Fetch>()` (via `createFetchMock()`); recreated each `beforeEach`                                                                                                        |
| `use-toast.nuxt.unit-setup.ts`        | Mocks `useToast` via `mockNuxtImport`                                                                                                                                                                          |
| `h3.nuxt.unit-setup.ts`               | Stubs globals `getRouterParam` and `readBody`                                                                                                                                                                  |
| `create-error.nuxt.unit-setup.ts`     | Mocks `createError` via `vi.hoisted` + `mockNuxtImport`                                                                                                                                                        |
| `use-head.nuxt.unit-setup.ts`         | Mocks `useHead` via `vi.hoisted` + `mockNuxtImport`; exposes as a `vi.fn` spy                                                                                                                                  |
| `call-once.nuxt.unit-setup.ts`        | Mocks `callOnce` via `vi.hoisted` + `mockNuxtImport`; exposes as a `vi.fn` spy                                                                                                                                 |

### Stores project only

| File                        | What it does                                           |
|-----------------------------|--------------------------------------------------------|
| `stores.nuxt.unit-setup.ts` | Calls `setActivePinia(createPinia())` before each test |

### Composable mock setup files (nuxt + stores, NOT composables)

The list below reflects what is registered at the time of writing, but **it will grow** as the project adds new composables.
To see the current full list, scan `tests/unit/setup/nuxt/composables/` — every file there registers one global mock.

| File                                  | Mock it registers | Mock factory                 | Notes                                                                             |
|---------------------------------------|-------------------|------------------------------|-----------------------------------------------------------------------------------|
| `use-fetch-status.nuxt.unit-setup.ts` | `useFetchStatus`  | `createUseFetchStatusMock()` | Returns `{fetchStatus, isIdle, isPending, isSuccess, isError, setFetchStatusTo*}` |
| `use-async-action.nuxt.unit-setup.ts` | `useAsyncAction`  | `createUseAsyncActionMock()` | Returns `{execute, fetchStatus, isIdle, isPending, isSuccess, isError}`           |
| `use-app-toast.nuxt.unit-setup.ts`    | `useAppToast`     | `createUseAppToastMock()`    | Returns `{addSuccessToast, addErrorToast}`                                        |
| `use-color-mode.nuxt.unit-setup.ts`   | `useColorMode`    | `createUseColorModeMock()`   | Reactive getter/setter on `.value`, not spy-based                                 |

#### Accessing and mutating a globally-mocked composable inside a component test

Because the mock is registered globally (via the setup file), you do **not** need `mockNuxtImport` in your spec.
Call the composable directly inside the test body — you get back the same mock instance the component received during `setup()`.
Mutate it, then `await nextTick()` to let the template react.

```ts
import { nextTick } from "vue";

it("should show dark mode tooltip when color mode is light.", async () => {
  const colorMode = useColorMode();
  colorMode.value = "light";
  await nextTick();

  const tooltip = wrapper.getComponent<typeof UTooltip>("#my-tooltip");
  expect(tooltip.props("text")).toBe("navigation.switchOnDarkMode");
});
```

The same pattern works for any composable listed in the table above (e.g. `useI18n()`, `useRouter()`, `useAppToast()`).

#### useI18n mock

`useI18n()` returns a mock (defined in `tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.ts`).

Exported constants from `useI18n.mock.constants.ts`:

- `DEFAULT_MOCKED_LOCALE` — `"en"` (typed as `SupportedLocaleCodeForMock`)
- `MOCKED_LOCALE_CODES` — `["en", "fr"]`
- `MOCKED_LOCALES` — array of `{ code, name, dir }` objects: `[{ code: "en", name: "English", dir: "ltr" }, { code: "fr", name: "Français", dir: "ltr" }]`

Exported types from `useI18n.mock.types.ts`:

- `SupportedLocaleCodeForMock` — `"en" | "fr"`
- `SupportedMockedLocale` — alias for `LocaleObject` from `@nuxtjs/i18n`

To test locale-dependent behavior, mutate `locale.value` directly and `await nextTick()`:

```ts
it("should display the french label when locale is fr.", async () => {
  const { locale } = useI18n();
  locale.value = "fr";
  await nextTick();

  expect(wrapper.find(".locale-label").text()).toBe("fr");
});
```

#### useRouter mock

`useRouter()` returns a mock (defined in `tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock.ts`).
The mock provides: `getRoutes`, `currentRoute`, `push`, `afterEach`, `beforeResolve`, `beforeEach`, `onError`.

Exported constants from `useRouter.mock.constants.ts`:

- `DEFAULT_MOCKED_ROUTE` — `{ path: "/", name: "home", meta: { titleKey: "home.pageTitle", icon: "i-lucide-home", order: 1 } }`
- `MOCKED_ROUTES` — array of 4 `RouteMock` entries (home, questions, settings, question/:id)

Exported types from `useRouter.mock.types.ts`:

- `RouteMock` — `{ path: string; name?: string | symbol | number; meta: PageMeta }`

To test navigation-dependent behavior:

```ts
import { MOCKED_ROUTES } from "~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock.constants";

it("should render navigation links for routes with order.", () => {
  const routesWithOrder = MOCKED_ROUTES.filter(route => route.meta.order !== undefined);
  // assert navigation items match routesWithOrder
});
```

#### useHead mock

`useHead` is a global `vi.fn()` spy. To assert what was passed to it, extract the function argument and call it:

```ts
it("should set the page title via useHead when mounted.", () => {
  const extractedHeadFunction = vi.mocked(useHead).mock.calls[0]?.[0] as () => Record<string, unknown>;

  expect(extractedHeadFunction()).toStrictEqual({ title: HOME_PAGE_TITLE_KEY });
});
```

### Repository mock setup files (nuxt + composables + stores)

| File                                            | Mock it registers                                                                                            |
|-------------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `question-themes-repository.nuxt.unit-setup.ts` | `questionThemesRepository` via `vi.mock(...)` (5 methods: `getAll`, `getById`, `create`, `patch`, `archive`) |

### Runtime config injected in nuxt environment

Tests running in the `nuxt`, `composables`, or `stores` projects have access to these injected runtime config values:

```ts
const runtimeConfig = {
  goatItApi: {
    baseUrl: "https://api.goat-it.com",
    adminKey: "test-admin-key",
  },
};
```

---

## 5. Running tests

```bash
# All tests
pnpm run test:unit

# With coverage
pnpm run test:unit:cov

# Watch mode
pnpm run test:unit:watch

# Single file
pnpm run test:unit file.spec.ts

# By test name
pnpm run test:unit -t "should render"

# Watch a single file
pnpm run test:unit:watch file.spec.ts
```

---

## 6. Test patterns by file type

### 6.1 Components

**Project:** `nuxt`
**Spec file location:** Colocated with the component, same directory, `ComponentName.spec.ts`

#### Structure

```ts
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { createTestingPinia } from "@pinia/testing";   // only if the component uses a store
import type { TestingPinia } from "@pinia/testing";    // only if the component uses a store
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import { createFakeXxx } from "~~/tests/unit/utils/faketories/.../xxx.entity.faketory";
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";   // only if uses a store
import type { MockedPiniaStore } from "~~/tests/unit/utils/types/mock.types"; // only if uses a store
import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { MyComponent } from "#components";

describe("MyComponent Component", () => {
  let wrapper: VueWrapper;
  let pinia: TestingPinia;                                                  // only if uses a store
  let myStore: ReturnType<typeof mockStore<typeof useMyStore>>;             // only if uses a store

  const defaultMyComponentProperties: MyComponentProperties = {            // only if has props
    /* default props */
  } as const;

  async function mountMyComponent(options: MountSuspendedOptions<typeof MyComponent> = {}): Promise<VueWrapper> {
    return mountSuspended(MyComponent, {
      props: defaultMyComponentProperties,   // only if has props
      global: { plugins: [pinia] },   // only if uses a store
      ...options,
    });
  }

  beforeEach(async () => {
    pinia = createTestingPinia();     // only if uses a store
    wrapper = await mountMyComponent();
    myStore = mockStore(useMyStore);  // after mountSuspended, only if uses a store
  });

  it("should render the component when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  // ... more tests
});
```

#### Key rules

- Import the component from `#components` (Nuxt auto-import). If not present yet, run `nuxt prepare` to generate the auto-imports.
- Use `describe("MyComponent Component", ...)` — always pass a string label in the form `"<ComponentName> Component"`, **never** a direct component reference.
- Declare default props as a `const` at the top of the `describe` block (before the mount helper), so every test can reference or override them.
- Create a `mountXxxComponent` helper that accepts `MountSuspendedOptions<typeof Xxx>` and spreads it after defaults. This allows individual tests to override any option.
- Do **not** use `shallow: true` for components (use it only for pages and layouts).
- Call `mockStore(useXxxStore)` **after** `mountSuspended` inside `beforeEach`.
- **Component tests use `createTestingPinia()`** from `@pinia/testing` (passed as a plugin). This is different from the `stores` project where `setActivePinia(createPinia())` runs automatically. Do not use `setActivePinia` in component tests.
- `$t` returns the key as-is — assert translation keys directly: `expect(...).toBe("questionThemes.fields.label")`.
- Mutate store state directly: `myStore.someField = value`, then re-mount if the template needs to re-render.
- Always use `data-testid` to find child components and elements — see [Section 7.5](#75-finding-elements-and-components).
- Check prop values with `component.props("propName")`.
- Only test props that are **dynamically bound** (prefixed with `:` in the template, e.g. `:label="slug"`). Skip static string props without `:` (e.g. `variant="subtle"`, `color="neutral"`) — they are implementation constants, not behaviour to verify.
- Every named slot in the template must be exercised by at least one test to achieve 100% coverage.

#### Example — finding child components and asserting props

```ts
it("should pass the status to the badge when mounted.", async () => {
  myStore.item = createFakeItem({ status: "active" });
  wrapper = await mountMyComponent();

  const badge = wrapper.findComponent<typeof MyBadge>("[data-testid='my-badge']");
  expect(badge.props("status")).toBe("active");
});
```

---

### 6.2 Pages

**Project:** `nuxt`
**Spec file location:** Colocated with the page file.

Pages follow the same structure as components with two differences:

1. **Always use `shallow: true`** — page tests stub child components.
2. **Import directly**, not from `#components`:

```ts
import MyPage from "@/pages/my-page.vue";
```

3. **Use a string label** in the form `"<PageName> Page"`:

```ts
describe("Questions Page", () => {
  // ...
});
```

#### Asserting `definePageMeta`

`definePageMeta` is globally mocked by `define-page-meta.nuxt.unit-setup.ts` and exposed as a Vitest spy:

```ts
it("should define page metadata when mounted.", () => {
  const expectedPageMeta: Parameters<typeof definePageMeta>[0] = {
    icon: MY_PAGE_ICON,
    titleKey: MY_PAGE_TITLE_KEY,
  };

  expect(definePageMeta).toHaveBeenCalledExactlyOnceWith(expectedPageMeta);
});
```

#### Asserting `useHead`

`useHead` is globally mocked as a `vi.fn()` spy. Extract and call its argument to assert the head input:

```ts
it("should set the page title via useHead when mounted.", () => {
  const extractedHeadFunction = vi.mocked(useHead).mock.calls[0]?.[0] as () => Record<string, unknown>;

  expect(extractedHeadFunction()).toStrictEqual({ title: MY_PAGE_TITLE_KEY });
});
```

#### Example

```ts
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { PageHeader } from "#components";

import { MY_PAGE_ICON, MY_PAGE_TITLE_KEY } from "@/pages/my-page.constants";
import MyPage from "@/pages/my-page.vue";

describe("Entity Page", () => {
  let wrapper: VueWrapper;

  async function mountMyPage(options: MountSuspendedOptions<typeof MyPage> = {}): Promise<VueWrapper> {
    return mountSuspended(MyPage, {
      shallow: true, ...options,
    });
  }

  beforeEach(async () => {
    wrapper = await mountMyPage();
  });

  it("should render the page when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should define page metadata when mounted.", () => {
    const expectedPageMeta: Parameters<typeof definePageMeta>[0] = {
      icon: MY_PAGE_ICON,
      titleKey: MY_PAGE_TITLE_KEY,
    };

    expect(definePageMeta).toHaveBeenCalledExactlyOnceWith(expectedPageMeta);
  });

  it("should set the page title via useHead when mounted.", () => {
    const extractedHeadFunction = vi.mocked(useHead).mock.calls[0]?.[0] as () => Record<string, unknown>;

    expect(extractedHeadFunction()).toStrictEqual({ title: MY_PAGE_TITLE_KEY });
  });
});
```

---

### 6.3 Layouts

**Project:** `nuxt`
**Spec file location:** `app/layouts/MyLayout/spec/MyLayout.spec.ts` (in a `spec/` subdirectory)

- Always use `shallow: true`.
- Import directly from the component path (not `#components`).
- Use a string label in the form `"<LayoutName> Layout"`.
- Tests are typically minimal — just existence checks.

```ts
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { VueWrapper } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import DefaultLayout from "@/layouts/DefaultLayout/DefaultLayout.vue";

describe("DefaultLayout Layout", () => {
  let wrapper: VueWrapper;

  async function mountDefaultLayout(options: MountSuspendedOptions<typeof DefaultLayout> = {}): Promise<VueWrapper> {
    return mountSuspended(DefaultLayout, {
      shallow: true, ...options,
    });
  }

  beforeEach(async () => {
    wrapper = await mountDefaultLayout();
  });

  it("should render the layout when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });
});
```

---

### 6.4 Composables

**Project:** `composables`
**Spec file location:** Colocated with the composable file.

Composable tests require special import handling because `vi.resetModules()` runs automatically before every test (set up by `vtu-config.nuxt.unit-setup.ts`). This ensures mocks are picked up fresh each time. You never call `vi.resetModules()` yourself.

There are three patterns depending on the composable's dependencies.

#### Pattern A — composable with mocked dependencies

Use this when the composable calls other composables that must be mocked (e.g. `useAsyncAction` calls `useFetchStatus`).

```ts
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createUseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";
import type { UseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";

// Import type only — the real module is loaded dynamically in beforeEach
import type { useAsyncAction as UseAsyncActionType } from "@/composables/core/useAsyncAction/useAsyncAction";

// 1. Declare mock variable outside describe (module-level)
let useFetchStatusMock: UseFetchStatusMock;

// 2. mockNuxtImport at module level (it is hoisted)
mockNuxtImport("useFetchStatus", () => (): UseFetchStatusMock => useFetchStatusMock);

// 3. Declare the real composable variable for dynamic import
let useAsyncAction: typeof UseAsyncActionType;

describe("useAsyncAction", () => {
  beforeEach(async () => {
    // 4. Recreate mock + dynamically import the real composable
    useFetchStatusMock = createUseFetchStatusMock();
    ({ useAsyncAction } = await import("@/composables/core/useAsyncAction/useAsyncAction"));
  });

  it("should call setFetchStatusToPending when execute is called.", async () => {
    const action = vi.fn<() => Promise<void>>();
    const { execute } = useAsyncAction(action, vi.fn());

    await execute();

    expect(useFetchStatusMock.setFetchStatusToPending).toHaveBeenCalledExactlyOnceWith();
  });
});
```

#### Pattern B — composable that depends only on globally-mocked composables

Use this when the composable only depends on things already mocked globally (e.g. `useToast` is globally mocked). You still need the dynamic import because `vi.resetModules()` runs before each test, but you do **not** need to declare any `mockNuxtImport`.

```ts
import { beforeEach, describe, expect, it } from "vitest";

import type { useAppToast as UseAppToastType } from "@/composables/ui/useAppToast/useAppToast";

let useAppToast: typeof UseAppToastType;

describe("useAppToast", () => {
  beforeEach(async () => {
    ({ useAppToast } = await import("@/composables/ui/useAppToast/useAppToast"));
  });

  it("should call useToast().add when addSuccessToast is called.", () => {
    const { addSuccessToast } = useAppToast();
    addSuccessToast({ title: "Done" });

    expect(useToast().add).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ title: "Done" }));
  });
});
```

#### Pattern C — composable with no external dependencies at all

Use this when the composable has **zero** external dependencies — no globally-mocked composables, no `mockNuxtImport`. Because the module has nothing to reset, a static import at the top level is safe and correct.

```ts
import { describe, expect, it } from "vitest";

import { useFetchStatus } from "@/composables/core/useFetchStatus/useFetchStatus";

describe("useFetchStatus", () => {
  it("should have idle status when initialized.", () => {
    const { fetchStatus } = useFetchStatus();

    expect(fetchStatus.value).toBe("idle");
  });
});
```

#### Why the dynamic import (Patterns A and B)?

`vi.resetModules()` runs automatically before every test (from `vtu-config.nuxt.unit-setup.ts`). This clears the module registry, so any module imported at the top level is effectively stale after the first test. By dynamically importing inside `beforeEach`, the composable always sees the freshly-reset mock values.

Pattern C does not need this because the composable has no dependencies that can become stale.

---

### 6.5 Stores

**Project:** `stores`
**Spec file location:** Colocated with the store file (`*.store.spec.ts`).

Stores depend on `useAsyncAction` and repository functions. Both are mocked globally, but the store test needs to **capture** the arguments passed to `useAsyncAction` to test internal wiring.

#### Single-action store

When the store calls `useAsyncAction` once:

```ts
import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import { createFakeItem } from "~~/tests/unit/utils/faketories/.../item.entity.faketory";

import type { useMyStore as UseMyStoreType } from "@/stores/domain/my-entity/my.store";

// 1. Variables to capture what gets passed to useAsyncAction
let useAsyncActionMock: UseAsyncActionMock;
let capturedAction: (() => Promise<MyEntity[]>) | undefined;
let capturedOnError: (() => void) | undefined;

// 2. Mock useAsyncAction — capture arguments, return a fresh mock instance
mockNuxtImport("useAsyncAction", () => (action: unknown, onError: unknown): UseAsyncActionMock => {
  capturedAction = action as () => Promise<MyEntity[]>;
  capturedOnError = onError as () => void;
  useAsyncActionMock = createUseAsyncActionMock();
  return useAsyncActionMock;
});

let useMyStore: typeof UseMyStoreType;

describe("useMyStore", () => {
  beforeEach(async () => {
    capturedAction = undefined;
    capturedOnError = undefined;
    ({ useMyStore } = await import("@/stores/domain/my-entity/my.store"));
  });

  describe("initial state", () => {
    it("should expose an empty array when created.", () => {
      const store = useMyStore();
      expect(store.items).toStrictEqual<MyEntity[]>([]);
    });
  });

  describe("reactive getters", () => {
    it("should reflect fetchStatus from useAsyncAction when created.", () => {
      const store = useMyStore();
      expect(store.fetchStatus).toBe(useAsyncActionMock.fetchStatus.value);
    });

    it("should be true when fetchStatus changes to pending.", () => {
      const store = useMyStore();
      useAsyncActionMock.fetchStatus.value = "pending";
      expect(store.isFetching).toBeTruthy();
    });
  });

  describe("useAsyncAction wiring", () => {
    it("should pass the repository getAll as action to useAsyncAction.", () => {
      useMyStore();
      expect(capturedAction).toBe(myRepository($fetch).getAll);
    });

    it("should call addErrorToast when the error callback is invoked.", () => {
      useMyStore();
      capturedOnError?.();
      expect(useAppToast().addErrorToast).toHaveBeenCalledExactlyOnceWith({
        description: "myEntity.cantFetch",
      });
    });
  });
});
```

#### Multi-action store (store calls `useAsyncAction` more than once)

When the store calls `useAsyncAction` multiple times (e.g. once for fetch, once for create), use a **call counter** to differentiate each invocation and return distinct mock instances:

```ts
let fetchAsyncActionMock: UseAsyncActionMock;
let createAsyncActionMock: UseAsyncActionMock;
let capturedFetchAction: (() => Promise<MyEntity[]>) | undefined;
let capturedFetchOnError: (() => void) | undefined;
let capturedCreateAction: ((dto: unknown) => Promise<MyEntity>) | undefined;
let capturedCreateOnError: (() => void) | undefined;

let useAsyncActionCallCount: number;

mockNuxtImport("useAsyncAction", () => (action: unknown, onError: unknown): UseAsyncActionMock => {
  useAsyncActionCallCount++;
  if (useAsyncActionCallCount === 1) {
    capturedFetchAction = action as () => Promise<MyEntity[]>;
    capturedFetchOnError = onError as () => void;
    fetchAsyncActionMock = createUseAsyncActionMock();
    return fetchAsyncActionMock;
  }

  capturedCreateAction = action as (dto: unknown) => Promise<MyEntity>;
  capturedCreateOnError = onError as () => void;
  createAsyncActionMock = createUseAsyncActionMock();
  return createAsyncActionMock;
});

describe("useMyStore", () => {
  beforeEach(async () => {
    useAsyncActionCallCount = 0;   // reset counter each test
    capturedFetchAction = undefined;
    capturedFetchOnError = undefined;
    capturedCreateAction = undefined;
    capturedCreateOnError = undefined;
    ({ useMyStore } = await import("@/stores/domain/my-entity/my.store"));
  });
  // ...
});
```

Key rules:

- Reset `useAsyncActionCallCount = 0` at the top of `beforeEach`.
- Each mocked instance (`fetchAsyncActionMock`, `createAsyncActionMock`) is independent — mutate their `fetchStatus.value` separately to drive reactive getter assertions.

#### Key rules (all stores)

- `setActivePinia(createPinia())` runs automatically before each test — no need to call it manually.
- `vi.resetModules()` runs automatically — use dynamic import in `beforeEach`.
- Declare `capturedAction` and `capturedOnError` at module level so the `mockNuxtImport` factory can assign to them.
- Reset captured variables to `undefined` at the start of each `beforeEach`.
- Mutate `useAsyncActionMock.fetchStatus.value` to drive reactive getter assertions (e.g. `isPending`, `isFetching`).
- Assert the captured action with `toBe(repositoryInstance($fetch).methodName)` — the repository is globally mocked.
- Assert `capturedOnError?.()` triggers `useAppToast().addErrorToast` with the correct i18n key.

---

### 6.6 Repositories

**Project:** `repositories`
**Spec file location:** Colocated with the repository file (`*.repository.spec.ts`).

Repositories run in a plain Node environment — no Nuxt, no happy-dom, no global `$fetch`. You must create your own fetch mock.

```ts
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { $Fetch } from "nitropack";

import { createFakeItem } from "~~/tests/unit/utils/faketories/.../item.entity.faketory";
import { createFakeItemCreationDto } from "~~/tests/unit/utils/faketories/.../item.dto.faketory";

import { myRepository } from "@/repositories/goat-it-api/my-entity/my.repository";

describe(myRepository, () => {
  let fetchMock: ReturnType<typeof vi.fn<$Fetch>>;

  beforeEach(() => {
    fetchMock = vi.fn<$Fetch>();
  });

  it("should return the repository object when called.", () => {
    const repository = myRepository(fetchMock as $Fetch);
    expect(repository).toStrictEqual({
      getAll: expect.any(Function),
      getById: expect.any(Function),
      create: expect.any(Function),
      patch: expect.any(Function),
      archive: expect.any(Function),
    });
  });

  describe("getAll", () => {
    it("should call fetch with the correct endpoint when called.", async () => {
      const repository = myRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue([]);
      await repository.getAll();

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/my-entities");
    });

    it("should return items when fetch resolves.", async () => {
      const fakeItems: MyEntity[] = [
        createFakeItem(),
        createFakeItem()
      ];
      const repository = myRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue(fakeItems);
      const result = await repository.getAll();

      expect(result).toStrictEqual(fakeItems);
    });
  });

  describe("patch", () => {
    it("should call fetch with the correct endpoint and options when called.", async () => {
      const repository = myRepository(fetchMock as $Fetch);
      const fakeDto = createFakeItemModificationDto();
      fetchMock.mockResolvedValue(createFakeItem());
      await repository.patch("abc123", fakeDto);

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/my-entities/abc123", {
        method: "PATCH",
        body: fakeDto,
      });
    });
  });

  describe("archive", () => {
    it("should call fetch with the correct endpoint and options when called.", async () => {
      const repository = myRepository(fetchMock as $Fetch);
      fetchMock.mockResolvedValue(createFakeItem());
      await repository.archive("abc123");

      expect(fetchMock).toHaveBeenCalledExactlyOnceWith("/api/goat-it-api/my-entities/abc123/archive", {
        method: "POST",
      });
    });
  });
});
```

#### Key rules

- No `mockNuxtImport` — the repository is a plain function.
- Use `describe(myRepository, ...)`
- `fetchMock = vi.fn<$Fetch>()` in `beforeEach`; cast as `$Fetch` when passing to the factory.
- Include a top-level test asserting the repository shape: `expect(repository).toStrictEqual({ getAll: expect.any(Function), ... })`.
- Test each method: what endpoint it calls, what HTTP method/options it passes, and what it returns.
- For methods with params (e.g. `getById(id)`, `patch(id, dto)`, `archive(id)`), test the interpolated URL.
- Use `toStrictEqual(value)` for return value assertions. If type can't be inferred, use `toStrictEqual<T>(value)` for example `toStrictEqual<QuestionTheme[]>([]);`

---

### 6.7 Server handlers

**Project:** `nuxt`
**Spec file location:** Colocated with the handler file (`*.handler.spec.ts`).

Server handler tests run in the `nuxt` environment. The globals `$fetch`, `getRouterParam`, `readBody`, and `createError` are all pre-mocked by the global setup files.

```ts
import type { H3Event } from "h3";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ZodError } from "zod";

import { createFakeItemDto } from "~~/tests/unit/utils/faketories/.../item.dto.faketory";

import { createItemFromDto } from "#server/utils/goat-it-api/mappers/goat-it-api.mappers";
import type { SharedRuntimeConfig } from "#build/types/runtime-config";
import { createGoatItApiEndpoint, createGoatItApiFetchOptions } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";
import { getItemsHandler } from "#server/api/goat-it-api/items/handlers/get-all/index.get.handler";
import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

// Mock the helpers module — uses import() expression syntax
vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"));

// Two-level describe: outer string label, inner function reference
describe("Server Goat It API Items Get Handler", () => {
  beforeEach(() => {
    vi.mocked($fetch).mockResolvedValue([
      createFakeItemDto(),
      createFakeItemDto()
    ]);
  });

  describe(getItemsHandler, () => {
    it("should create the api endpoint when called.", async () => {
      const event = createFakeH3Event();
      await getItemsHandler(event);

      expect(createGoatItApiEndpoint).toHaveBeenCalledExactlyOnceWith("items");
    });

    it("should create api fetch options with the runtime config when called.", async () => {
      const event = createFakeH3Event();
      await getItemsHandler(event);
      const expectedConfig: SharedRuntimeConfig["goatItApi"] = {
        baseUrl: "https://api.goat-it.com",
        adminKey: "test-admin-key",
      };

      expect(createGoatItApiFetchOptions).toHaveBeenCalledExactlyOnceWith(expectedConfig);
    });

    it("should call $fetch with the built endpoint and options when called.", async () => {
      const event = createFakeH3Event();
      const expectedEndpoint = "/admin/items";
      const expectedOptions = {
        baseURL: "https://api.goat-it.com",
        headers: { "goat-it-api-key": "test-admin-key" }
      };
      vi.mocked(createGoatItApiEndpoint).mockReturnValue(expectedEndpoint);
      vi.mocked(createGoatItApiFetchOptions).mockReturnValue(expectedOptions);
      await getItemsHandler(event);

      expect($fetch).toHaveBeenCalledExactlyOnceWith(expectedEndpoint, expectedOptions);
    });

    it("should return mapped items when called.", async () => {
      const event = createFakeH3Event();
      const fakeDtos = [
        createFakeItemDto(),
        createFakeItemDto()
      ];
      vi.mocked($fetch).mockResolvedValue(fakeDtos);
      const expectedItems = fakeDtos.map(createItemFromDto);
      const result = await getItemsHandler(event);

      expect(result).toStrictEqual<MyEntity[]>(expectedItems);
    });

    it("should throw a ZodError when the API response is invalid.", async () => {
      const event = createFakeH3Event();
      vi.mocked($fetch).mockResolvedValue([{ invalid: true }]);

      await expect(getItemsHandler(event)).rejects.toThrow(ZodError);
    });
  });
});
```

#### Handlers with route params (e.g. `[id].archive.post.handler.ts`)

```ts
it("should call getRouterParam with the id param name when called.", async () => {
  const event = createFakeH3Event({ params: { id: "abc123" } });
  vi.mocked(getRouterParam).mockReturnValue("abc123");
  await archiveItemHandler(event);

  expect(getRouterParam).toHaveBeenCalledExactlyOnceWith(event, "id");
});
```

#### Handlers with request body (POST/PATCH)

```ts
it("should call readBody to extract the request body when called.", async () => {
  const event = createFakeH3Event();
  const fakeBody = createFakeItemCreationDto();
  vi.mocked(readBody).mockResolvedValue(fakeBody);
  await createItemHandler(event);

  expect(readBody).toHaveBeenCalledExactlyOnceWith(event);
});
```

#### Testing `createError` calls

When a handler throws via `createError`, test it by catching the thrown error and asserting the `createError` call:

```ts
import { HttpStatusCode } from "#server/utils/http/http.enums";

it("should call createError with the correct status code when the item is not found.", async () => {
  vi.mocked($fetch).mockResolvedValue(null);
  vi.mocked(createError).mockImplementation((args) => {
    throw new Error(String(args.message));
  });
  const event = createFakeH3Event();

  try {
    await getItemHandler(event);
  } catch (error: unknown) {
    void error;
  }

  expect(createError).toHaveBeenCalledExactlyOnceWith({
    statusCode: HttpStatusCode.NotFound,
    message: "Item not found.",
  });
});
```

#### Key rules

- Always mock the helpers module using `import()` expression syntax: `vi.mock(import("#server/utils/goat-it-api/helpers/goat-it-api.helpers"))`.
- Use a **two-level `describe`** pattern: outer string label `"Server Goat It API <Resource> <Method> Handler"`, inner `describe(handlerFn, ...)` with the function reference.
- Use `vi.mocked($fetch).mockResolvedValue(...)` — `$fetch` is already a global spy.
- The runtime config values injected are `baseUrl: "https://api.goat-it.com"` and `adminKey: "test-admin-key"`.
- Always test the Zod validation error path with invalid data.
- Use `HttpStatusCode` enum from `#server/utils/http/http.enums` for status code assertions.
- For routes with params: assert `getRouterParam` was called with `(event, "id")`.
- For routes with body (POST/PATCH): assert `readBody` was called with `(event)`.

#### Swallowing errors to assert side-effect calls

When a handler is expected to throw but the test needs to assert a side-effect call (e.g. `handleGoatItApiError`), use a `try/catch` block — **never** `.catch(() => null)`:

```ts
// GOOD — try/catch with void error
it("should call handleGoatItApiError when $fetch throws an error.", async () => {
  const fetchError = new Error("Network error");
  vi.mocked($fetch).mockRejectedValue(fetchError);

  try {
    await myHandler(mockedEvent);
  } catch (error: unknown) {
    void error;
  }

  expect(handleGoatItApiError).toHaveBeenCalledExactlyOnceWith(fetchError);
});

// BAD — .catch(() => null)
await myHandler(mockedEvent).catch(() => null);
```

---

### 6.8 Server utils / mappers / helpers

**Project:** `node`
**Spec file location:** Colocated with the source file.

These are pure function tests — no mocking, no DOM. Import with `#server/utils/...`.

```ts
import { describe, it, expect } from "vitest";

import { createGoatItApiEndpoint } from "#server/utils/goat-it-api/helpers/goat-it-api.helpers";

describe(createGoatItApiEndpoint, () => {
  it("should return the correct endpoint string when called with a resource name.", () => {
    expect(createGoatItApiEndpoint("items")).toBe("/admin/items");
  });
});
```

For mapper tests, build the expected entity using the entity faketory with spread from the DTO to ensure field alignment:

```ts
import { describe, it, expect } from "vitest";

import { createFakeItemDto } from "~~/tests/unit/utils/faketories/.../item.dto.faketory";
import { createFakeItem } from "~~/tests/unit/utils/faketories/.../item.entity.faketory";
import { createItemFromDto } from "#server/utils/goat-it-api/mappers/goat-it-api.mappers";

describe(createItemFromDto, () => {
  it("should return a mapped item from the DTO when called.", () => {
    const dto = createFakeItemDto();
    const result = createItemFromDto(dto);

    expect(result).toStrictEqual(createFakeItem({
      ...dto,
      createdAt: new Date(dto.createdAt),   // convert ISO string → Date
      updatedAt: new Date(dto.updatedAt),
    }));
  });
});
```

---

### 6.9 Shared helpers

**Project:** `node`
**Spec file location:** Colocated with the helper file.

```ts
import { describe, it, expect } from "vitest";

import { isNonEmptyString } from "#shared/utils/helpers/string.helpers";

describe("String Helpers", () => {
  describe(isNonEmptyString, () => {
    it("should return true when input is a non-empty string.", () => {
      expect(isNonEmptyString("hello")).toBeTruthy();
    });

    it("should return false when input is an empty string.", () => {
      expect(isNonEmptyString("")).toBeFalsy();
    });

    it("should return false when input is undefined.", () => {
      expect(isNonEmptyString()).toBeFalsy();
    });
  });
});
```

Use `#shared/utils/...` import alias. No mocking. Test all branches including edge cases.

---

### 6.10 i18n translation parity

**Project:** `node`
**Spec file location:** `app/i18n/specs/<name>.translations.spec.ts` (NOT colocated — always in `app/i18n/specs/`)

These tests ensure every locale file has the same keys as the French source file.

```ts
import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frMyFeature from "~/i18n/locales/fr/my-feature.json";
import enMyFeature from "~/i18n/locales/en/my-feature.json";

describe("my-feature.json translations", () => {
  it("should have the same keys in english as in french when context is my-feature.", () => {
    const crushedFrKeys = Object.keys(crush(frMyFeature)).toSorted();
    const crushedEnKeys = Object.keys(crush(enMyFeature)).toSorted();

    expect(crushedEnKeys).toStrictEqual<string[]>(crushedFrKeys);
  });
});
```

- One test per locale pair per JSON file.
- `crush` from `radashi` flattens nested JSON into dot-notation keys.
- Assert sorted EN keys equal sorted FR keys.

---

## 7. Component test utilities

### 7.1 `getWrapperVm<T>` and `ComponentVm`

**Location:** `tests/unit/utils/helpers/vtu.helpers.ts`

`getWrapperVm` is a typed helper that extracts the component VM from a `VueWrapper`. VTU does not always type `wrapper.vm` correctly (especially with `mountSuspended`); this helper works around that by casting to a known interface.

```ts
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
```

The base `ComponentVm` type (in `tests/unit/utils/types/vtu.types.ts`) exposes only `$emit`:

```ts
type ComponentVm = {
  $emit: (event: string, ...arguments_: unknown[]) => void;
};
```

#### Emitting events from a child component

Use `getWrapperVm(childWrapper).$emit(...)` to trigger events on child components as if they were emitted by the real component:

```ts
it("should close the modal when the footer emits closeModal.", async () => {
  const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='question-theme-form-modal-footer']");
  getWrapperVm(footer).$emit("closeModal");

  expect(wrapper.emitted("update:open")).toBeDefined();
});
```

#### Accessing exposed component properties

When the component under test exposes properties via `defineExpose`, extend `ComponentVm` with a local type:

```ts
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";

type MyFormVm = ComponentVm & {
  isFormValid: boolean; triggerFormSubmit: () => Promise<void>;
};

it("should disable submit when form is invalid.", () => {
  const vm = getWrapperVm<MyFormVm>(wrapper);
  expect(vm.isFormValid).toBeFalsy();
});
```

#### Setting template refs to null to test null-guard branches

Components often guard against null template refs (e.g. `if (!formRef.value) return`). To cover these branches, use `getWrapperVm` to set the ref to `null` before calling the guarded method:

```ts
it("should not submit when the form reference is null.", async () => {
  const vm = getWrapperVm<MyFormVm>(wrapper);
  vm.$.refs.form = null;

  await vm.triggerFormSubmit();

  expect(wrapper.emitted("submitCreation")).toBeUndefined();
});
```

This pattern is essential for achieving 100% branch coverage on components with optional template refs.

---

### 7.2 `wrapper.emitted()`

Use `wrapper.emitted("eventName")` to check that an event was emitted by the component under test:

```ts
// Assert event was NOT emitted
expect(wrapper.emitted("update:open")).toBeUndefined();

// Assert event was emitted without payload
expect(wrapper.emitted("submitCreation")).toStrictEqual([[]]);

// Assert event was emitted with specific payload
expect(wrapper.emitted("submitCreation")).toStrictEqual([[fakeData]]);
```

Note: `wrapper.emitted()` returns an array of arrays — each inner array contains the arguments of one emission.

---

### 7.3 `wrapper.setProps()`

Use `wrapper.setProps(partialProps)` to reactively mutate props after mounting, without remounting the component. Always `await` it:

```ts
it("should disable the close button when isCreating is true.", async () => {
  await wrapper.setProps({ isCreating: true });

  const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='question-theme-form-modal-footer']");
  expect(footer.props("isCloseButtonDisabled")).toBeTruthy();
});
```

---

### 7.4 `flushPromises`

Use `flushPromises` from `@vue/test-utils` to wait for all pending async operations (e.g. after triggering an event that calls an async function):

```ts
import { flushPromises } from "@vue/test-utils";

it("should emit submitCreation after the primary button click resolves.", async () => {
  const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='question-theme-form-modal-footer']");
  getWrapperVm(footer).$emit("primaryButtonClick");
  await flushPromises();

  expect(wrapper.emitted("submitCreation")).toBeDefined();
});
```

---

### 7.5 Finding elements and components

#### `data-testid` is the required selector for child components

**Always add `data-testid` to the source `.vue` file and use `"[data-testid='...']"` to find components and elements in tests.** This is the only approach that is unambiguous, order-independent, and resilient to component tree refactoring.

`{ name: "ComponentName" }` is a **last-resort fallback** only — use it when the component is a third-party stub (e.g. a `@nuxt/ui` primitive like `UColorPicker`) that cannot have `data-testid` added to its source.

If a component in the template does not yet have a `data-testid`, add one to the source `.vue` file before writing the test.

**Never use `findAllComponents` with `{ name: "..." }` when multiple sibling instances of the same component exist** — the order is fragile. Add a `data-testid` (using `:data-testid` with a dynamic key when in a `v-for`) so each instance is uniquely addressable.

#### `wrapper.findComponent` vs `wrapper.getComponent`

| Method                       | Behavior when not found  | Use when                                        |
|------------------------------|--------------------------|-------------------------------------------------|
| `wrapper.findComponent(...)` | Returns an empty wrapper | You need to check if a component exists         |
| `wrapper.getComponent(...)`  | Throws immediately       | You know the component must exist (prefer this) |

Always provide the generic type parameter for prop assertions:

```ts
// Primary pattern — data-testid selector
const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='question-theme-form-modal-footer']");
const form = wrapper.getComponent<typeof QuestionThemeForm>("[data-testid='question-theme-form-modal-form']");

// Fallback — { name: "..." } only for third-party stubs without accessible source
const colorPicker = wrapper.findComponent<typeof UColorPicker>({ name: "UColorPicker" });
```

#### DOM selectors: element type, ID, CSS class, and `data-testid`

Use `wrapper.find(selector)` for native DOM elements:

```ts
// By element type
const form = wrapper.find("form");

// By ID
const container = wrapper.find("#question-themes-table");

// By CSS class
const label = wrapper.find(".label-text");

// By data-testid — preferred
const button = wrapper.find("[data-testid='input-color-picker-button']");
```

Use `wrapper.findComponent(selector)` to find a Vue component by its `data-testid`:

```ts
const footer = wrapper.findComponent<typeof DefaultModalFooter>("[data-testid='question-theme-form-modal-footer']");
```

#### Dynamic `data-testid` in `v-for` loops

When the same component is rendered multiple times in a `v-for`, use a dynamic `:data-testid` binding so each instance is uniquely addressable:

```vue
<!-- In the source .vue -->
<QuestionThemeAliasPill
  v-for="alias in aliases"
  :key="alias"
  :data-testid="`alias-pill-${alias}`"
  :alias="alias"
/>
```

```ts
// In the spec
const pill = wrapper.findComponent<typeof QuestionThemeAliasPill>("[data-testid='alias-pill-my-alias']");
expect(pill.props("alias")).toBe("my-alias");
```

#### Triggering DOM events

```ts
// Trigger a native event on a DOM element
await wrapper.find("form").trigger("submit");
await wrapper.find("input").trigger("blur");
await wrapper.find("input").trigger("change");
```

---

## 8. Mock infrastructure

All shared mock utilities live in `tests/unit/utils/`.

### 8.1 `ToMock<T>` type

Replaces every function property of `T` with a Vitest `Mock<Fn>`, leaving non-function properties as-is.

```ts
// tests/unit/utils/types/mock.types.ts
type ToMock<Stub> = {
  [Key in keyof Stub]: Stub[Key] extends (...arguments_: unknown[]) => unknown ? Mock<Stub[Key]> : Stub[Key];
};
```

Use it to type your mock objects:

```ts
type MyComposableMock = ToMock<MyComposable>;
```

### 8.2 `MockedPiniaStore<TStoreDefinition>` type

Produces a typed Pinia store where all actions are replaced by Vitest `Mock` functions and getters are unwrapped from `ComputedRef`.

```ts
type MyStoreMock = MockedPiniaStore<typeof useMyStore>;
```

### 8.3 `mockStore` helper

Casts `useStore()` to `MockedPiniaStore<typeof useStore>`. Use it after `mountSuspended` to get a typed store reference with mocked actions.

```ts
import { mockStore } from "~~/tests/unit/utils/mocks/stores/store.mock";

const myStore = mockStore(useMyStore);
// myStore.someAction is a Mock; myStore.someState is writable
```

### 8.4 `MountSuspendedOptions<Component>` type

A convenience type for the second argument of `mountSuspended`:

```ts
import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

async function mountMyComponent(options: MountSuspendedOptions<typeof MyComponent> = {}): Promise<VueWrapper> {
  return mountSuspended(MyComponent, { ...options });
}
```

### 8.5 Composable mock files

Each non-trivial composable has a mock triplet in `tests/unit/utils/mocks/composables/<category>/<ComposableName>/`:

| File                       | Purpose                                                                    |
|----------------------------|----------------------------------------------------------------------------|
| `useXxx.mock.ts`           | Exports `type UseXxxMock` and `function createUseXxxMock(): UseXxxMock`    |
| `useXxx.mock.constants.ts` | Optional — exported constants used by tests (e.g. `DEFAULT_MOCKED_LOCALE`) |
| `useXxx.mock.types.ts`     | Optional — extra types used by the mock                                    |

#### Full mock inventory

| Category | Mock directory    | Factory function                                     | Key members                                                                                                                                 |
|----------|-------------------|------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `core/`  | `useAsyncAction/` | `createUseAsyncActionMock()`                         | `execute`, `fetchStatus`, `isIdle`, `isPending`, `isSuccess`, `isError`                                                                     |
| `core/`  | `useFetchStatus/` | `createUseFetchStatusMock()`                         | `fetchStatus`, `isIdle`, `isPending`, `isSuccess`, `isError`, `setFetchStatusToPending`, `setFetchStatusToSuccess`, `setFetchStatusToError` |
| `nuxt/`  | `createError/`    | `createCreateErrorMock()`                            | `Mock<typeof createError>`                                                                                                                  |
| `nuxt/`  | `h3/`             | `createGetRouterParamMock()`, `createReadBodyMock()` | H3 utility mocks                                                                                                                            |
| `nuxt/`  | `useColorMode/`   | `createUseColorModeMock(initialValue?)`              | Reactive `.value` getter/setter (not spy-based)                                                                                             |
| `nuxt/`  | `useFetch/`       | `createFetchMock()`                                  | `vi.fn<$Fetch>()` — used internally by fetch setup file                                                                                     |
| `nuxt/`  | `useI18n/`        | `createUseI18nMock()`                                | `t`, `locale`, `localeCodes`, `locales`, `setLocale` + constants + types                                                                    |
| `nuxt/`  | `useRouter/`      | `createUseRouterMock()`                              | `getRoutes`, `currentRoute`, `push`, `afterEach`, `beforeResolve`, `beforeEach`, `onError` + constants + types                              |
| `nuxt/`  | `useToast/`       | `createUseToastMock()`                               | `add`, `remove`, `clear`                                                                                                                    |
| `ui/`    | `useAppToast/`    | `createUseAppToastMock()`                            | `addSuccessToast`, `addErrorToast`                                                                                                          |

#### Mock factory pattern

```ts
import { vi } from "vitest";
import { computed, ref } from "vue";
import type { ToMock } from "~~/tests/unit/utils/types/mock.types";
import type { UseMyComposable } from "~/composables/.../useMyComposable";

type UseMyComposableMock = ToMock<UseMyComposable>;

function createUseMyComposableMock(): UseMyComposableMock {
  const status = ref<string>("idle");
  return {
    status,
    isIdle: computed(() => status.value === "idle"),
    doSomething: vi.fn<UseMyComposable["doSomething"]>(),
  };
}

export type { UseMyComposableMock };
export { createUseMyComposableMock };
```

### 8.6 Repository mock files

Repository mocks live in `tests/unit/utils/mocks/repositories/goat-it-api/<RepositoryName>/`.

```ts
import { vi } from "vitest";
import type { ToMock } from "~~/tests/unit/utils/types/mock.types";
import type { MyRepository } from "~/repositories/goat-it-api/my-entity/my.repository";

type MyRepositoryMock = ToMock<ReturnType<MyRepository>>;

function createMyRepositoryMock(): MyRepositoryMock {
  return {
    getAll: vi.fn<MyRepositoryMock["getAll"]>(),
    getById: vi.fn<MyRepositoryMock["getById"]>(),
    create: vi.fn<MyRepositoryMock["create"]>(),
    patch: vi.fn<MyRepositoryMock["patch"]>(),
    archive: vi.fn<MyRepositoryMock["archive"]>(),
  };
}

export type { MyRepositoryMock };
export { createMyRepositoryMock };
```

> **Note:** The mock must include all methods exported by the real repository. Currently the `questionThemesRepository` mock has 5 methods: `getAll`, `getById`, `create`, `patch`, `archive`.

### 8.7 Registering new mocks

#### New composable mock

1. Create `tests/unit/utils/mocks/composables/<category>/<ComposableName>/useXxx.mock.ts`.
2. Create a setup file `tests/unit/setup/nuxt/composables/use-xxx.nuxt.unit-setup.ts` using `mockNuxtImport`.
3. Add the setup file path to `VITEST_COMPOSABLES_MOCK_SETUP_FILES` in `configs/vitest/vitest.config.constants.ts`.

#### New repository mock

1. Create `tests/unit/utils/mocks/repositories/goat-it-api/<ResourceName>/xxx-repository.mock.ts`.
2. Create a setup file `tests/unit/setup/nuxt/repositories/xxx-repository.nuxt.unit-setup.ts` using `vi.mock(...)` (**not** `mockNuxtImport`).
3. Add the setup file path to `VITEST_REPOSITORIES_MOCK_SETUP_FILES` in `configs/vitest/vitest.config.constants.ts`.

> Repository setup files use `vi.mock(...)` instead of `mockNuxtImport` because repositories are not Nuxt auto-imports.

---

## 9. Faketories

Faketories generate typed fake data for tests. They live in `tests/unit/utils/faketories/`.

### Structure

Each entity typically has two layers:

```text
tests/unit/utils/faketories/
  my-entity/
    entity/
      my-entity.entity.faketory.ts   ← domain type (QuestionTheme, etc.)
    dto/
      my-entity.dto.faketory.ts      ← raw API DTO type (may contain multiple factories)
  shared/
    locale/
      locale.faketory.ts             ← shared locale helpers (createFakeLocalizedText, createFakeLocalizedTexts)
```

The DTO faketory may contain multiple factory functions for different use cases (e.g. `createFakeAdminQuestionThemeDto`, `createFakeQuestionThemeCreationDto`, `createFakeQuestionThemeModificationDto`).

### Pattern

```ts
import { faker } from "@faker-js/faker";
import { MY_ENTITY_STATUSES } from "@goat-it/schemas/my-entity";

function createFakeMyEntity(myEntity: Partial<MyEntity> = {}): MyEntity {
  return {
    id: faker.database.mongodbObjectId(),
    slug: faker.lorem.slug(),
    name: faker.lorem.word(),
    status: faker.helpers.arrayElement(MY_ENTITY_STATUSES),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(), ...myEntity,  // always spread at the end
  };
}

export { createFakeMyEntity };
```

### Shared faketories

`tests/unit/utils/faketories/shared/locale/locale.faketory.ts` provides helpers for localized text fields:

- `createFakeLocalizedText(partial?)` — returns a `Partial<LocalizedText>` with random optional values.
- `createFakeLocalizedTexts(partial?)` — returns an array of localized text objects.

Import and use them when building entities or DTOs that have localized fields.

### Rules

- Accept `Partial<T>` as the only parameter, default to `{}`.
- Always spread `...partialOverride` at the end so callers can override any field.
- Use `faker.database.mongodbObjectId()` for IDs.
- Use `faker.lorem.slug()` for slugs.
- Use `faker.helpers.arrayElement(ENUM_VALUES)` for enum fields.
- DTO faketories produce raw API shapes (dates as ISO strings via `.toISOString()`); entity faketories produce domain shapes (dates as `Date` objects via `faker.date.anytime()`).

---

## 10. Naming conventions

| Item               | Convention                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Spec files         | `SourceFile.spec.ts`, colocated with source (exceptions: layouts → `spec/`, i18n → `app/i18n/specs/`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `describe` label   | **Components:** string `"<ComponentName> Component"` (e.g. `"LocaleSelect Component"`). **Pages:** string `"<PageName> Page"` (e.g. `"Home Page"`). **Layouts:** string `"<LayoutName> Layout"` (e.g. `"DefaultLayout Layout"`). **Server handlers:** outer string `"Server Goat It API <Resource> <Method> Handler"`, inner `describe(handlerFn, ...)`. **Functions/composables/stores/repositories:** pass the exported symbol directly (`describe(myFn, ...)`) or use a free-form string when no single symbol represents the subject (e.g. `describe("useAppToast", ...)`, `describe("Goat It API Helpers", ...)`). |
| Test names         | `"should <action> when <condition>."` — always end with a period                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Mount helpers      | `async function mountXxxComponent(options: MountSuspendedOptions<typeof Xxx> = {}): Promise<VueWrapper>`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Faketory functions | `createFake<Entity>(partial: Partial<Entity> = {}): Entity`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Mock type          | `UseXxxMock`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Mock factory       | `createUseXxxMock(): UseXxxMock`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Captured variables | `capturedAction`, `capturedOnError` (store tests); `capturedFetchAction`, `capturedCreateAction` etc. for multi-action stores                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

### Single-call assertion

Always use `toHaveBeenCalledExactlyOnceWith(...)` instead of `toHaveBeenCalledTimes(1)` + `toHaveBeenCalledWith(...)`.

```ts
// Good
expect(myMock).toHaveBeenCalledExactlyOnceWith(expectedArg);

// Avoid
expect(myMock).toHaveBeenCalledTimes(1);
expect(myMock).toHaveBeenCalledWith(expectedArg);
```

---

## 11. Common pitfalls

### Missing dynamic import in composable/store tests

**Wrong:**

```ts
import { useMyComposable } from "@/composables/.../useMyComposable";

describe("useMyComposable", () => {
  it("...", () => {
    const { value } = useMyComposable(); // uses stale mock
  });
});
```

**Correct:** Import dynamically inside `beforeEach` so the module is re-evaluated after the automatic `vi.resetModules()`.

**Exception:** Pattern C — composables with zero external dependencies (no mocked imports) may use a static top-level import.

---

### Calling `mockStore` before `mountSuspended`

`mockStore` returns `useStore()`, which creates the store. If you call it before mounting, the component may create a different store instance than your test reference.

**Always** call `mockStore(useXxxStore)` **after** `mountSuspended` inside `beforeEach`.

---

### Forgetting `shallow: true` on pages and layouts

Page and layout tests stub child components. Without `shallow: true`, the test will attempt to fully render every child (including deeply-nested ones), causing failures and slow tests.

---

### Forgetting to reset captured variables in store tests

The `mockNuxtImport` factory runs once per module load (not per test). Reset `capturedAction = undefined`, `capturedOnError = undefined`, and `useAsyncActionCallCount = 0` (for multi-action stores) at the top of each `beforeEach` to avoid cross-test contamination.

---

### Using `mockNuxtImport` for a globally-mocked composable in component tests

When a composable is already globally mocked (via setup files in `tests/unit/setup/nuxt/composables/`), do **not** add `mockNuxtImport("useFoo", ...)` in your component spec. Just call `useFoo()` directly in the test body — you get back the same mock instance the component received.

```ts
// Wrong — duplicates the global mock
mockNuxtImport("useColorMode", () => () => createUseColorModeMock());

// Correct — use the global mock directly
it("should show dark tooltip when color mode is light.", async () => {
  const colorMode = useColorMode();
  colorMode.value = "light";
  await nextTick();
  // ... assert
});
```

---

### Using `mockNuxtImport` for repository mocks

Repositories are not Nuxt auto-imports — they are regular TypeScript modules. Use `vi.mock(...)` in repository setup files, not `mockNuxtImport`.

---

### Hardcoding locale strings in i18n assertions

The `$t` mock returns the translation key unchanged. Assert against the key:

```ts
// Good
expect(badge.props("label")).toBe("questionThemes.fields.status");

// Wrong
expect(badge.props("label")).toBe("Status"); // hardcoded translated text
```

---

### Not covering all branches

Coverage is enforced at 100%. Make sure to test both truthy and falsy branches, empty vs. non-empty arrays, all status values, and error paths.

---

### Using `describe(MyPage, ...)` for pages, layouts, or components

**Wrong:**

```ts
describe(MyPage, () => {
  // …
});
describe(DefaultLayout, () => {
  // …
});
describe(MyComponent, () => {
  // …
});
```

**Correct:** Always use a string label for visual file types:

```ts
describe("Entity Page", () => {
  // …
});
describe("DefaultLayout Layout", () => {
  // …
});
describe("MyComponent Component", () => {
  // …
});
```

Only functions, composables, stores, and repositories use the symbol reference form.
