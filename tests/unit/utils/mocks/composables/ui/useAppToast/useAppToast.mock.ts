import { vi } from "vitest";

import { createMockedToast } from "~~/tests/unit/utils/mocks/composables/nuxt/useToast/useToast.mock";
import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseAppToast } from "~/composables/ui/useAppToast/useAppToast";

type UseAppToastMock = ToMock<UseAppToast>;

/**
 * Creates a mock implementation of the `useAppToast` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseAppToastMock(): UseAppToastMock {
  return {
    addSuccessToast: vi.fn<UseAppToast["addSuccessToast"]>(createMockedToast),
    addErrorToast: vi.fn<UseAppToast["addErrorToast"]>(createMockedToast),
    addInfoToast: vi.fn<UseAppToast["addInfoToast"]>(createMockedToast),
    removeToast: vi.fn<UseAppToast["removeToast"]>(),
  };
}

export type { UseAppToastMock };

export { createUseAppToastMock };