import { expect } from "@playwright/test";

import { getApiResponse } from "#acceptance/features/support/helpers/api-response.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function assertHealthStatus(world: GoatItWorld, expectedStatus: string): Promise<void> {
  const body: unknown = await getApiResponse(world).json();

  expect(body).toStrictEqual({ status: expectedStatus });
}

function assertResponseIsNotCached(world: GoatItWorld): void {
  expect(getApiResponse(world).headers()["cache-control"]).toBe("no-store");
}

export { assertHealthStatus, assertResponseIsNotCached };