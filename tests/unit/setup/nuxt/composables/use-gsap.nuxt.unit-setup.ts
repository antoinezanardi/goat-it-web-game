import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";

const useGsapMock: MockHolder<UseGSAPMock> = { instance: createUseGSAPMock() };

mockNuxtImport("useGSAP", () => () => useGsapMock.instance);

beforeEach(() => {
  useGsapMock.instance = createUseGSAPMock();
});

export { useGsapMock };