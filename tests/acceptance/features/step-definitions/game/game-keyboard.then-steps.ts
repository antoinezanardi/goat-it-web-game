import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getGameTourButton } from "#acceptance/features/support/helpers/game.helpers.ts";
import { expectShortcutHintOnHover } from "#acceptance/features/step-definitions/game/helpers/game-keyboard.then-steps.helpers.ts";
import { ARROW_LEFT_KEY_HINT, ARROW_RIGHT_KEY_HINT } from "#acceptance/features/step-definitions/game/game-keyboard.steps.constants.ts";

Then(
  /^hovering the previous question button should show the arrow left key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectShortcutHintOnHover(this.page, this.page.getByTestId("game-previous-question-button"), ARROW_LEFT_KEY_HINT);
  },
);

Then(
  /^hovering the next question button should show the arrow right key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectShortcutHintOnHover(this.page, this.page.getByTestId("game-next-question-button"), ARROW_RIGHT_KEY_HINT);
  },
);

Then(
  /^hovering the tutorial back control should show the arrow left key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectShortcutHintOnHover(this.page, getGameTourButton(this.page, "Back"), ARROW_LEFT_KEY_HINT);
  },
);

Then(
  /^hovering the tutorial next control should show the arrow right key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectShortcutHintOnHover(this.page, getGameTourButton(this.page, "Next"), ARROW_RIGHT_KEY_HINT);
  },
);

Then(
  /^hovering the tutorial finish control should show the arrow right key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectShortcutHintOnHover(this.page, getGameTourButton(this.page, "Finish"), ARROW_RIGHT_KEY_HINT);
  },
);

Then(
  /^the tutorial skip control should expose no shortcut hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTourButton(this.page, "Skip")).not.toHaveAttribute("aria-keyshortcuts");
  },
);