import { mockNuxtImport } from "@nuxt/test-utils/runtime";

import { createUseCookieMockState } from "~~/tests/unit/utils/mocks/composables/nuxt/useCookie/useCookie.mock";
import type { UseCookieMockState } from "~~/tests/unit/utils/mocks/composables/nuxt/useCookie/useCookie.mock";

type UseCookieMockPayload = string | boolean | number | Record<string, unknown> | null | undefined;

const useCookieMockState: UseCookieMockState<UseCookieMockPayload> = createUseCookieMockState<UseCookieMockPayload>(null);

mockNuxtImport("useCookie", () => (name: string, options?: Record<string, unknown>) => {
  useCookieMockState.capturedName.current = name;
  useCookieMockState.capturedOptions.current = options;

  return useCookieMockState.cookieRef;
});

export { useCookieMockState };