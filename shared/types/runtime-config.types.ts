import type { Locale } from "@goat-it/schemas/shared/locale";
import type { RuntimeConfig } from "nuxt/schema";

type AppRuntimeConfig = RuntimeConfig & { public: { defaultLocale: Locale } };

export type {
  AppRuntimeConfig,
};