import { FetchError } from "ofetch";
import type { H3Error } from "h3";
import { z } from "zod";
import { createFakeApiResponseExceptionDto } from "@goat-it/schemas/testing/shared";
import { describe, expect, it, vi } from "vitest";

import { throwGoatItApiError } from "#server/utils/goat-it-api/helpers/goat-it-api-error/goat-it-api-error.helpers";
import { HttpStatusCode } from "#server/utils/http/http.enums";

const upstreamErrorCodeBody = createFakeApiResponseExceptionDto({ statusCode: 429, errorCode: "custom-upstream-code" });
const upstreamBodyWithoutErrorCode = createFakeApiResponseExceptionDto({ statusCode: 404, errorCode: undefined });
const upstreamClientErrorCodeBody = createFakeApiResponseExceptionDto({ statusCode: 422, errorCode: "custom-client-code" });
const unparseableBody = { unexpected: "shape" };
const timeoutCause = Object.assign(new Error("[TimeoutError]: The operation was aborted due to timeout"), { name: "TimeoutError" });
const redirectCause = new Error("unexpected redirect");
const abortCause = Object.assign(new Error("This operation was aborted"), { name: "AbortError" });
const connectionCause = Object.assign(new Error("connect ECONNREFUSED"), { code: "ECONNREFUSED" });

type FakeFetchResponse = {
  status: number;
  statusText: string;
  headers: { get: (name: string) => string | null };
};

function createFetchErrorWithResponse(status: number, body: unknown, headers: Record<string, string> = {}): FetchError {
  const fetchError = new FetchError("Goat It API error");
  const response: FakeFetchResponse = {
    status,
    statusText: "",
    headers: { get: (name: string) => headers[name] ?? null },
  };

  fetchError.response = response as unknown as FetchError["response"];
  fetchError.data = body;

  return fetchError;
}

function createFetchErrorWithoutResponse(cause: unknown): FetchError {
  return new FetchError("Goat It API error", { cause });
}

function createZodError(): z.ZodError {
  const result = z.strictObject({ id: z.string() }).safeParse({ name: "x" });

  if (!result.success) {
    return result.error;
  }
  throw new Error("Expected a zod error");
}

function getThrowableError(function_: () => void): H3Error {
  try {
    function_();
  } catch(error: unknown) {
    return error as H3Error;
  }

  throw new Error("Expected function to throw");
}

