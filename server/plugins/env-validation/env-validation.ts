import { defineNitroPlugin } from "nitropack/runtime";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";
import { validateAppRuntimeConfig } from "#server/utils/env/helpers/env-validation.helpers";

export default defineNitroPlugin((): void => {
  // Acceptable as the NitroRuntimeConfig type does not expose custom runtimeConfig keys
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const config = useRuntimeConfig() as unknown as AppRuntimeConfig;

  validateAppRuntimeConfig(config, { isProduction: !import.meta.dev });
});