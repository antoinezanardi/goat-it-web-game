import { isValidLocale } from "@goat-it/schemas/shared/locale";
import { z } from "zod";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { LOCAL_HOSTNAMES, RFC1918_IPV4_PATTERN, SUPPORTED_CSP_MODES } from "#server/utils/env/env.constants";
import type { ValidateAppRuntimeConfigOptions } from "#server/utils/env/env.types";

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
}

export {
  isInternalHostname,
  validateAppRuntimeConfig,
};