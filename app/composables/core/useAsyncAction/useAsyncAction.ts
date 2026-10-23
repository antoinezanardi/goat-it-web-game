import type { AsyncResult } from "#shared/types/async-result.types";
import {
  ASYNC_ACTION_ABORT_ERROR_NAME,
  ASYNC_ACTION_SUPERSEDED_MESSAGE,
  ASYNC_ACTION_TIMEOUT_ERROR_NAME,
  ASYNC_ACTION_TIMEOUT_MESSAGE,
} from "@/composables/core/useAsyncAction/use-async-action.constants";
import type {
  ActiveAsyncActionRequest,
  AsyncActionContext,
  UseAsyncAction,
  UseAsyncActionOptions,
} from "@/composables/core/useAsyncAction/use-async-action.types";

/**
 * Creates a latest-wins async lane.
 *
 * Every `execute` call supersedes the previous in-flight request of the same instance: the previous
 * signal is aborted with an `AbortError` reason and its timer is cleared. A call that is superseded
 * before it settles resolves `{ ok: false, superseded: true }` and never writes the fetch status,
 * the caller's state or calls `onError`. The action receives `{ signal }` as its first argument and
 * must forward it cooperatively (repositories pass it to `$fetch`); a non-cooperative action only
 * settles when it settles. When `timeoutInMs` is provided, the current request's signal is aborted
 * with a `TimeoutError` reason at that deadline and the timer never outlives its request.
 */
function useAsyncAction<TResult, TArguments extends unknown[] = []>(
  action: (context: AsyncActionContext, ...arguments_: TArguments) => Promise<TResult>,
  options: UseAsyncActionOptions = {},
): UseAsyncAction<TResult, TArguments> {
  const {
    fetchStatus,
    isIdle,
    isPending,
    isSuccess,
    isError,
    setFetchStatusToPending,
    setFetchStatusToSuccess,
    setFetchStatusToError,
  } = useFetchStatus();

  let latestRequestId = 0;
  let activeRequest: ActiveAsyncActionRequest | undefined;

  async function execute(...arguments_: TArguments): Promise<AsyncResult<TResult>> {
    const requestId = ++latestRequestId;
    if (activeRequest) {
      clearTimeout(activeRequest.timer);
      activeRequest.controller.abort(new DOMException(ASYNC_ACTION_SUPERSEDED_MESSAGE, ASYNC_ACTION_ABORT_ERROR_NAME));
    }
    const controller = new AbortController();
    const timer = options.timeoutInMs === undefined ? undefined : setTimeout(() => {
      controller.abort(new DOMException(ASYNC_ACTION_TIMEOUT_MESSAGE, ASYNC_ACTION_TIMEOUT_ERROR_NAME));
    }, options.timeoutInMs);
    activeRequest = { requestId, controller, timer };
    setFetchStatusToPending();

    let result: AsyncResult<TResult>;
    try {
      const value = await action({ signal: controller.signal }, ...arguments_);
      result = { ok: true, value };
    } catch(error: unknown) {
      result = { ok: false, error };
    }
    clearTimeout(timer);
    if (requestId !== latestRequestId) {
      return { ok: false, superseded: true };
    }
    activeRequest = undefined;
    if (result.ok) {
      setFetchStatusToSuccess();

      return result;
    }
    setFetchStatusToError();
    options.onError?.(result.error);

    return result;
  }
  return {
    execute,
    fetchStatus,
    isIdle,
    isPending,
    isSuccess,
    isError,
  };
}

export { useAsyncAction };