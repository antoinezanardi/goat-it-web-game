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

When(
  /^the user opens the question filters from the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const filtersLink = dialog.getByTestId("game-sidebar-filters-link");

    await expect(filtersLink).toBeVisible();
    await filtersLink.click();
  },
);

When(
  /^the user clicks the reset button in the question filters modal$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const resetButton = dialog.getByTestId("game-questions-filters-modal-reset-button");

    await expect(resetButton).toBeVisible();
    await resetButton.click();
  },
);

When(
  /^the user opens the questions filters theme filter$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const filterTrigger = dialog.getByTestId("game-questions-filters-theme-filter-input");

    await expect(filterTrigger).toBeVisible();
    await filterTrigger.click();
  },
);

When(
  /^the user opens the questions filters category filter$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const filterTrigger = dialog.getByTestId("game-questions-filters-category-filter-input");

    await expect(filterTrigger).toBeVisible();
    await filterTrigger.click();
  },
);

When(
  /^the user toggles the "(?<theme>[^"]+)" theme option$/u,
  async function(this: GoatItWorld, theme: string): Promise<void> {
    const option = this.page.getByRole("option", { name: theme });

    await expect(option).toBeVisible();
    await option.click();
  },
);

When(
  /^the user toggles the "(?<category>[^"]+)" category option$/u,
  async function(this: GoatItWorld, category: string): Promise<void> {
    const option = this.page.getByRole("option", { name: category });

    await expect(option).toBeVisible();
    await option.click();
  },
);

When(
  /^the user closes the theme filter$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
    await expect(this.page.getByRole("listbox")).toBeHidden();
  },
);

When(
  /^the user closes the category filter$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
    await expect(this.page.getByRole("listbox")).toBeHidden();
  },
);