const SCRUBBED_SENTRY_BREADCRUMB_PROPERTIES: readonly string[] = ["data"];

const SCRUBBED_SENTRY_EVENT_PROPERTIES: readonly string[] = ["breadcrumbs", "contexts", "extra", "request", "user"];

const SCRUBBED_SENTRY_EXCEPTION_PROPERTIES: readonly string[] = ["mechanism", "value"];

const SCRUBBED_SENTRY_FRAME_PROPERTIES: readonly string[] = ["vars"];

const SCRUBBED_SENTRY_MESSAGE_PROPERTIES: readonly string[] = ["logentry", "message"];

const SENTRY_DENIED_URL_PATTERNS: readonly RegExp[] = [/^chrome-extension:\/\//u, /^moz-extension:\/\//u];

const SENTRY_HEALTH_CHECK_PATHS: readonly string[] = ["/healthz", "/readyz"];

const SENTRY_IGNORED_ERROR_PATTERNS: readonly (string | RegExp)[] = ["AbortError", "The operation was aborted"];

const SENTRY_SENSITIVE_FIELD_DENY_LIST: readonly string[] = ["forwarded", "-ip", "remote-", "via", "-user"];

export {
  SCRUBBED_SENTRY_BREADCRUMB_PROPERTIES,
  SCRUBBED_SENTRY_EVENT_PROPERTIES,
  SCRUBBED_SENTRY_EXCEPTION_PROPERTIES,
  SCRUBBED_SENTRY_FRAME_PROPERTIES,
  SCRUBBED_SENTRY_MESSAGE_PROPERTIES,
  SENTRY_DENIED_URL_PATTERNS,
  SENTRY_HEALTH_CHECK_PATHS,
  SENTRY_IGNORED_ERROR_PATTERNS,
  SENTRY_SENSITIVE_FIELD_DENY_LIST,
};