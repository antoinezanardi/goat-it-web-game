import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseRouterMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock";
import type { UseRouterMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useRouter/useRouter.mock";

let useRouterMock: UseRouterMock = createUseRouterMock();

mockNuxtImport("useRouter", () => (): UseRouterMock => useRouterMock);

beforeEach(() => {
  useRouterMock = createUseRouterMock();
});