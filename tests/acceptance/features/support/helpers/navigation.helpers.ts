import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function waitForPageLoadStates(world: GoatItWorld): Promise<void> {
  await world.page.waitForLoadState("load");
  await waitForAppHydration(world);
}

async function waitForAppHydration(world: GoatItWorld): Promise<void> {
  await world.page.waitForFunction((): boolean => {
    const rootElement = document.querySelector("#__nuxt");

    return rootElement === null || "__vue_app__" in rootElement;
  });
}

async function waitForPageUrl(world: GoatItWorld, pageUrl: string): Promise<void> {
  await world.page.waitForURL(currentUrl => new URL(currentUrl).pathname === pageUrl);
}

export {
  waitForAppHydration,
  waitForPageLoadStates,
  waitForPageUrl,
};