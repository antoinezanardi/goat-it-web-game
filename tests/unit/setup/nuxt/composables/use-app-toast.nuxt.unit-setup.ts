import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseAppToastMock } from "~~/tests/unit/utils/mocks/composables/ui/useAppToast/useAppToast.mock";

const useAppToastMock: MockHolder<UseAppToastMock> = { instance: createUseAppToastMock() };

// Acceptable as mock factory return type is inferred from createUseAppToastMock
// oxlint-disable-next-line typescript/explicit-function-return-type
mockNuxtImport("useAppToast", () => () => useAppToastMock.instance);

beforeEach(() => {
  useAppToastMock.instance = createUseAppToastMock();
});

export { useAppToastMock };