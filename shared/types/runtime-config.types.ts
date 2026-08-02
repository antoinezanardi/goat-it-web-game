import type { RuntimeConfig } from "nuxt/schema";

type AppRuntimeConfig = RuntimeConfig & { public: { defaultLocale: string } };

export type {
  AppRuntimeConfig,
};