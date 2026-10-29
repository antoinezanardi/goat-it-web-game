import type { DestinationStream } from "pino";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import {
  createServerLogger,
  getServerLogger,
  logServerError,
  logServerWarning,
} from "#server/utils/logging/helpers/structured-logger/structured-logger.helpers";
import { SERVER_LOGGER_NAME, SERVER_LOG_EVENT_NAMES } from "#server/utils/logging/logging.constants";

vi.stubGlobal("useRuntimeConfig", vi.fn());

type CapturedLog = Record<string, unknown>;

function createLogSink(capturedLogs: CapturedLog[]): DestinationStream {
  return {
    write(message: string): void {
      const parsedLog: unknown = JSON.parse(message);
      capturedLogs.push(isRecord(parsedLog) ? parsedLog : {});
    },
  };
}

describe(createServerLogger, () => {
  it("should write a json record with the event name and message when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR }, "upstream failure");

    expect(capturedLogs[0]).toMatchObject({
      name: SERVER_LOGGER_NAME,
      level: 40,
      msg: "upstream failure",
      event: SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR,
    });
  });

  it("should write an iso timestamp when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR });

    expect(String(capturedLogs[0]?.time)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u);
  });

  it("should omit the pid when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR });

    expect(capturedLogs[0]).not.toHaveProperty("pid");
  });

  it("should omit the hostname when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR });

    expect(capturedLogs[0]).not.toHaveProperty("hostname");
  });

  it("should redact a secret-bearing field when an event contains one.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.error({ authorization: "Bearer secret" });

    expect(capturedLogs[0]).toMatchObject({ authorization: "[Redacted]" });
  });

  it("should serialize an error when an error is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.error(new Error("boom"));

    expect(capturedLogs[0]).toMatchObject({ err: { type: "Error", message: "boom" } });
  });

  it("should not write a record when the level is below the configured severity.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("error", createLogSink(capturedLogs));

    logger.warn({ event: SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR });

    expect(capturedLogs).toStrictEqual([]);
  });
});

describe(getServerLogger, () => {
  let getFreshServerLogger: typeof getServerLogger;

  beforeEach(async() => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ logger: { level: "warn" } } as unknown as ReturnType<typeof useRuntimeConfig>);
    vi.resetModules();
    ({ getServerLogger: getFreshServerLogger } = await import("#server/utils/logging/helpers/structured-logger/structured-logger.helpers"));
  });

  it("should reuse a single logger instance when called twice.", () => {
    expect(getFreshServerLogger()).toBe(getFreshServerLogger());
  });

  it("should use the configured level when creating the logger.", () => {
    expect(getFreshServerLogger().level).toBe("warn");
  });
});

describe(logServerWarning, () => {
  beforeEach(() => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ logger: { level: "warn" } } as unknown as ReturnType<typeof useRuntimeConfig>);
  });

  it("should emit a warning event with the safe context when called.", () => {
    const warnSpy = vi.spyOn(getServerLogger(), "warn").mockReturnValue(undefined);

    logServerWarning(SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR, { reason: "upstream timeout" });

    expect(warnSpy).toHaveBeenCalledExactlyOnceWith({
      event: SERVER_LOG_EVENT_NAMES.GOAT_IT_API_UPSTREAM_ERROR,
      reason: "upstream timeout",
    });
  });
});

describe(logServerError, () => {
  beforeEach(() => {
    vi.mocked(useRuntimeConfig).mockReturnValue({ logger: { level: "warn" } } as unknown as ReturnType<typeof useRuntimeConfig>);
  });

  it("should emit an error event with the mapped error and context when called.", () => {
    const error = Object.assign(new Error("boom"), { statusCode: 502, code: "ECONNRESET" });
    const errorSpy = vi.spyOn(getServerLogger(), "error").mockReturnValue(undefined);

    logServerError(error, SERVER_LOG_EVENT_NAMES.SERVER_UNHANDLED_ERROR, { method: "GET" });

    expect(errorSpy).toHaveBeenCalledExactlyOnceWith({
      event: SERVER_LOG_EVENT_NAMES.SERVER_UNHANDLED_ERROR,
      errorName: "Error",
      errorCode: "ECONNRESET",
      statusCode: 502,
      method: "GET",
    });
  });
});