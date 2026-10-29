import { describe, it, expect } from "vitest";

import type { RuntimeConfigOverrides } from "~~/tests/unit/utils/types/runtime-config.types";

import type { AppRuntimeConfig, CspMode, LogLevel, SentryEnvironment } from "#shared/types/runtime-config.types";
import { isInternalHostname, validateAppRuntimeConfig } from "#server/utils/env/helpers/env-validation/env-validation.helpers";

function buildAppRuntimeConfig(overrides: RuntimeConfigOverrides = {}): AppRuntimeConfig {
  return {
    goatItApi: {
      baseUrl: overrides.baseUrl ?? "https://api.goat-it.com",
      gameKey: overrides.gameKey ?? "test-game-key",
    },
    rateLimit: {
      maximumRequests: overrides.maximumRequests ?? 60,
      windowInMs: overrides.windowInMs ?? 60_000,
      trustProxy: overrides.trustProxy ?? false,
    },
    security: { cspMode: overrides.cspMode ?? "enforce" },
    logger: { level: overrides.logLevel ?? "info" },
    public: {
      defaultLocale: overrides.defaultLocale ?? "en",
      sentry: {
        dsn: overrides.sentryDsn ?? "https://public@o123.ingest.us.sentry.io/456",
        environment: overrides.sentryEnvironment ?? "production",
        release: overrides.sentryRelease ?? "",
      },
    },
  } as unknown as AppRuntimeConfig;
}

describe(isInternalHostname, () => {
  it.each<{ hostname: string }>([
    { hostname: "localhost" },
    { hostname: "127.0.0.1" },
    { hostname: "[::1]" },
    { hostname: "goat-it-api-production" },
    { hostname: "10.0.0.8" },
    { hostname: "172.16.0.1" },
    { hostname: "172.20.0.1" },
    { hostname: "172.31.255.254" },
    { hostname: "192.168.1.20" },
  ])("should return true when the hostname \"$hostname\" is internal.", ({ hostname }) => {
    expect(isInternalHostname(hostname)).toBe(true);
  });

  it.each<{ hostname: string }>([
    { hostname: "api.goat-it.com" },
    { hostname: "goat-it.fr" },
    { hostname: "8.8.8.8" },
    { hostname: "11.0.0.1" },
    { hostname: "172.15.255.255" },
    { hostname: "172.32.0.1" },
    { hostname: "192.169.0.1" },
    { hostname: "[2001:db8::1]" },
  ])("should return false when the hostname \"$hostname\" is not internal.", ({ hostname }) => {
    expect(isInternalHostname(hostname)).toBe(false);
  });
});

