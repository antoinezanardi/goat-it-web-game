import { setResponseHeader } from "h3";
import type { NitroApp } from "nitropack/types";

import { getSentryIngestOrigin } from "#shared/utils/helpers/sentry/ingest/sentry-ingest.helpers";
import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";
import {
  CSP_CONNECT_SRC_DIRECTIVE,
  CSP_DIRECTIVES,
  CSP_ENFORCE_HEADER_NAME,
  CSP_NONCE_PLACEHOLDER,
  CSP_REPORT_ONLY_HEADER_NAME,
  SCRIPT_TAG_WITHOUT_NONCE_PATTERN,
} from "#server/utils/security/security-headers.constants";

/**
 * Options for building the Content-Security-Policy header of one rendered page.
 */
type BuildContentSecurityPolicyOptions = {
  /** Per-render nonce substituted into the script-src placeholder. */
  nonce: string;
  /** Sentry DSN whose exact ingest origin is appended to connect-src when valid. */
  sentryDsn?: string;
};

function appendConnectSourceOrigin(directives: readonly string[], sentryOrigin: string | undefined): string[] {
  if (sentryOrigin === undefined) {
    return [...directives];
  }
  return directives.map(directive => (directive === CSP_CONNECT_SRC_DIRECTIVE ? `${CSP_CONNECT_SRC_DIRECTIVE} ${sentryOrigin}` : directive));
}

/**
 * Joins the CSP directives, appends the Sentry ingest origin when configured, and substitutes the nonce placeholder.
 */
function buildContentSecurityPolicy({ nonce, sentryDsn = "" }: BuildContentSecurityPolicyOptions): string {
  const directives = appendConnectSourceOrigin(CSP_DIRECTIVES, getSentryIngestOrigin(sentryDsn));

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

    setResponseHeader(event, cspHeaderName, buildContentSecurityPolicy({ nonce, sentryDsn: dsn }));
  });
}

export {
  buildContentSecurityPolicy,
  generateCspNonce,
  registerCspNonceHook,
  stampNonceOnInlineScripts,
};