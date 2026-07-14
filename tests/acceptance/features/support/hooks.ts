import { fileURLToPath } from "node:url";
import path from "node:path";

import { After, AfterAll, Before, BeforeAll, Status } from "@cucumber/cucumber";
import { createPage, createTest } from "@nuxt/test-utils/e2e";

import {
  ACCEPTANCE_TESTS_DEFAULT_LOCALE,
  BEFORE_ALL_TIMEOUT,
  BEFORE_TIMEOUT,
  SANDBOX_ADMIN_KEY,
  SHARED_BUILD_DIR,
} from "#acceptance/features/support/constants/hooks.constants.ts";
import {
  generateScreenshotOnScenarioFailure,
  getSandboxBaseUrl,
  getWorkerId,
  removeAcceptanceTestsReportsScreenshotsDirectory,
  resetSandboxData,
  waitForSandboxHealthCheck,
} from "#acceptance/features/support/helpers/hooks.helpers.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";

const rootDirectory = fileURLToPath(new URL("../../../..", import.meta.url));
const workerId = getWorkerId();
const sandboxBaseUrl = getSandboxBaseUrl();
const { beforeEach, afterEach, afterAll, beforeAll } = createTest({
  runner: "cucumber",
  build: false,
  server: true,
  env: {
    NUXT_GOAT_IT_API_BASE_URL: sandboxBaseUrl,
    NUXT_GOAT_IT_API_ADMIN_KEY: SANDBOX_ADMIN_KEY,
  },
  browserOptions: {
    type: "chromium",
    launch: {
      headless: true,
      ignoreDefaultArgs: ["--hide-scrollbars"],
    },
  },
  rootDir: rootDirectory,
  nuxtConfig: {
    buildDir: SHARED_BUILD_DIR,
    nitro: {
      output: {
        dir: path.resolve(rootDirectory, SHARED_BUILD_DIR, "output"),
      },
    },
    i18n: {
      defaultLocale: ACCEPTANCE_TESTS_DEFAULT_LOCALE,
    },
  },
});

BeforeAll({ timeout: BEFORE_ALL_TIMEOUT }, async(): Promise<void> => {
  if (workerId === 0) {
    console.info(`[Worker ${workerId}] Cleaning up previous acceptance test reports...`);
    removeAcceptanceTestsReportsScreenshotsDirectory();
  }

  console.info(`[Worker ${workerId}] Waiting for Goat It API sandbox to become healthy (${sandboxBaseUrl})...`);
  await waitForSandboxHealthCheck();
  console.info(`[Worker ${workerId}] Goat It API sandbox is healthy.`);

  console.info(`[Worker ${workerId}] Starting Nuxt server (buildDir: ${SHARED_BUILD_DIR})...`);
  await beforeAll();
  console.info(`[Worker ${workerId}] Nuxt server started successfully.`);
});

Before({ timeout: BEFORE_TIMEOUT }, async function(this: GoatItWorld): Promise<void> {
  resetSandboxData();
  beforeEach();
  this.page = await createPage();
  this.context = this.page.context();
});

After(async function(this: GoatItWorld, scenario): Promise<void> {
  if (scenario.result?.status === Status.FAILED) {
    try {
      await generateScreenshotOnScenarioFailure(this, scenario);
    } catch(error: unknown) {
      console.error("Failed to generate screenshot on scenario failure:", error);
    }
  }
  afterEach();

  try {
    await this.context.close();
  } catch(error: unknown) {
    console.error("Failed to close browser context:", error);
  }
});

AfterAll(async(): Promise<void> => {
  await afterAll();
});