import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

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

When(
  /^the user selects the "(?<locale>[^"]+)" locale option in the game sidebar$/u,
  async function(this: GoatItWorld, locale: string): Promise<void> {
    const dialog = this.page.getByRole("dialog");
    const localeSelect = dialog.getByTestId("locale-select");

    await expect(localeSelect).toBeVisible();
    await localeSelect.click();

    const option = this.page.getByRole("option", { name: locale });
    await expect(option).toBeVisible();
    await option.click();
  },
);