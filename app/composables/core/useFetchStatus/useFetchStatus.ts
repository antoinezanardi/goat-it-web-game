import type { AsyncDataRequestStatus } from "#app";
import type { UseFetchStatus } from "@/composables/core/useFetchStatus/use-fetch-status.types";

/**
 * Tracks an async operation through the `idle | pending | success | error` lifecycle.
 *
 * Starts in `idle` and exposes read-only computed flags plus three setters; the
 * setters are the only supported mutation path for `fetchStatus`.
 */
function useFetchStatus(): UseFetchStatus {
  const fetchStatus = ref<AsyncDataRequestStatus>("idle");

  const isIdle = computed<boolean>(() => fetchStatus.value === "idle");
  const isPending = computed<boolean>(() => fetchStatus.value === "pending");
  const isSuccess = computed<boolean>(() => fetchStatus.value === "success");
  const isError = computed<boolean>(() => fetchStatus.value === "error");

  function setFetchStatusToPending(): void {
    fetchStatus.value = "pending";
  }

  function setFetchStatusToSuccess(): void {
    fetchStatus.value = "success";
  }

  function setFetchStatusToError(): void {
    fetchStatus.value = "error";
  }
  return {
    fetchStatus,
    isIdle,
    isPending,
    isSuccess,
    isError,
    setFetchStatusToPending,
    setFetchStatusToSuccess,
    setFetchStatusToError,
  };
}

export {
  useFetchStatus,
};