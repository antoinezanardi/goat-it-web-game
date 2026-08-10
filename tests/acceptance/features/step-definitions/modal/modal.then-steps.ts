import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^a confirmation modal should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();
  },
);