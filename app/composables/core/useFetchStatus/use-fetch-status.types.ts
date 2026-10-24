import type { AsyncDataRequestStatus } from "#app";

/**
 * Contract returned by `useFetchStatus`: the status ref, derived flags, and setters.
 */
type UseFetchStatus = {
  fetchStatus: Ref<AsyncDataRequestStatus>;
  /** True only until one of the setters below is called. */
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
  setFetchStatusToPending: () => void;
  setFetchStatusToSuccess: () => void;
  setFetchStatusToError: () => void;
};

export type { UseFetchStatus };