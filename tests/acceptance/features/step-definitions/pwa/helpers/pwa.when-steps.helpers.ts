import { url } from "@nuxt/test-utils/e2e";
import { expect } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";

import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { skipQuestions } from "#acceptance/features/step-definitions/game/helpers/game.when-steps.helpers.ts";
import {
  PWA_RANDOM_QUESTIONS_REQUEST_FAILURE_TIMEOUT_IN_MS,
  PWA_RANDOM_QUESTIONS_REQUEST_PATH,
} from "#acceptance/features/step-definitions/pwa/pwa.steps.constants.ts";

async function setBrowserOffline(context: BrowserContext, page: Page, isOffline: boolean): Promise<void> {
  await context.setOffline(isOffline);
  await expect.poll(async() => page.evaluate((): boolean => navigator.onLine)).toBe(!isOffline);
}

async function navigateDirectly(page: Page, pagePath: string): Promise<void> {
  await page.goto(url(pagePath), { waitUntil: "load" });
}

async function reloadDirectly(page: Page): Promise<void> {
  await page.reload({ waitUntil: "load" });
}

async function skipQuestionsUntilRandomQuestionsRequestFails(world: GoatItWorld, count: number): Promise<void> {
  const failedRequest = world.page.waitForEvent("requestfailed", {
    predicate: (request): boolean => request.url().includes(PWA_RANDOM_QUESTIONS_REQUEST_PATH),
    timeout: PWA_RANDOM_QUESTIONS_REQUEST_FAILURE_TIMEOUT_IN_MS,
  });

  await skipQuestions(world, count);
  await failedRequest;
}

export {
  navigateDirectly,
  reloadDirectly,
  setBrowserOffline,
  skipQuestionsUntilRandomQuestionsRequestFails,
};