import { Then } from "@cucumber/cucumber";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { getVisibleDefaultModal } from "#acceptance/features/support/helpers/modal.helpers.ts";

Then(
  /^a confirmation modal should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    await getVisibleDefaultModal(this.page);
  },
);