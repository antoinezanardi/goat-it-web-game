import { vi } from "vitest";
import { computed, ref } from "vue";

import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

import type { UseFetchStatus } from "~/composables/core/useFetchStatus/useFetchStatus";
import type { AsyncDataRequestStatus } from "#app";

type UseFetchStatusMock = ToMock<UseFetchStatus>;

/**
 * Creates a mock implementation of the `useFetchStatus` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseFetchStatusMock(): UseFetchStatusMock {
  const fetchStatus = ref<AsyncDataRequestStatus>("idle");

  return {
    fetchStatus,
    isIdle: computed<boolean>(() => fetchStatus.value === "idle"),
    isPending: computed<boolean>(() => fetchStatus.value === "pending"),
    isSuccess: computed<boolean>(() => fetchStatus.value === "success"),
    isError: computed<boolean>(() => fetchStatus.value === "error"),
    setFetchStatusToPending: vi.fn<UseFetchStatus["setFetchStatusToPending"]>(),
    setFetchStatusToSuccess: vi.fn<UseFetchStatus["setFetchStatusToSuccess"]>(),
    setFetchStatusToError: vi.fn<UseFetchStatus["setFetchStatusToError"]>(),
  };
}

export type { UseFetchStatusMock };

export { createUseFetchStatusMock };