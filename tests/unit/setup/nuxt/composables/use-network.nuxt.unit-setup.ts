import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseNetworkMock, createUseNetworkReturn } from "~~/tests/unit/utils/mocks/composables/core/useNetwork/useNetwork.mock";
import type { UseNetworkMock } from "~~/tests/unit/utils/mocks/composables/core/useNetwork/useNetwork.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

const useNetworkMock: MockHolder<UseNetworkMock> = {
  instance: createUseNetworkMock(),
};

mockNuxtImport("useNetwork", () => () => createUseNetworkReturn(useNetworkMock.instance));

beforeEach(() => {
  useNetworkMock.instance = createUseNetworkMock();
});

export { useNetworkMock };