import type { APIResponse } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

function getApiResponse(world: GoatItWorld): APIResponse {
  if (world.lastApiResponse === undefined) {
    throw new Error("No API response has been recorded for this scenario.");
  }
  return world.lastApiResponse;
}

export { getApiResponse };