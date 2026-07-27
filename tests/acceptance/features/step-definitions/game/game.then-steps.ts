import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^a game question should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-question")).toBeVisible();
  },
);

Then(
  /^the next question button should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-next-button")).toBeVisible();
  },
);