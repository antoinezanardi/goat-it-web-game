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

function buildContentSecurityPolicy(nonce: string): string {
  return CSP_DIRECTIVES.join("; ").replace(CSP_NONCE_PLACEHOLDER, nonce);
}

function generateCspNonce(): string {
  return crypto.randomUUID();
}

function stampNonceOnInlineScripts(htmlChunks: string[], nonce: string): string[] {
  return htmlChunks.map(chunk => chunk.replace(SCRIPT_TAG_WITHOUT_NONCE_PATTERN, `<script nonce="${nonce}"`));
}

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