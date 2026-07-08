import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function waitForPageLoadStates(world: GoatItWorld): Promise<void> {
  await world.page.waitForLoadState("load");
}

async function waitForPageUrl(world: GoatItWorld, pageUrl: string): Promise<void> {
  await world.page.waitForURL(currentUrl => new URL(currentUrl).pathname === pageUrl);
}

export {
  waitForPageLoadStates,
  waitForPageUrl,
};