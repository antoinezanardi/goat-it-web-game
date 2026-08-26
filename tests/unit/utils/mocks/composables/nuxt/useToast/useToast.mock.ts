import { vi } from "vitest";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { Toast } from "#ui/composables";

const MOCKED_TOAST_ID = "mocked-toast-id";

type ToastEventHandler = (...arguments_: unknown[]) => void;

type UseToastStub = {
  add: (options: Partial<Toast>) => Toast;
  remove: (id: string | number) => void;
  clear: () => void;
};

type UseToastMock = ToMock<UseToastStub>;

/**
 * Creates a full fake toast satisfying every required Toast event handler.
 * Can only be used from unit tests mocks.
 */
function createMockedToast(): Toast {
  return {
    "id": MOCKED_TOAST_ID,
    "onEscapeKeyDown": vi.fn<ToastEventHandler>(),
    "onPause": vi.fn<ToastEventHandler>(),
    "onResume": vi.fn<ToastEventHandler>(),
    "onSwipeStart": vi.fn<ToastEventHandler>(),
    "onSwipeMove": vi.fn<ToastEventHandler>(),
    "onSwipeCancel": vi.fn<ToastEventHandler>(),
    "onSwipeEnd": vi.fn<ToastEventHandler>(),
    "onUpdate:open": vi.fn<ToastEventHandler>(),
  };
}

/**
 * Creates a mock implementation of the `useToast` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseToastMock(): UseToastMock {
  return {
    add: vi.fn<UseToastStub["add"]>(createMockedToast),
    remove: vi.fn<UseToastStub["remove"]>(),
    clear: vi.fn<UseToastStub["clear"]>(),
  };
}

export type { UseToastMock };

export { MOCKED_TOAST_ID, createMockedToast, createUseToastMock };