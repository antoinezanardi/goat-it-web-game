import { getErrorStatusCode } from "#shared/utils/helpers/error-status/error-status.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import { SAFE_ERROR_TOKEN_PATTERN } from "#server/utils/logging/helpers/server-error-log-mapping/server-error-log-mapping.constants";
import type { SafeServerErrorLog } from "#server/utils/logging/helpers/server-error-log-mapping/server-error-log-mapping.types";

function getSafeErrorToken(value: unknown): string | undefined {
  return typeof value === "string" && SAFE_ERROR_TOKEN_PATTERN.test(value) ? value : undefined;
}

/**
 * Maps any thrown server value to the small set of error fields that are safe to log.
 *
 * Error messages, stack traces, payloads, and unknown properties are intentionally dropped.
 */
function mapServerErrorToSafeLog(error: unknown): SafeServerErrorLog {
  if (!isRecord(error)) {
    return { errorName: "UnknownError" };
  }

  const errorName = getSafeErrorToken(error.name) ?? "Error";
  const statusCode = getErrorStatusCode(error);
  const errorCode = getSafeErrorToken(error.code);

  return {
    errorName,
    ...errorCode === undefined ? {} : { errorCode },
    ...statusCode === undefined ? {} : { statusCode },
  };
}

export { mapServerErrorToSafeLog };