import { FetchError } from "ofetch";
import { z } from "zod";
import { describe, expect, it } from "vitest";

import { isUnexpectedClientError } from "@/utils/core/sentry/helpers/client-error-report/client-error-report.helpers";

describe(isUnexpectedClientError, () => {
  it.each<{ description: string; error: unknown; expected: boolean }>([
    { description: "a zod contract error", error: new z.ZodError([]), expected: true },
    { description: "a runtime error", error: new TypeError("render failed"), expected: true },
    { description: "a network fetch error without a response", error: new FetchError("fetch failed"), expected: false },
    { description: "a fetch error carrying a 502 response", error: makeFetchError(502), expected: false },
    { description: "a non-fetch error carrying a 502 status", error: { statusCode: 502 }, expected: false },
    { description: "a non-fetch error carrying a 404 status", error: { statusCode: 404 }, expected: false },
    { description: "an aborted request", error: Object.assign(new Error("aborted"), { name: "AbortError" }), expected: false },
    { description: "a timed-out request", error: Object.assign(new Error("timed out"), { name: "TimeoutError" }), expected: false },
    { description: "a string value", error: "boom", expected: false },
    { description: "a null value", error: null, expected: false },
    { description: "a plain object", error: { foo: "bar" }, expected: false },
  ])("should return $expected when the failure is $description.", ({ error, expected }) => {
    expect(isUnexpectedClientError(error)).toBe(expected);
  });
});

function makeFetchError(status: number): FetchError {
  const fetchError = new FetchError("upstream failed");
  fetchError.response = { status } as Response;

  return fetchError;
}