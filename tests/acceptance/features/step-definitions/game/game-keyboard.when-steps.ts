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