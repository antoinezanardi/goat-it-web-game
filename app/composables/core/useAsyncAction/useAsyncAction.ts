import type { AsyncResult } from "#shared/types/async-result.types";
import type { UseAsyncAction } from "@/composables/core/useAsyncAction/use-async-action.types";

/**
 * Wraps an async action with a fetch-status lifecycle and a non-throwing result.
 *
 * `execute` never rejects: it always resolves to an `AsyncResult` discriminated
 * union, drives the status flags, and forwards any failure to the optional
 * `onError`. The status flags are read-only computed refs.
 *
 * @example
 * const { execute } = useAsyncAction(loadQuestions);
 * const result = await execute();
 * if (!result.ok) {
 *   // `result.error` has already been forwarded to `onError`.
 * }
 */
function useAsyncAction<TResult, TArguments extends unknown[] = []>(
  action: (...arguments_: TArguments) => Promise<TResult>,
  onError?: (error: unknown) => void,
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

  async function execute(...arguments_: TArguments): Promise<AsyncResult<TResult>> {
    setFetchStatusToPending();
    try {
      const value = await action(...arguments_);
      setFetchStatusToSuccess();

      return { ok: true, value };
    } catch(error: unknown) {
      setFetchStatusToError();
      onError?.(error);

      return { ok: false, error };
    }
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