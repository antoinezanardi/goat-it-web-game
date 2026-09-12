import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getVisibleGameQuestionCard } from "#acceptance/features/support/helpers/game.helpers.ts";
import { waitForQuestionCardTransition } from "#acceptance/features/step-definitions/game/helpers/game.when-steps.helpers.ts";

When(
  /^the user goes to the next question$/u,
  { timeout: 90_000 },
  async function(this: GoatItWorld): Promise<void> {
    await this.page.getByTestId("game-next-question-button").click();
    await waitForQuestionCardTransition(this);
  },
);

When(
  /^the user goes to the previous question$/u,
  { timeout: 90_000 },
  async function(this: GoatItWorld): Promise<void> {
    await this.page.getByTestId("game-previous-question-button").click();
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
    await this.page.getByRole("link", { name: "Back to Home" }).click();
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

    const [openedTabPage] = await Promise.all([
      this.context.waitForEvent("page"),
      link.click(),
    ]);
    this.openedTabPage = openedTabPage;
  },
);

When(
  /^the user clicks on the theme icon stack$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    await question.getByTestId("theme-stack-trigger").click();
  },
);

When(
  /^the user clicks on the "\+(?<count>\d+) other themes?" text$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const labelRegex = new RegExp(`\\+${count} other themes?`, "iu");

    await question.getByText(labelRegex).click();
  },
);

When(
  /^the user closes the themes popover$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
  },
);