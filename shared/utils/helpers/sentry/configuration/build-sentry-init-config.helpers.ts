import {
  SENTRY_DENIED_URL_PATTERNS,
  SENTRY_IGNORED_ERROR_PATTERNS,
  SENTRY_SENSITIVE_FIELD_DENY_LIST,
} from "#shared/utils/helpers/sentry/sentry.constants";
import type { SentryInitConfig, SentryRuntimeConfig } from "#shared/utils/helpers/sentry/sentry.types";

/**
 * Builds the shared `Sentry.init` options, or `undefined` when error tracking must stay disabled.
 *
 * Disabled environments and a blank DSN skip initialization entirely, so automated tests never contact Sentry.
 * The DSN is trimmed; an empty release is omitted so the SDK does not send a meaningless label.
 */
function buildSentryInitConfig(config: SentryRuntimeConfig): SentryInitConfig | undefined {
  if (!config.enabled) {
    return undefined;
  }

  const dsn = config.dsn.trim();

  if (dsn.length === 0) {
    return undefined;
  }

  const release = config.release.trim();
  const sensitiveFieldDenyList = [...SENTRY_SENSITIVE_FIELD_DENY_LIST];

  const sentryInitConfig: SentryInitConfig = {
    dsn,
    environment: config.environment,
    ...release.length > 0 ? { release } : {},
    dataCollection: {
      userInfo: false,
      httpBodies: [],
      httpHeaders: { deny: [...sensitiveFieldDenyList] },
      cookies: { deny: [...sensitiveFieldDenyList] },
      urlQueryParams: { deny: [...sensitiveFieldDenyList] },
    },
    ignoreErrors: [...SENTRY_IGNORED_ERROR_PATTERNS],
    denyUrls: [...SENTRY_DENIED_URL_PATTERNS],
  };

  return sentryInitConfig;
}

export { buildSentryInitConfig };