import { getErrorStatusCode } from "#shared/utils/helpers/error-status/error-status.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import type { SafeServerErrorLog } from "#server/utils/logging/helpers/server-error-log-mapping/server-error-log-mapping.types";

/**
 * Maps any thrown server value to the small set of error fields that are safe to log.
 *
 * Error messages, stack traces, payloads, and unknown properties are intentionally dropped.
 */
function mapServerErrorToSafeLog(error: unknown): SafeServerErrorLog {
  if (!isRecord(error)) {
    return { errorName: "UnknownError" };
  }

  const errorName = typeof error.name === "string" && error.name !== "" ? error.name : "Error";
  const statusCode = getErrorStatusCode(error);
  const errorCode = typeof error.code === "string" && error.code !== "" ? error.code : undefined;

  return {
    errorName,
    ...errorCode === undefined ? {} : { errorCode },
    ...statusCode === undefined ? {} : { statusCode },
  };
}

export { mapServerErrorToSafeLog };