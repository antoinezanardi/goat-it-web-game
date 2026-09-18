import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  getGameTourBackdrop,
  getGameTourBody,
  getGameTourButton,
  getGameTourTitle,
  getGameTourTooltip,
} from "#acceptance/features/support/helpers/game.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the interactive tutorial entry should be before the rules link$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = this.page.getByRole("dialog");
    const tutorialBox = await dialog.getByTestId("game-sidebar-tutorial-link").boundingBox();
    const rulesBox = await dialog.getByTestId("game-sidebar-rules-link").boundingBox();

    expect(tutorialBox).not.toBeNull();
    expect(rulesBox).not.toBeNull();
    // Acceptable as the not.toBeNull assertions above guarantee both boxes are present
    // oxlint-disable-next-line typescript/no-non-null-assertion
    expect(tutorialBox!.y).toBeLessThan(rulesBox!.y);
  },
);

Then(
  /^the interactive tutorial should be visible$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTourTooltip(this.page)).toBeVisible();
  },
);

Then(
  /^the interactive tutorial step title should be "(?<title>[^"]+)"$/u,
  async function(this: GoatItWorld, title: string): Promise<void> {
    await expect(getGameTourTitle(this.page)).toHaveText(title);
  },
);

Then(
  /^the interactive tutorial description should contain "(?<text>[^"]+)"$/u,
  async function(this: GoatItWorld, text: string): Promise<void> {
    await expect(getGameTourBody(this.page)).toContainText(text);
  },
);

Then(
  /^the interactive tutorial should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTourTooltip(this.page)).toBeHidden();
    await expect(getGameTourBackdrop(this.page)).toBeHidden();
  },
);

Then(
  /^the Back button should not be available in the interactive tutorial$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(getGameTourButton(this.page, "Back")).toBeHidden();
  },
);

Then(
  /^the interactive tutorial should target the sidebar toggle$/u,
  async function(this: GoatItWorld): Promise<void> {
    const sidebarToggle = this.page.getByTestId("game-sidebar-toggle-button");

    await expect(sidebarToggle).toBeVisible();
    await expect(sidebarToggle).toHaveClass(/nt-highlight/u);
  },
);