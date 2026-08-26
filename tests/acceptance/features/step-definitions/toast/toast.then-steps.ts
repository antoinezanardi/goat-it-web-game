import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the toast with(?<exact> exact)? text "(?<text>[^"]*)" should be visible$/u,
  async function(this: GoatItWorld, exact: string | undefined, text: string): Promise<void> {
    const toastRegion = this.page.getByRole("region", { name: "Notifications" });
    const toastText = toastRegion.getByText(text, { exact: exact !== undefined });

    await expect(toastText).toBeVisible();
  },
);

Then(
  /^the toast with(?<exact> exact)? text "(?<text>[^"]*)" should be hidden$/u,
  async function(this: GoatItWorld, exact: string | undefined, text: string): Promise<void> {
    const toastRegion = this.page.getByRole("region", { name: "Notifications" });
    const toastText = toastRegion.getByText(text, { exact: exact !== undefined });

    await expect(toastText).toBeHidden();
  },
);