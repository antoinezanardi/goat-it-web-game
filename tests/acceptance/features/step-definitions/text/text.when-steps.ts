import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user clicks on the text "(?<text>[^"]*)"$/u,
  async function(this: GoatItWorld, text: string): Promise<void> {
    const locator = this.page.getByText(text, { exact: true }).first();

    await expect(locator).toBeVisible();
    await locator.click();
  },
);