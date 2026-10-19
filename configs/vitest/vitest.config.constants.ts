import path from "node:path";

import type { ModuleOptions as SitemapModuleOptions } from "@nuxtjs/sitemap";
import type { NuxtConfig } from "@nuxt/schema";
import type { TestProjectInlineConfiguration } from "vitest/config";
import type { InlineConfig } from "vitest/node";

import { VitestProjectNames } from "./vitest.config.enums.ts";

type UnitTestNuxtOverrides = NuxtConfig & {
  sitemap?: Partial<SitemapModuleOptions>;
  site?: { indexable?: boolean };
};

const processCwd = process.cwd();

const createVitestFsModuleCachePath = (projectName: VitestProjectNames): string => path.resolve(processCwd, "node_modules/.vitest-cache", projectName);

const VITEST_FS_MODULE_CACHE_EXCLUSION_PLUGIN_CONFIG: Pick<TestProjectInlineConfiguration, "plugins"> = {
  plugins: [
    {
      name: "vitest-fs-module-cache-exclusions",
      configureVitest({ defineCacheKeyGenerator }): void {
        defineCacheKeyGenerator(({ id, sourceCode }) => (id.includes("nuxt-vitest-app-entry") || sourceCode.includes("nuxt-vitest-app-entry") ? false : undefined));
      },
    },
  ],
};

