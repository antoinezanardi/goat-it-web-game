import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";
import type { UseAsyncActionMock } from "~~/tests/unit/utils/mocks/composables/core/useAsyncAction/useAsyncAction.mock";

let useAsyncActionMock: UseAsyncActionMock = createUseAsyncActionMock();

mockNuxtImport("useAsyncAction", () => (): UseAsyncActionMock => useAsyncActionMock);

beforeEach(() => {
  useAsyncActionMock = createUseAsyncActionMock();
});