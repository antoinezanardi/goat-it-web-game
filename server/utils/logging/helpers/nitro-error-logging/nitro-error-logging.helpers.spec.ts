import type { H3Event } from "h3";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getServerLogger } from "#server/utils/logging/helpers/server-logger/server-logger.helpers";
import { logNitroError } from "#server/utils/logging/helpers/nitro-error-logging/nitro-error-logging.helpers";
import { ServerLogEventName } from "#server/utils/logging/server-log.enums";

vi.stubGlobal("useRuntimeConfig", vi.fn());

function createErrorEvent(method: string, path: string): H3Event {
  // Acceptable as only method and path are needed to exercise the error hook helper
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return { method, path } as unknown as H3Event;
}

describe(logNitroError, () => {
  beforeEach(() => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ logger: { level: "info" } } as unknown as ReturnType<typeof useRuntimeConfig>);
  });

  it("should log an unexpected server error with a query-free path when a 5xx failure occurs.", () => {
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);
    const error = Object.assign(new Error("boom"), { statusCode: 500 });
    const event = createErrorEvent("GET", "/game?secret=1");

    logNitroError(error, { event });

    expect(errorSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.SERVER_UNHANDLED_ERROR,
      errorName: "Error",
      statusCode: 500,
      method: "GET",
      path: "/game",
    });
  });

  it("should not log an expected client error when a 4xx failure occurs.", () => {
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);

    logNitroError(Object.assign(new Error("not found"), { statusCode: 404 }));

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should not log a proxy error already logged by the upstream path when the error carries an error code.", () => {
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);

    logNitroError({ statusCode: 502, data: { errorCode: "upstream-error" } });

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should log an unexpected failure when the error data has no error code.", () => {
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);

    logNitroError({ statusCode: 500, data: {} });

    expect(errorSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.SERVER_UNHANDLED_ERROR,
      errorName: "Error",
      statusCode: 500,
    });
  });

  it("should log a non error value with the unknown error name when the thrown value is not an error object.", () => {
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);

    logNitroError("boom");

    expect(errorSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.SERVER_UNHANDLED_ERROR,
      errorName: "UnknownError",
    });
  });

  it("should log a failure without method or path when no event is provided.", () => {
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);

    logNitroError(Object.assign(new Error("boom"), { statusCode: 503 }));

    expect(errorSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.SERVER_UNHANDLED_ERROR,
      errorName: "Error",
      statusCode: 503,
    });
  });

  it("should log a failure without a status when the thrown error has no status.", () => {
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);
    const event = createErrorEvent("POST", "/api/boom");

    logNitroError(new Error("boom"), { event });

    expect(errorSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.SERVER_UNHANDLED_ERROR,
      errorName: "Error",
      method: "POST",
      path: "/api/boom",
    });
  });
});