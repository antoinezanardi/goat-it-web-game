import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the game sidebar should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByRole("dialog")).toBeVisible();
  },
);

Then(
  /^the game sidebar brand text should be "(?<brand>[^"]*)"$/u,
  async function(this: GoatItWorld, brand: string): Promise<void> {
    const dialog = this.page.getByRole("dialog");

    await expect(dialog.getByText(brand, { exact: true })).toBeVisible();
  },
);

Then(
  /^the game sidebar back to home link should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog");

    await expect(dialog.getByRole("link", { name: "Back to Home" })).toBeVisible();
  },
);

Then(
  /^the game sidebar version button should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog");

    await expect(dialog.getByTestId("github-version-button")).toBeVisible();
  },
);

Then(
  /^the game sidebar rules link should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog");

    await expect(dialog.getByRole("link", { name: "Rules", exact: true })).toBeVisible();
  },
);

Then(
  /^the rules page should have been opened in a new tab$/u,
  function(this: GoatItWorld): void {
    if (!this.openedTabPage) {
      throw new Error("Expected a new tab to have been opened, but none was found.");
    }
    const actual = this.openedTabPage.url();
    const expectedOrigin = new URL(this.page.url()).origin;

    expect(new URL(actual).origin).toBe(expectedOrigin);
    expect(new URL(actual).pathname).toBe("/rules");
  },
);