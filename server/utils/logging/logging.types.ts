import type { SERVER_LOG_EVENT_NAMES } from "#server/utils/logging/logging.constants";

/**
 * Structured event names emitted by the server logger.
 */
type ServerLogEventName = (typeof SERVER_LOG_EVENT_NAMES)[keyof typeof SERVER_LOG_EVENT_NAMES];

/**
 * Level used by structured events: warnings for recoverable anomalies, errors for unexpected failures.
 */
type ServerEventLevel = "error" | "warn";

/**
 * Metadata allowed in a structured log entry; payloads, headers, cookies, query strings, and source IPs are never included.
 */
type SafeLogContext = {
  /** HTTP status code when one is known. */
  statusCode?: number;
  /** HTTP method of the failing request. */
  method?: string;
  /** Request pathname without the query string. */
  path?: string;
  /** Error class name, such as `FetchError`. */
  errorName?: string;
  /** Machine-readable error code, such as `ECONNRESET`. */
  errorCode?: string;
  /** Sanitized explanation for a known anomaly. */
  reason?: string;
};

export type { SafeLogContext, ServerEventLevel, ServerLogEventName };