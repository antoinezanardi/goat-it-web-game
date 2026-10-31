import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGsapMock } from "~~/tests/unit/utils/mocks/composables/core/useGsap/useGsap.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseGsapMock } from "~~/tests/unit/utils/mocks/composables/core/useGsap/useGsap.mock.types";

const useGsapMock: MockHolder<UseGsapMock> = { instance: createUseGsapMock() };

mockNuxtImport("useGsap", () => () => useGsapMock.instance);

beforeEach(() => {
  useGsapMock.instance = createUseGsapMock();
});

export { useGsapMock };