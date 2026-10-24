import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createUseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";
import type { UseFetchStatusMock } from "~~/tests/unit/utils/mocks/composables/core/useFetchStatus/useFetchStatus.mock";

import type { useAsyncAction as UseAsyncActionType } from "@/composables/core/useAsyncAction/useAsyncAction";

let useFetchStatusMock: UseFetchStatusMock;

mockNuxtImport("useFetchStatus", () => (): UseFetchStatusMock => useFetchStatusMock);

let useAsyncAction: typeof UseAsyncActionType;

describe("useAsyncAction", () => {
  beforeEach(async() => {
    useFetchStatusMock = createUseFetchStatusMock();
    ({ useAsyncAction } = await import("@/composables/core/useAsyncAction/useAsyncAction"));
  });

  describe("execute", () => {
    it("should call setFetchStatusToPending when called.", async() => {
      const action = vi.fn<() => Promise<void>>();
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      await execute();

      expect(useFetchStatusMock.setFetchStatusToPending).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call the action with provided arguments when called.", async() => {
      const action = vi.fn<(count: number, label: string) => Promise<void>>();
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      await execute(42, "hello");

      expect(action).toHaveBeenCalledExactlyOnceWith(42, "hello");
    });

    it("should call setFetchStatusToSuccess when action resolves.", async() => {
      const action = vi.fn<() => Promise<string>>().mockResolvedValue("result");
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      await execute();

      expect(useFetchStatusMock.setFetchStatusToSuccess).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return a success result with the value when action resolves.", async() => {
      const action = vi.fn<() => Promise<string>>().mockResolvedValue("result");
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      const result = await execute();

      expect(result).toStrictEqual({ ok: true, value: "result" });
    });

    it("should not call onError when action resolves.", async() => {
      const action = vi.fn<() => Promise<void>>();
      const onError = vi.fn<(error: unknown) => void>();
      const { execute } = useAsyncAction(action, onError);

      await execute();

      expect(onError).not.toHaveBeenCalled();
    });

    it("should call setFetchStatusToError when action rejects.", async() => {
      const action = vi.fn<() => Promise<void>>().mockRejectedValue(new Error("something went wrong"));
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      await execute();

      expect(useFetchStatusMock.setFetchStatusToError).toHaveBeenCalledExactlyOnceWith();
    });

    it("should call onError with the error when action rejects.", async() => {
      const error = new Error("something went wrong");
      const action = vi.fn<() => Promise<void>>().mockRejectedValue(error);
      const onError = vi.fn<(error: unknown) => void>();
      const { execute } = useAsyncAction(action, onError);

      await execute();

      expect(onError).toHaveBeenCalledExactlyOnceWith(error);
    });

    it("should return a failure result with the error when action rejects.", async() => {
      const error = new Error("fail");
      const action = vi.fn<() => Promise<string>>().mockRejectedValue(error);
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      const result = await execute();

      expect(result).toStrictEqual({ ok: false, error });
    });

    it("should return a failure result when action rejects and onError is omitted.", async() => {
      const error = new Error("fail");
      const action = vi.fn<() => Promise<string>>().mockRejectedValue(error);
      const { execute } = useAsyncAction(action);

      const result = await execute();

      expect(result).toStrictEqual({ ok: false, error });
    });

    it("should not call setFetchStatusToSuccess when action rejects.", async() => {
      const action = vi.fn<() => Promise<void>>().mockRejectedValue(new Error("fail"));
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      await execute();

      expect(useFetchStatusMock.setFetchStatusToSuccess).not.toHaveBeenCalled();
    });

    it("should not call setFetchStatusToError when action resolves.", async() => {
      const action = vi.fn<() => Promise<void>>();
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      await execute();

      expect(useFetchStatusMock.setFetchStatusToError).not.toHaveBeenCalled();
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
      const exposedReferences = useAsyncAction(vi.fn<() => Promise<void>>(), vi.fn<(error: unknown) => void>());

      expect(exposedReferences[ref]).toBe(useFetchStatusMock[ref]);
    });
  });
});