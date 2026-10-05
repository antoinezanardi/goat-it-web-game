import type { BrowserContext, Locator, Page } from "@playwright/test";

async function clickAndGetOpenedTab(context: BrowserContext, locator: Locator): Promise<Page> {
  const [openedTabPage] = await Promise.all([
    context.waitForEvent("page"),
    locator.click(),
  ]);

  return openedTabPage;
}

export {
  clickAndGetOpenedTab,
};