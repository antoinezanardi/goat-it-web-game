import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

function getVisibleGameQuestionCard(page: Page): Locator {
  return page.getByTestId("game-question");
}

function getGameTourTooltip(page: Page): Locator {
  return page.getByTestId("game-tutorial");
}

function getGameTourBackdrop(page: Page): Locator {
  return page.getByTestId("game-tutorial-backdrop");
}

function getGameTourSpotlight(page: Page): Locator {
  return page.getByTestId("game-tutorial-spotlight");
}

function getGameTourTitle(page: Page): Locator {
  return page.getByTestId("game-tutorial-title");
}

function getGameTourButton(page: Page, name: string): Locator {
  return getGameTourTooltip(page).getByTestId(`game-tutorial-${name.toLowerCase()}`);
}

function getNotificationToastRegion(page: Page): Locator {
  return page.getByRole("region", { name: "Notifications", includeHidden: true });
}

function getGameTutorialInvitationToast(page: Page): Locator {
  return getNotificationToastRegion(page)
    .locator("[data-slot='base']")
    .filter({ hasText: "Would you like to launch the interactive tutorial?" });
}

function getGameTutorialInvitationAction(page: Page, name: string): Locator {
  return getGameTutorialInvitationToast(page).getByRole("button", { name });
}

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

export {
  expectTutorialSpotlightCovers,
  getGameTourBackdrop,
  getGameTourButton,
  getGameTourSpotlight,
  getGameTourTitle,
  getGameTourTooltip,
  getGameTutorialInvitationAction,
  getGameTutorialInvitationToast,
  getVisibleGameQuestionCard,
};