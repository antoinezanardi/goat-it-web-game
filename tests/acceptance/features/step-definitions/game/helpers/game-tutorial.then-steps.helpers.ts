import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import { getGameTourSpotlight } from "#acceptance/features/support/helpers/game.helpers.ts";

async function expectTutorialSpotlightCovers(page: Page, target: Locator): Promise<void> {
  const spotlight = getGameTourSpotlight(page);

  await expect(target).toBeVisible();
  await expect(spotlight).toBeVisible();

  const targetBox = await target.boundingBox();
  const spotlightBox = await spotlight.boundingBox();

  if (targetBox === null || spotlightBox === null) {
    throw new Error("Could not measure the tutorial target or the interactive tutorial spotlight window.");
  }
  expect(spotlightBox.x).toBeLessThanOrEqual(targetBox.x);
  expect(spotlightBox.y).toBeLessThanOrEqual(targetBox.y);
  expect(spotlightBox.x + spotlightBox.width).toBeGreaterThanOrEqual(targetBox.x + targetBox.width);
  expect(spotlightBox.y + spotlightBox.height).toBeGreaterThanOrEqual(targetBox.y + targetBox.height);
}

export { expectTutorialSpotlightCovers };