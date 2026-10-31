/**
 * Environment flags that change how strictly the runtime configuration is validated.
 */
type ValidateAppRuntimeConfigOptions = {
  /** True on a deployed boot, where the upstream API URL must use HTTPS unless the host is internal. */
  isProduction: boolean;
};

export type { ValidateAppRuntimeConfigOptions };