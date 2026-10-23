import type { TestProjectInlineConfiguration } from "vitest/config";

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

const VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG: Pick<TestProjectInlineConfiguration, "plugins"> = {
  plugins: [...VITEST_FS_MODULE_CACHE_EXCLUSION_PLUGIN_CONFIG.plugins ?? []],
};

export { VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG };