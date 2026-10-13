import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseAsyncDataMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useAsyncData/useAsyncData.mock";
import type { UseAsyncDataMock, UseAsyncDataMockResult, UseAsyncDataMockSignature } from "~~/tests/unit/utils/mocks/composables/nuxt/useAsyncData/useAsyncData.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

const useAsyncDataMock: MockHolder<UseAsyncDataMock> = { instance: createUseAsyncDataMock() };

mockNuxtImport("useAsyncData", () => (...arguments_: Parameters<UseAsyncDataMockSignature>): UseAsyncDataMockResult => useAsyncDataMock.instance(...arguments_));

beforeEach(() => {
  useAsyncDataMock.instance = createUseAsyncDataMock();
});

export { useAsyncDataMock };