import {
  SENTRY_DENIED_URL_PATTERNS,
  SENTRY_IGNORED_ERROR_PATTERNS,
} from "#shared/utils/helpers/sentry/sentry.constants";
import type { SentryInitConfig, SentryRuntimeConfig } from "#shared/utils/helpers/sentry/sentry.types";

/**
 * Builds the shared `Sentry.init` options, or `undefined` when error tracking must stay disabled.
 *
 * Disabled environments, a missing environment label, and a blank DSN skip initialization entirely, so automated
 * tests never contact Sentry. Collection is opt-out per category: identity, cookies, headers, query strings, bodies,
 * and stack-frame variables are never collected. The DSN is trimmed.
 */
function buildSentryInitConfig(config: SentryRuntimeConfig): SentryInitConfig | undefined {
  if (!config.enabled || config.environment === undefined) {
    return undefined;
  }

  const dsn = config.dsn.trim();

  if (dsn.length === 0) {
    return undefined;
  }
  return {
    dsn,
    environment: config.environment,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      urlQueryParams: false,
      httpBodies: [],
      stackFrameVariables: false,
    },
    ignoreErrors: [...SENTRY_IGNORED_ERROR_PATTERNS],
    denyUrls: [...SENTRY_DENIED_URL_PATTERNS],
  };
}

export { buildSentryInitConfig };