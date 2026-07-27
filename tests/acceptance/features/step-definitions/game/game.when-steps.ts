import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user goes to the next question$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.getByTestId("game-next-button").click();
  },
);

When(
  /^the user skips (?<count>\d+) questions$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    const clicks = Math.trunc(Number(count));

    for (let index = 0; index < clicks; index++) {
      // Acceptable as each click must be sequential to let the page render the next question
      // oxlint-disable-next-line eslint/no-await-in-loop
      await this.page.getByTestId("game-next-button").click();
    }
  },
);