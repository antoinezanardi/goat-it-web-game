import { setResponseHeader } from "h3";
import type { NitroApp } from "nitropack/types";

import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";
import {
  CSP_CONNECT_SRC_DIRECTIVE,
  CSP_DIRECTIVES,
  CSP_ENFORCE_HEADER_NAME,
  CSP_NONCE_PLACEHOLDER,
  CSP_REPORT_ONLY_HEADER_NAME,
  SCRIPT_TAG_WITHOUT_NONCE_PATTERN,
  SENTRY_INGEST_HOSTNAME_MARKER,
  SENTRY_SAAS_HOSTNAME_SUFFIX,
} from "#server/utils/security/security-headers.constants";

/**
 * Extracts the exact HTTPS Sentry ingest origin from a DSN.
 *
 * Returns `undefined` for an empty, malformed, non-HTTPS, or non-Sentry SaaS host, so the policy never widens.
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

/**
 * Joins the CSP directives, appends the Sentry ingest origin when configured, and substitutes the nonce placeholder.
 */
function buildContentSecurityPolicy(nonce: string, sentryDsn = ""): string {
  const sentryIngestOrigin = getSentryIngestOrigin(sentryDsn);
  const directives = sentryIngestOrigin === undefined ? CSP_DIRECTIVES : CSP_DIRECTIVES.map(directive => (directive === CSP_CONNECT_SRC_DIRECTIVE ? `${CSP_CONNECT_SRC_DIRECTIVE} ${sentryIngestOrigin}` : directive));

  return directives.join("; ").replace(CSP_NONCE_PLACEHOLDER, nonce);
}

/**
 * Generates a fresh per-render CSP nonce.
 */
function generateCspNonce(): string {
  return crypto.randomUUID();
}

/**
 * Adds the nonce to every inline `<script>` tag in the chunks that lacks one.
 */
function stampNonceOnInlineScripts(htmlChunks: string[], nonce: string): string[] {
  return htmlChunks.map(chunk => chunk.replace(SCRIPT_TAG_WITHOUT_NONCE_PATTERN, `<script nonce="${nonce}"`));
}

/**
 * Registers the `render:html` hook that stamps the CSP nonce and sets the policy header on every rendered page.
 *
 * Does nothing when the mode is `off`. In `report-only` mode the same nonces are stamped but the report-only header is used,
 * so switching to `enforce` needs no HTML change. `bodyAppend` is stamped only on the buffered render path.
 *
 * @see docs/security.md
 */
function registerCspNonceHook(nitroApp: NitroApp): void {
  nitroApp.hooks.hook("render:html", (htmlContext, { event, streaming }) => {
    const runtimeConfig = getRuntimeConfig(event);
    const { cspMode } = runtimeConfig.security;
    const { dsn } = runtimeConfig.public.sentry;

    if (cspMode === "off") {
      return;
    }

    const nonce = generateCspNonce();
    htmlContext.head = stampNonceOnInlineScripts(htmlContext.head, nonce);
    htmlContext.bodyPrepend = stampNonceOnInlineScripts(htmlContext.bodyPrepend, nonce);

    if (streaming !== true) {
      htmlContext.bodyAppend = stampNonceOnInlineScripts(htmlContext.bodyAppend, nonce);
    }

    const cspHeaderName = cspMode === "report-only" ? CSP_REPORT_ONLY_HEADER_NAME : CSP_ENFORCE_HEADER_NAME;

    setResponseHeader(event, cspHeaderName, buildContentSecurityPolicy(nonce, dsn));
  });
}

export {
  buildContentSecurityPolicy,
  generateCspNonce,
  getSentryIngestOrigin,
  registerCspNonceHook,
  stampNonceOnInlineScripts,
};