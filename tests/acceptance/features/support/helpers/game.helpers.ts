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

export {
  getGameTourBackdrop,
  getGameTourButton,
  getGameTourTitle,
  getGameTourTooltip,
  getGameTutorialInvitationAction,
  getGameTutorialInvitationToast,
  getVisibleGameQuestionCard,
};