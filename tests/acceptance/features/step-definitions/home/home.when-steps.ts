import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(/^the user clicks on the version button$/u, async function(this: GoatItWorld): Promise<void> {
  const versionButton = this.page.locator("[data-testid='github-version-button']");
  const openedTabPromise = this.context.waitForEvent("page");

  await versionButton.click();

  this.openedTabPage = await openedTabPromise;
});

When(/^the user clicks the play button on the home page$/u, async function(this: GoatItWorld): Promise<void> {
  const playButton = this.page.getByTestId("home-play-button").getByRole("link");

  await expect(playButton).toBeVisible();
  await playButton.click();
});