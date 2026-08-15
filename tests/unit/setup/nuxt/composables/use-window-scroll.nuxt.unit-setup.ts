import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";
import type { UseWindowScrollOptions } from "@vueuse/core";

import { createUseWindowScrollMock } from "~~/tests/unit/utils/mocks/composables/core/useWindowScroll/useWindowScroll.mock";
import type { UseWindowScrollMock } from "~~/tests/unit/utils/mocks/composables/core/useWindowScroll/useWindowScroll.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

const useWindowScrollMock: MockHolder<UseWindowScrollMock> = { instance: createUseWindowScrollMock() };

mockNuxtImport("useWindowScroll", () => (options: UseWindowScrollOptions | undefined): UseWindowScrollMock => {
  useWindowScrollMock.instance.capturedOptions.current = options;

  return useWindowScrollMock.instance;
});

beforeEach(() => {
  useWindowScrollMock.instance = createUseWindowScrollMock();
});

export { useWindowScrollMock };