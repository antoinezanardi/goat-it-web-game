import { When } from "@cucumber/cucumber";

import { getGameTutorialInvitationAction } from "#acceptance/features/support/helpers/game.helpers.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user clicks the "(?<action>[^"]*)" action in the tutorial invitation$/u,
  async function(this: GoatItWorld, action: string): Promise<void> {
    const actionButton = getGameTutorialInvitationAction(this.page, action);

    await clickVisibleLocator(actionButton);
  },
);