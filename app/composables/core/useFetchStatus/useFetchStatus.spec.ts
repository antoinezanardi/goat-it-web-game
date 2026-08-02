import { describe, expect, it } from "vitest";

import { useFetchStatus } from "@/composables/core/useFetchStatus/useFetchStatus";

describe(useFetchStatus, () => {
  describe("fetchStatus", () => {
    it("should have idle status when initialized.", () => {
      const { fetchStatus } = useFetchStatus();

      expect(fetchStatus.value).toBe("idle");
    });
  });

  describe("isIdle", () => {
    it("should be true when status is idle.", () => {
      const { isIdle } = useFetchStatus();

      expect(isIdle.value).toBeTruthy();
    });

    it("should be false when status is pending.", () => {
      const { isIdle, setFetchStatusToPending } = useFetchStatus();

      setFetchStatusToPending();

      expect(isIdle.value).toBeFalsy();
    });

    it("should be false when status is success.", () => {
      const { isIdle, setFetchStatusToSuccess } = useFetchStatus();

      setFetchStatusToSuccess();

      expect(isIdle.value).toBeFalsy();
    });

    it("should be false when status is error.", () => {
      const { isIdle, setFetchStatusToError } = useFetchStatus();

      setFetchStatusToError();

      expect(isIdle.value).toBeFalsy();
    });
  });

  describe("isPending", () => {
    it("should be false when status is idle.", () => {
      const { isPending } = useFetchStatus();

      expect(isPending.value).toBeFalsy();
    });

    it("should be true when status is pending.", () => {
      const { isPending, setFetchStatusToPending } = useFetchStatus();

      setFetchStatusToPending();

      expect(isPending.value).toBeTruthy();
    });

    it("should be false when status is success.", () => {
      const { isPending, setFetchStatusToSuccess } = useFetchStatus();

      setFetchStatusToSuccess();

      expect(isPending.value).toBeFalsy();
    });

    it("should be false when status is error.", () => {
      const { isPending, setFetchStatusToError } = useFetchStatus();

      setFetchStatusToError();

      expect(isPending.value).toBeFalsy();
    });
  });

  describe("isSuccess", () => {
    it("should be false when status is idle.", () => {
      const { isSuccess } = useFetchStatus();

      expect(isSuccess.value).toBeFalsy();
    });

    it("should be false when status is pending.", () => {
      const { isSuccess, setFetchStatusToPending } = useFetchStatus();

      setFetchStatusToPending();

      expect(isSuccess.value).toBeFalsy();
    });

    it("should be true when status is success.", () => {
      const { isSuccess, setFetchStatusToSuccess } = useFetchStatus();

      setFetchStatusToSuccess();

      expect(isSuccess.value).toBeTruthy();
    });

    it("should be false when status is error.", () => {
      const { isSuccess, setFetchStatusToError } = useFetchStatus();

      setFetchStatusToError();

      expect(isSuccess.value).toBeFalsy();
    });
  });

  describe("isError", () => {
    it("should be false when status is idle.", () => {
      const { isError } = useFetchStatus();

      expect(isError.value).toBeFalsy();
    });

    it("should be false when status is pending.", () => {
      const { isError, setFetchStatusToPending } = useFetchStatus();

      setFetchStatusToPending();

      expect(isError.value).toBeFalsy();
    });

    it("should be false when status is success.", () => {
      const { isError, setFetchStatusToSuccess } = useFetchStatus();

      setFetchStatusToSuccess();

      expect(isError.value).toBeFalsy();
    });

    it("should be true when status is error.", () => {
      const { isError, setFetchStatusToError } = useFetchStatus();

      setFetchStatusToError();

      expect(isError.value).toBeTruthy();
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