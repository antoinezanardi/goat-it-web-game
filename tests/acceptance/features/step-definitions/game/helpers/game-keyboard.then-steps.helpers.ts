import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";

async function getOpenTooltipContent(page: Page, control: Locator): Promise<Locator> {
  await expect(control).toHaveAttribute("aria-describedby", /^.+$/u);
  const tooltipId = await control.getAttribute("aria-describedby");

  if (tooltipId === null) {
    throw new Error("Expected the hovered control to expose a tooltip description id");
  }
  return page.locator("[data-slot=\"content\"]").filter({ has: page.locator(`[id="${tooltipId}"]`) });
}

async function expectShortcutHintOnHover(page: Page, control: Locator, keyHint: string): Promise<void> {
  await expect(control).toBeVisible();
  await page.mouse.move(0, 0);
  await control.hover();

  const tooltipContent = await getOpenTooltipContent(page, control);

  await expect(tooltipContent.locator("kbd")).toHaveText(keyHint);
}

export { expectShortcutHintOnHover };