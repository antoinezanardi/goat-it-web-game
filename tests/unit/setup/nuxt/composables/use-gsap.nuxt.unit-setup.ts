import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";
import type { UseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";

const USE_GSAP_MOCK: { current: UseGSAPMock } = { current: createUseGSAPMock() };

// Acceptable as mock factory return type is inferred from createUseGSAPMock
// oxlint-disable-next-line typescript/explicit-function-return-type
mockNuxtImport("useGSAP", () => () => {
  USE_GSAP_MOCK.current = createUseGSAPMock();

  return {
    context: USE_GSAP_MOCK.current.context,
    set: USE_GSAP_MOCK.current.set,
    timeline: USE_GSAP_MOCK.current.timeline,
  };
});

beforeEach(() => {
  USE_GSAP_MOCK.current = createUseGSAPMock();
});

export { USE_GSAP_MOCK };