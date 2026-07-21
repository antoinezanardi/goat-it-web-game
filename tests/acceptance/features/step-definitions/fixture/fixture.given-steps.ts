import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { loadFixtureByDomain } from "#acceptance/features/step-definitions/fixture/helpers/fixture.given-steps.helpers.ts";

Given(
  /^the database is populated with the question theme fixture set "(?<setName>[^"]*)"$/u,
  async function(this: GoatItWorld, setName: string): Promise<void> {
    await loadFixtureByDomain(this, "question-theme", setName);
  },
);

Given(
  /^the database is populated with the question fixture set "(?<setName>[^"]*)"$/u,
  async function(this: GoatItWorld, setName: string): Promise<void> {
    await loadFixtureByDomain(this, "question", setName);
  },
);