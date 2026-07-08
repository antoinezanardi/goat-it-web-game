import { vi } from "vitest";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { Toast } from "#ui/composables";

type UseToastStub = {
  add: (options: Partial<Toast>) => void;
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
    add: vi.fn<UseToastStub["add"]>(),
    remove: vi.fn<UseToastStub["remove"]>(),
    clear: vi.fn<UseToastStub["clear"]>(),
  };
}

export type { UseToastMock };

export { createUseToastMock };