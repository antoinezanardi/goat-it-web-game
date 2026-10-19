import type { UseAsyncAction, UseAsyncActionResult } from "@/composables/core/useAsyncAction/use-async-action.types";

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

  async function execute(...arguments_: TArguments): Promise<UseAsyncActionResult<TResult>> {
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