const SENTRY_DENIED_URL_PATTERNS: readonly RegExp[] = [/^chrome-extension:\/\//u, /^moz-extension:\/\//u];

const SENTRY_HEALTH_CHECK_PATHS: readonly string[] = ["/healthz", "/readyz"];

const SENTRY_IGNORED_ERROR_PATTERNS: readonly (string | RegExp)[] = ["AbortError", "The operation was aborted"];

export {
  SENTRY_DENIED_URL_PATTERNS,
  SENTRY_HEALTH_CHECK_PATHS,
  SENTRY_IGNORED_ERROR_PATTERNS,
};