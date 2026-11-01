import { url } from "@nuxt/test-utils/e2e";
import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";

import {
  SECURITY_CSP_NONCE_PATTERN,
  SECURITY_EXPECTED_API_CACHE_HEADERS,
  SECURITY_EXPECTED_HEADERS,
} from "#acceptance/features/step-definitions/security/security.steps.constants.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

function assertSecurityHeaders(response: APIResponse): void {
  expect(response.headers()).toMatchObject(SECURITY_EXPECTED_HEADERS);
}

function assertPrivateApiCacheHeaders(response: APIResponse): void {
  expect(response.headers()).toMatchObject(SECURITY_EXPECTED_API_CACHE_HEADERS);
}

function assertRetryAfterHeader(response: APIResponse): void {
  expect(Number(response.headers()["retry-after"])).toBeGreaterThan(0);
}

async function assertInlineScriptsCarryNonce(world: GoatItWorld, path: string): Promise<void> {
  const response = await world.context.request.get(url(path));
  const nonce = SECURITY_CSP_NONCE_PATTERN.exec(response.headers()["content-security-policy"] ?? "")?.groups?.nonce ?? "";
  const html = await response.text();
  const scriptTags = html.match(/<script[^>]*>/giu) ?? [];

  expect(scriptTags.length > 0 && scriptTags.every(scriptTag => scriptTag.includes(`nonce="${nonce}"`))).toBe(true);
}

export {
  assertInlineScriptsCarryNonce,
  assertPrivateApiCacheHeaders,
  assertRetryAfterHeader,
  assertSecurityHeaders,
};