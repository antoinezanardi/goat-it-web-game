import {
  CLIENT_ERROR_STATUS_CODE_MIN,
  HTTP_STATUS_CODE_MAX,
  HTTP_STATUS_CODE_MIN,
  SERVER_ERROR_STATUS_CODE_MIN,
} from "#shared/utils/helpers/error-status/error-status.constants";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";

/**
 * Reads a valid numeric HTTP status from an error-shaped value.
 *
 * Recognizes h3 `statusCode`, a direct `status`, and an ofetch `response.status`; values outside the standard
 * 100-599 range, such as `0` on a network failure, yield `undefined`.
 */
function getErrorStatusCode(error: unknown): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  const statusCode = typeof error.statusCode === "number" ? error.statusCode : getFallbackStatusCode(error);

  return statusCode !== undefined && statusCode >= HTTP_STATUS_CODE_MIN && statusCode <= HTTP_STATUS_CODE_MAX ? statusCode : undefined;
}

function getFallbackStatusCode(error: Record<PropertyKey, unknown>): number | undefined {
  if (typeof error.status === "number") {
    return error.status;
  }

  const { response } = error;

  return isRecord(response) && typeof response.status === "number" ? response.status : undefined;
}

/**
 * Tells whether a status code is a client error (400-499).
 */
function isClientErrorStatus(statusCode: number): boolean {
  return statusCode >= CLIENT_ERROR_STATUS_CODE_MIN && statusCode < SERVER_ERROR_STATUS_CODE_MIN;
}

/**
 * Tells whether a status code is a server error (500-599).
 */
function isServerErrorStatus(statusCode: number): boolean {
  return statusCode >= SERVER_ERROR_STATUS_CODE_MIN && statusCode <= HTTP_STATUS_CODE_MAX;
}

export { getErrorStatusCode, isClientErrorStatus, isServerErrorStatus };