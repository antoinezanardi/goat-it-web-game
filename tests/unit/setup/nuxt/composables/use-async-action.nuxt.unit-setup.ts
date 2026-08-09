import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";

const useAsyncActionMock: MockHolder<UseAsyncActionMock> = { instance: createUseAsyncActionMock() };

// Acceptable as mock factory return type is inferred from createUseAsyncActionMock
// oxlint-disable-next-line typescript/explicit-function-return-type
mockNuxtImport("useAsyncAction", () => () => useAsyncActionMock.instance);

beforeEach(() => {
  useAsyncActionMock.instance = createUseAsyncActionMock();
});

export { useAsyncActionMock };