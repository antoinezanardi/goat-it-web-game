import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the(?<exact> exact)? text "(?<text>[^"]*)" should be visible$/u,
  async function(this: GoatItWorld, exact: string | undefined, text: string): Promise<void> {
    const locator = this.page.getByText(text, { exact: exact !== undefined });

    await expect(locator).toBeVisible();
  },
);

Then(
  /^the(?<exact> exact)? text "(?<text>[^"]*)" should be hidden$/u,
  async function(this: GoatItWorld, exact: string | undefined, text: string): Promise<void> {
    const locator = this.page.getByText(text, { exact: exact !== undefined });

    await expect(locator).toBeHidden();
  },
);