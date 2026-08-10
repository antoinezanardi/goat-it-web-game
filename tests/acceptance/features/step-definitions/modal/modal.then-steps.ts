import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { MODAL_ANIMATION_SETTLE_MS } from "#acceptance/features/step-definitions/modal/modal.steps.constants.ts";

Then(
  /^a confirmation modal should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog").first();
    await expect(dialog).toBeVisible();
  },
);

Then(
  /^no confirmation modal is displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.waitForTimeout(MODAL_ANIMATION_SETTLE_MS);
    await expect(this.page.getByRole("dialog")).toHaveCount(0);
  },
);