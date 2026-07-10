import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";
import type { UseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";

let useFetchStatusMock: UseFetchStatusMock = createUseFetchStatusMock();

mockNuxtImport("useFetchStatus", () => (): UseFetchStatusMock => useFetchStatusMock);

beforeEach(() => {
  useFetchStatusMock = createUseFetchStatusMock();
});