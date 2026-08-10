import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import type { LocatorRole } from "#acceptance/features/support/types/playwright.types.ts";
import { ROLE_ALTERNATION_PATTERN } from "#acceptance/features/step-definitions/element/element.steps.constants.ts";
import { clickOnRoleWithText } from "#acceptance/features/step-definitions/element/helpers/element.when-steps.helpers.ts";

When(
  new RegExp(`^the user clicks on the (?<role>${ROLE_ALTERNATION_PATTERN}) with(?<exact> exact)? name "(?<name>[^"]*)"$`, "u"),
  async function(this: GoatItWorld, role: LocatorRole, exact: string | undefined, name: string): Promise<void> {
    await clickOnRoleWithText(this, role, name, exact !== undefined);
  },
);