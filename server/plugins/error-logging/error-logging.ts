import { defineNitroPlugin } from "nitropack/runtime";

import { logNitroError } from "#server/utils/logging/helpers/nitro-error-logging/nitro-error-logging.helpers";

export default defineNitroPlugin((nitroApp): void => {
  nitroApp.hooks.hook("error", (nitroError, context) => {
    logNitroError(nitroError, { event: context.event });
  });
});