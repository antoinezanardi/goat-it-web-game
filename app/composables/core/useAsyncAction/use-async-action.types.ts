import type { AsyncDataRequestStatus } from "#app";
import type { AsyncResult } from "#shared/types/async-result.types";

type UseAsyncAction<TResult, TArguments extends unknown[]> = {
  execute: (...arguments_: TArguments) => Promise<AsyncResult<TResult>>;
  fetchStatus: Ref<AsyncDataRequestStatus>;
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
};

export type { UseAsyncAction };