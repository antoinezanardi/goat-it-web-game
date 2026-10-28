import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { waitForQuestionCardTransition } from "#acceptance/features/step-definitions/game/helpers/game.when-steps.helpers.ts";

When(
  /^the user presses the left arrow key$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("ArrowLeft");
    await waitForQuestionCardTransition(this);
  },
);

When(
  /^the user presses the right arrow key$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("ArrowRight");
    await waitForQuestionCardTransition(this);
  },
);

When(
  /^the user presses the Escape key$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
  },
);

When(
  /^the user presses the Tab key (?<times>\d+) times$/u,
  async function(this: GoatItWorld, times: string): Promise<void> {
    for (let index = 0; index < Number(times); index++) {
      await this.page.keyboard.press("Tab");
    }
  },
);