import { describe, expect, it } from "vitest";

import {
  buildContentSecurityPolicy,
  generateCspNonce,
  stampNonceOnInlineScripts,
} from "#server/utils/security/helpers/security-headers.helpers";

describe(buildContentSecurityPolicy, () => {
  it("should build the agreed content security policy when called with a nonce.", () => {
    const nonce = "2f1c9a3e-0000-4000-8000-000000000001";

    const policy = buildContentSecurityPolicy(nonce);

    expect(policy).toBe("default-src 'self'; " +
      `script-src 'self' 'wasm-unsafe-eval' 'nonce-${nonce}'; ` +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data:; " +
      "font-src 'self'; " +
      "connect-src 'self'; " +
      "worker-src 'self' blob:; " +
      "manifest-src 'self'; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "object-src 'none'");
  });
});

describe(generateCspNonce, () => {
  it("should generate a uuid nonce when called.", () => {
    const nonce = generateCspNonce();

    expect(nonce).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/u);
  });
});

describe(stampNonceOnInlineScripts, () => {
  it("should add the nonce to every script tag when no nonce is present.", () => {
    const chunks = [
      "<script type=\"importmap\">{\"imports\":{}}</script>",
      "<script>window.__NUXT__={}</script>",
    ];

    const stampedChunks = stampNonceOnInlineScripts(chunks, "nonce-value");

    expect(stampedChunks).toStrictEqual([
      "<script nonce=\"nonce-value\" type=\"importmap\">{\"imports\":{}}</script>",
      "<script nonce=\"nonce-value\">window.__NUXT__={}</script>",
    ]);
  });

  it("should keep the existing nonce when a script tag already has one.", () => {
    const chunks = ["<script nonce=\"existing\" src=\"/app.js\"></script>"];

    const stampedChunks = stampNonceOnInlineScripts(chunks, "nonce-value");

    expect(stampedChunks).toStrictEqual(["<script nonce=\"existing\" src=\"/app.js\"></script>"]);
  });

  it("should leave the chunk untouched when it contains no script tag.", () => {
    const chunks = ["<style>:root{color:red}</style>"];

    const stampedChunks = stampNonceOnInlineScripts(chunks, "nonce-value");

    expect(stampedChunks).toStrictEqual(["<style>:root{color:red}</style>"]);
  });
});