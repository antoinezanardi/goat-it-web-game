import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the game settings About tab should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-settings-about-tab")).toBeVisible();
    await expect(this.page.getByTestId("game-settings-general-tab")).toBeHidden();
  },
);

Then(
  /^the game settings selected locale should be "(?<locale>[^"]*)"$/u,
  async function(this: GoatItWorld, locale: string): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");

    await expect(modal.getByTestId("locale-select")).toContainText(locale);
  },
);