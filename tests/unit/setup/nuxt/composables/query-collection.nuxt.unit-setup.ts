import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createQueryCollectionMock } from "~~/tests/unit/utils/mocks/composables/nuxt/queryCollection/queryCollection.mock";
import type { QueryCollectionMock, QueryCollectionMockEntry } from "~~/tests/unit/utils/mocks/composables/nuxt/queryCollection/queryCollection.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

const queryCollectionMock: MockHolder<QueryCollectionMock> = { instance: createQueryCollectionMock() };

mockNuxtImport("queryCollection", () => (collection: string): QueryCollectionMockEntry => queryCollectionMock.instance(collection));

beforeEach(() => {
  queryCollectionMock.instance = createQueryCollectionMock();
});

export { queryCollectionMock };