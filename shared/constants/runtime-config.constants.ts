const CSP_MODES = ["enforce", "report-only", "off"] as const;
const LOG_LEVELS = ["fatal", "error", "warn", "info", "debug", "trace", "silent"] as const;
const SENTRY_ENVIRONMENTS = ["production", "staging"] as const;

export {
  CSP_MODES,
  LOG_LEVELS,
  SENTRY_ENVIRONMENTS,
};