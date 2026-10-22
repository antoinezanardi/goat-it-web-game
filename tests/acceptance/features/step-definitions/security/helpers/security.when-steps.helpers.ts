import { url } from "@nuxt/test-utils/e2e";
import type { APIResponse } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { waitForPageLoadStates } from "#acceptance/features/support/helpers/navigation.helpers.ts";
import { SECURITY_PAGE_SETTLE_MS } from "#acceptance/features/step-definitions/security/security.steps.constants.ts";

async function requestRouteAsClient(world: GoatItWorld, route: string, clientIp: string): Promise<APIResponse> {
  return world.context.request.get(url(route), { headers: { "X-Forwarded-For": clientIp } });
}

async function postJsonBodyAsClient(world: GoatItWorld, route: string, bodySizeInBytes: number, clientIp: string): Promise<APIResponse> {
  return world.context.request.post(url(route), {
    headers: { "X-Forwarded-For": clientIp, "content-type": "application/json" },
    data: "a".repeat(bodySizeInBytes),
  });
}

async function postNonJsonBodyAsClient(world: GoatItWorld, route: string, clientIp: string): Promise<APIResponse> {
  return world.context.request.post(url(route), {
    headers: { "X-Forwarded-For": clientIp, "content-type": "text/plain" },
    data: "not-a-json-body",
  });
}

async function visitPage(world: GoatItWorld, path: string): Promise<void> {
  await world.page.goto(url(path));
  await waitForPageLoadStates(world);
  await world.page.waitForTimeout(SECURITY_PAGE_SETTLE_MS);
}

export { postJsonBodyAsClient, postNonJsonBodyAsClient, requestRouteAsClient, visitPage };