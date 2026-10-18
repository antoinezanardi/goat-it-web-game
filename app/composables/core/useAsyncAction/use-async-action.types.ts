import type { AsyncDataRequestStatus } from "#app";

type UseAsyncActionResult<TResult> =
  | { ok: true; value: TResult } |
  { ok: false; error: unknown };

type UseAsyncAction<TResult, TArguments extends unknown[]> = {
  execute: (...arguments_: TArguments) => Promise<UseAsyncActionResult<TResult>>;
  fetchStatus: Ref<AsyncDataRequestStatus>;
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
};

export type { UseAsyncAction, UseAsyncActionResult };