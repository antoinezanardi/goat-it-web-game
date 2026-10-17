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

export type { UseFetchStatus };