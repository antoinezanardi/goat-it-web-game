import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the element with testid "(?<testId>[^"]*)" should be visible$/u,
  async function(this: GoatItWorld, testId: string): Promise<void> {
    await expect(this.page.getByTestId(testId)).toBeVisible();
  },
);

Then(
  /^the element with testid "(?<testId>[^"]*)" should be hidden$/u,
  async function(this: GoatItWorld, testId: string): Promise<void> {
    await expect(this.page.getByTestId(testId)).toBeHidden();
  },
);