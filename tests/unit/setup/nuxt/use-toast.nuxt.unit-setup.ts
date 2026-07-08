import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseToastMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock";
import type { UseToastMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock";

let useToastMock: UseToastMock = createUseToastMock();

mockNuxtImport("useToast", () => (): UseToastMock => useToastMock);

beforeEach(() => {
  useToastMock = createUseToastMock();
});