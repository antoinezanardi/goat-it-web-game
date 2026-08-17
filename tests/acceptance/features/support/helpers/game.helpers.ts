import type { Locator, Page } from "@playwright/test";

function getVisibleGameQuestionCard(page: Page): Locator {
  return page.getByTestId("card-transition-entering").getByTestId("game-question");
}

export {
  getVisibleGameQuestionCard,
};