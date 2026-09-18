import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  getGameTourButton,
  getGameTourTooltip,
} from "#acceptance/features/support/helpers/game.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user opens the interactive tutorial from the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog");

    if (!await dialog.isVisible()) {
      await this.page.getByTestId("game-sidebar-toggle-button").click();
      await expect(dialog).toBeVisible();
    }

    const tutorialLink = dialog.getByTestId("game-sidebar-tutorial-link");
    await expect(tutorialLink).toBeVisible();
    await tutorialLink.click();
    await expect(getGameTourTooltip(this.page)).toBeVisible();
  },
);

When(
  /^the user clicks the (?<control>Next|Back|Skip|Finish) button in the interactive tutorial$/u,
  async function(this: GoatItWorld, control: string): Promise<void> {
    const button = getGameTourButton(this.page, control);
    await expect(button).toBeVisible();
    await button.click();
  },
);