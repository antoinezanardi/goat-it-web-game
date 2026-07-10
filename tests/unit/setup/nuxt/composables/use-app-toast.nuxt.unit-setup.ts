import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";

let useAppToastMock: UseAppToastMock = createUseAppToastMock();

mockNuxtImport("useAppToast", () => (): UseAppToastMock => useAppToastMock);

beforeEach(() => {
  useAppToastMock = createUseAppToastMock();
});