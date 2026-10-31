import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getGameTourButton } from "#acceptance/features/support/helpers/game.helpers.ts";
import { expectShortcutHintOnHover } from "#acceptance/features/step-definitions/game/helpers/game-keyboard.then-steps.helpers.ts";
import { ARROW_LEFT_KEY_HINT, ESCAPE_KEY_HINT } from "#acceptance/features/step-definitions/game/game-keyboard.steps.constants.ts";

Then(
  /^hovering the previous question button should show the arrow left key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectShortcutHintOnHover(this.page, this.page.getByTestId("game-previous-question-button"), ARROW_LEFT_KEY_HINT);
  },
);

Then(
  /^hovering the tutorial back control should show the arrow left key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expectShortcutHintOnHover(this.page, getGameTourButton(this.page, "Back"), ARROW_LEFT_KEY_HINT);
  },
);

Then(
  /^the tutorial skip control should show the escape key hint$/u,
  async function(this: GoatItWorld): Promise<void> {
    const skipControl = getGameTourButton(this.page, "Skip");

    await expect(skipControl).toHaveAttribute("aria-keyshortcuts", "Escape");
    await expect(skipControl.locator("kbd")).toHaveText(ESCAPE_KEY_HINT);
    await expect(skipControl.locator("kbd")).toBeVisible();
  },
);