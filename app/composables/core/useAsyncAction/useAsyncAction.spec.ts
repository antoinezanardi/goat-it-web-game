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

    it("should return the result when action resolves.", async() => {
      const action = vi.fn<() => Promise<string>>().mockResolvedValue("result");
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      const result = await execute();

      expect(result).toBe("result");
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

    it("should return undefined when action rejects.", async() => {
      const action = vi.fn<() => Promise<string>>().mockRejectedValue(new Error("fail"));
      const { execute } = useAsyncAction(action, vi.fn<(error: unknown) => void>());

      const result = await execute();

      expect(result).toBeUndefined();
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

  describe("fetchStatus", () => {
    it("should expose the fetchStatus ref from useFetchStatus when called.", () => {
      const { fetchStatus } = useAsyncAction(vi.fn<() => Promise<void>>(), vi.fn<(error: unknown) => void>());

      expect(fetchStatus).toBe(useFetchStatusMock.fetchStatus);
    });
  });

  describe("isIdle", () => {
    it("should expose the isIdle computed ref from useFetchStatus when called.", () => {
      const { isIdle } = useAsyncAction(vi.fn<() => Promise<void>>(), vi.fn<(error: unknown) => void>());

      expect(isIdle).toBe(useFetchStatusMock.isIdle);
    });
  });

  describe("isPending", () => {
    it("should expose the isPending computed ref from useFetchStatus when called.", () => {
      const { isPending } = useAsyncAction(vi.fn<() => Promise<void>>(), vi.fn<(error: unknown) => void>());

      expect(isPending).toBe(useFetchStatusMock.isPending);
    });
  });

  describe("isSuccess", () => {
    it("should expose the isSuccess computed ref from useFetchStatus when called.", () => {
      const { isSuccess } = useAsyncAction(vi.fn<() => Promise<void>>(), vi.fn<(error: unknown) => void>());

      expect(isSuccess).toBe(useFetchStatusMock.isSuccess);
    });
  });

  describe("isError", () => {
    it("should expose the isError computed ref from useFetchStatus when called.", () => {
      const { isError } = useAsyncAction(vi.fn<() => Promise<void>>(), vi.fn<(error: unknown) => void>());

      expect(isError).toBe(useFetchStatusMock.isError);
    });
  });
});