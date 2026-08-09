import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user goes to the next question$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.getByTestId("game-next-question-button").click();
  },
);

When(
  /^the user goes to the previous question$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.getByTestId("game-previous-question-button").click();
  },
);

When(
  /^the user skips (?<count>\d+) questions$/u,
  { timeout: 25_000 },
  async function(this: GoatItWorld, count: string): Promise<void> {
    const clicks = Math.trunc(Number(count));

    for (let index = 0; index < clicks; index++) {
      // Acceptable as each click must be sequential to let the page render the next question
      // oxlint-disable-next-line eslint/no-await-in-loop
      await this.page.getByTestId("game-next-question-button").click();
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
    const trigger = this.page.getByTestId("game-question-context-accordion-trigger");
    await expect(trigger).toBeVisible();
    await trigger.click();
  },
);

When(
  /^the user clicks on the question source link "(?<domain>[^"]*)"$/u,
  async function(this: GoatItWorld, domain: string): Promise<void> {
    const sourceNav = this.page.getByTestId("game-question-source-links");
    const link = sourceNav.getByText(domain, { exact: true });
    await expect(link).toBeVisible();

    const [openedTabPage] = await Promise.all([
      this.context.waitForEvent("page"),
      link.click(),
    ]);
    this.openedTabPage = openedTabPage;
  },
);