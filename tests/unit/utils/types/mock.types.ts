import type { Store, StoreDefinition } from "pinia";
import type { Mock } from "vitest";

/**
 * Replaces every function property of `Stub` with a Vitest `Mock`, leaving non-function properties as-is.
 *
 * Why it exists: mock factories (`createUseXxxMock`, `createMyRepositoryMock`) must expose each function
 * of the real API as a typed `vi.fn()` so tests can assert calls and override implementations, while
 * refs and plain values stay untouched. Only used in unit tests.
 */
type ToMock<Stub> = {
  [Key in keyof Stub]: Stub[Key] extends (...arguments_: unknown[]) => unknown ? Mock<Stub[Key]> : Stub[Key];
};

/**
 * Holds the current mock instance of a globally mocked composable.
 *
 * Why it exists: a setup file registers the mock via `mockNuxtImport("useXxx", () => () => holder.instance)`
 * and `beforeEach` replaces `holder.instance` with a fresh mock to isolate tests. Destructuring at module
 * scope would capture the stale instance created at module evaluation; the holder gives tests a stable
 * reference that always points to the current mock. Only used in unit tests setup files.
 */
type MockHolder<T> = {
  instance: T;
};

/**
 * Shapes a Pinia store into its mock form: actions become Vitest `Mock` functions and getters are
 * unwrapped from `ComputedRef` to plain values.
 *
 * Why it exists: `createTestingPinia()` does not type actions as mocks, so `mockStore` casts the store
 * to this type to give component tests typed actions (`myStore.fetch.mockResolvedValue(...)`) and
 * readable getter values. Only used in unit tests.
 */
type MockedPiniaStore<TStoreDefinition extends () => unknown> =
  TStoreDefinition extends StoreDefinition<
    infer Id,
    infer State,
    infer Getters,
    infer Actions
  > ?
  Store<
    Id,
    State,
    Record<string, never>,
    {
      [Key in keyof Actions]: Actions[Key] extends (
        ...arguments_: infer Arguments
      ) => infer ReturnT ?
        Mock<(...arguments_: Arguments) => ReturnT> :
        Actions[Key];
    }
  > & {
    [Key in keyof Getters]: Getters[Key] extends ComputedRef<infer Value> ? Value : never;
  } : ReturnType<TStoreDefinition>;

export type {
  ToMock,
  MockHolder,
  MockedPiniaStore,
};