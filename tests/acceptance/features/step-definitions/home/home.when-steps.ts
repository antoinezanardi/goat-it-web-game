import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickAndGetOpenedTab } from "#acceptance/features/step-definitions/element/helpers/element.when-steps.helpers.ts";

When(/^the user clicks on the version button$/u, async function(this: GoatItWorld): Promise<void> {
  const versionButton = this.page.locator("[data-testid='github-version-button']");

  await expect(versionButton).toBeVisible();

  this.openedTabPage = await clickAndGetOpenedTab(this.context, versionButton);
});

When(/^the user clicks the play button on the home page$/u, async function(this: GoatItWorld): Promise<void> {
  const playButton = this.page.getByTestId("home-play-button").getByRole("link");

  await expect(playButton).toBeVisible();
  await playButton.click();
});