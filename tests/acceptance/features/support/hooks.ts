import { fileURLToPath } from "node:url";
import path from "node:path";

import { After, AfterAll, Before, BeforeAll, Status } from "@cucumber/cucumber";
import { createPage, createTest } from "@nuxt/test-utils/e2e";
import type { Db, MongoClient } from "mongodb";

import {
  ACCEPTANCE_TESTS_DEFAULT_LOCALE,
  ACCEPTANCE_TESTS_SITE_URL,
  BEFORE_ALL_TIMEOUT,
  BEFORE_TIMEOUT,
  SANDBOX_GAME_KEY,
  SHARED_BUILD_DIR,
} from "#acceptance/features/support/constants/hooks.constants.ts";
import {
  generateScreenshotOnScenarioFailure,
  getMongoClient,
  getMongoDatabase,
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
    NUXT_GOAT_IT_API_GAME_KEY: SANDBOX_GAME_KEY,
    NUXT_PUBLIC_SITE_URL: ACCEPTANCE_TESTS_SITE_URL,
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

let mongoClient: MongoClient | undefined;
let mongoDatabase: Db | undefined;

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

  console.info(`[Worker ${workerId}] Connecting to MongoDB...`);
  mongoClient = await getMongoClient(workerId);
  mongoDatabase = getMongoDatabase(mongoClient);
  console.info(`[Worker ${workerId}] Connected to MongoDB.`);
});

Before({ timeout: BEFORE_TIMEOUT }, async function(this: GoatItWorld): Promise<void> {
  // Acceptable as mongoClient and mongoDatabase are guaranteed to be assigned in BeforeAll before Before runs
  // oxlint-disable-next-line typescript/no-non-null-assertion
  this.mongoClient = mongoClient!;
  // oxlint-disable-next-line typescript/no-non-null-assertion
  this.mongoDb = mongoDatabase!;
  await resetSandboxData(this);
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

  try {
    await mongoClient?.close();
    console.info(`[Worker ${workerId}] MongoDB connection closed.`);
  } catch(error: unknown) {
    console.error(`[Worker ${workerId}] Failed to close MongoDB connection:`, error);
  }
});