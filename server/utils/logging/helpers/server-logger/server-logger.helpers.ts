import { pino } from "pino";
import type { DestinationStream, Logger } from "pino";

import type { LogLevel } from "#shared/types/runtime-config.types";
import { mapServerErrorToSafeLog } from "#server/utils/logging/helpers/server-error-log-mapping/server-error-log-mapping.helpers";
import {
  SERVER_LOGGER_NAME,
  SERVER_LOG_REDACTION_CENSOR,
  SERVER_LOG_REDACTION_PATHS,
} from "#server/utils/logging/helpers/server-logger/server-logger.constants";
import type { SafeLogContext, ServerEventLevel } from "#server/utils/logging/helpers/server-logger/server-logger.types";
import type { ServerLogEventName } from "#server/utils/logging/server-log.enums";
import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";

let serverLogger: Logger | undefined;

/**
 * Creates a JSON logger carrying only the app's name, ISO timestamps, and secret redaction.
 *
 * The name is bound through `base` because Pino drops every base binding, including `name`, when `base` is null.
 * The destination is injectable so tests can capture NDJSON synchronously; production uses Pino's stdout default.
 */
function createServerLogger(level: LogLevel, destination?: DestinationStream): Logger {
  return pino(
    {
      level,
      base: { name: SERVER_LOGGER_NAME },
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: { paths: [...SERVER_LOG_REDACTION_PATHS], censor: SERVER_LOG_REDACTION_CENSOR },
    },
    destination,
  );
}

/**
 * Returns the process-local logger, creating it from the validated runtime level on first use.
 */
function getServerLogger(): Logger {
  serverLogger ??= createServerLogger(getRuntimeConfig().logger.level);

  return serverLogger;
}

/**
 * Emits one structured record without letting a logging failure fail the request.
 *
 * Pino can throw when its destination is synchronous, so the write is guarded and a local console fallback keeps the
 * process observable without exposing request data.
 */
function logServerEvent(level: ServerEventLevel, eventName: ServerLogEventName, context: SafeLogContext = {}): void {
  try {
    getServerLogger()[level]({ event: eventName, ...context });
  } catch(error) {
    console.error("Structured logging failed.", error);
  }
}

/**
 * Emits a warning event for a recoverable anomaly with only safe metadata.
 */
function logServerWarning(eventName: ServerLogEventName, context: SafeLogContext = {}): void {
  logServerEvent("warn", eventName, context);
}

/**
 * Maps an unexpected thrown value to safe fields and emits an error event.
 *
 * The raw error, its message, stack, and any payload are never forwarded.
 */
function logServerError(error: unknown, eventName: ServerLogEventName, context: SafeLogContext = {}): void {
  logServerEvent("error", eventName, { ...mapServerErrorToSafeLog(error), ...context });
}

export { createServerLogger, getServerLogger, logServerError, logServerWarning };