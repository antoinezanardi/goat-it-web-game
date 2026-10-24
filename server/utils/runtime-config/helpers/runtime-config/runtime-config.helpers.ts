import type { H3Event } from "h3";

import type { AppRuntimeConfig } from "#shared/types/runtime-config.types";

/**
 * Reads the Nitro runtime config for the given event as the app's typed configuration.
 *
 * Values are validated at boot by `validateAppRuntimeConfig`; this helper only narrows the Nitro shape.
 */
function getRuntimeConfig(event: H3Event): AppRuntimeConfig {
  // Acceptable as the NitroRuntimeConfig type does not expose custom runtimeConfig keys
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return useRuntimeConfig(event) as unknown as AppRuntimeConfig;
}

export { getRuntimeConfig };