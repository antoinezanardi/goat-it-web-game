import { defineVitestProject } from "@nuxt/test-utils/config";
import { defineConfig } from "vitest/config";

import { VITEST_COMPOSABLES_PROJECT_CONFIG, VITEST_IGNORED_STARTING_BY_LOGS, VITEST_NODE_PROJECT_CONFIG, VITEST_NUXT_PROJECT_CONFIG, VITEST_REPOSITORIES_PROJECT_CONFIG, VITEST_STORES_PROJECT_CONFIG } from "./vitest.config.constants";

export default defineConfig({
  test: {
    hookTimeout: 20_000,
    projects: [
      await defineVitestProject(VITEST_NUXT_PROJECT_CONFIG),
      await defineVitestProject(VITEST_COMPOSABLES_PROJECT_CONFIG),
      await defineVitestProject(VITEST_STORES_PROJECT_CONFIG),
      VITEST_REPOSITORIES_PROJECT_CONFIG,
      VITEST_NODE_PROJECT_CONFIG,
    ],
    onConsoleLog: (log: string): boolean => !VITEST_IGNORED_STARTING_BY_LOGS.some(ignoredLogStart => log.startsWith(ignoredLogStart)),
    watch: false,
    coverage: {
      provider: "v8",
      include: [
        "app/**/*.ts",
        "app/**/*.vue",
        "server/**/*.ts",
        "shared/**/*.ts",
      ],
      exclude: [
        "**/*.constants.ts",
        "**/*.enums.ts",
        "**/*.types.ts",
        "**/*.d.ts",
        "**/*.config.ts",
        "**/*.spec.ts",
        "server/api/**/*.{get,post,put,patch,delete}.ts",
      ],
      reportsDirectory: "tests/unit/coverage",
      reporter: [
        "clover",
        "json",
        "lcov",
        "text",
        "text-summary",
        "html",
      ],
      thresholds: {
        100: true,
      },
    },
  },
});