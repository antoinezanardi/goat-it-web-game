import type { Locator, Page } from "@playwright/test";

function getVisibleGameQuestionCard(page: Page): Locator {
  return page.getByTestId("game-question").filter({ visible: true });
}

export {
  getVisibleGameQuestionCard,
};