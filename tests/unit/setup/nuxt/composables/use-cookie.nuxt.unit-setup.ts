import { mockNuxtImport } from "@nuxt/test-utils/runtime";

import { createUseCookieMockState } from "~~/tests/unit/utils/mocks/composables/nuxt/useCookie/useCookie.mock";
import type { UseCookieMockState } from "~~/tests/unit/utils/mocks/composables/nuxt/useCookie/useCookie.mock";

// Acceptable as useCookie<string | null> requires null as the initial value for the cookie guard
// oxlint-disable-next-line unicorn/no-null
const useCookieMockState: UseCookieMockState<string | null> = createUseCookieMockState<string | null>(null);

mockNuxtImport("useCookie", () => (name: string, options?: Record<string, unknown>) => {
  useCookieMockState.capturedName.current = name;
  useCookieMockState.capturedOptions.current = options;

  return useCookieMockState.cookieRef;
});

export { useCookieMockState };