import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

Then(
  /^the manifest link should be present in the document head$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.locator("head link[rel=\"manifest\"]")).toBeAttached();
  },
);

Then(
  /^the theme color meta tag should have content "(?<content>[^"]*)"$/u,
  async function(this: GoatItWorld, content: string): Promise<void> {
    await expect(this.page.locator("head meta[name=\"theme-color\"]")).toHaveAttribute("content", content);
  },
);

Then(
  /^the apple touch icon link should be present in the document head$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.locator("head link[rel=\"apple-touch-icon\"]")).toHaveAttribute("href", "/pwa/apple-touch-icon.png");
  },
);

Then(
  /^the mobile web app capable meta tag should be present$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.locator("head meta[name=\"mobile-web-app-capable\"]")).toHaveAttribute("content", "yes");
  },
);

Then(
  /^the service worker should be active$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect
      .poll(async() => this.page.evaluate(async() => {
        if (!("serviceWorker" in navigator)) {
          return false;
        }
        const registration = await navigator.serviceWorker.getRegistration();

        return registration !== undefined && registration.active !== null;
      }))
      .toBe(true);
  },
);