import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  getGameTourBackdrop,
  getGameTourButton,
  getGameTourSpotlight,
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
    const sidebarToggle = this.page.getByTestId("game-sidebar-toggle-button");
    const spotlight = getGameTourSpotlight(this.page);

    await expect(sidebarToggle).toBeVisible();
    await expect(spotlight).toBeVisible();

    const toggleBox = await sidebarToggle.boundingBox();
    const spotlightBox = await spotlight.boundingBox();

    if (toggleBox === null || spotlightBox === null) {
      throw new Error("Could not measure the sidebar toggle or the interactive tutorial spotlight window.");
    }
    expect(spotlightBox.x).toBeLessThanOrEqual(toggleBox.x);
    expect(spotlightBox.y).toBeLessThanOrEqual(toggleBox.y);
    expect(spotlightBox.x + spotlightBox.width).toBeGreaterThanOrEqual(toggleBox.x + toggleBox.width);
    expect(spotlightBox.y + spotlightBox.height).toBeGreaterThanOrEqual(toggleBox.y + toggleBox.height);
  },
);