import type { IsSentryEnabledOptions } from "#shared/utils/helpers/sentry/configuration/is-sentry-enabled.types";

/**
 * Tells whether Sentry may initialize for the current build and configuration.
 */
function isSentryEnabled({ isDevelopment, disabled }: IsSentryEnabledOptions): boolean {
  return !isDevelopment && !disabled;
}

export { isSentryEnabled };