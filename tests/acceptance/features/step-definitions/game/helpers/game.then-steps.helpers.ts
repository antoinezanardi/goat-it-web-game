import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import { getVisibleGameQuestionCard } from "#acceptance/features/support/helpers/game.helpers.ts";

async function expectQuestionCardFieldText(page: Page, testId: string, value: string): Promise<void> {
  const question = getVisibleGameQuestionCard(page);

  await expect(question.getByTestId(testId)).toHaveText(value);
}

function getThemePopoverRow(popover: Locator, label: string): Locator {
  return popover.locator("[data-testid='theme-popover-row']").filter({ hasText: label });
}

async function hoverBadgeAndExpectPopoverText(page: Page, badge: Locator, popoverTestId: string, text: string): Promise<void> {
  await expect(badge).toBeVisible();
  await badge.hover();

  await expect(page.getByTestId(popoverTestId)).toHaveText(text);
}

export {
  expectQuestionCardFieldText,
  getThemePopoverRow,
  hoverBadgeAndExpectPopoverText,
};