import type { H3Event } from "h3";
import { pino } from "pino";
import type { DestinationStream, Logger } from "pino";

import type { LogLevel } from "#shared/types/runtime-config.types";
import { mapErrorToSafeLog } from "#server/utils/logging/helpers/error-log-mapping/error-log-mapping.helpers";
import {
  SERVER_LOGGER_NAME,
  SERVER_LOG_REDACTION_CENSOR,
  SERVER_LOG_REDACTION_PATHS,
} from "#server/utils/logging/logging.constants";
import type { SafeLogContext, ServerEventLevel, ServerLogEventName } from "#server/utils/logging/logging.types";
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
function getServerLogger(event?: H3Event): Logger {
  serverLogger ??= createServerLogger(getRuntimeConfig(event).logger.level);

  return serverLogger;
}

function logServerEvent(level: ServerEventLevel, eventName: ServerLogEventName, context: SafeLogContext = {}): void {
  const logger = getServerLogger();

  if (level === "warn") {
    logger.warn({ event: eventName, ...context });

    return;
  }
  logger.error({ event: eventName, ...context });
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
  logServerEvent("error", eventName, { ...mapErrorToSafeLog(error), ...context });
}

export { createServerLogger, getServerLogger, logServerError, logServerWarning };