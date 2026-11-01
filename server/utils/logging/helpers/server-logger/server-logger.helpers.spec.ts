import type { DestinationStream } from "pino";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import {
  createServerLogger,
  getServerLogger,
  logServerError,
  logServerWarning,
} from "#server/utils/logging/helpers/server-logger/server-logger.helpers";
import {
  SERVER_LOGGER_NAME,
  SERVER_LOG_REDACTION_CENSOR,
  SERVER_LOG_REDACTION_PATHS,
} from "#server/utils/logging/helpers/server-logger/server-logger.constants";
import { ServerLogEventName } from "#server/utils/logging/server-log.enums";

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

function mockLoggerLevel(level = "info"): void {
  vi.mocked(useRuntimeConfig).mockReturnValue({ logger: { level } } as unknown as ReturnType<typeof useRuntimeConfig>);
}

function getLogValue(log: CapturedLog, path: string): unknown {
  return path.split(".").reduce<unknown>((value, segment) => (isRecord(value) ? value[segment] : undefined), log);
}

function getFirstCapturedLog(capturedLogs: CapturedLog[]): CapturedLog {
  const [firstLog] = capturedLogs;

  if (firstLog === undefined) {
    throw new Error("The logger did not capture any record.");
  }
  return firstLog;
}

function createSecretPayload(path: string): CapturedLog {
  const payload: CapturedLog = {};
  const segments = path.split(".");
  let cursor = payload;

  for (const [index, segment] of segments.entries()) {
    if (index === segments.length - 1) {
      cursor[segment] = "secret";
    } else {
      const next: CapturedLog = {};
      cursor[segment] = next;
      cursor = next;
    }
  }
  return payload;
}

describe(createServerLogger, () => {
  it("should write a json record with the event name and message when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR }, "upstream failure");

    expect(capturedLogs[0]).toMatchObject({
      name: SERVER_LOGGER_NAME,
      level: 40,
      msg: "upstream failure",
      event: ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR,
    });
  });

  it("should write an iso timestamp when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR });

    expect(String(capturedLogs[0]?.time)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/u);
  });

  it("should omit the pid when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR });

    expect(capturedLogs[0]).not.toHaveProperty("pid");
  });

  it("should omit the hostname when an event is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.warn({ event: ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR });

    expect(capturedLogs[0]).not.toHaveProperty("hostname");
  });

  it.each<{ path: string }>(SERVER_LOG_REDACTION_PATHS.map(path => ({ path })))(
    "should redact the secret field \"$path\" when an event contains it.",
    ({ path }) => {
      const capturedLogs: CapturedLog[] = [];
      const logger = createServerLogger("info", createLogSink(capturedLogs));

      logger.error(createSecretPayload(path));

      expect(getLogValue(getFirstCapturedLog(capturedLogs), path)).toBe(SERVER_LOG_REDACTION_CENSOR);
    },
  );

  it("should serialize an error when an error is logged.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("info", createLogSink(capturedLogs));

    logger.error(new Error("boom"));

    expect(capturedLogs[0]).toMatchObject({ err: { type: "Error", message: "boom" } });
  });

  it("should not write a record when the level is below the configured severity.", () => {
    const capturedLogs: CapturedLog[] = [];
    const logger = createServerLogger("error", createLogSink(capturedLogs));

    logger.warn({ event: ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR });

    expect(capturedLogs).toStrictEqual([]);
  });
});

describe(getServerLogger, () => {
  let getFreshServerLogger: typeof getServerLogger;

  beforeEach(async() => {
    mockLoggerLevel("warn");
    vi.resetModules();
    ({ getServerLogger: getFreshServerLogger } = await import("#server/utils/logging/helpers/server-logger/server-logger.helpers"));
  });

  it("should reuse a single logger instance when called twice.", () => {
    expect(getFreshServerLogger()).toBe(getFreshServerLogger());
  });

  it("should use the configured level when creating the logger.", () => {
    expect(getFreshServerLogger().level).toBe("warn");
  });
});

describe(logServerWarning, () => {
  let logFreshServerWarning: typeof logServerWarning;
  let getFreshServerLogger: typeof getServerLogger;

  beforeEach(async() => {
    mockLoggerLevel("warn");
    vi.resetModules();
    ({ logServerWarning: logFreshServerWarning, getServerLogger: getFreshServerLogger } = await import("#server/utils/logging/helpers/server-logger/server-logger.helpers"));
  });

  it("should emit a warning event with the safe context when called.", () => {
    const warnSpy = vi.spyOn(getFreshServerLogger(), "warn").mockReturnValue(undefined);

    logFreshServerWarning(ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR, { reason: "upstream timeout" });

    expect(warnSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR,
      reason: "upstream timeout",
    });
  });

  it("should not throw when the logger write fails.", () => {
    vi.spyOn(getFreshServerLogger(), "warn").mockImplementation(() => {
      throw new Error("write failed");
    });

    expect(() => logFreshServerWarning(ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR)).not.toThrow();
  });

  it("should log a fallback message when the logger write fails.", () => {
    const consoleSpy = vi.spyOn(console, "error").mockReturnValue();
    vi.spyOn(getFreshServerLogger(), "warn").mockImplementation(() => {
      throw new Error("write failed");
    });

    logFreshServerWarning(ServerLogEventName.GOAT_IT_API_UPSTREAM_ERROR);

    expect(consoleSpy).toHaveBeenCalledExactlyOnceWith("Structured logging failed.", expect.any(Error));
  });
});

describe(logServerError, () => {
  let logFreshServerError: typeof logServerError;
  let getFreshServerLogger: typeof getServerLogger;

  beforeEach(async() => {
    mockLoggerLevel("warn");
    vi.resetModules();
    ({ logServerError: logFreshServerError, getServerLogger: getFreshServerLogger } = await import("#server/utils/logging/helpers/server-logger/server-logger.helpers"));
  });

  it("should emit an error event with the mapped error and context when called.", () => {
    const error = Object.assign(new Error("boom"), { statusCode: 502, code: "ECONNRESET" });
    const errorSpy = vi.spyOn(getFreshServerLogger(), "error").mockReturnValue(undefined);

    logFreshServerError(error, ServerLogEventName.SERVER_UNHANDLED_ERROR, { method: "GET" });

    expect(errorSpy).toHaveBeenCalledExactlyOnceWith({
      event: ServerLogEventName.SERVER_UNHANDLED_ERROR,
      errorName: "Error",
      errorCode: "ECONNRESET",
      statusCode: 502,
      method: "GET",
    });
  });
});