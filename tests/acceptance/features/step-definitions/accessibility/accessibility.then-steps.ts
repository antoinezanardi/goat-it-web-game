import { Then } from "@cucumber/cucumber";

import { checkAccessibility } from "#acceptance/features/step-definitions/accessibility/helpers/accessibility.then-steps.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the page should not contain accessibility issues in (?<mode>desktop|mobile) mode$/u,
  { timeout: 10_000 },
  async function(this: GoatItWorld, mode: "desktop" | "mobile"): Promise<void> {
    await checkAccessibility(this, mode);
  },
);