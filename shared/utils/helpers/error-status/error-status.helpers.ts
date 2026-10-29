import { isRecord } from "#shared/utils/helpers/object/object.helpers";

/**
 * Reads a numeric HTTP status from an error-shaped value.
 *
 * Recognizes h3 `statusCode`, a direct `status`, and an ofetch `response.status`; any other shape yields `undefined`.
 */
function getErrorStatusCode(error: unknown): number | undefined {
  if (!isRecord(error)) {
    return undefined;
  }

  if (typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if (typeof error.status === "number") {
    return error.status;
  }

  const { response } = error;

  if (isRecord(response) && typeof response.status === "number") {
    return response.status;
  }
  return undefined;
}

/**
 * Tells whether a status code is a client error (400-499).
 */
function isClientErrorStatus(statusCode: number): boolean {
  // Acceptable as HTTP status class boundaries are standard, self-explanatory values
  // oxlint-disable-next-line no-magic-numbers
  return statusCode >= 400 && statusCode < 500;
}

/**
 * Tells whether a status code is a server error (500-599).
 */
function isServerErrorStatus(statusCode: number): boolean {
  // Acceptable as HTTP status class boundaries are standard, self-explanatory values
  // oxlint-disable-next-line no-magic-numbers
  return statusCode >= 500 && statusCode < 600;
}

export { getErrorStatusCode, isClientErrorStatus, isServerErrorStatus };