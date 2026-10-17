import type { AsyncDataRequestStatus } from "#app";

type UseAsyncAction<TResult, TArguments extends unknown[]> = {
  execute: (...arguments_: TArguments) => Promise<TResult | undefined>;
  fetchStatus: Ref<AsyncDataRequestStatus>;
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
};

export type { UseAsyncAction };