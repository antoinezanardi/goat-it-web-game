/**
 * Inputs that decide whether Sentry may initialize.
 */
type IsSentryEnabledOptions = {
  /** Whether the current build is a local development build. */
  isDevelopment: boolean;
  /** Whether error tracking is explicitly disabled by configuration. */
  disabled: boolean;
};

export type { IsSentryEnabledOptions };