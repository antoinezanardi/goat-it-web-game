import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseGoatItApiErrorToastMock } from "~~/tests/unit/utils/mocks/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast.mock";

const useGoatItApiErrorToastMock: MockHolder<UseGoatItApiErrorToastMock> = { instance: createUseGoatItApiErrorToastMock() };

// Acceptable as mock factory return type is inferred from createUseGoatItApiErrorToastMock
// oxlint-disable-next-line typescript/explicit-function-return-type
mockNuxtImport("useGoatItApiErrorToast", () => () => useGoatItApiErrorToastMock.instance);

beforeEach(() => {
  useGoatItApiErrorToastMock.instance = createUseGoatItApiErrorToastMock();
});

export { useGoatItApiErrorToastMock };