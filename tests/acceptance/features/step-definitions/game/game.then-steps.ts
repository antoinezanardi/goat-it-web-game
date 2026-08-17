import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getVisibleGameQuestionCard } from "#acceptance/features/support/helpers/game.helpers.ts";

Then(
  /^a game question should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    await expect(question).toHaveCount(1);
    await expect(question).toBeVisible();
  },
);

Then(
  /^the next question button should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-next-question-button")).toBeVisible();
  },
);

Then(
  /^the next question button should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-next-question-button")).toBeHidden();
  },
);

Then(
  /^the previous question button should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-previous-question-button")).toBeVisible();
  },
);

Then(
  /^the previous question button should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-previous-question-button")).toBeHidden();
  },
);

Then(
  /^the no more questions message should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-no-more-questions")).toBeVisible();
  },
);

Then(
  /^the question card should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    await expect(question).toHaveCount(1);
    await expect(question).toBeVisible();
  },
);

Then(
  /^the question theme should be "(?<theme>[^"]*)"$/u,
  async function(this: GoatItWorld, theme: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    await expect(question.getByTestId("game-question-theme")).toHaveText(theme);
  },
);

Then(
  /^the question category should be "(?<category>[^"]*)"$/u,
  async function(this: GoatItWorld, category: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    await expect(question.getByTestId("game-question-category")).toHaveText(category);
  },
);

Then(
  /^the question difficulty should be "(?<difficulty>[^"]*)"$/u,
  async function(this: GoatItWorld, difficulty: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const difficultyBadge = question.getByTestId("game-question-difficulty");

    await expect(difficultyBadge).toBeVisible();
    await difficultyBadge.hover();

    const gameQuestionDifficultyTooltip: Readonly<Record<string, string>> = {
      easy: "This question is easy to deduce",
      medium: "This question is moderately difficult to deduce",
      hard: "This question is hard to deduce",
    };
    const tooltipText = gameQuestionDifficultyTooltip[difficulty.toLowerCase()] ?? difficulty;
    await expect(this.page.locator("[role=\"tooltip\"]")).toHaveText(tooltipText);
  },
);

Then(
  /^the question statement should be "(?<statement>[^"]*)"$/u,
  async function(this: GoatItWorld, statement: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    await expect(question.getByTestId("game-question-statement")).toHaveText(statement);
  },
);

Then(
  /^the question answer should be "(?<answer>[^"]*)"$/u,
  async function(this: GoatItWorld, answer: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    await expect(question.getByTestId("game-question-answer")).toHaveText(answer);
  },
);

Then(
  /^the question source link "(?<domain>[^"]*)" should be visible$/u,
  async function(this: GoatItWorld, domain: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const sourceNav = question.getByTestId("game-question-source-links");

    await expect(sourceNav.getByText(domain, { exact: true })).toBeVisible();
  },
);

Then(
  /^the question context should be "(?<context>[^"]*)"$/u,
  async function(this: GoatItWorld, context: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    await expect(question.getByTestId("game-question-context")).toHaveText(context);
  },
);

Then(
  /^the question trivia item "(?<text>[^"]*)" should be visible$/u,
  async function(this: GoatItWorld, text: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const triviaList = question.getByTestId("game-question-trivia");

    await expect(triviaList.getByText(text, { exact: true })).toBeVisible();
  },
);

Then(
  /^the theme icon stack should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);

    await expect(question.getByTestId("theme-stack-trigger")).toBeVisible();
  },
);

Then(
  /^the "and (?<count>\d+) other themes?" text should be visible$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    const question = getVisibleGameQuestionCard(this.page);
    const labelRegex = new RegExp(`and ${count} other themes?`, "iu");

    await expect(question.getByText(labelRegex)).toBeVisible();
  },
);

Then(
  /^the themes popover should contain "(?<label>[^"]*)"$/u,
  async function(this: GoatItWorld, label: string): Promise<void> {
    const popover = this.page.getByTestId("theme-popover-content");

    await expect(popover.getByText(label, { exact: true })).toBeVisible();
  },
);

Then(
  /^the primary theme "(?<label>[^"]*)" should be flagged in the themes popover$/u,
  async function(this: GoatItWorld, label: string): Promise<void> {
    const popover = this.page.getByTestId("theme-popover-content");
    const row = popover.locator("[data-testid='theme-popover-row']").filter({ hasText: label });

    await expect(row.getByTestId("theme-primary-badge")).toBeVisible();
  },
);

Then(
  /^the themes popover should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("theme-popover-content")).toBeVisible();
  },
);