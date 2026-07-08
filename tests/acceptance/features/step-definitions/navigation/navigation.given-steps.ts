import { Given } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { goOnPage } from "#acceptance/features/step-definitions/navigation/helpers/navigation.given-steps.helpers.ts";

Given(/^the user is on (?<page>.+) page$/u, async function(this: GoatItWorld, page: string): Promise<void> {
  const pageName = page === "home" ? "" : page;

  await goOnPage(this, pageName);
});