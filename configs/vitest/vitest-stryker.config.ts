import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

import { VITEST_COMPOSABLES_PROJECT_CONFIG, VITEST_IGNORED_STARTING_BY_LOGS, VITEST_NODE_PROJECT_CONFIG, VITEST_REPOSITORIES_PROJECT_CONFIG, VITEST_STORES_PROJECT_CONFIG } from "./vitest.config.constants";

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject(VITEST_COMPOSABLES_PROJECT_CONFIG),
      await defineVitestProject(VITEST_STORES_PROJECT_CONFIG),
      VITEST_REPOSITORIES_PROJECT_CONFIG,
      VITEST_NODE_PROJECT_CONFIG,
    ],
    onConsoleLog: (log: string): boolean => !VITEST_IGNORED_STARTING_BY_LOGS.some(ignoredLogStart => log.startsWith(ignoredLogStart)),
  },
});