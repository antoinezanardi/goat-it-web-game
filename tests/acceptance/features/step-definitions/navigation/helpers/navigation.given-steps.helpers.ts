import { url } from "@nuxt/test-utils/e2e";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { waitForPageLoadStates } from "#acceptance/features/support/helpers/navigation.helpers.ts";

async function goOnPage(world: GoatItWorld, pageName: string): Promise<void> {
  const pagePath = pageName === "" ? "/" : `/${pageName}`;
  const pageUrl = url(pagePath);

  await world.page.goto(pageUrl);
  await waitForPageLoadStates(world);
}

export {
  goOnPage,
};