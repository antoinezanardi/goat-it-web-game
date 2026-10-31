import { LOCALES } from "@goat-it/schemas/shared/locale";
import { z } from "zod";

import { CSP_MODES, LOG_LEVELS, SENTRY_ENVIRONMENTS } from "#shared/constants/runtime-config.constants";
import type { AppRuntimeConfig, SentryEnvironment } from "#shared/types/runtime-config.types";
import { getSentryIngestOrigin } from "#shared/utils/helpers/sentry/ingest/sentry-ingest.helpers";
import type { ValidateAppRuntimeConfigOptions } from "#server/utils/env/helpers/env-validation/env-validation.types";
import { isInternalHostname } from "#server/utils/env/helpers/internal-hostname/internal-hostname.helpers";

const INVALID_URL_MESSAGE = "must be a valid URL.";
const RATE_LIMIT_NUMBER_MESSAGE = "must be an integer greater than or equal to 1.";
const BOOLEAN_MESSAGE = "must be a boolean.";

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

function addProductionBaseUrlIssues(baseUrl: string, context: z.RefinementCtx): void {
  if (!z.url().safeParse(baseUrl).success) {
    return;
  }

  const { protocol, hostname } = new URL(baseUrl);
  if (protocol !== "http:" && protocol !== "https:") {
    return;
  }

  if (protocol !== "https:" && !isInternalHostname(hostname)) {
    context.addIssue({ code: "custom", path: ["goatItApi", "baseUrl"], message: "must use https in production." });
  }
}

function addProductionSentryIssues(sentry: AppRuntimeConfig["public"]["sentry"], context: z.RefinementCtx): void {
  if (sentry.disabled) {
    return;
  }

  if (sentry.environment === undefined || !SENTRY_ENVIRONMENTS.includes(sentry.environment)) {
    context.addIssue({
      code: "custom",
      path: ["public", "sentry", "environment"],
      message: "must be production or staging for a deployed build.",
    });
  }

  if (getSentryIngestOrigin(sentry.dsn) === undefined) {
    context.addIssue({
      code: "custom",
      path: ["public", "sentry", "dsn"],
      message: "must be a valid https Sentry ingest URL for a deployed build.",
    });
  }
}

/**
 * Builds the boot-validation schema, adding the rules that only apply to deployed builds.
 *
 * Internal and loopback hosts keep working over HTTP in production, and Sentry requirements are skipped when error
 * tracking is disabled.
 */
function createAppRuntimeConfigSchema({ isProduction }: ValidateAppRuntimeConfigOptions): z.ZodType<AppRuntimeConfig> {
  return APP_RUNTIME_CONFIG_SCHEMA.superRefine((config, context) => {
    if (!isProduction) {
      return;
    }

    addProductionBaseUrlIssues(config.goatItApi.baseUrl, context);
    addProductionSentryIssues(config.public.sentry, context);
  });
}

export {
  APP_RUNTIME_CONFIG_SCHEMA,
  createAppRuntimeConfigSchema,
};