import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseOverlayMock } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseOverlayMock } from "~~/tests/unit/utils/mocks/composables/nuxt-ui/useOverlay/useOverlay.mock";

const useOverlayMock: MockHolder<UseOverlayMock> = { instance: createUseOverlayMock() };

mockNuxtImport("useOverlay", () => () => useOverlayMock.instance);

beforeEach(() => {
  useOverlayMock.instance = createUseOverlayMock();
});

export { useOverlayMock };