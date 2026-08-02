import type { AsyncDataRequestStatus } from "#app";

type UseFetchStatus = {
  fetchStatus: Ref<AsyncDataRequestStatus>;
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
  setFetchStatusToPending: () => void;
  setFetchStatusToSuccess: () => void;
  setFetchStatusToError: () => void;
};

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

export type {
  UseFetchStatus,
};

export {
  useFetchStatus,
};