describe(validateAppRuntimeConfig, () => {
  it.each<{ description: string; config: AppRuntimeConfig; isProduction: boolean; isTest?: boolean }>([
    { description: "a valid https base url in production", config: buildAppRuntimeConfig(), isProduction: true },
    { description: "a loopback http base url in production", config: buildAppRuntimeConfig({ baseUrl: "http://localhost:9090" }), isProduction: true },
    { description: "a loopback ip base url in production", config: buildAppRuntimeConfig({ baseUrl: "http://127.0.0.1:9090" }), isProduction: true },
    { description: "an internal http base url in production", config: buildAppRuntimeConfig({ baseUrl: "http://goat-it-api-production:9696" }), isProduction: true },
    { description: "a private ip http base url in production", config: buildAppRuntimeConfig({ baseUrl: "http://192.168.1.20:9090" }), isProduction: true },
    { description: "a non https base url outside production", config: buildAppRuntimeConfig({ baseUrl: "http://api.goat-it.com" }), isProduction: false },
    { description: "an alternate supported locale", config: buildAppRuntimeConfig({ defaultLocale: "fr" }), isProduction: true },
    { description: "a report-only csp mode", config: buildAppRuntimeConfig({ cspMode: "report-only" }), isProduction: true },
    { description: "a disabled csp mode", config: buildAppRuntimeConfig({ cspMode: "off" }), isProduction: true },
    { description: "a trusted proxy flag", config: buildAppRuntimeConfig({ trustProxy: true }), isProduction: true },
    { description: "a deployed production config with an https dsn", config: buildAppRuntimeConfig(), isProduction: true },
    { description: "a deployed staging config with an https dsn", config: buildAppRuntimeConfig({ sentryEnvironment: "staging" }), isProduction: true },
    { description: "a test config with a blank dsn", config: buildAppRuntimeConfig({ sentryDsn: "", sentryEnvironment: "test" }), isProduction: true, isTest: true },
    { description: "a development config with a blank dsn", config: buildAppRuntimeConfig({ sentryDsn: "", sentryEnvironment: "development" }), isProduction: false },
    { description: "a configured release", config: buildAppRuntimeConfig({ sentryRelease: "abc123" }), isProduction: true },
    { description: "a debug log level", config: buildAppRuntimeConfig({ logLevel: "debug" }), isProduction: true },
  ])("should not throw when the config has $description.", ({ config, isProduction, isTest = false }) => {
    expect(() => validateAppRuntimeConfig(config, { isProduction, isTest })).not.toThrow();
  });

  it.each<{ description: string; config: AppRuntimeConfig; isProduction: boolean; isTest?: boolean; expectedMessage: string }>([
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
      description: "a non http or https base url in production",
      config: buildAppRuntimeConfig({ baseUrl: "ftp://localhost:9090" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.baseUrl\" must use the http or https protocol.",
    },
    {
      description: "a non http or https base url outside production",
      config: buildAppRuntimeConfig({ baseUrl: "ftp://api.goat-it.com" }),
      isProduction: false,
      expectedMessage: "Invalid runtime environment: \"goatItApi.baseUrl\" must use the http or https protocol.",
    },
    {
      description: "a non https base url in production",
      config: buildAppRuntimeConfig({ baseUrl: "http://api.goat-it.com" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.baseUrl\" must use https in production.",
    },
    {
      description: "an empty game key",
      config: buildAppRuntimeConfig({ gameKey: "" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.gameKey\" must be set.",
    },
    {
      description: "a blank game key",
      config: buildAppRuntimeConfig({ gameKey: "   " }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"goatItApi.gameKey\" must be set.",
    },
    {
      description: "a blank game key outside production",
      config: buildAppRuntimeConfig({ gameKey: "   " }),
      isProduction: false,
      expectedMessage: "Invalid runtime environment: \"goatItApi.gameKey\" must be set.",
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
    {
      description: "a zero maximum request count",
      config: buildAppRuntimeConfig({ maximumRequests: 0 }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"rateLimit.maximumRequests\" must be an integer greater than or equal to 1.",
    },
    {
      description: "a fractional maximum request count",
      config: buildAppRuntimeConfig({ maximumRequests: 2.5 }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"rateLimit.maximumRequests\" must be an integer greater than or equal to 1.",
    },
    {
      description: "a zero rate limit window",
      config: buildAppRuntimeConfig({ windowInMs: 0 }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"rateLimit.windowInMs\" must be an integer greater than or equal to 1.",
    },
    {
      description: "a non boolean trusted proxy flag",
      config: buildAppRuntimeConfig({ trustProxy: "true" as unknown as boolean }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"rateLimit.trustProxy\" must be a boolean.",
    },
    {
      description: "an unsupported csp mode",
      config: buildAppRuntimeConfig({ cspMode: "log-only" as unknown as CspMode }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"security.cspMode\" must be one of the supported modes.",
    },
    {
      description: "an unsupported sentry environment",
      config: buildAppRuntimeConfig({ sentryEnvironment: "preprod" as unknown as SentryEnvironment }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"public.sentry.environment\" must be one of the supported environments.",
    },
    {
      description: "a non string sentry release",
      config: buildAppRuntimeConfig({ sentryRelease: 42 as unknown as string }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"public.sentry.release\" must be a string.",
    },
    {
      description: "a deployed config with a blank dsn",
      config: buildAppRuntimeConfig({ sentryDsn: "" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"public.sentry.dsn\" must be a valid https URL for a deployed build.",
    },
    {
      description: "a deployed config with a malformed dsn",
      config: buildAppRuntimeConfig({ sentryDsn: "not-a-url" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"public.sentry.dsn\" must be a valid https URL for a deployed build.",
    },
    {
      description: "a deployed config with a non https dsn",
      config: buildAppRuntimeConfig({ sentryDsn: "http://public@o123.ingest.us.sentry.io/456" }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"public.sentry.dsn\" must be a valid https URL for a deployed build.",
    },
    {
      description: "an unsupported log level",
      config: buildAppRuntimeConfig({ logLevel: "verbose" as unknown as LogLevel }),
      isProduction: true,
      expectedMessage: "Invalid runtime environment: \"logger.level\" must be one of the supported levels.",
    },
  ])("should throw when the config has $description.", ({ config, isProduction, isTest = false, expectedMessage }) => {
    expect(() => validateAppRuntimeConfig(config, { isProduction, isTest })).toThrow(expectedMessage);
  });
});