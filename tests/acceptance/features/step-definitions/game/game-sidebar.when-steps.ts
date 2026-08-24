import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user opens the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.getByTestId("game-sidebar-toggle-button").click();
  },
);

When(
  /^the user clicks the back to home link in the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog");

    await dialog.getByRole("link", { name: "Back to Home" }).click();
  },
);

When(
  /^the user clicks the rules link in the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog");
    const openedTabPromise = this.context.waitForEvent("page");

    await dialog.getByRole("link", { name: "Rules", exact: true }).click();

    this.openedTabPage = await openedTabPromise;
  },
);