import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickModalFooterButton, getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

When(
  /^the user opens the question filters$/u,
  async function(this: GoatItWorld): Promise<void> {
    const filtersButton = this.page.getByTestId("game-questions-filters-button");

    await expect(filtersButton).toBeVisible();
    await filtersButton.click();
  },
);

When(
  /^the user turns on the questions filters adult content switch$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const switchControl = dialog.getByTestId("game-settings-adult-content-switch").getByRole("switch");

    await expect(switchControl).toBeVisible();
    await switchControl.click();
  },
);

When(
  /^the user turns off the questions filters adult content switch$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const switchControl = dialog.getByTestId("game-settings-adult-content-switch").getByRole("switch");

    await expect(switchControl).toBeVisible();
    await switchControl.click();
  },
);

When(
  /^the user opens the questions filters difficulty filter$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const filterTrigger = dialog.getByTestId("game-settings-filter-multi-select-input");

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