import type { Locale } from "@goat-it/schemas/shared/locale";
import type { RuntimeConfig } from "nuxt/schema";

type CspMode = "enforce" | "report-only" | "off";

type AppRuntimeConfig = RuntimeConfig & {
  goatItApi: { baseUrl: string; gameKey: string };
  rateLimit: { maximumRequests: number; windowInMs: number; trustProxy: boolean };
  security: { cspMode: CspMode };
  public: { defaultLocale: Locale };
};

export type {
  AppRuntimeConfig,
  CspMode,
};