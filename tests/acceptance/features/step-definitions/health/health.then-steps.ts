import { Then } from "@cucumber/cucumber";

import {
  assertHealthStatus,
  assertResponseIsNotCached,
} from "#acceptance/features/step-definitions/health/helpers/health.then-steps.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the health response should report the status "(?<status>[^"]*)"$/u,
  async function(this: GoatItWorld, status: string): Promise<void> {
    await assertHealthStatus(this, status);
  },
);

Then(
  /^the health response should not be cached$/u,
  function(this: GoatItWorld): void {
    assertResponseIsNotCached(this);
  },
);