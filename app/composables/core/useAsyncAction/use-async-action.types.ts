import type { AsyncDataRequestStatus } from "#app";
import type { AsyncResult } from "#shared/types/async-result.types";

type AsyncActionContext = {
  signal: AbortSignal;
};

type ActiveAsyncActionRequest = {
  requestId: number;
  controller: AbortController;
  timer: ReturnType<typeof setTimeout> | undefined;
};

type UseAsyncActionOptions = {
  onError?: (error: unknown) => void;
  timeoutInMs?: number;
};

type UseAsyncAction<TResult, TArguments extends unknown[]> = {
  execute: (...arguments_: TArguments) => Promise<AsyncResult<TResult>>;
  fetchStatus: Ref<AsyncDataRequestStatus>;
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
};

export type { ActiveAsyncActionRequest, AsyncActionContext, UseAsyncAction, UseAsyncActionOptions };