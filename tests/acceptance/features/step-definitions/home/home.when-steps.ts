import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(/^the user clicks on the version button$/u, async function(this: GoatItWorld): Promise<void> {
  const versionButton = this.page.locator("[data-testid='github-version-button']");
  const openedTabPromise = this.context.waitForEvent("page");

  await versionButton.click();

  this.openedTabPage = await openedTabPromise;
});