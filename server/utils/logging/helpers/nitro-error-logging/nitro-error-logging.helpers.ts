import { getErrorStatusCode, isClientErrorStatus } from "#shared/utils/helpers/error-status/error-status.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import { logServerError } from "#server/utils/logging/helpers/server-logger/server-logger.helpers";
import type { NitroErrorLoggingContext } from "#server/utils/logging/helpers/nitro-error-logging/nitro-error-logging.types";
import { ServerLogEventName } from "#server/utils/logging/server-log.enums";

function isHandledProxyError(error: unknown): boolean {
  return isRecord(error) && isRecord(error.data) && typeof error.data.errorCode === "string";
}

function getSafeRequestPath(context: NitroErrorLoggingContext): string | undefined {
  const { event } = context;

  if (typeof event?.path !== "string") {
    return undefined;
  }
  return event.path.split("?")[0];
}

/**
 * Logs an unexpected Nitro failure through the structured logger.
 *
 * Skips expected 4xx responses and proxy failures already handled by the Goat It API error path, so the same error is
 * never recorded twice. Only status, method, and query-free path are forwarded; the request body, headers, cookies,
 * query string, source IP, and h3 error data never reach the logger.
 */
function logNitroError(error: unknown, context: NitroErrorLoggingContext = {}): void {
  const statusCode = getErrorStatusCode(error);

  if (statusCode !== undefined && isClientErrorStatus(statusCode) || isHandledProxyError(error)) {
    return;
  }

  const path = getSafeRequestPath(context);
  const { event } = context;
  const method = typeof event?.method === "string" ? event.method : undefined;

  logServerError(error, ServerLogEventName.SERVER_UNHANDLED_ERROR, {
    ...statusCode === undefined ? {} : { statusCode },
    ...method === undefined ? {} : { method },
    ...path === undefined ? {} : { path },
  });
}

export { logNitroError };