import { When } from "@cucumber/cucumber";
import { url } from "@nuxt/test-utils/e2e";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

When(
  /^the user sends a HEAD request to the "(?<route>[^"]*)" route$/u,
  async function(this: GoatItWorld, route: string): Promise<void> {
    this.lastApiResponse = await this.context.request.head(url(route));
  },
);