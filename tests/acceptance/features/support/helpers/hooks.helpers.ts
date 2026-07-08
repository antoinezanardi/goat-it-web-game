import { execSync } from "node:child_process";

import type { ITestCaseHookParameter } from "@cucumber/cucumber";
import { rimraf } from "rimraf";

import { ACCEPTANCE_TESTS_REPORTS_SCREENSHOTS_PATH } from "#acceptance/features/support/constants/acceptance.constants.ts";
import {
  RESET_SANDBOX_DATA_TIMEOUT_IN_MS,
  SANDBOX_BASE_PORT,
  SANDBOX_HEALTH_CHECK_INTERVAL_IN_MS,
  SANDBOX_HEALTH_CHECK_MAX_RETRIES,
  SANDBOX_MONGODB_DATABASE_NAME,
} from "#acceptance/features/support/constants/hooks.constants.ts";
import type { GoatItWorld } from "#acceptance/features/support/types/world.types.ts";
import { MS_IN_SECOND } from "#shared/utils/helpers/time/time.constants.ts";
import { sleep } from "#shared/utils/helpers/time/time.helpers.ts";

function getWorkerId(): number {
  return Number(process.env.CUCUMBER_WORKER_ID ?? "0");
}

function getSandboxBaseUrl(): string {
  return `http://localhost:${SANDBOX_BASE_PORT + getWorkerId()}`;
}

function removeAcceptanceTestsReportsScreenshotsDirectory(): void {
  const acceptanceTestsReportsDirectoryFilesPath = `${process.cwd()}/${ACCEPTANCE_TESTS_REPORTS_SCREENSHOTS_PATH}`;

  console.info(`Removing reports screenshots directory: "${acceptanceTestsReportsDirectoryFilesPath}"`);
  rimraf.sync(acceptanceTestsReportsDirectoryFilesPath);
}

function sanitizeScenarioName(name: string): string {
  const MAX_LENGTH = 200;

  return name
    .replaceAll(/["*/:<>?\\|]/gu, "-")
    .replaceAll("..", "")
    .replaceAll(/\s+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "")
    .slice(0, MAX_LENGTH);
}

async function generateScreenshotOnScenarioFailure(world: GoatItWorld, scenario: ITestCaseHookParameter): Promise<void> {
  const screenShotExtension = ".png";
  const sanitizedName = sanitizeScenarioName(scenario.pickle.name);
  const screenShotRelativePath = `${ACCEPTANCE_TESTS_REPORTS_SCREENSHOTS_PATH}/${sanitizedName}-${Date.now()}${screenShotExtension}`;
  const screenShot = await world.page.screenshot({
    path: screenShotRelativePath,
    fullPage: true,
  });

  world.attach(screenShot, "image/png");
  const screenShotFullPath = `${process.cwd()}/${screenShotRelativePath}`;

  console.info(`Screenshot for failure scenario: ${scenario.pickle.name} saved at: "${screenShotFullPath}"`);
}

function resetSandboxData(): void {
  const containerName = `goat-it-api-sandbox-mongodb-${getWorkerId()}`;

  try {
    execSync(
      `docker exec ${containerName} mongosh --quiet --eval "db.dropDatabase()" ${SANDBOX_MONGODB_DATABASE_NAME}`,
      { stdio: "pipe", timeout: RESET_SANDBOX_DATA_TIMEOUT_IN_MS },
    );
  } catch(error: unknown) {
    throw new Error(`Failed to reset the Goat It API sandbox data within ${RESET_SANDBOX_DATA_TIMEOUT_IN_MS / MS_IN_SECOND}s.`, { cause: error });
  }
}

async function waitForSandboxHealthCheck(): Promise<void> {
  const healthCheckUrl = `${getSandboxBaseUrl()}/health`;

  for (let attempt = 1; attempt <= SANDBOX_HEALTH_CHECK_MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(healthCheckUrl, { signal: AbortSignal.timeout(SANDBOX_HEALTH_CHECK_INTERVAL_IN_MS) });

      if (response.ok) {
        return;
      }
    } catch {
      console.info(`Sandbox health check attempt ${attempt}/${SANDBOX_HEALTH_CHECK_MAX_RETRIES} failed (worker ${getWorkerId()}, url: ${healthCheckUrl})`);
    }

    if (attempt < SANDBOX_HEALTH_CHECK_MAX_RETRIES) {
      await sleep(SANDBOX_HEALTH_CHECK_INTERVAL_IN_MS);
    }
  }

  throw new Error(`Goat It API sandbox did not become healthy after ${SANDBOX_HEALTH_CHECK_MAX_RETRIES} retries (${SANDBOX_HEALTH_CHECK_MAX_RETRIES * SANDBOX_HEALTH_CHECK_INTERVAL_IN_MS / MS_IN_SECOND}s). Worker: ${getWorkerId()}, URL: ${healthCheckUrl}`);
}

export {
  generateScreenshotOnScenarioFailure,
  getSandboxBaseUrl,
  getWorkerId,
  removeAcceptanceTestsReportsScreenshotsDirectory,
  resetSandboxData,
  sanitizeScenarioName,
  waitForSandboxHealthCheck,
};