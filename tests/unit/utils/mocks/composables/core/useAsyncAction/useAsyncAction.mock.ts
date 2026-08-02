import { vi } from "vitest";
import { computed, ref } from "vue";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseAsyncAction } from "~/composables/core/useAsyncAction/useAsyncAction";
import type { AsyncDataRequestStatus } from "#app";

type UseAsyncActionMock = ToMock<UseAsyncAction<unknown, unknown[]>>;

/**
 * Creates a mock implementation of the `useAsyncAction` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseAsyncActionMock(): UseAsyncActionMock {
  const fetchStatus = ref<AsyncDataRequestStatus>("idle");

  return {
    execute: vi.fn<UseAsyncAction<unknown, unknown[]>["execute"]>(),
    fetchStatus,
    isIdle: computed<boolean>(() => fetchStatus.value === "idle"),
    isPending: computed<boolean>(() => fetchStatus.value === "pending"),
    isSuccess: computed<boolean>(() => fetchStatus.value === "success"),
    isError: computed<boolean>(() => fetchStatus.value === "error"),
  };
}

export type { UseAsyncActionMock };

export { createUseAsyncActionMock };