const VITEST_BASE_RESOLVE_ALIASES = [
  { find: /^~\//u, replacement: `${path.resolve(processCwd, "app")}/` },
  { find: /^@\//u, replacement: `${path.resolve(processCwd, "app")}/` },
  { find: /^~~\//u, replacement: `${processCwd}/` },
  { find: /^#shared\//u, replacement: `${path.resolve(processCwd, "shared")}/` },
  { find: /^#server\//u, replacement: `${path.resolve(processCwd, "server")}/` },
  { find: /^#build\//u, replacement: `${path.resolve(processCwd, ".nuxt")}/` },
] as const;

const VITEST_NODE_PROJECT_RESOLVE_ALIASES = [
  ...VITEST_BASE_RESOLVE_ALIASES,
  { find: /^ofetch$/u, replacement: path.resolve(processCwd, "node_modules/.pnpm/node_modules/ofetch") },
  { find: /^h3$/u, replacement: path.resolve(processCwd, "node_modules/.pnpm/node_modules/h3") },
] as const;

const UNIT_TEST_NUXT_OVERRIDES: UnitTestNuxtOverrides = {
  runtimeConfig: {
    goatItApi: {
      baseUrl: "https://api.goat-it.com",
      gameKey: "test-game-key",
    },
    rateLimit: {
      maximumRequests: 60,
      windowInMs: 60_000,
      trustProxy: false,
    },
    security: {
      cspMode: "enforce",
    },
  },
  site: { indexable: false },
  sitemap: { enabled: false },
  experimental: { viteEnvironmentApi: false },
} as const;

const VITEST_PROJECT_COMMON_INLINE_CONFIG: InlineConfig = {
  globals: true,
  mockReset: true,
  clearMocks: true,
  restoreMocks: true,
  fsModuleCache: true,
  maxWorkers: "75%",
  experimental: { diagnostics: { transform: false } },
} as const;

const VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG: InlineConfig = {
  ...VITEST_PROJECT_COMMON_INLINE_CONFIG,
  environment: "nuxt",
  pool: "threads",
  isolate: false,
  testTimeout: 20_000,
  hookTimeout: 60_000,
  deps: {
    optimizer: {
      client: {
        enabled: true,
        include: ["reka-ui"],
      },
    },
  },
  environmentOptions: {
    nuxt: {
      overrides: UNIT_TEST_NUXT_OVERRIDES,
    },
  },
} as const;

const VITEST_NUXT_PROJECT_SETUP_FILES = [
  path.resolve(processCwd, "tests/unit/setup/nuxt/reka-ui-dismissable-layer.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/main-landmark.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/vtu-config.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/dates.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/use-i18n.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/use-router.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/fetch.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/use-toast.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/h3.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/create-error.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/use-head.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/use-seo-meta.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/call-once.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/define-page-meta.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/virtualizer.nuxt.unit-setup.ts"),
] as const;

const VITEST_COMPOSABLES_MOCK_SETUP_FILES: readonly string[] = [
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-fetch-status.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-async-data.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/query-collection.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-async-action.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-app-toast.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-goat-it-api-error-toast.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-gsap.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-game.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-game-question-translation.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-overlay.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-window-scroll.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-preferred-reduced-motion.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-preferred-languages.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-document-visibility.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-cookie.nuxt.unit-setup.ts"),
  path.resolve(processCwd, "tests/unit/setup/nuxt/composables/use-question-card-highlight.nuxt.unit-setup.ts"),
] as const;

const VITEST_COMPOSABLES_PROJECT_INCLUDES = ["app/composables/**/*.spec.ts"];

const VITEST_STORES_PROJECT_INCLUDES = ["app/**/*.store.spec.ts"];

const VITEST_REPOSITORIES_PROJECT_INCLUDES = ["app/**/*.repository.spec.ts"];

const VITEST_REPOSITORIES_MOCK_SETUP_FILES: readonly string[] = [
  path.resolve(
    processCwd,
    "tests/unit/setup/nuxt/repositories/question-themes-repository.nuxt.unit-setup.ts",
  ),
  path.resolve(
    processCwd,
    "tests/unit/setup/nuxt/repositories/questions-repository.nuxt.unit-setup.ts",
  ),
] as const;

const VITEST_NODE_PROJECT_INCLUDES = [
  "app/**/*.mappers.spec.ts",
  "app/**/*.helpers.spec.ts",
  "app/**/*.translations.spec.ts",
  "server/**/*.mappers.spec.ts",
  "server/**/*.helpers.spec.ts",
  "shared/**/*.mappers.spec.ts",
  "shared/**/*.helpers.spec.ts",
];

const VITEST_DOM_PROJECT_INCLUDES = [
  "app/**/*.dom.helpers.spec.ts",
  "server/**/*.dom.helpers.spec.ts",
  "shared/**/*.dom.helpers.spec.ts",
];

const VITEST_IGNORED_STARTING_BY_LOGS = [
  "<Suspense> is an experimental feature",
  "[Vue warn]: App already provides property with key \"Symbol(pinia)\"",
  "[nuxt] error caught during app initialization Error: Context conflict",
  "[Vue warn]: There is already an app instance mounted on the host container",
  "[Vue Router warn]: No match found for location with path \"",
  "[Vue warn]: onBeforeMount is called when there is no active component instance",
  "[Vue warn]: onMounted is called when there is no active component instance",
  "[Vue warn]: Unhandled error during execution of watcher callback",
  "[NUXT_E1005]",
] as const;

const VITEST_REPOSITORIES_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  resolve: {
    alias: VITEST_BASE_RESOLVE_ALIASES,
  },
  test: {
    ...VITEST_PROJECT_COMMON_INLINE_CONFIG,
    name: VitestProjectNames.REPOSITORIES,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.REPOSITORIES),
    include: [...VITEST_REPOSITORIES_PROJECT_INCLUDES],
    setupFiles: [path.resolve(processCwd, "tests/unit/setup/nuxt/dates.nuxt.unit-setup.ts")],
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
    setupFiles: [
      path.resolve(processCwd, "tests/unit/setup/nuxt/dates.nuxt.unit-setup.ts"),
      path.resolve(processCwd, "tests/unit/setup/node/nitro-auto-imports.node.unit-setup.ts"),
      path.resolve(processCwd, "tests/unit/setup/node/h3.node.unit-setup.ts"),
    ],
    pool: "threads",
    isolate: false,
  },
} as const;

const VITEST_NUXT_PROJECT_CONFIG: TestProjectInlineConfiguration = {
  ...VITEST_FS_MODULE_CACHE_EXCLUSION_PLUGIN_CONFIG,
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
  ...VITEST_FS_MODULE_CACHE_EXCLUSION_PLUGIN_CONFIG,
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
  ...VITEST_FS_MODULE_CACHE_EXCLUSION_PLUGIN_CONFIG,
  test: {
    ...VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG,
    name: VitestProjectNames.STORES,
    fsModuleCachePath: createVitestFsModuleCachePath(VitestProjectNames.STORES),
    include: [...VITEST_STORES_PROJECT_INCLUDES],
    setupFiles: [
      ...VITEST_NUXT_PROJECT_SETUP_FILES,
      ...VITEST_REPOSITORIES_MOCK_SETUP_FILES,
      ...VITEST_COMPOSABLES_MOCK_SETUP_FILES,
      path.resolve(processCwd, "tests/unit/setup/nuxt/stores.nuxt.unit-setup.ts"),
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
  VITEST_PROJECT_COMMON_INLINE_CONFIG,
  VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG,
  VITEST_NUXT_PROJECT_SETUP_FILES,
  VITEST_COMPOSABLES_MOCK_SETUP_FILES,
  VITEST_COMPOSABLES_PROJECT_INCLUDES,
  VITEST_STORES_PROJECT_INCLUDES,
  VITEST_REPOSITORIES_PROJECT_INCLUDES,
  VITEST_REPOSITORIES_MOCK_SETUP_FILES,
  VITEST_NODE_PROJECT_INCLUDES,
  VITEST_DOM_PROJECT_INCLUDES,
  VITEST_IGNORED_STARTING_BY_LOGS,
  VITEST_REPOSITORIES_PROJECT_CONFIG,
  VITEST_NODE_PROJECT_CONFIG,
  VITEST_DOM_PROJECT_CONFIG,
  VITEST_NUXT_PROJECT_CONFIG,
  VITEST_COMPOSABLES_PROJECT_CONFIG,
  VITEST_STORES_PROJECT_CONFIG,
};