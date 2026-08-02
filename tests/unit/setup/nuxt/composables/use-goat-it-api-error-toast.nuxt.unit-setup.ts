import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";
import type { UseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";

let useGoatItApiErrorToastMock: UseGoatItApiErrorToastMock = createUseGoatItApiErrorToastMock();

mockNuxtImport("useGoatItApiErrorToast", () => (): UseGoatItApiErrorToastMock => useGoatItApiErrorToastMock);

beforeEach(() => {
  useGoatItApiErrorToastMock = createUseGoatItApiErrorToastMock();
});