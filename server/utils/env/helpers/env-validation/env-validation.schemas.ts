import { LOCALES } from "@goat-it/schemas/shared/locale";
import { z } from "zod";

import { CSP_MODES, LOG_LEVELS } from "#shared/constants/runtime-config.constants";
import type { AppRuntimeConfig, SentryEnvironment } from "#shared/types/runtime-config.types";
import { BOOLEAN_MESSAGE, INVALID_URL_MESSAGE, RATE_LIMIT_NUMBER_MESSAGE } from "#server/utils/env/helpers/env-validation/env-validation.constants";

const BASE_URL_SCHEMA = z.string({ error: INVALID_URL_MESSAGE }).superRefine((value, context) => {
  if (!z.url().safeParse(value).success) {
    context.addIssue({ code: "custom", message: INVALID_URL_MESSAGE });

    return;
  }

  const { protocol } = new URL(value);
  if (protocol !== "http:" && protocol !== "https:") {
    context.addIssue({ code: "custom", message: "must use the http or https protocol." });
  }
});

const RATE_LIMIT_NUMBER_SCHEMA = z.number({ error: RATE_LIMIT_NUMBER_MESSAGE }).int({ error: RATE_LIMIT_NUMBER_MESSAGE }).min(1, { error: RATE_LIMIT_NUMBER_MESSAGE });

const SENTRY_RUNTIME_CONFIG_SCHEMA = z.object({
  dsn: z.string(),
  environment: z.custom<SentryEnvironment>().optional(),
  disabled: z.boolean({ error: BOOLEAN_MESSAGE }),
});

const PUBLIC_RUNTIME_CONFIG_SCHEMA = z.object({
  defaultLocale: z.enum(LOCALES, { error: "must be one of the supported locales." }),
  sentry: SENTRY_RUNTIME_CONFIG_SCHEMA,
});

const GOAT_IT_API_RUNTIME_CONFIG_SCHEMA = z.object({
  baseUrl: BASE_URL_SCHEMA,
  gameKey: z.string({ error: "must be set." }).trim().min(1, { error: "must be set." }),
});

const RATE_LIMIT_RUNTIME_CONFIG_SCHEMA = z.object({
  maximumRequests: RATE_LIMIT_NUMBER_SCHEMA,
  windowInMs: RATE_LIMIT_NUMBER_SCHEMA,
  trustProxy: z.boolean({ error: BOOLEAN_MESSAGE }),
});

const SECURITY_RUNTIME_CONFIG_SCHEMA = z.object({
  cspMode: z.enum(CSP_MODES, { error: "must be one of the supported modes." }),
});

const LOGGER_RUNTIME_CONFIG_SCHEMA = z.object({
  level: z.enum(LOG_LEVELS, { error: "must be one of the supported levels." }),
});

const APP_RUNTIME_CONFIG_SCHEMA: z.ZodType<AppRuntimeConfig> = z.object({
  goatItApi: GOAT_IT_API_RUNTIME_CONFIG_SCHEMA,
  rateLimit: RATE_LIMIT_RUNTIME_CONFIG_SCHEMA,
  security: SECURITY_RUNTIME_CONFIG_SCHEMA,
  logger: LOGGER_RUNTIME_CONFIG_SCHEMA,
  public: PUBLIC_RUNTIME_CONFIG_SCHEMA,
});

export { APP_RUNTIME_CONFIG_SCHEMA };