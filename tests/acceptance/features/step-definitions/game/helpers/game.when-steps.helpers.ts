import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function getVisibleGameDialog(page: Page): Promise<Locator> {
  const dialog = page.getByRole("dialog").first();

  await expect(dialog).toBeVisible();

  return dialog;
}

async function readNextQuestionButtonState(page: Page): Promise<"disabled" | "settled"> {
  return page.evaluate(() => {
    const button = document.querySelector("[data-testid=\"game-next-question-button\"]");

    if (!(button instanceof HTMLElement) || button.offsetParent === null || !("disabled" in button)) {
      return "settled";
    }
    return button.disabled === true ? "disabled" : "settled";
  });
}

async function waitForQuestionCardTransition(world: GoatItWorld): Promise<void> {
  const nextButton = world.page.getByTestId("game-next-question-button");

  if (await nextButton.count() === 0 || !await nextButton.isVisible()) {
    return;
  }

  await expect.poll(async() => readNextQuestionButtonState(world.page), { timeout: 60_000 }).not.toBe("disabled");
}

export {
  getVisibleGameDialog,
  waitForQuestionCardTransition,
};