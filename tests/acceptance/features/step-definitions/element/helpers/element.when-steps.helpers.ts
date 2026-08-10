import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import type { LocatorRole } from "#acceptance/features/support/types/playwright.types.ts";

async function resolveVisibleRoleLocator(world: GoatItWorld, role: LocatorRole, name: string, isExact: boolean): Promise<Locator> {
  const locator = world.page.getByRole(role, { name, exact: isExact });

  await expect(locator).toBeVisible();

  return locator;
}

async function clickOnRoleWithText(world: GoatItWorld, role: LocatorRole, name: string, isExact: boolean): Promise<void> {
  const locator = await resolveVisibleRoleLocator(world, role, name, isExact);

  await locator.click();
}

export {
  clickOnRoleWithText,
};