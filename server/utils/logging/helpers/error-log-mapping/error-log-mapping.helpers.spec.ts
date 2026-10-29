import { describe, expect, it } from "vitest";

import { mapErrorToSafeLog } from "#server/utils/logging/helpers/error-log-mapping/error-log-mapping.helpers";

describe(mapErrorToSafeLog, () => {
  it("should return the error name when a plain error is mapped.", () => {
    expect(mapErrorToSafeLog(new Error("boom"))).toStrictEqual({ errorName: "Error" });
  });

  it("should return the status and code when the error exposes both.", () => {
    const error = Object.assign(new Error("boom"), { statusCode: 502, code: "ECONNRESET" });

    expect(mapErrorToSafeLog(error)).toStrictEqual({ errorName: "Error", errorCode: "ECONNRESET", statusCode: 502 });
  });

  it("should return the response status when the error is an ofetch-shaped record.", () => {
    expect(mapErrorToSafeLog({ name: "FetchError", response: { status: 504 } })).toStrictEqual({ errorName: "FetchError", statusCode: 504 });
  });

  it("should fall back to the generic error name when the error has no name.", () => {
    expect(mapErrorToSafeLog({ status: 500 })).toStrictEqual({ errorName: "Error", statusCode: 500 });
  });

  it("should drop the error code when the code is blank.", () => {
    expect(mapErrorToSafeLog({ name: "", code: "" })).toStrictEqual({ errorName: "Error" });
  });

  it("should return the unknown error name when the thrown value is not an object.", () => {
    expect(mapErrorToSafeLog("boom")).toStrictEqual({ errorName: "UnknownError" });
  });

  it("should return the unknown error name when the thrown value is null.", () => {
    expect(mapErrorToSafeLog(null)).toStrictEqual({ errorName: "UnknownError" });
  });
});