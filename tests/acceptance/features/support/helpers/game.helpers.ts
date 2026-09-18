import type { Locator, Page } from "@playwright/test";

function getVisibleGameQuestionCard(page: Page): Locator {
  return page.getByTestId("game-question");
}

function getGameTourTooltip(page: Page): Locator {
  return page.locator("#nt-tooltip");
}

function getGameTourBackdrop(page: Page): Locator {
  return page.locator("#nt-backdrop");
}

function getGameTourTitle(page: Page): Locator {
  return page.locator("#nt-tooltip-title");
}

function getGameTourBody(page: Page): Locator {
  return page.locator("#nt-tooltip-body");
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