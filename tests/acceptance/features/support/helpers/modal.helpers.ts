import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

async function getVisibleDefaultModal(page: Page): Promise<Locator> {
  const dialog = page.getByRole("dialog").first();

  await expect(dialog).toBeVisible();

  return dialog;
}

export {
  getVisibleDefaultModal,
};