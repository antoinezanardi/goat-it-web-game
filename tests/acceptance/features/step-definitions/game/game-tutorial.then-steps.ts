import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { expectTutorialSpotlightCovers } from "#acceptance/features/step-definitions/game/helpers/game-tutorial.then-steps.helpers.ts";
import {
  getGameTourBackdrop,
  getGameTourButton,
  getGameTourTitle,
  getGameTourTooltip,
} from "#acceptance/features/support/helpers/game.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the interactive tutorial should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTourTooltip(this.page)).toBeVisible();
  },
);

Then(
  /^the interactive tutorial step title should be "(?<title>[^"]+)"$/u,
  async function(this: GoatItWorld, title: string): Promise<void> {
    await expect(getGameTourTitle(this.page)).toHaveText(title);
  },
);

Then(
  /^the interactive tutorial should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTourTooltip(this.page)).toBeHidden();
    await expect(getGameTourBackdrop(this.page)).toBeHidden();
  },
);

Then(
  /^the Back button should not be available in the interactive tutorial$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTourButton(this.page, "Back")).toBeHidden();
  },
);

Then(
  /^the interactive tutorial should target the sidebar toggle$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectTutorialSpotlightCovers(this.page, this.page.getByTestId("game-sidebar-toggle-button"));
  },
);

Then(
  /^the interactive tutorial should target the filters trigger$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectTutorialSpotlightCovers(this.page, this.page.getByTestId("game-questions-filters-button"));
  },
);