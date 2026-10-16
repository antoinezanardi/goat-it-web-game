import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";
import { clickAndGetOpenedTab } from "#acceptance/features/support/helpers/tab.helpers.ts";
import { getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

When(
  /^the user opens the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const toggleButton = this.page.getByTestId("game-sidebar-toggle-button");
    await clickVisibleLocator(toggleButton);
  },
);

When(
  /^the user clicks the back to home link in the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const backToHomeLink = dialog.getByRole("link", { name: "Back to Home" });

    await clickVisibleLocator(backToHomeLink);
  },
);

When(
  /^the user clicks the rules link in the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const rulesLink = dialog.getByRole("link", { name: "Rules", exact: true });

    this.openedTabPage = await clickAndGetOpenedTab(this.context, rulesLink);
  },
);

When(
  /^the user closes the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.keyboard.press("Escape");
  },
);