import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";

When(
  /^the user clicks on the table of contents link "(?<name>[^"]*)"$/u,
  async function(this: GoatItWorld, name: string): Promise<void> {
    const tocLink = this.page.getByTestId("docs-toc").getByRole("link", { name });

    await clickVisibleLocator(tocLink);
  },
);