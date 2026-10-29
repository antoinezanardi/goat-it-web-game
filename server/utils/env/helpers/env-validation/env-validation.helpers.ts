import { isValidLocale } from "@goat-it/schemas/shared/locale";
import { z } from "zod";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import {
  LOCAL_HOSTNAMES,
  RFC1918_IPV4_PATTERN,
  SUPPORTED_CSP_MODES,
  SUPPORTED_LOG_LEVELS,
  SUPPORTED_SENTRY_ENVIRONMENTS,
} from "#server/utils/env/helpers/env-validation/env-validation.constants";
import type { ValidateAppRuntimeConfigOptions } from "#server/utils/env/helpers/env-validation/env-validation.types";

/**
 * Tells whether a host is internal: loopback names, single-label names, and RFC1918 IPv4 addresses.
 *
 * Production HTTPS validation exempts these hosts so local and sidecar deployments keep working.
 */
function isInternalHostname(hostname: string): boolean {
  if (LOCAL_HOSTNAMES.includes(hostname)) {
    return true;
  }

  if (!hostname.includes(".") && !hostname.startsWith("[")) {
    return true;
  }
  return z.ipv4().safeParse(hostname).success && RFC1918_IPV4_PATTERN.test(hostname);
}

function validateRateLimitConfig(rateLimit: AppRuntimeConfig["rateLimit"]): void {
  if (!z.number().int().min(1).safeParse(rateLimit.maximumRequests).success) {
    throw new Error("Invalid runtime environment: \"rateLimit.maximumRequests\" must be an integer greater than or equal to 1.");
  }

  if (!z.number().int().min(1).safeParse(rateLimit.windowInMs).success) {
    throw new Error("Invalid runtime environment: \"rateLimit.windowInMs\" must be an integer greater than or equal to 1.");
  }

  if (typeof rateLimit.trustProxy !== "boolean") {
    throw new TypeError("Invalid runtime environment: \"rateLimit.trustProxy\" must be a boolean.");
  }
}

function validateSecurityConfig(security: AppRuntimeConfig["security"]): void {
  if (!SUPPORTED_CSP_MODES.includes(security.cspMode)) {
    throw new Error("Invalid runtime environment: \"security.cspMode\" must be one of the supported modes.");
  }
}

function validateSentryConfig(
  sentry: AppRuntimeConfig["public"]["sentry"],
  options: ValidateAppRuntimeConfigOptions,
): void {
  if (!SUPPORTED_SENTRY_ENVIRONMENTS.includes(sentry.environment)) {
    throw new Error("Invalid runtime environment: \"public.sentry.environment\" must be one of the supported environments.");
  }

  if (typeof sentry.release !== "string") {
    throw new TypeError("Invalid runtime environment: \"public.sentry.release\" must be a string.");
  }

  if (!options.isProduction || options.isTest) {
    return;
  }

  const dsnValidation = z.url().safeParse(sentry.dsn);

  if (!dsnValidation.success || !dsnValidation.data.startsWith("https://")) {
    throw new Error("Invalid runtime environment: \"public.sentry.dsn\" must be a valid https URL for a deployed build.");
  }
}

function validateLoggerConfig(logger: AppRuntimeConfig["logger"]): void {
  if (!SUPPORTED_LOG_LEVELS.includes(logger.level)) {
    throw new Error("Invalid runtime environment: \"logger.level\" must be one of the supported levels.");
  }
}

/**
 * Fail-fast validation of the runtime environment, run before the Nitro server accepts traffic.
 *
 * Checks that the upstream base URL is a valid http(s) URL, that production uses HTTPS unless the host is
 * internal, that the game key is non-empty, and that the default locale, rate-limit, CSP, Sentry, and logger
 * settings are supported.
 *
 * A deployed build (`isProduction && !isTest`) must also provide a valid HTTPS Sentry DSN.
 *
 * @throws When any checked value is missing, malformed, or unsupported, which aborts the boot.
 * @see docs/security.md
 */
function validateAppRuntimeConfig(config: AppRuntimeConfig, options: ValidateAppRuntimeConfigOptions): void {
  const baseUrlValidation = z.url().safeParse(config.goatItApi.baseUrl);

  if (!baseUrlValidation.success) {
    throw new Error("Invalid runtime environment: \"goatItApi.baseUrl\" must be a valid URL.");
  }

  const baseUrl = new URL(baseUrlValidation.data);
  if (baseUrl.protocol !== "http:" && baseUrl.protocol !== "https:") {
    throw new Error("Invalid runtime environment: \"goatItApi.baseUrl\" must use the http or https protocol.");
  }

  if (options.isProduction && baseUrl.protocol !== "https:" && !isInternalHostname(baseUrl.hostname)) {
    throw new Error("Invalid runtime environment: \"goatItApi.baseUrl\" must use https in production.");
  }

  if (config.goatItApi.gameKey.trim().length === 0) {
    throw new Error("Invalid runtime environment: \"goatItApi.gameKey\" must be set.");
  }

  if (!isValidLocale(config.public.defaultLocale)) {
    throw new Error("Invalid runtime environment: \"public.defaultLocale\" must be one of the supported locales.");
  }

  validateRateLimitConfig(config.rateLimit);
  validateSecurityConfig(config.security);
  validateSentryConfig(config.public.sentry, options);
  validateLoggerConfig(config.logger);
}

export {
  isInternalHostname,
  validateAppRuntimeConfig,
};