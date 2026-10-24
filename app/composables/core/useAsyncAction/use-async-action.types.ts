import type { AsyncDataRequestStatus } from "#app";
import type { AsyncResult } from "#shared/types/async-result.types";

/**
 * Contract returned by `useAsyncAction`: the executable and its read-only lifecycle flags.
 */
type UseAsyncAction<TResult, TArguments extends unknown[]> = {
  /** Runs the wrapped action and moves `fetchStatus` from pending to success or error. */
  execute: (...arguments_: TArguments) => Promise<AsyncResult<TResult>>;
  /** Lifecycle status of the last execution; change it through `execute`, not directly. */
  fetchStatus: Ref<AsyncDataRequestStatus>;
  /** True until the first execution starts. */
  isIdle: ComputedRef<boolean>;
  /** True while the wrapped action is in flight. */
  isPending: ComputedRef<boolean>;
  /** True when the last execution resolved successfully. */
  isSuccess: ComputedRef<boolean>;
  /** True when the last execution failed. */
  isError: ComputedRef<boolean>;
};

export type { UseAsyncAction };