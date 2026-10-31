import { expect } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";

import {
  PWA_OFFLINE_FALLBACK_PATH,
  PWA_RANDOM_QUESTIONS_ROUTE_PATTERN,
  PWA_SERVICE_WORKER_PRECACHE_TIMEOUT_IN_MS,
} from "#acceptance/features/step-definitions/pwa/pwa.steps.constants.ts";

async function waitForOfflineFallbackPrecache(page: Page): Promise<void> {
  await expect
    .poll(async() => page.evaluate(async(fallbackPath: string): Promise<boolean> => {
      if (!("serviceWorker" in navigator)) {
        return false;
      }
      await navigator.serviceWorker.ready;
      const cacheNames = await caches.keys();
      const cacheEntries = await Promise.all(cacheNames.map(async cacheName => {
        const cache = await caches.open(cacheName);

        return cache.keys();
      }));

      return cacheEntries.flat().some(request => new URL(request.url).pathname === fallbackPath);
    }, PWA_OFFLINE_FALLBACK_PATH), { timeout: PWA_SERVICE_WORKER_PRECACHE_TIMEOUT_IN_MS })
    .toBe(true);

  if (!await page.evaluate((): boolean => navigator.serviceWorker.controller !== null)) {
    await page.reload({ waitUntil: "load" });
  }
  await expect.poll(async() => page.evaluate((): boolean => navigator.serviceWorker.controller !== null)).toBe(true);
}

async function routeRandomQuestionsServerError(context: BrowserContext): Promise<void> {
  await context.route(PWA_RANDOM_QUESTIONS_ROUTE_PATTERN, async route => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ statusCode: 500, statusMessage: "Internal Server Error" }),
    });
  });
}

async function routeRandomQuestionsNetworkFailure(context: BrowserContext): Promise<void> {
  await context.route(PWA_RANDOM_QUESTIONS_ROUTE_PATTERN, async route => {
    await route.abort("failed");
  });
}

export { routeRandomQuestionsNetworkFailure, routeRandomQuestionsServerError, waitForOfflineFallbackPrecache };