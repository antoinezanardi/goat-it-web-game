import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import { getVisibleGameQuestionCard } from "#acceptance/features/support/helpers/game.helpers.ts";
import { getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

async function expectDefaultModalElementText(page: Page, testId: string, text: string): Promise<void> {
  const dialog = await getVisibleDefaultModal(page);

  await expect(dialog.getByTestId(testId)).toHaveText(text);
}

async function expectQuestionCardFieldText(page: Page, testId: string, value: string): Promise<void> {
  const question = getVisibleGameQuestionCard(page);

  await expect(question.getByTestId(testId)).toHaveText(value);
}

async function expectQuestionCardElementVisibility(page: Page, testId: string, isVisible: boolean): Promise<void> {
  const question = getVisibleGameQuestionCard(page);

  if (isVisible) {
    await expect(question.getByTestId(testId)).toBeVisible();

    return;
  }
  await expect(question.getByTestId(testId)).toBeHidden();
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
  expectDefaultModalElementText,
  expectQuestionCardElementVisibility,
  expectQuestionCardFieldText,
  getThemePopoverRow,
  hoverBadgeAndExpectPopoverText,
};