import path from "node:path";

import type { ModuleOptions as SitemapModuleOptions } from "@nuxtjs/sitemap";
import type { NuxtConfig } from "@nuxt/schema";
import type { InlineConfig } from "vitest/node";

import type { VitestProjectNames } from "./vitest.config.enums.ts";

type UnitTestNuxtOverrides = NuxtConfig & {
  sitemap?: Partial<SitemapModuleOptions>;
  site?: { indexable?: boolean };
};

const PROCESS_CWD = process.cwd();

function createVitestFsModuleCachePath(projectName: VitestProjectNames): string {
  return path.resolve(PROCESS_CWD, "node_modules/.vitest-cache", projectName);
}

const VITEST_BASE_RESOLVE_ALIASES = [
  { find: /^~\//u, replacement: `${path.resolve(PROCESS_CWD, "app")}/` },
  { find: /^@\//u, replacement: `${path.resolve(PROCESS_CWD, "app")}/` },
  { find: /^~~\//u, replacement: `${PROCESS_CWD}/` },
  { find: /^#shared\//u, replacement: `${path.resolve(PROCESS_CWD, "shared")}/` },
  { find: /^#server\//u, replacement: `${path.resolve(PROCESS_CWD, "server")}/` },
  { find: /^#build\//u, replacement: `${path.resolve(PROCESS_CWD, ".nuxt")}/` },
] as const;

const VITEST_NODE_PROJECT_RESOLVE_ALIASES = [
  ...VITEST_BASE_RESOLVE_ALIASES,
  { find: /^ofetch$/u, replacement: path.resolve(PROCESS_CWD, "node_modules/.pnpm/node_modules/ofetch") },
  { find: /^h3$/u, replacement: path.resolve(PROCESS_CWD, "node_modules/.pnpm/node_modules/h3") },
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
  plugins: [path.resolve(PROCESS_CWD, "tests/unit/setup/nuxt/gsap-scroll-trigger.nuxt-plugin.ts")],
  experimental: { viteEnvironmentApi: false },
} as const;

const VITEST_PROJECT_COMMON_INLINE_CONFIG: InlineConfig = {
  globals: true,
  mockReset: true,
  clearMocks: true,
  restoreMocks: true,
  fsModuleCache: true,
  maxWorkers: "75%",
  env: { TZ: "UTC" },
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

export {
  PROCESS_CWD,
  createVitestFsModuleCachePath,
  VITEST_BASE_RESOLVE_ALIASES,
  VITEST_NODE_PROJECT_RESOLVE_ALIASES,
  VITEST_PROJECT_COMMON_INLINE_CONFIG,
  VITEST_PROJECT_COMMON_NUXT_INLINE_CONFIG,
  VITEST_IGNORED_STARTING_BY_LOGS,
};