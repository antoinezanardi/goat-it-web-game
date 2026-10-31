import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getActiveGameQuestionCard } from "#acceptance/features/support/helpers/game.helpers.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";
import { clickAndGetOpenedTab } from "#acceptance/features/support/helpers/tab.helpers.ts";
import {
  skipQuestions,
  waitForQuestionCardTransition,
} from "#acceptance/features/step-definitions/game/helpers/game.when-steps.helpers.ts";

When(
  /^the user goes to the next question$/u,
  { timeout: 90_000 },
  async function(this: GoatItWorld): Promise<void> {
    const nextButton = this.page.getByTestId("game-next-question-button");
    await clickVisibleLocator(nextButton);
    await waitForQuestionCardTransition(this);
  },
);

When(
  /^the user goes to the previous question$/u,
  { timeout: 90_000 },
  async function(this: GoatItWorld): Promise<void> {
    const previousButton = this.page.getByTestId("game-previous-question-button");
    await clickVisibleLocator(previousButton);
    await waitForQuestionCardTransition(this);
  },
);

When(
  /^the user skips (?<count>\d+) questions$/u,
  { timeout: 300_000 },
  async function(this: GoatItWorld, count: string): Promise<void> {
    await skipQuestions(this, Math.trunc(Number(count)));
  },
);

When(
  /^the user clicks the back to home button$/u,
  async function(this: GoatItWorld): Promise<void> {
    const backToHomeLink = this.page.getByRole("link", { name: "Back to Home" });
    await clickVisibleLocator(backToHomeLink);
  },
);

When(
  /^the user expands the question context accordion$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getActiveGameQuestionCard(this.page);
    const trigger = question.getByTestId("game-question-context-accordion-trigger");
    await clickVisibleLocator(trigger);
  },
);

When(
  /^the user clicks on the question source link "(?<domain>[^"]*)"$/u,
  async function(this: GoatItWorld, domain: string): Promise<void> {
    const question = getActiveGameQuestionCard(this.page);
    const sourceNav = question.getByTestId("game-question-source-links");
    const link = sourceNav.getByText(domain, { exact: true });
    this.openedTabPage = await clickAndGetOpenedTab(this.context, link);
  },
);

When(
  /^the user clicks on the theme icon stack$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getActiveGameQuestionCard(this.page);

    const themeStackTrigger = question.getByTestId("theme-stack-trigger");
    await clickVisibleLocator(themeStackTrigger);
  },
);

When(
  /^the user clicks on the "\+(?<count>\d+) other themes?" text$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    const question = getActiveGameQuestionCard(this.page);
    const labelRegex = new RegExp(`\\+${count} other themes?`, "iu");

    const otherThemesText = question.getByText(labelRegex);
    await clickVisibleLocator(otherThemesText);
  },
);

When(
  /^the user closes the themes popover$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
  },
);