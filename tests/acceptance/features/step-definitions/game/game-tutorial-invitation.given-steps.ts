import { Given } from "@cucumber/cucumber";
import { url } from "@nuxt/test-utils/e2e";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Given(
  /^the tutorial invitation has already been decided$/u,
  async function(this: GoatItWorld): Promise<void> {
    await this.context.addCookies([
      {
        name: "game_tutorial_invitation_decided",
        value: "true",
        url: url("/"),
      },
    ]);
  },
);