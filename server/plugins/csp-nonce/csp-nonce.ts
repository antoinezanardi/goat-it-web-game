import { defineNitroPlugin } from "nitropack/runtime";

import { getRuntimeConfig } from "#server/utils/runtime-config/helpers/runtime-config.helpers";
import { buildContentSecurityPolicy, generateCspNonce, stampNonceOnInlineScripts } from "#server/utils/security/helpers/security-headers.helpers";

const CSP_ENFORCE_HEADER_NAME = "Content-Security-Policy";
const CSP_REPORT_ONLY_HEADER_NAME = "Content-Security-Policy-Report-Only";

export default defineNitroPlugin((nitroApp): void => {
  nitroApp.hooks.hook("render:html", (htmlContext, { event, streaming }) => {
    const { cspMode } = getRuntimeConfig(event).security;

    if (cspMode === "off") {
      return;
    }

    const nonce = generateCspNonce();
    htmlContext.head = stampNonceOnInlineScripts(htmlContext.head, nonce);
    htmlContext.bodyPrepend = stampNonceOnInlineScripts(htmlContext.bodyPrepend, nonce);

    if (streaming !== true) {
      htmlContext.body = stampNonceOnInlineScripts(htmlContext.body, nonce);
      htmlContext.bodyAppend = stampNonceOnInlineScripts(htmlContext.bodyAppend, nonce);
    }

    setResponseHeader(event, cspMode === "report-only" ? CSP_REPORT_ONLY_HEADER_NAME : CSP_ENFORCE_HEADER_NAME, buildContentSecurityPolicy(nonce));
  });
});