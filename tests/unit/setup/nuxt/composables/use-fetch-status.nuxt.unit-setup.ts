import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";

const useFetchStatusMock: MockHolder<UseFetchStatusMock> = { instance: createUseFetchStatusMock() };

mockNuxtImport("useFetchStatus", () => () => useFetchStatusMock.instance);

beforeEach(() => {
  useFetchStatusMock.instance = createUseFetchStatusMock();
});

export { useFetchStatusMock };