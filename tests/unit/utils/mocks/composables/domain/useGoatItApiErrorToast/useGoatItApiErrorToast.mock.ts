import { vi } from "vitest";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseGoatItApiErrorToast } from "~/composables/domain/useGoatItApiErrorToast/useGoatItApiErrorToast";

type UseGoatItApiErrorToastMock = ToMock<UseGoatItApiErrorToast>;

/**
 * Creates a mock implementation of the `useGoatItApiErrorToast` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseGoatItApiErrorToastMock(): UseGoatItApiErrorToastMock {
  return {
    handleGoatItApiError: vi.fn<UseGoatItApiErrorToast["handleGoatItApiError"]>(),
  };
}

export type { UseGoatItApiErrorToastMock };

export { createUseGoatItApiErrorToastMock };