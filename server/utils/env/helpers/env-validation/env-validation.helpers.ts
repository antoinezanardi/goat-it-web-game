import type { z } from "zod";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { createAppRuntimeConfigSchema } from "#server/utils/env/helpers/env-validation/env-validation.schemas";
import type { ValidateAppRuntimeConfigOptions } from "#server/utils/env/helpers/env-validation/env-validation.types";

function formatRuntimeConfigIssues(issues: readonly z.core.$ZodIssue[]): string {
  return issues.map(issue => `Invalid runtime environment: "${issue.path.join(".")}" ${issue.message}`).join("\n");
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