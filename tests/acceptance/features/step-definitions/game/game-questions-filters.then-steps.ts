import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

Then(
  /^the questions filters adult content switch should be (?<state>on|off)$/u,
  async function(this: GoatItWorld, state: string): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const switchControl = dialog.getByTestId("game-settings-adult-content-switch").getByRole("switch");

    await expect(switchControl).toHaveAttribute("aria-checked", state === "on" ? "true" : "false");
  },
);

Then(
  /^the questions filters adult content description should be "(?<description>[^"]*)"$/u,
  async function(this: GoatItWorld, description: string): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    await expect(dialog.getByTestId("game-settings-adult-content-description")).toHaveText(description);
  },
);

Then(
  /^the questions filters adult content icon should be active$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    await expect(dialog.getByTestId("game-settings-adult-content-icon")).toHaveClass(/text-primary/u);
  },
);

Then(
  /^the questions filters difficulty filter summary should be "(?<summary>[^"]*)"$/u,
  async function(this: GoatItWorld, summary: string): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    await expect(dialog.getByTestId("game-settings-filter-multi-select-summary")).toHaveText(summary);
  },
);

Then(
  /^the questions filters apply button should be (?<state>disabled|enabled)$/u,
  async function(this: GoatItWorld, state: string): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const applyButton = dialog.getByTestId("default-modal-footer-primary-button");

    if (state === "disabled") {
      await expect(applyButton).toBeDisabled();

      return;
    }
    await expect(applyButton).toBeEnabled();
  },
);

Then(
  /^the question filters trigger count badge should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId("game-questions-filters-button-badge")).toBeHidden();
  },
);

Then(
  /^the question filters applied count on the trigger should be (?<count>\d+)$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    await expect(this.page.getByTestId("game-questions-filters-button-badge")).toHaveText(count);
  },
);

Then(
  /^the question filters applied count in the modal header should be (?<count>\d+)$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    await expect(dialog.getByTestId("game-questions-filters-modal-count-badge")).toHaveText(count);
  },
);

Then(
  /^the question filters applied count in the sidebar should be (?<count>\d+)$/u,
  async function(this: GoatItWorld, count: string): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    await expect(dialog.getByTestId("game-sidebar-filters-count-badge")).toHaveText(count);
  },
);