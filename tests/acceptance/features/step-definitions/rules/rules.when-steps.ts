import { When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user clicks on the table of contents link "(?<name>[^"]*)"$/u,
  async function(this: GoatItWorld, name: string): Promise<void> {
    const tocLink = this.page.getByTestId("docs-toc").getByRole("link", { name });

    await expect(tocLink).toBeVisible();
    await tocLink.click();
  },
);