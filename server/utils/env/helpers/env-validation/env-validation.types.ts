/**
 * Environment flags that change how strictly the runtime configuration is validated.
 */
type ValidateAppRuntimeConfigOptions = {
  /** True on a deployed boot, where the upstream API URL must use HTTPS unless the host is internal. */
  isProduction: boolean;
  /** True when Nuxt test mode (`$test.test`) is enabled and exposed as `import.meta.test`, including the `--envName test` acceptance build. */
  isTest: boolean;
};

export type { ValidateAppRuntimeConfigOptions };