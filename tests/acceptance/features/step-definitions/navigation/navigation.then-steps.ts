import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { waitForPageUrl } from "#acceptance/features/support/helpers/navigation.helpers.ts";

Then(/^the user should be on (?<page>.+) page$/u, async function(this: GoatItWorld, page: string): Promise<void> {
  const pageName = page === "home" ? "" : page;

  await waitForPageUrl(this, `/${pageName}`);
});

Then(
  /^a new tab should have been opened with URL "(?<expectedUrl>[^"]*)"$/u,
  function(this: GoatItWorld, expectedUrl: string): void {
    if (!this.openedTabPage) {
      throw new Error("Expected a new tab to have been opened, but none was found.");
    }
    const actual = this.openedTabPage.url();
    const expectedOrigin = new URL(expectedUrl).origin;
    const expectedPathname = new URL(expectedUrl).pathname;

    expect(new URL(actual).origin).toBe(expectedOrigin);
    expect(new URL(actual).pathname).toContain(expectedPathname);
  },
);