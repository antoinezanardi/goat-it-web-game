import { describe, expect, it } from "vitest";

import {
  getErrorStatusCode,
  isClientErrorStatus,
  isServerErrorStatus,
} from "#shared/utils/helpers/error-status/error-status.helpers";

describe(getErrorStatusCode, () => {
  it.each<{ description: string; error: unknown; expectedStatusCode: number | undefined }>([
    { description: "an h3 status code", error: { statusCode: 503 }, expectedStatusCode: 503 },
    { description: "a direct status", error: { status: 404 }, expectedStatusCode: 404 },
    { description: "an ofetch response status", error: { response: { status: 502 } }, expectedStatusCode: 502 },
    { description: "a plain error", error: new Error("boom"), expectedStatusCode: undefined },
    { description: "a non record value", error: "boom", expectedStatusCode: undefined },
    { description: "a non numeric status", error: { statusCode: "503" }, expectedStatusCode: undefined },
    { description: "an empty response object", error: { response: {} }, expectedStatusCode: undefined },
  ])("should return the expected status code when the error is $description.", ({ error, expectedStatusCode }) => {
    expect(getErrorStatusCode(error)).toBe(expectedStatusCode);
  });
});

describe(isClientErrorStatus, () => {
  it.each<{ description: string; statusCode: number; expected: boolean }>([
    { description: "a bad request", statusCode: 400, expected: true },
    { description: "a rate limit", statusCode: 429, expected: true },
    { description: "a server error", statusCode: 500, expected: false },
    { description: "a redirect", statusCode: 302, expected: false },
  ])("should return $expected when the status is $description.", ({ statusCode, expected }) => {
    expect(isClientErrorStatus(statusCode)).toBe(expected);
  });
});

describe(isServerErrorStatus, () => {
  it.each<{ description: string; statusCode: number; expected: boolean }>([
    { description: "an internal error", statusCode: 500, expected: true },
    { description: "a bad gateway", statusCode: 502, expected: true },
    { description: "a client error", statusCode: 404, expected: false },
    { description: "an informational status", statusCode: 100, expected: false },
  ])("should return $expected when the status is $description.", ({ statusCode, expected }) => {
    expect(isServerErrorStatus(statusCode)).toBe(expected);
  });
});