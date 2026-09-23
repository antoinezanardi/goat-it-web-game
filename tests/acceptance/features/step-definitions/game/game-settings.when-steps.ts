import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user clicks the settings button in the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog").first();
    const settingsButton = dialog.getByTestId("game-sidebar-settings-button");

    await expect(settingsButton).toBeVisible();
    await settingsButton.click();
  },
);

When(
  /^the user selects the "(?<locale>[^"]+)" locale option in the game settings$/u,
  async function(this: GoatItWorld, locale: string): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");
    const localeSelect = modal.getByTestId("locale-select");

    await expect(localeSelect).toBeVisible();
    await localeSelect.click();

    const option = this.page.getByRole("option", { name: locale });
    await expect(option).toBeVisible();
    await option.click();
  },
);