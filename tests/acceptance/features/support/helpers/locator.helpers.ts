import { expect } from "@playwright/test";
import type { Locator } from "@playwright/test";

async function clickVisibleLocator(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  await locator.click();
}

export { clickVisibleLocator };