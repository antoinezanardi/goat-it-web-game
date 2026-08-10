import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";

const useGoatItApiErrorToastMock: MockHolder<UseGoatItApiErrorToastMock> = { instance: createUseGoatItApiErrorToastMock() };

mockNuxtImport("useGoatItApiErrorToast", () => () => useGoatItApiErrorToastMock.instance);

beforeEach(() => {
  useGoatItApiErrorToastMock.instance = createUseGoatItApiErrorToastMock();
});

export { useGoatItApiErrorToastMock };