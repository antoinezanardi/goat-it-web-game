import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the game settings About tab should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-settings-about-tab")).toBeVisible();
    await expect(this.page.getByTestId("game-settings-general-tab")).toBeHidden();
  },
);

Then(
  /^the game settings selected locale should be "(?<locale>[^"]*)"$/u,
  async function(this: GoatItWorld, locale: string): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");

    await expect(modal.getByTestId("locale-select")).toContainText(locale);
  },
);

Then(
  /^the game settings adult content switch should be (?<state>on|off)$/u,
  async function(this: GoatItWorld, state: string): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");
    const switchControl = modal.getByTestId("game-settings-adult-content-switch").getByRole("switch");

    await expect(switchControl).toHaveAttribute("aria-checked", state === "on" ? "true" : "false");
  },
);

Then(
  /^the game settings adult content description should be "(?<description>[^"]*)"$/u,
  async function(this: GoatItWorld, description: string): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");

    await expect(modal.getByTestId("game-settings-adult-content-description")).toHaveText(description);
  },
);

Then(
  /^the game settings adult content icon should be active$/u,
  async function(this: GoatItWorld): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");

    await expect(modal.getByTestId("game-settings-adult-content-icon")).toHaveClass(/text-secondary/u);
  },
);