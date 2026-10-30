import {
  SENTRY_INGEST_HOSTNAME_MARKER,
  SENTRY_SAAS_HOSTNAME_SUFFIX,
} from "#shared/utils/helpers/sentry/ingest/sentry-ingest.constants";

/**
 * Extracts the exact HTTPS Sentry ingest origin from a DSN.
 *
 * Returns `undefined` for an empty, malformed, non-HTTPS, or non-Sentry SaaS host, so neither the CSP nor boot
 * validation accepts a host the browser would never be allowed to call.
 */
function getSentryIngestOrigin(sentryDsn: string): string | undefined {
  try {
    const { protocol, hostname } = new URL(sentryDsn);

    if (protocol !== "https:" || !hostname.includes(SENTRY_INGEST_HOSTNAME_MARKER) || !hostname.endsWith(SENTRY_SAAS_HOSTNAME_SUFFIX)) {
      return undefined;
    }
    return `https://${hostname}`;
  } catch {
    return undefined;
  }
}

export { getSentryIngestOrigin };