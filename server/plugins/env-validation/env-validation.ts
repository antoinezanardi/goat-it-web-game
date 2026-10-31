import { defineNitroPlugin } from "nitropack/runtime";

import { validateAppRuntimeConfig } from "#server/utils/env/helpers/env-validation/env-validation.helpers";

export default defineNitroPlugin((): void => {
  if (import.meta.prerender === true) {
    return;
  }

  validateAppRuntimeConfig(useRuntimeConfig(), { isProduction: !import.meta.dev });
});