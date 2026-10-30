import { describe, expect, it } from "vitest";

import { mapServerErrorToSafeLog } from "#server/utils/logging/helpers/server-error-log-mapping/server-error-log-mapping.helpers";
import type { SafeServerErrorLog } from "#server/utils/logging/helpers/server-error-log-mapping/server-error-log-mapping.types";

describe(mapServerErrorToSafeLog, () => {
  it.each<{ description: string; error: unknown; expected: SafeServerErrorLog }>([
    {
      description: "a plain error",
      error: new Error("boom"),
      expected: { errorName: "Error" },
    },
    {
      description: "an error exposing a status and a code",
      error: Object.assign(new Error("boom"), { statusCode: 502, code: "ECONNRESET" }),
      expected: { errorName: "Error", errorCode: "ECONNRESET", statusCode: 502 },
    },
    {
      description: "an ofetch-shaped record",
      error: { name: "FetchError", response: { status: 504 } },
      expected: { errorName: "FetchError", statusCode: 504 },
    },
    {
      description: "an error without a name",
      error: { status: 500 },
      expected: { errorName: "Error", statusCode: 500 },
    },
    {
      description: "an error with a blank code",
      error: { name: "", code: "" },
      expected: { errorName: "Error" },
    },
    {
      description: "a non-object value",
      error: "boom",
      expected: { errorName: "UnknownError" },
    },
    {
      description: "a null value",
      error: null,
      expected: { errorName: "UnknownError" },
    },
  ])("should return the expected safe log when the error is $description.", ({ error, expected }) => {
    expect(mapServerErrorToSafeLog(error)).toStrictEqual(expected);
  });
});