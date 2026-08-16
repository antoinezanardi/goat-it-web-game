import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the table of contents should contain the link "(?<name>[^"]*)"$/u,
  async function(this: GoatItWorld, name: string): Promise<void> {
    await expect(this.page.getByTestId("docs-toc").getByRole("link", { name })).toBeVisible();
  },
);

Then(
  /^the table of contents link "(?<name>[^"]*)" should be active$/u,
  async function(this: GoatItWorld, name: string): Promise<void> {
    await expect(this.page.getByTestId("docs-toc").getByRole("link", { name })).toHaveClass(/text-primary/u);
  },
);