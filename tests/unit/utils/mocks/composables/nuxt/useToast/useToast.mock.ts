import { vi } from "vitest";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { Toast } from "#ui/composables";

const MOCKED_TOAST_ID = "mocked-toast-id";

type UseToastStub = {
  add: (options: Partial<Toast>) => Toast;
  remove: (options: Partial<Toast>) => void;
  clear: (options: Partial<Toast>) => void;
};

type UseToastMock = ToMock<UseToastStub>;

/**
 * Creates a mock implementation of the `useToast` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseToastMock(): UseToastMock {
  return {
    // Acceptable as mock-shape cast: partial Toast with only `id` is sufficient for test assertions
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    add: vi.fn<UseToastStub["add"]>(() => ({ id: MOCKED_TOAST_ID }) as Toast),
    remove: vi.fn<UseToastStub["remove"]>(),
    clear: vi.fn<UseToastStub["clear"]>(),
  };
}

export type { UseToastMock };

export { MOCKED_TOAST_ID, createUseToastMock };