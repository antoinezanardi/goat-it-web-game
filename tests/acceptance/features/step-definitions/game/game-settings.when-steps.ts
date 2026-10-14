import { When } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { clickVisibleLocator } from "#acceptance/features/support/helpers/locator.helpers.ts";
import { getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

When(
  /^the user clicks the settings button in the game sidebar$/u,
  async function(this: GoatItWorld): Promise<void> {
    const dialog = await getVisibleDefaultModal(this.page);
    const settingsButton = dialog.getByTestId("game-sidebar-settings-button");

    await clickVisibleLocator(settingsButton);
  },
);

When(
  /^the user selects the "(?<locale>[^"]+)" locale option in the game settings$/u,
  async function(this: GoatItWorld, locale: string): Promise<void> {
    const modal = this.page.getByTestId("game-settings-modal");
    const localeSelect = modal.getByTestId("locale-select");

    await clickVisibleLocator(localeSelect);

    const option = this.page.getByRole("option", { name: locale });
    await clickVisibleLocator(option);
  },
);