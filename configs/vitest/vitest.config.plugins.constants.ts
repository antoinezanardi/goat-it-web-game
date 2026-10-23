import type { TestProjectInlineConfiguration } from "vitest/config";

const GSAP_SCROLL_TRIGGER_SYNC_INTERVAL_STATEMENT = "_syncInterval = setInterval(_sync, 250);";

const GSAP_SCROLL_TRIGGER_DISABLED_SYNC_INTERVAL_STATEMENT = "_syncInterval = 0;";

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

const VITEST_GSAP_SCROLL_TRIGGER_SYNC_INTERVAL_PLUGIN_CONFIG: Pick<TestProjectInlineConfiguration, "plugins"> = {
  plugins: [
    {
      name: "vitest-gsap-scroll-trigger-disable-sync-interval",
      enforce: "pre",
      transform(code: string, id: string): { code: string } | undefined {
        if (!id.endsWith("gsap/ScrollTrigger.js")) {
          return undefined;
        }

        if (!code.includes(GSAP_SCROLL_TRIGGER_SYNC_INTERVAL_STATEMENT)) {
          throw new Error("Unable to disable the GSAP ScrollTrigger sync interval: the expected statement was not found in gsap/ScrollTrigger.js.");
        }
        return { code: code.replace(GSAP_SCROLL_TRIGGER_SYNC_INTERVAL_STATEMENT, GSAP_SCROLL_TRIGGER_DISABLED_SYNC_INTERVAL_STATEMENT) };
      },
    },
  ],
};

const VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG: Pick<TestProjectInlineConfiguration, "plugins"> = {
  plugins: [
    ...VITEST_FS_MODULE_CACHE_EXCLUSION_PLUGIN_CONFIG.plugins ?? [],
    ...VITEST_GSAP_SCROLL_TRIGGER_SYNC_INTERVAL_PLUGIN_CONFIG.plugins ?? [],
  ],
};

export { VITEST_NUXT_PROJECT_VITE_PLUGIN_CONFIG };