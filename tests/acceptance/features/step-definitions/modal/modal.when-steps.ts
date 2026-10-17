import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";
import { clickModalFooterButton, getVisibleConfirmDialogFooter, getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

When(
  /^the user clicks on the close button in the modal header$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);

    const closeButton = dialog.locator("[data-slot='close']");

    await clickVisibleLocator(closeButton);
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
    const confirmFooter = await getVisibleConfirmDialogFooter(this.page);

    await clickModalFooterButton(confirmFooter, "primary");
  },
);

When(
  /^the user returns from the discard confirmation by (?<action>going back|pressing escape)$/u,
  async function(this: GoatItWorld, action: "going back" | "pressing escape"): Promise<void> {
    const confirmFooter = await getVisibleConfirmDialogFooter(this.page);

    if (action === "going back") {
      await clickModalFooterButton(confirmFooter, "close");

      return;
    }
    await this.page.keyboard.press("Escape");
  },
);