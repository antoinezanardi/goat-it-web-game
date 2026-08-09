import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";

const useAsyncActionMock: MockHolder<UseAsyncActionMock> = { instance: createUseAsyncActionMock() };

mockNuxtImport("useAsyncAction", () => () => useAsyncActionMock.instance);

beforeEach(() => {
  useAsyncActionMock.instance = createUseAsyncActionMock();
});

export { useAsyncActionMock };