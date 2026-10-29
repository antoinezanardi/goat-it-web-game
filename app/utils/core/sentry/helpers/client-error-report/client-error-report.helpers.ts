import { getErrorStatusCode, isServerErrorStatus } from "#shared/utils/helpers/error-status/error-status.helpers";
import { isRecord } from "#shared/utils/helpers/object/object.helpers";
import type { ClientErrorCapture } from "@/utils/core/sentry/helpers/client-error-report/client-error-report.types";

function isAbortError(error: unknown): boolean {
  return isRecord(error) && (error.name === "AbortError" || error.name === "CanceledError");
}

/**
 * Tells whether a caught client failure is actionable enough to report.
 *
 * Cancelled requests, expected 4xx outcomes, and non-error values are not reportable. Network failures and 5xx
 * responses are reportable; responses without a status are not.
 */
function isUnexpectedClientError(error: unknown): boolean {
  if (isAbortError(error)) {
    return false;
  }

  const statusCode = getErrorStatusCode(error);

  // Acceptable as the 100 lower bound is the standard first HTTP status code
  // oxlint-disable-next-line no-magic-numbers
  if (statusCode !== undefined && statusCode >= 100) {
    return isServerErrorStatus(statusCode);
  }
  return error instanceof Error;
}

/**
 * Reports a caught client failure exactly once when it is unexpected.
 *
 * Expected 4xx and cancelled outcomes are ignored. The caller owns the capture function so this helper stays pure and
 * the owning error-handling boundary decides which SDK call to use.
 */
function reportUnexpectedClientError(error: unknown, captureException: ClientErrorCapture): void {
  if (!isUnexpectedClientError(error)) {
    return;
  }
  captureException(error);
}

export { isUnexpectedClientError, reportUnexpectedClientError };