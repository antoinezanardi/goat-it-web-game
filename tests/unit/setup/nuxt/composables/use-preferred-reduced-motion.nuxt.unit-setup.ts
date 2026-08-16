import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUsePreferredReducedMotionMock } from "~~/tests/unit/utils/mocks/composables/core/usePreferredReducedMotion/usePreferredReducedMotion.mock";
import type { UsePreferredReducedMotionMock } from "~~/tests/unit/utils/mocks/composables/core/usePreferredReducedMotion/usePreferredReducedMotion.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

const usePreferredReducedMotionMock: MockHolder<UsePreferredReducedMotionMock> = {
  instance: createUsePreferredReducedMotionMock(),
};

mockNuxtImport("usePreferredReducedMotion", () => () => usePreferredReducedMotionMock.instance.preferredReducedMotionRef);

beforeEach(() => {
  usePreferredReducedMotionMock.instance = createUsePreferredReducedMotionMock();
});

export { usePreferredReducedMotionMock };