import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import {
  expectServiceWorkerPrecachesOfflineFallback,
  expectStaticOfflineFallback,
} from "#acceptance/features/step-definitions/pwa/helpers/pwa.then-steps.helpers.ts";
import {
  PWA_CONNECTIVITY_STATUS_TEST_ID,
  PWA_CONNECTIVITY_STATUS_TIMEOUT_IN_MS,
  PWA_OFFLINE_PAGE_TEST_ID,
} from "#acceptance/features/step-definitions/pwa/pwa.steps.constants.ts";

Then(
  /^the manifest link should be present in the document head$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.locator("head link[rel=\"manifest\"]")).toHaveAttribute("href", "/manifest.webmanifest");
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

Then(
  /^the offline fallback should be displayed$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId(PWA_OFFLINE_PAGE_TEST_ID)).toBeVisible();
  },
);

Then(
  /^the offline fallback should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId(PWA_OFFLINE_PAGE_TEST_ID)).toBeHidden();
  },
);

Then(
  /^the connectivity indicator should be hidden$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId(PWA_CONNECTIVITY_STATUS_TEST_ID)).toBeHidden();
  },
);

Then(
  /^the connectivity indicator should display "(?<label>[^"]*)" with the "(?<icon>[^"]*)" icon$/u,
  async function(this: GoatItWorld, label: string, icon: string): Promise<void> {
    const indicator = this.page.getByTestId(PWA_CONNECTIVITY_STATUS_TEST_ID);

    await expect(indicator).toBeVisible();
    await expect(indicator).toContainText(label);
    await expect(indicator.getByTestId("connectivity-status-icon")).toHaveAttribute("data-icon-name", icon);
  },
);

Then(
  /^the connectivity indicator should be hidden after the online confirmation$/u,
  async function(this: GoatItWorld): Promise<void> {
    await expect(this.page.getByTestId(PWA_CONNECTIVITY_STATUS_TEST_ID))
      .toBeHidden({ timeout: PWA_CONNECTIVITY_STATUS_TIMEOUT_IN_MS });
  },
);

Then(
  /^the built offline fallback should be a static document$/u,
  // Acceptable as the Cucumber Then callback declares the typed world even though the artifact assertions need no page access
  // oxlint-disable-next-line eslint/prefer-arrow-callback
  function(this: GoatItWorld): void {
    expectStaticOfflineFallback();
  },
);

Then(
  /^the built service worker should precache the offline fallback$/u,
  // Acceptable as the Cucumber Then callback declares the typed world even though the artifact assertions need no page access
  // oxlint-disable-next-line eslint/prefer-arrow-callback
  function(this: GoatItWorld): void {
    expectServiceWorkerPrecachesOfflineFallback();
  },
);