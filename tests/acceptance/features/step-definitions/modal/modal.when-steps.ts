import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickModalFooterButton, getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

When(
  /^the user clicks on the close button in the modal header$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    const closeButton = dialog.getByRole("button", { name: "Close" }).first();

    await expect(closeButton).toBeVisible();
    await closeButton.click();
  },
);

When(
  /^the user clicks on the close button in the modal footer$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    await clickModalFooterButton(dialog, "close");
  },
);

When(
  /^the user clicks on the overlay outside of the modal$/u,
  async function(this: GoatItWorld): Promise<void> {
    await getVisibleDefaultModal(this.page);

    await this.page.locator("body").click({ position: { x: 10, y: 10 } });
  },
);

When(
  /^the user clicks on the primary button in the modal$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    await clickModalFooterButton(dialog, "primary");
  },
);

When(
  /^the user confirms closing without applying$/u,
  async function(this: GoatItWorld): Promise<void> {
    const confirmFooter = this.page.getByTestId("confirm-dialog-footer");

    await clickModalFooterButton(confirmFooter, "primary");
  },
);

When(
  /^the user returns from the discard confirmation by (?<action>going back|pressing escape)$/u,
  async function(this: GoatItWorld, action: string): Promise<void> {
    if (action === "going back") {
      const confirmFooter = this.page.getByTestId("confirm-dialog-footer");

      await clickModalFooterButton(confirmFooter, "close");

      return;
    }
    await this.page.keyboard.press("Escape");
  },
);