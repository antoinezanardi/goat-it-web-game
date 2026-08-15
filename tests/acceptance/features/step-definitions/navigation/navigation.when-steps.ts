import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { waitForPageLoadStates } from "#acceptance/features/support/helpers/navigation.helpers.ts";

When(/^the user reloads the page$/u, async function(this: GoatItWorld): Promise<void> {
  await this.page.reload();
  await waitForPageLoadStates(this);
});

When(
  /^the user navigates back$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.page.goBack();
  },
);

When(
  /^the user scrolls down past (?<pixels>\d+) pixels$/u,
  async function(this: GoatItWorld, pixels: string): Promise<void> {
    await this.page.mouse.move(0, 0);
    await this.page.mouse.wheel(0, Number(pixels) + 1);
  },
);

When(
  /^the user scrolls to the "(?<heading>[^"]*)" heading$/u,
  async function(this: GoatItWorld, heading: string): Promise<void> {
    await this.page.getByTestId("docs-toc").waitFor({ state: "visible" });
    await this.page.getByRole("heading", { name: heading }).scrollIntoViewIfNeeded();
    await this.page.mouse.move(0, 0);
    await this.page.mouse.wheel(0, 1);
  },
);