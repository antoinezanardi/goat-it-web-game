import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  getGameTutorialInvitationAction,
  getGameTutorialInvitationToast,
} from "#acceptance/features/support/helpers/game.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the tutorial invitation should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTutorialInvitationToast(this.page)).toBeVisible();
  },
);

Then(
  /^the tutorial invitation should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTutorialInvitationToast(this.page)).toBeHidden();
  },
);

Then(
  /^the tutorial invitation should offer the "(?<primary>[^"]*)" and "(?<secondary>[^"]*)" actions$/u,
  async function(this: GoatItWorld, primary: string, secondary: string): Promise<void> {
    const primaryAction = getGameTutorialInvitationAction(this.page, primary);
    const secondaryAction = getGameTutorialInvitationAction(this.page, secondary);

    await expect(primaryAction).toBeVisible();
    await expect(primaryAction).toBeEnabled();
    await expect(secondaryAction).toBeVisible();
  },
);

Then(
  /^the tutorial decision should be remembered$/u,
  async function(this: GoatItWorld): Promise<void> {
    const cookies = await this.context.cookies();
    const decisionCookie = cookies.find(cookie => cookie.name === "game_tutorial_invitation_decided");

    expect(decisionCookie?.value).toBe("true");
  },
);