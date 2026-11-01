import { z } from "zod";

import { SENTRY_ENVIRONMENTS } from "#shared/constants/runtime-config.constants";
import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { getSentryIngestOrigin } from "#shared/utils/helpers/sentry/ingest/sentry-ingest.helpers";
import { APP_RUNTIME_CONFIG_SCHEMA } from "#server/utils/env/helpers/env-validation/env-validation.schemas";
import type { ValidateAppRuntimeConfigOptions } from "#server/utils/env/helpers/env-validation/env-validation.types";
import { isInternalHostname } from "#server/utils/env/helpers/internal-hostname/internal-hostname.helpers";

function formatRuntimeConfigIssues(issues: readonly z.core.$ZodIssue[]): string {
  return issues.map(issue => `Invalid runtime environment: "${issue.path.join(".")}" ${issue.message}`).join("\n");
}

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

/**
 * Fail-fast validation of the runtime environment, run before the Nitro server accepts traffic.
 *
 * Parses the resolved Nitro runtime config with `APP_RUNTIME_CONFIG_SCHEMA`, so malformed or unsupported values, an
 * insecure production upstream URL, and missing Sentry deployment settings all abort the boot. Every issue names the
 * offending config path; received values are never included.
 *
 * @throws When the config does not match the schema; the server must not continue starting.
 * @returns The parsed configuration; `goatItApi.gameKey` is normalized by trimming.
 * @see docs/security.md
 */
function validateAppRuntimeConfig(config: unknown, options: ValidateAppRuntimeConfigOptions): AppRuntimeConfig {
  const result = createAppRuntimeConfigSchema(options).safeParse(config);

  if (!result.success) {
    throw new Error(formatRuntimeConfigIssues(result.error.issues));
  }
  return result.data;
}

export { validateAppRuntimeConfig };