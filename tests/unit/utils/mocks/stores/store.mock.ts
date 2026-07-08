import type { MockedPiniaStore } from "~~/tests/unit/utils/types/mock.types";

/**
 * Mocks a Pinia store by returning the store with mocked actions and writable refs.
 * Only used in unit tests.
 * @param useStore
 */
function mockStore<TStoreDefinition extends () => unknown>(useStore: TStoreDefinition): MockedPiniaStore<TStoreDefinition> {
  // Acceptable as we want to return the store with mocked actions and writable refs
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return useStore() as MockedPiniaStore<TStoreDefinition>;
}

export {
  mockStore,
};