import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import {
  assertInlineScriptsCarryNonce,
  assertPrivateApiCacheHeaders,
  assertRetryAfterHeader,
  assertSecurityHeaders,
  getApiResponse,
} from "#acceptance/features/step-definitions/security/helpers/security.then-steps.helpers.ts";

Then(
  /^the response status should be (?<status>\d+)$/u,
  function(this: GoatItWorld, status: string): void {
    expect(getApiResponse(this).status()).toBe(Number(status));
  },
);

Then(
  /^the response should carry a retry after header$/u,
  function(this: GoatItWorld): void {
    assertRetryAfterHeader(getApiResponse(this));
  },
);

Then(
  /^the response should carry the security headers$/u,
  function(this: GoatItWorld): void {
    assertSecurityHeaders(getApiResponse(this));
  },
);

Then(
  /^the response should be private, not stored and vary on the cookie$/u,
  function(this: GoatItWorld): void {
    assertPrivateApiCacheHeaders(getApiResponse(this));
  },
);

Then(
  /^all inline scripts in the "(?<path>[^"]*)" response should carry the content security policy nonce$/u,
  async function(this: GoatItWorld, path: string): Promise<void> {
    await assertInlineScriptsCarryNonce(this, path);
  },
);

Then(
  /^no content security policy violations should have been reported$/u,
  function(this: GoatItWorld): void {
    expect(this.cspViolations).toStrictEqual([]);
  },
);