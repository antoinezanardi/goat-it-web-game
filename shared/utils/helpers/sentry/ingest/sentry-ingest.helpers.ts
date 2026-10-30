import {
  SENTRY_INGEST_HOSTNAME_MARKER,
  SENTRY_PROJECT_ID_PATTERN,
  SENTRY_SAAS_HOSTNAME_SUFFIX,
} from "#shared/utils/helpers/sentry/ingest/sentry-ingest.constants";

/**
 * Extracts the exact HTTPS Sentry ingest origin from a DSN.
 *
 * Returns `undefined` for an empty, malformed, non-HTTPS, or non-Sentry SaaS host, and for a DSN missing its public key
 * or numeric project id, so neither the CSP nor boot validation accepts a DSN the SDK would silently ignore.
 */
function getSentryIngestOrigin(sentryDsn: string): string | undefined {
  try {
    const { protocol, hostname, pathname, username } = new URL(sentryDsn);
    const projectId = pathname.replace(/^\//u, "");

    if (
      protocol !== "https:" ||
      username.length === 0 ||
      !SENTRY_PROJECT_ID_PATTERN.test(projectId) ||
      !hostname.includes(SENTRY_INGEST_HOSTNAME_MARKER) ||
      !hostname.endsWith(SENTRY_SAAS_HOSTNAME_SUFFIX)
    ) {
      return undefined;
    }
    return `https://${hostname}`;
  } catch {
    return undefined;
  }
}

export { getSentryIngestOrigin };