import { defineNitroPlugin } from "nitropack/runtime";

import { registerCspNonceHook } from "#server/utils/security/helpers/security-headers/security-headers.helpers";

export default defineNitroPlugin(registerCspNonceHook);