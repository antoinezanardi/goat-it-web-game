import { url } from "@nuxt/test-utils/e2e";
import type { APIResponse } from "playwright-core";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { SECURITY_RATE_LIMIT_MAXIMUM_REQUESTS } from "#acceptance/features/support/constants/hooks.constants.ts";
import { SECURITY_API_PROXY_ROUTE } from "#acceptance/features/step-definitions/security/security.steps.constants.ts";

async function enableClientForwarding(world: GoatItWorld, clientIp: string): Promise<void> {
  await world.context.setExtraHTTPHeaders({ "X-Forwarded-For": clientIp });
}

async function exhaustRateLimitForClient(world: GoatItWorld, clientIp: string): Promise<APIResponse | undefined> {
  let lastResponse: APIResponse | undefined;

  for (let attempt = 0; attempt <= SECURITY_RATE_LIMIT_MAXIMUM_REQUESTS; attempt++) {
    // Acceptable as the rate limit budget must be exhausted with sequential requests
    // oxlint-disable-next-line eslint/no-await-in-loop
    lastResponse = await world.context.request.get(url(SECURITY_API_PROXY_ROUTE), { headers: { "X-Forwarded-For": clientIp } });
  }
  return lastResponse;
}

export { enableClientForwarding, exhaustRateLimitForClient };