import { setResponseHeader } from "h3";
import type { NitroApp } from "nitropack/types";

import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config/runtime-config.helpers";
import {
  CSP_DIRECTIVES,
  CSP_ENFORCE_HEADER_NAME,
  CSP_NONCE_PLACEHOLDER,
  CSP_REPORT_ONLY_HEADER_NAME,
  SCRIPT_TAG_WITHOUT_NONCE_PATTERN,
} from "#server/utils/security/security-headers.constants";

/**
 * Joins the CSP directives and substitutes the nonce placeholder.
 */
function buildContentSecurityPolicy(nonce: string): string {
  return CSP_DIRECTIVES.join("; ").replace(CSP_NONCE_PLACEHOLDER, nonce);
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
    const { cspMode } = getRuntimeConfig(event).security;

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

    setResponseHeader(event, cspHeaderName, buildContentSecurityPolicy(nonce));
  });
}

export {
  buildContentSecurityPolicy,
  generateCspNonce,
  registerCspNonceHook,
  stampNonceOnInlineScripts,
};