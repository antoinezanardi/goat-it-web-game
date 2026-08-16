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

    await expect(question.getByTestId("game-question-difficulty")).toHaveText(difficulty);
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