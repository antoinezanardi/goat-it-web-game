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

export {
  getGameTourBackdrop,
  getGameTourButton,
  getGameTourTitle,
  getGameTourTooltip,
  getVisibleGameQuestionCard,
};