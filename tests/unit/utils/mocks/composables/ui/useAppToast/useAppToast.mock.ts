import { vi } from "vitest";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseAppToast } from "~/composables/ui/useAppToast/useAppToast";

type UseAppToastMock = ToMock<UseAppToast>;

/**
 * Creates a mock implementation of the `useAppToast` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseAppToastMock(): UseAppToastMock {
  return {
    addSuccessToast: vi.fn<UseAppToast["addSuccessToast"]>(),
    addErrorToast: vi.fn<UseAppToast["addErrorToast"]>(),
  };
}

export type { UseAppToastMock };

export { createUseAppToastMock };