describe(throwGoatItApiError, () => {
  describe("when the error is a FetchError with an upstream response", () => {
    it.each<{ description: string; status: number; body: unknown; expectedStatusCode: number }>([
      { description: "a rate limited error", status: 429, body: upstreamErrorCodeBody, expectedStatusCode: HttpStatusCode.TOO_MANY_REQUESTS },
      { description: "a rate limited error with an unparseable body", status: 429, body: unparseableBody, expectedStatusCode: HttpStatusCode.TOO_MANY_REQUESTS },
      { description: "an unauthorized error", status: 401, body: unparseableBody, expectedStatusCode: HttpStatusCode.BAD_GATEWAY },
      { description: "a forbidden error", status: 403, body: unparseableBody, expectedStatusCode: HttpStatusCode.BAD_GATEWAY },
      { description: "a forwarded client error", status: 404, body: upstreamBodyWithoutErrorCode, expectedStatusCode: HttpStatusCode.NOT_FOUND },
      { description: "a client error with an unparseable body", status: 404, body: unparseableBody, expectedStatusCode: HttpStatusCode.BAD_GATEWAY },
      {
        description: "a server error with a bogus body status code",
        status: 500,
        body: { statusCode: 599, message: "boom", error: "Server Error" },
        expectedStatusCode: HttpStatusCode.BAD_GATEWAY,
      },
      { description: "a service unavailable error", status: 503, body: unparseableBody, expectedStatusCode: HttpStatusCode.BAD_GATEWAY },
    ])("should throw an H3Error with status $expectedStatusCode when the upstream responds with $description.", ({ status, body, expectedStatusCode }) => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithResponse(status, body)));

      expect(error.statusCode).toBe(expectedStatusCode);
    });

    it.each<{ description: string; status: number; body: unknown; expectedData: { errorCode?: string; retryAfter?: string } }>([
      { description: "a rate limited error with an upstream error code", status: 429, body: upstreamErrorCodeBody, expectedData: { errorCode: "custom-upstream-code" } },
      { description: "a rate limited error with an unparseable body", status: 429, body: unparseableBody, expectedData: { errorCode: "rate-limited" } },
      { description: "an unauthorized error", status: 401, body: unparseableBody, expectedData: { errorCode: "upstream-error" } },
      { description: "a forwarded client error without an error code", status: 404, body: upstreamBodyWithoutErrorCode, expectedData: {} },
      { description: "a forwarded client error with an upstream error code", status: 422, body: upstreamClientErrorCodeBody, expectedData: { errorCode: "custom-client-code" } },
      { description: "a client error with an unparseable body", status: 404, body: unparseableBody, expectedData: { errorCode: "upstream-error" } },
      { description: "a server error", status: 500, body: unparseableBody, expectedData: { errorCode: "upstream-error" } },
    ])("should throw an H3Error with the expected data when the upstream responds with $description.", ({ status, body, expectedData }) => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithResponse(status, body)));

      expect(error.data).toStrictEqual(expectedData);
    });

    it("should forward the upstream retry after value when the upstream rate limits the request with one.", () => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithResponse(429, upstreamErrorCodeBody, { "retry-after": "30" })));

      expect(error.data).toStrictEqual({ errorCode: "custom-upstream-code", retryAfter: "30" });
    });

    it("should not forward the upstream error message when the upstream responds with an error.", () => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithResponse(404, upstreamBodyWithoutErrorCode)));

      expect(error.message).not.toBe(upstreamBodyWithoutErrorCode.message);
    });

    it("should log the upstream failure without secrets when the upstream responds with an unauthorized error.", () => {
      const consoleSpy = vi.spyOn(console, "error").mockReturnValue();

      getThrowableError(() => throwGoatItApiError(createFetchErrorWithResponse(401, unparseableBody)));

      expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(expect.stringContaining("Goat It API upstream error:"));
    });
  });

  describe("when the error is a FetchError without an upstream response", () => {
    it.each<{ description: string; cause: Error; expectedStatusCode: number }>([
      { description: "a timeout", cause: timeoutCause, expectedStatusCode: HttpStatusCode.GATEWAY_TIMEOUT },
      { description: "an unexpected redirect", cause: redirectCause, expectedStatusCode: HttpStatusCode.BAD_GATEWAY },
      { description: "a client abort", cause: abortCause, expectedStatusCode: HttpStatusCode.BAD_GATEWAY },
      { description: "a connection failure", cause: connectionCause, expectedStatusCode: HttpStatusCode.BAD_GATEWAY },
    ])("should throw an H3Error with status $expectedStatusCode when the upstream fails with $description.", ({ cause, expectedStatusCode }) => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithoutResponse(cause)));

      expect(error.statusCode).toBe(expectedStatusCode);
    });

    it.each<{ description: string; cause: Error; expectedData: { errorCode?: string } }>([
      { description: "a timeout", cause: timeoutCause, expectedData: { errorCode: "upstream-timeout" } },
      { description: "an unexpected redirect", cause: redirectCause, expectedData: { errorCode: "upstream-error" } },
      { description: "a client abort", cause: abortCause, expectedData: { errorCode: "upstream-error" } },
      { description: "a connection failure", cause: connectionCause, expectedData: { errorCode: "upstream-error" } },
    ])("should throw an H3Error with the expected data when the upstream fails with $description.", ({ cause, expectedData }) => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithoutResponse(cause)));

      expect(error.data).toStrictEqual(expectedData);
    });

    it("should not log when the client aborts the request.", () => {
      const consoleSpy = vi.spyOn(console, "error").mockReturnValue();

      getThrowableError(() => throwGoatItApiError(createFetchErrorWithoutResponse(abortCause)));

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should log the upstream failure when the upstream times out.", () => {
      const consoleSpy = vi.spyOn(console, "error").mockReturnValue();

      getThrowableError(() => throwGoatItApiError(createFetchErrorWithoutResponse(timeoutCause)));

      expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(expect.stringContaining("Goat It API upstream error:"));
    });

    it("should throw an H3Error with the bad gateway status when the upstream fails with a non-error cause.", () => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithoutResponse("network reset")));

      expect(error.statusCode).toBe(HttpStatusCode.BAD_GATEWAY);
    });

    it("should throw an H3Error with the bad gateway status when the upstream fails with an error without a code.", () => {
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithoutResponse(new Error("plain network failure"))));

      expect(error.statusCode).toBe(HttpStatusCode.BAD_GATEWAY);
    });

    it("should throw an H3Error with the bad gateway status when the upstream fails with an error with a numeric code.", () => {
      const numericCodeCause = Object.assign(new Error("numeric network failure"), { code: 42 });
      const error = getThrowableError(() => throwGoatItApiError(createFetchErrorWithoutResponse(numericCodeCause)));

      expect(error.statusCode).toBe(HttpStatusCode.BAD_GATEWAY);
    });
  });

  describe("when the error is a ZodError", () => {
    it("should throw an H3Error with the bad gateway status when the upstream payload drifts from the contract.", () => {
      const error = getThrowableError(() => throwGoatItApiError(createZodError()));

      expect(error.statusCode).toBe(HttpStatusCode.BAD_GATEWAY);
    });

    it("should throw an H3Error with the upstream error code when the upstream payload drifts from the contract.", () => {
      const error = getThrowableError(() => throwGoatItApiError(createZodError()));

      expect(error.data).toStrictEqual({ errorCode: "upstream-error" });
    });

    it("should log the drifted issue paths when the upstream payload drifts from the contract.", () => {
      const consoleSpy = vi.spyOn(console, "error").mockReturnValue();

      getThrowableError(() => throwGoatItApiError(createZodError()));

      expect(consoleSpy).toHaveBeenCalledExactlyOnceWith(expect.stringContaining("id"));
    });
  });

  describe("when the error is neither a FetchError nor a ZodError", () => {
    it("should throw an H3Error with the internal server error status when the thrown value is an error.", () => {
      const error = getThrowableError(() => throwGoatItApiError(new Error("boom")));

      expect(error.statusCode).toBe(HttpStatusCode.INTERNAL_SERVER_ERROR);
    });

    it("should throw an H3Error with the internal error code when the thrown value is an error.", () => {
      const error = getThrowableError(() => throwGoatItApiError(new Error("boom")));

      expect(error.data).toStrictEqual({ errorCode: "internal-error" });
    });

    it("should throw an H3Error with the internal error code when the thrown value is not an error.", () => {
      const error = getThrowableError(() => throwGoatItApiError("boom"));

      expect(error.data).toStrictEqual({ errorCode: "internal-error" });
    });
  });
});