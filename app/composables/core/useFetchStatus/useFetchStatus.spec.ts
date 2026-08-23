import { describe, expect, it } from "vitest";

import type { AsyncDataRequestStatus } from "#app";
import type { UseFetchStatus } from "@/composables/core/useFetchStatus/useFetchStatus";
import { useFetchStatus } from "@/composables/core/useFetchStatus/useFetchStatus";

type FetchStatusComputationCase = {
  status: AsyncDataRequestStatus;
  setStatus: (composable: UseFetchStatus) => void;
  expected: boolean;
};

describe(useFetchStatus, () => {
  describe("fetchStatus", () => {
    it("should have idle status when initialized.", () => {
      const { fetchStatus } = useFetchStatus();

      expect(fetchStatus.value).toBe("idle");
    });
  });

  describe("isIdle", () => {
    it.each<FetchStatusComputationCase>([
      { status: "idle", setStatus: (): void => undefined, expected: true },
      {
        status: "pending",
        setStatus: ({ setFetchStatusToPending }: UseFetchStatus): void => setFetchStatusToPending(),
        expected: false,
      },
      {
        status: "success",
        setStatus: ({ setFetchStatusToSuccess }: UseFetchStatus): void => setFetchStatusToSuccess(),
        expected: false,
      },
      {
        status: "error",
        setStatus: ({ setFetchStatusToError }: UseFetchStatus): void => setFetchStatusToError(),
        expected: false,
      },
    ])("should be $expected when fetch status is $status.", ({ setStatus, expected }) => {
      const composable = useFetchStatus();

      setStatus(composable);

      expect(composable.isIdle.value).toBe(expected);
    });
  });

  describe("isPending", () => {
    it.each<FetchStatusComputationCase>([
      { status: "idle", setStatus: (): void => undefined, expected: false },
      {
        status: "pending",
        setStatus: ({ setFetchStatusToPending }: UseFetchStatus): void => setFetchStatusToPending(),
        expected: true,
      },
      {
        status: "success",
        setStatus: ({ setFetchStatusToSuccess }: UseFetchStatus): void => setFetchStatusToSuccess(),
        expected: false,
      },
      {
        status: "error",
        setStatus: ({ setFetchStatusToError }: UseFetchStatus): void => setFetchStatusToError(),
        expected: false,
      },
    ])("should be $expected when fetch status is $status.", ({ setStatus, expected }) => {
      const composable = useFetchStatus();

      setStatus(composable);

      expect(composable.isPending.value).toBe(expected);
    });
  });

  describe("isSuccess", () => {
    it.each<FetchStatusComputationCase>([
      { status: "idle", setStatus: (): void => undefined, expected: false },
      {
        status: "pending",
        setStatus: ({ setFetchStatusToPending }: UseFetchStatus): void => setFetchStatusToPending(),
        expected: false,
      },
      {
        status: "success",
        setStatus: ({ setFetchStatusToSuccess }: UseFetchStatus): void => setFetchStatusToSuccess(),
        expected: true,
      },
      {
        status: "error",
        setStatus: ({ setFetchStatusToError }: UseFetchStatus): void => setFetchStatusToError(),
        expected: false,
      },
    ])("should be $expected when fetch status is $status.", ({ setStatus, expected }) => {
      const composable = useFetchStatus();

      setStatus(composable);

      expect(composable.isSuccess.value).toBe(expected);
    });
  });

  describe("isError", () => {
    it.each<FetchStatusComputationCase>([
      { status: "idle", setStatus: (): void => undefined, expected: false },
      {
        status: "pending",
        setStatus: ({ setFetchStatusToPending }: UseFetchStatus): void => setFetchStatusToPending(),
        expected: false,
      },
      {
        status: "success",
        setStatus: ({ setFetchStatusToSuccess }: UseFetchStatus): void => setFetchStatusToSuccess(),
        expected: false,
      },
      {
        status: "error",
        setStatus: ({ setFetchStatusToError }: UseFetchStatus): void => setFetchStatusToError(),
        expected: true,
      },
    ])("should be $expected when fetch status is $status.", ({ setStatus, expected }) => {
      const composable = useFetchStatus();

      setStatus(composable);

      expect(composable.isError.value).toBe(expected);
    });
  });

  describe("setFetchStatusToPending", () => {
    it("should set status to pending when called.", () => {
      const { fetchStatus, setFetchStatusToPending } = useFetchStatus();

      setFetchStatusToPending();

      expect(fetchStatus.value).toBe("pending");
    });
  });

  describe("setFetchStatusToSuccess", () => {
    it("should set status to success when called.", () => {
      const { fetchStatus, setFetchStatusToSuccess } = useFetchStatus();

      setFetchStatusToSuccess();

      expect(fetchStatus.value).toBe("success");
    });
  });

  describe("setFetchStatusToError", () => {
    it("should set status to error when called.", () => {
      const { fetchStatus, setFetchStatusToError } = useFetchStatus();

      setFetchStatusToError();

      expect(fetchStatus.value).toBe("error");
    });
  });
});