/**
 * Sanitized error fields allowed in a structured log entry.
 */
type SafeServerErrorLog = {
  /** Error class name; `UnknownError` when the thrown value is not an object, `Error` when the name is missing or unsafe. */
  errorName: string;
  /** Machine-readable error code when the error exposes a safe one. */
  errorCode?: string;
  /** HTTP status code when the error exposes one. */
  statusCode?: number;
};

export type { SafeServerErrorLog };