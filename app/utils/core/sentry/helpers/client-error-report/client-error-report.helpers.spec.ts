import { describe, expect, it, vi } from "vitest";

import {
  isUnexpectedClientError,
  reportUnexpectedClientError,
} from "@/utils/core/sentry/helpers/client-error-report/client-error-report.helpers";

describe(isUnexpectedClientError, () => {
  it.each<{ description: string; error: unknown; expected: boolean }>([
    { description: "a network error without a status", error: new TypeError("fetch failed"), expected: true },
    { description: "an error with a 502 status code", error: { statusCode: 502 }, expected: true },
    { description: "an error with a 503 response status", error: { response: { status: 503 } }, expected: true },
    { description: "an error with a 404 status code", error: { statusCode: 404 }, expected: false },
    { description: "an error with a 429 response status", error: { response: { status: 429 } }, expected: false },
    { description: "an aborted request", error: Object.assign(new Error("aborted"), { name: "AbortError" }), expected: false },
    { description: "a cancelled request", error: Object.assign(new Error("cancelled"), { name: "CanceledError" }), expected: false },
    { description: "a string value", error: "boom", expected: false },
    { description: "a null value", error: null, expected: false },
    { description: "a plain object", error: { foo: "bar" }, expected: false },
    { description: "an error with a zero status code", error: Object.assign(new Error("network"), { statusCode: 0 }), expected: true },
  ])("should return $expected when the failure is $description.", ({ error, expected }) => {
    expect(isUnexpectedClientError(error)).toBe(expected);
  });
});

describe(reportUnexpectedClientError, () => {
  it("should capture an unexpected server failure once when it is reported.", () => {
    const captureException = vi.fn<(error: unknown) => void>();
    const error = { statusCode: 502 };

    reportUnexpectedClientError(error, captureException);

    expect(captureException).toHaveBeenCalledExactlyOnceWith(error);
  });

  it("should not capture an expected client failure when it is reported.", () => {
    const captureException = vi.fn<(error: unknown) => void>();

    reportUnexpectedClientError({ statusCode: 404 }, captureException);

    expect(captureException).not.toHaveBeenCalled();
  });

  it("should not capture a cancelled request when it is reported.", () => {
    const captureException = vi.fn<(error: unknown) => void>();
    const error = Object.assign(new Error("aborted"), { name: "AbortError" });

    reportUnexpectedClientError(error, captureException);

    expect(captureException).not.toHaveBeenCalled();
  });
});