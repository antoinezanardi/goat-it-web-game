import { expect } from "@playwright/test";
import type { Page } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

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

async function toggleOptionByName(page: Page, name: string): Promise<void> {
  const option = page.getByRole("option", { name });

  await expect(option).toBeVisible();
  await option.click();
}

async function skipQuestions(world: GoatItWorld, count: number): Promise<void> {
  for (let index = 0; index < count; index++) {
    const nextButton = world.page.getByTestId("game-next-question-button");

    if (index === 0) {
      // Acceptable as the game loads its questions asynchronously after navigation
      // oxlint-disable-next-line eslint/no-await-in-loop
      await expect(nextButton).toBeVisible({ timeout: 10_000 });
    } else if (await nextButton.count() === 0 || !await nextButton.isVisible()) {
      return;
    }

    // Acceptable as each visibility assertion must be sequential to let the page render the next question
    // oxlint-disable-next-line eslint/no-await-in-loop
    await expect(nextButton).toBeVisible();
    // Acceptable as each click must be sequential to let the page render the next question
    // oxlint-disable-next-line eslint/no-await-in-loop
    await nextButton.click();
    // Acceptable as each transition must settle before the next click to avoid swallowed navigations
    // oxlint-disable-next-line eslint/no-await-in-loop
    await waitForQuestionCardTransition(world);
  }
}

export {
  skipQuestions,
  toggleOptionByName,
  waitForQuestionCardTransition,
};