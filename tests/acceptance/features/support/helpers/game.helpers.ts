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

function getGameTourBody(page: Page): Locator {
  return page.getByTestId("game-tutorial-description");
}

function getGameTourButton(page: Page, name: string): Locator {
  return getGameTourTooltip(page).getByRole("button", { name, exact: true });
}

export {
  getGameTourBackdrop,
  getGameTourBody,
  getGameTourButton,
  getGameTourTitle,
  getGameTourTooltip,
  getVisibleGameQuestionCard,
};