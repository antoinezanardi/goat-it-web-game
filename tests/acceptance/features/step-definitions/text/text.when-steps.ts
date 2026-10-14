import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";

When(
  /^the user clicks on the text "(?<text>[^"]*)"$/u,
  async function(this: GoatItWorld, text: string): Promise<void> {
    const locator = this.page.getByText(text, { exact: true }).first();

    await clickVisibleLocator(locator);
  },
);