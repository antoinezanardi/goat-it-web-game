import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

async function waitForPageLoadStates(world: GoatItWorld): Promise<void> {
  await world.page.waitForLoadState("load");
  await waitForAppHydration(world);
}

function isNuxtAppFullyHydrated(): boolean {
  const rootElement = document.querySelector("#__nuxt");

  if (rootElement === null) {
    return true;
  }

  if (!("__vue_app__" in rootElement)) {
    return false;
  }

  const { __vue_app__: vueApp } = rootElement;

  if (typeof vueApp !== "object" || vueApp === null || !("config" in vueApp)) {
    return false;
  }

  const { config } = vueApp;

  if (typeof config !== "object" || config === null || !("globalProperties" in config)) {
    return false;
  }

  const { globalProperties } = config;

  if (typeof globalProperties !== "object" || globalProperties === null || !("$nuxt" in globalProperties)) {
    return false;
  }

  const { $nuxt } = globalProperties;

  return typeof $nuxt === "object" && $nuxt !== null && "isHydrating" in $nuxt && $nuxt.isHydrating === false;
}

async function waitForAppHydration(world: GoatItWorld): Promise<void> {
  await world.page.waitForFunction(isNuxtAppFullyHydrated);
}

async function waitForPageUrl(world: GoatItWorld, pageUrl: string): Promise<void> {
  await world.page.waitForURL(currentUrl => new URL(currentUrl).pathname === pageUrl);
}

export {
  waitForAppHydration,
  waitForPageLoadStates,
  waitForPageUrl,
};