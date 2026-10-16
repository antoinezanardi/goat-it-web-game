import { describe, it, expect } from "vitest";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { validateAppRuntimeConfig } from "#server/utils/env/helpers/env-validation.helpers";

type RuntimeConfigOverrides = {
  baseUrl?: string;
  gameKey?: string;
  defaultLocale?: string;
};

function buildAppRuntimeConfig(overrides: RuntimeConfigOverrides = {}): AppRuntimeConfig {
  return {
    goatItApi: {
      baseUrl: overrides.baseUrl ?? "https://api.goat-it.com",
      gameKey: overrides.gameKey ?? "test-game-key",
    },
    public: { defaultLocale: overrides.defaultLocale ?? "en" },
  } as unknown as AppRuntimeConfig;
}

describe(validateAppRuntimeConfig, () => {
  it.each<{ description: string; config: AppRuntimeConfig; isProduction: boolean }>([
    { description: "a valid https base url in production", config: buildAppRuntimeConfig(), isProduction: true },
    { description: "a loopback http base url in production", config: buildAppRuntimeConfig({ baseUrl: "http://localhost:9090" }), isProduction: true },
    { description: "a loopback ip base url in production", config: buildAppRuntimeConfig({ baseUrl: "http://127.0.0.1:9090" }), isProduction: true },
    { description: "a non https base url outside production", config: buildAppRuntimeConfig({ baseUrl: "http://api.goat-it.com" }), isProduction: false },
    { description: "a blank game key outside production", config: buildAppRuntimeConfig({ gameKey: "  " }), isProduction: false },
    { description: "an alternate supported locale", config: buildAppRuntimeConfig({ defaultLocale: "fr" }), isProduction: true },
  ])("should not throw when the config has $description.", ({ config, isProduction }) => {
    expect(() => validateAppRuntimeConfig(config, { isProduction })).not.toThrow();
  });

  it.each<{ description: string; config: AppRuntimeConfig; isProduction: boolean; expectedMessage: string }>([
    {
      description: "an invalid base url in production",
      config: buildAppRuntimeConfig({ baseUrl: "not-a-url" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.baseUrl\" must be a valid URL.",
    },
    {
      description: "an invalid base url outside production",
      config: buildAppRuntimeConfig({ baseUrl: "not-a-url" }),
      isProduction: false,
      expectedMessage: "Invalid runtime environment: \"goatItApi.baseUrl\" must be a valid URL.",
    },
    {
      description: "a non https base url in production",
      config: buildAppRuntimeConfig({ baseUrl: "http://api.goat-it.com" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.baseUrl\" must use https in production.",
    },
    {
      description: "an empty game key in production",
      config: buildAppRuntimeConfig({ gameKey: "" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.gameKey\" must be set in production.",
    },
    {
      description: "a blank game key in production",
      config: buildAppRuntimeConfig({ gameKey: "   " }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.gameKey\" must be set in production.",
    },
    {
      description: "an unsupported default locale in production",
      config: buildAppRuntimeConfig({ defaultLocale: "ja" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"public.defaultLocale\" must be one of the supported locales.",
    },
    {
      description: "an unsupported default locale outside production",
      config: buildAppRuntimeConfig({ defaultLocale: "ja" }),
      isProduction: false,
      expectedMessage: "Invalid runtime environment: \"public.defaultLocale\" must be one of the supported locales.",
    },
  ])("should throw when the config has $description.", ({ config, isProduction, expectedMessage }) => {
    expect(() => validateAppRuntimeConfig(config, { isProduction })).toThrow(expectedMessage);
  });
});