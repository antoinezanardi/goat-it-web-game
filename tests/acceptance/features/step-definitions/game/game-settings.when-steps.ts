import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickModalFooterButton, getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

When(
  /^the user clicks the settings button in the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
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

When(
  /^the user turns on the game settings adult content switch$/u,
  async function(this: GoatItWorld): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");
    const switchControl = modal.getByTestId("game-settings-adult-content-switch").getByRole("switch");

    await expect(switchControl).toBeVisible();
    await switchControl.click();
  },
);

When(
  /^the user opens the cognitive difficulty filter in the game settings$/u,
  async function(this: GoatItWorld): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");
    const filterTrigger = modal.getByTestId("game-settings-filter-multi-select-input");

    await expect(filterTrigger).toBeVisible();
    await filterTrigger.click();
  },
);

When(
  /^the user toggles the "(?<difficulty>[^"]+)" cognitive difficulty option$/u,
  async function(this: GoatItWorld, difficulty: string): Promise<void> {
    const option = this.page.getByRole("option", { name: difficulty });

    await expect(option).toBeVisible();
    await option.click();
  },
);

When(
  /^the user closes the cognitive difficulty filter$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
  },
);

When(
  /^the user confirms restoring all options in the confirmation dialog$/u,
  async function(this: GoatItWorld): Promise<void> {
    const confirmFooter = this.page.getByTestId("confirm-dialog-footer");

    await clickModalFooterButton(confirmFooter, "primary");
  },
);

When(
  /^the user keeps the last selected option in the confirmation dialog$/u,
  async function(this: GoatItWorld): Promise<void> {
    const confirmFooter = this.page.getByTestId("confirm-dialog-footer");

    await clickModalFooterButton(confirmFooter, "close");
  },
);