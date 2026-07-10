import type { AsyncDataRequestStatus } from "#app";

type UseAsyncAction<TResult, TArguments extends unknown[]> = {
  execute: (...arguments_: TArguments) => Promise<TResult | undefined>;
  fetchStatus: Ref<AsyncDataRequestStatus>;
  isIdle: ComputedRef<boolean>;
  isPending: ComputedRef<boolean>;
  isSuccess: ComputedRef<boolean>;
  isError: ComputedRef<boolean>;
};

function useAsyncAction<TResult, TArguments extends unknown[] = []>(
  action: (...arguments_: TArguments) => Promise<TResult>,
  onError: (error: unknown) => void,
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

  async function execute(...arguments_: TArguments): Promise<TResult | undefined> {
    setFetchStatusToPending();
    try {
      const result = await action(...arguments_);
      setFetchStatusToSuccess();

      return result;
    } catch(error: unknown) {
      setFetchStatusToError();
      onError(error);
    }
    return undefined;
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

export type {
  UseAsyncAction,
};

export { useAsyncAction };