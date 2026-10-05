import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getVisibleGameQuestionCard } from "#acceptance/features/support/helpers/game.helpers.ts";
import { clickAndGetOpenedTab } from "#acceptance/features/support/helpers/tab.helpers.ts";
import { waitForQuestionCardTransition } from "#acceptance/features/step-definitions/game/helpers/game.when-steps.helpers.ts";

When(
  /^the user goes to the next question$/u,
  { timeout: 90_000 },
  async function(this: GoatItWorld): Promise<void> {
    const nextButton = this.page.getByTestId("game-next-question-button");
    await expect(nextButton).toBeVisible();
    await nextButton.click();
    await waitForQuestionCardTransition(this);
  },
);

When(
  /^the user goes to the previous question$/u,
  { timeout: 90_000 },
  async function(this: GoatItWorld): Promise<void> {
    const previousButton = this.page.getByTestId("game-previous-question-button");
    await expect(previousButton).toBeVisible();
    await previousButton.click();
    await waitForQuestionCardTransition(this);
  },
);

When(
  /^the user skips (?<count>\d+) questions$/u,
  { timeout: 300_000 },
  async function(this: GoatItWorld, count: string): Promise<void> {
    const clicks = Math.trunc(Number(count));

    for (let index = 0; index < clicks; index++) {
      const nextButton = this.page.getByTestId("game-next-question-button");

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
      await waitForQuestionCardTransition(this);
    }
  },
);

When(
  /^the user clicks the back to home button$/u,
  async function(this: GoatItWorld): Promise<void> {
    const backToHomeLink = this.page.getByRole("link", { name: "Back to Home" });
    await expect(backToHomeLink).toBeVisible();
    await backToHomeLink.click();
  },
);

When(
  /^the user expands the question context accordion$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const trigger = question.getByTestId("game-question-context-accordion-trigger");
    await expect(trigger).toBeVisible();
    await trigger.click();
  },
);

When(
  /^the user clicks on the question source link "(?<domain>[^"]*)"$/u,
  async function(this: GoatItWorld, domain: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const sourceNav = question.getByTestId("game-question-source-links");
    const link = sourceNav.getByText(domain, { exact: true });
    await expect(link).toBeVisible();

    this.openedTabPage = await clickAndGetOpenedTab(this.context, link);
  },
);

When(
  /^the user clicks on the theme icon stack$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    const themeStackTrigger = question.getByTestId("theme-stack-trigger");
    await expect(themeStackTrigger).toBeVisible();
    await themeStackTrigger.click();
  },
);

When(
  /^the user clicks on the "\+(?<count>\d+) other themes?" text$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const labelRegex = new RegExp(`\\+${count} other themes?`, "iu");

    const otherThemesText = question.getByText(labelRegex);
    await expect(otherThemesText).toBeVisible();
    await otherThemesText.click();
  },
);

When(
  /^the user closes the themes popover$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
  },
);