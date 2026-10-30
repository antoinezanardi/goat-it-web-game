import { FetchError } from "ofetch";
import { ZodError } from "zod";

import { getErrorStatusCode } from "#shared/utils/helpers/error-status/error-status.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";

function isAbortError(error: unknown): boolean {
  return isRecord(error) && (error.name === "AbortError" || error.name === "TimeoutError");
}

/**
 * Tells whether a caught client failure is worth reporting to error tracking.
 *
 * The server owns every HTTP-status failure and every network `FetchError`; reporting them again from the browser
 * would duplicate events. Cancelled and timed-out requests are not reportable either. What remains is a client-only
 * failing error, such as a repository `ZodError` or a runtime error caught by the toast boundary.
 */
function isUnexpectedClientError(error: unknown): boolean {
  if (isAbortError(error) || error instanceof FetchError || getErrorStatusCode(error) !== undefined) {
    return false;
  }
  return error instanceof Error || error instanceof ZodError;
}

export { isUnexpectedClientError };