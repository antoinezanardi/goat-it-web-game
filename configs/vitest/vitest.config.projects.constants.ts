import type { TestProjectInlineConfiguration } from "vitest/config";

import {
  createVitestFsModuleCachePath,
  VITEST_BASE_RESOLVE_ALIASES,
  VITEST_NODE_PROJECT_RESOLVE_ALIASES,
  VITEST_PROJECT_COMMON_INLINE_CONFIG,
  VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG,
} from "./vitest.config.constants.ts";
import { VitestProjectNames } from "./vitest.config.enums.ts";
import { VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG } from "./vitest.config.plugins.constants.ts";
import {
  VITEST_COMPOSABLES_PROJECT_INCLUDES,
  VITEST_DOM_PROJECT_INCLUDES,
  VITEST_NODE_PROJECT_INCLUDES,
  VITEST_REPOSITORIES_PROJECT_INCLUDES,
  VITEST_STORES_PROJECT_INCLUDES,
} from "./vitest.config.project-includes.constants.ts";
import {
  VITEST_COMPOSABLES_MOCK_SETUP_FILES,
  VITEST_NODE_PROJECT_SETUP_FILES,
  VITEST_NUXT_PROJECT_SETUP_FILES,
  VITEST_REPOSITORIES_MOCK_SETUP_FILES,
  VITEST_STORES_PROJECT_SETUP_FILE,
} from "./vitest.config.setup-files.constants.ts";

const VITEST_REPOSITORIES_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  resolve: {
    alias: VITEST_BASE_RESOLVE_ALIASES,
  },
  test: {
    ...VITEST_PROJECT_COMMON_INLINE_CONFIG,
    name: VitestProjectNames.REPOSITORIES,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.REPOSITORIES),
    include: [...VITEST_REPOSITORIES_PROJECT_INCLUDES],
    pool: "threads",
    isolate: false,
  },
} as const;

const VITEST_NODE_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  resolve: {
    alias: VITEST_NODE_PROJECT_RESOLVE_ALIASES,
  },
  test: {
    ...VITEST_PROJECT_COMMON_INLINE_CONFIG,
    name: VitestProjectNames.NODE,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.NODE),
    include: [...VITEST_NODE_PROJECT_INCLUDES],
    exclude: [...VITEST_DOM_PROJECT_INCLUDES],
    setupFiles: [...VITEST_NODE_PROJECT_SETUP_FILES],
    pool: "threads",
    isolate: false,
  },
} as const;

const VITEST_NUXT_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  ...VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG,
  test: {
    ...VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG,
    name: VitestProjectNames.NUXT,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.NUXT),
    include: [
      "app/**/*.spec.ts",
      "server/**/*.spec.ts",
      "shared/**/*.spec.ts",
    ],
    exclude: [
      ...VITEST_NODE_PROJECT_INCLUDES,
      ...VITEST_DOM_PROJECT_INCLUDES,
      ...VITEST_STORES_PROJECT_INCLUDES,
      ...VITEST_COMPOSABLES_PROJECT_INCLUDES,
      ...VITEST_REPOSITORIES_PROJECT_INCLUDES,
    ],
    setupFiles: [
      ...VITEST_NUXT_PROJECT_SETUP_FILES,
      ...VITEST_REPOSITORIES_MOCK_SETUP_FILES,
      ...VITEST_COMPOSABLES_MOCK_SETUP_FILES,
    ],
  },
} as const;

const VITEST_COMPOSABLES_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  ...VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG,
  test: {
    ...VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG,
    name: VitestProjectNames.COMPOSABLES,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.COMPOSABLES),
    isolate: true,
    include: [...VITEST_COMPOSABLES_PROJECT_INCLUDES],
    exclude: [...VITEST_NODE_PROJECT_INCLUDES, ...VITEST_DOM_PROJECT_INCLUDES],
    setupFiles: [
      ...VITEST_NUXT_PROJECT_SETUP_FILES,
      ...VITEST_REPOSITORIES_MOCK_SETUP_FILES,
    ],
  },
} as const;

const VITEST_STORES_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  ...VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG,
  test: {
    ...VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG,
    name: VitestProjectNames.STORES,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.STORES),
    include: [...VITEST_STORES_PROJECT_INCLUDES],
    setupFiles: [
      ...VITEST_NUXT_PROJECT_SETUP_FILES,
      ...VITEST_REPOSITORIES_MOCK_SETUP_FILES,
      ...VITEST_COMPOSABLES_MOCK_SETUP_FILES,
      VITEST_STORES_PROJECT_SETUP_FILE,
    ],
  },
} as const;

const VITEST_DOM_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  resolve: {
    alias: VITEST_BASE_RESOLVE_ALIASES,
  },
  test: {
    ...VITEST_PROJECT_COMMON_INLINE_CONFIG,
    name: VitestProjectNames.DOM,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.DOM),
    include: [...VITEST_DOM_PROJECT_INCLUDES],
    environment: "happy-dom",
    pool: "threads",
    isolate: false,
  },
} as const;

export {
  VITEST_REPOSITORIES_PROJECT_CONFIG,
  VITEST_NODE_PROJECT_CONFIG,
  VITEST_DOM_PROJECT_CONFIG,
  VITEST_NUXT_PROJECT_CONFIG,
  VITEST_COMPOSABLES_PROJECT_CONFIG,
  VITEST_STORES_PROJECT_CONFIG,
};