import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the page title should be "(?<title>[^"]*)"$/u,
  async function(this: GoatItWorld, title: string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  },
);