import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { createUseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";
import type { UseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";

import type { AsyncActionContext } from "@/composables/core/useAsyncAction/use-async-action.types";
import type { useAsyncAction as UseAsyncActionType } from "@/composables/core/useAsyncAction/useAsyncAction";

let useFetchStatusMock: UseFetchStatusMock;

mockNuxtImport("useFetchStatus", () => (): UseFetchStatusMock => useFetchStatusMock);

let useAsyncAction: typeof UseAsyncActionType;

function createAbortRejectingAction(abortError: Error): Mock<(context: AsyncActionContext) => Promise<never>> {
  return vi.fn<(context: AsyncActionContext) => Promise<never>>(async({ signal }) => {
    const rejection = Promise.withResolvers<never>();
    signal.addEventListener("abort", () => rejection.reject(abortError));

    return rejection.promise;
  });
}

describe("useAsyncAction", () => {
  beforeEach(async() => {
    useFetchStatusMock = createUseFetchStatusMock();
    ({ useAsyncAction } = await import("@/composables/core/useAsyncAction/useAsyncAction"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("execute", () => {
    it("should call setFetchStatusToPending when called.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>();
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      await execute();

      expect(useFetchStatusMock.setFetchStatusToPending).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call the action with the context and the provided arguments when called.", async() => {
      const action = vi.fn<(context: AsyncActionContext, count: number, label: string) => Promise<void>>();
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      await execute(42, "hello");

      expect(action).toHaveBeenCalledExactlyOnceWith({ signal: expect.any(AbortSignal) as AbortSignal }, 42, "hello");
    });

    it("should call the action with a signal that is not aborted when execute is called.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>();
      const { execute } = useAsyncAction(action);

      await execute();

      expect(action.mock.calls[0]?.[0].signal.aborted).toBe(false);
    });

    it("should call setFetchStatusToSuccess when action resolves.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>().mockResolvedValue("result");
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      await execute();

      expect(useFetchStatusMock.setFetchStatusToSuccess).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return a success result with the value when action resolves.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>().mockResolvedValue("result");
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      const result = await execute();

      expect(result).toStrictEqual({ ok: true, value: "result" });
    });

    it("should not call onError when action resolves.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>();
      const onError = vi.fn<(error: unknown) => void>();
      const { execute } = useAsyncAction(action, { onError });

      await execute();

      expect(onError).not.toHaveBeenCalled();
    });

    it("should call setFetchStatusToError when action rejects.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>().mockRejectedValue(new Error("something went wrong"));
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      await execute();

      expect(useFetchStatusMock.setFetchStatusToError).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call onError with the error when action rejects.", async() => {
      const error = new Error("something went wrong");
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>().mockRejectedValue(error);
      const onError = vi.fn<(error: unknown) => void>();
      const { execute } = useAsyncAction(action, { onError });

      await execute();

      expect(onError).toHaveBeenCalledExactlyOnceWith(error);
    });

    it("should return a failure result with the error when action rejects.", async() => {
      const error = new Error("fail");
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>().mockRejectedValue(error);
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      const result = await execute();

      expect(result).toStrictEqual({ ok: false, error });
    });

    it("should return a failure result when action rejects and options are omitted.", async() => {
      const error = new Error("fail");
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>().mockRejectedValue(error);
      const { execute } = useAsyncAction(action);

      const result = await execute();

      expect(result).toStrictEqual({ ok: false, error });
    });

    it("should not call setFetchStatusToSuccess when action rejects.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>().mockRejectedValue(new Error("fail"));
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      await execute();

      expect(useFetchStatusMock.setFetchStatusToSuccess).not.toHaveBeenCalled();
    });

    it("should not call setFetchStatusToError when action resolves.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>();
      const { execute } = useAsyncAction(action, { onError: vi.fn<(error: unknown) => void>() });

      await execute();

      expect(useFetchStatusMock.setFetchStatusToError).not.toHaveBeenCalled();
    });

    it("should abort the previous signal with an AbortError reason when execute is called while pending.", async() => {
      const firstAction = Promise.withResolvers<undefined>();
      let firstSignal: AbortSignal | undefined;
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>()
        .mockImplementationOnce(async context => {
          firstSignal = context.signal;
          await firstAction.promise;
        })
        .mockResolvedValueOnce(undefined);
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      const secondExecution = execute();

      expect((firstSignal?.reason as DOMException | undefined)?.name).toBe("AbortError");

      firstAction.resolve(undefined);
      await firstExecution;
      await secondExecution;
    });

    it("should not abort the previous signal when it already settled.", async() => {
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>();
      const { execute } = useAsyncAction(action);

      await execute();
      await execute();

      expect(action.mock.calls[0]?.[0].signal.aborted).toBe(false);
    });

    it("should resolve a superseded result when the older call resolves after the newer one started.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockResolvedValueOnce("newer");
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      await execute();
      firstAction.resolve("older");

      await expect(firstExecution).resolves.toStrictEqual({ ok: false, superseded: true });
    });

    it("should resolve a superseded result when the older call resolves first but a newer call already started.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const secondAction = Promise.withResolvers<string>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockReturnValueOnce(secondAction.promise);
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      const secondExecution = execute();
      firstAction.resolve("older");

      await expect(firstExecution).resolves.toStrictEqual({ ok: false, superseded: true });

      secondAction.resolve("newer");
      await secondExecution;
    });

    it("should resolve a superseded result when the older call rejects after being superseded.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockResolvedValueOnce("newer");
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      await execute();
      firstAction.reject(new Error("aborted"));

      await expect(firstExecution).resolves.toStrictEqual({ ok: false, superseded: true });
    });

    it("should not call onError when the superseded action rejects.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const onError = vi.fn<(error: unknown) => void>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockResolvedValueOnce("newer");
      const { execute } = useAsyncAction(action, { onError });

      const firstExecution = execute();
      await execute();
      firstAction.reject(new Error("aborted"));
      await firstExecution;

      expect(onError).not.toHaveBeenCalled();
    });

    it("should not call setFetchStatusToError when the superseded action rejects.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockResolvedValueOnce("newer");
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      await execute();
      firstAction.reject(new Error("aborted"));
      await firstExecution;

      expect(useFetchStatusMock.setFetchStatusToError).not.toHaveBeenCalled();
    });

    it("should call setFetchStatusToSuccess once when one of two overlapping calls is superseded.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockResolvedValueOnce("newer");
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      await execute();
      firstAction.resolve("older");
      await firstExecution;

      expect(useFetchStatusMock.setFetchStatusToSuccess).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call setFetchStatusToSuccess once when two calls overlap.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const secondAction = Promise.withResolvers<string>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockReturnValueOnce(secondAction.promise);
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      const secondExecution = execute();
      firstAction.resolve("older");
      await firstExecution;
      secondAction.resolve("newer");
      await secondExecution;

      expect(useFetchStatusMock.setFetchStatusToSuccess).toHaveBeenCalledExactlyOnceWith();
    });

    it("should resolve only the last result as successful when three calls overlap.", async() => {
      const firstAction = Promise.withResolvers<string>();
      const secondAction = Promise.withResolvers<string>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<string>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockReturnValueOnce(secondAction.promise)
        .mockResolvedValueOnce("third");
      const { execute } = useAsyncAction(action);

      const firstExecution = execute();
      const secondExecution = execute();
      await execute();
      firstAction.resolve("first");
      secondAction.resolve("second");

      await expect(Promise.all([firstExecution, secondExecution])).resolves.toStrictEqual([
        { ok: false, superseded: true },
        { ok: false, superseded: true },
      ]);
    });
  });

  describe("timeout", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should abort the action signal with a TimeoutError reason when the timeout elapses.", async() => {
      const deferredAction = Promise.withResolvers<undefined>();
      let receivedSignal: AbortSignal | undefined;
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>(async context => {
        receivedSignal = context.signal;

        return deferredAction.promise;
      });
      const { execute } = useAsyncAction(action, { timeoutInMs: 1000 });

      const execution = execute();
      await vi.advanceTimersByTimeAsync(1000);

      expect((receivedSignal?.reason as DOMException | undefined)?.name).toBe("TimeoutError");

      deferredAction.resolve(undefined);
      await execution;
    });

    it("should not abort the action signal when the timeout has not elapsed.", async() => {
      const deferredAction = Promise.withResolvers<undefined>();
      let receivedSignal: AbortSignal | undefined;
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>(async context => {
        receivedSignal = context.signal;

        return deferredAction.promise;
      });
      const { execute } = useAsyncAction(action, { timeoutInMs: 1000 });

      const execution = execute();
      await vi.advanceTimersByTimeAsync(999);

      expect(receivedSignal?.aborted).toBe(false);

      deferredAction.resolve(undefined);
      await execution;
    });

    it("should return a failure result when the latest request times out.", async() => {
      const abortError = new Error("aborted");
      const action = createAbortRejectingAction(abortError);
      const { execute } = useAsyncAction(action, { timeoutInMs: 1000 });

      const execution = execute();
      await vi.advanceTimersByTimeAsync(1000);
      const result = await execution;

      expect(result).toStrictEqual({ ok: false, error: abortError });
    });

    it("should set the fetch status to error when the latest request times out.", async() => {
      const action = createAbortRejectingAction(new Error("aborted"));
      const { execute } = useAsyncAction(action, { timeoutInMs: 1000 });

      const execution = execute();
      await vi.advanceTimersByTimeAsync(1000);
      await execution;

      expect(useFetchStatusMock.setFetchStatusToError).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call onError with the abort error when the latest request times out.", async() => {
      const abortError = new Error("aborted");
      const onError = vi.fn<(error: unknown) => void>();
      const action = createAbortRejectingAction(abortError);
      const { execute } = useAsyncAction(action, { timeoutInMs: 1000, onError });

      const execution = execute();
      await vi.advanceTimersByTimeAsync(1000);
      await execution;

      expect(onError).toHaveBeenCalledExactlyOnceWith(abortError);
    });

    it("should clear the timer when the action settles before the timeout.", async() => {
      const { execute } = useAsyncAction(vi.fn<(context: AsyncActionContext) => Promise<void>>(), { timeoutInMs: 1000 });

      await execute();

      expect(vi.getTimerCount()).toBe(0);
    });

    it("should clear the superseded request timer when a newer request starts.", async() => {
      const firstAction = Promise.withResolvers<undefined>();
      const action = vi.fn<(context: AsyncActionContext) => Promise<void>>()
        .mockReturnValueOnce(firstAction.promise)
        .mockResolvedValueOnce(undefined);
      const { execute } = useAsyncAction(action, { timeoutInMs: 1000 });

      const firstExecution = execute();
      const secondExecution = execute();

      expect(vi.getTimerCount()).toBe(1);

      firstAction.resolve(undefined);
      await firstExecution;
      await secondExecution;
    });

    it("should not arm a timer when timeoutInMs is omitted.", async() => {
      const { execute } = useAsyncAction(vi.fn<(context: AsyncActionContext) => Promise<void>>());

      await execute();

      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe("exposed refs", () => {
    it.each<{ ref: "fetchStatus" | "isIdle" | "isPending" | "isSuccess" | "isError" }>([
      { ref: "fetchStatus" },
      { ref: "isIdle" },
      { ref: "isPending" },
      { ref: "isSuccess" },
      { ref: "isError" },
    ])("should expose the $ref ref from useFetchStatus when called.", ({ ref }) => {
      const exposedReferences = useAsyncAction(vi.fn<(context: AsyncActionContext) => Promise<void>>(), { onError: vi.fn<(error: unknown) => void>() });

      expect(exposedReferences[ref]).toBe(useFetchStatusMock[ref]);
    });
  });
});