import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUseDocumentVisibilityMock } from "~~/tests/unit/utils/mocks/composables/core/useDocumentVisibility/useDocumentVisibility.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";
import type { UseDocumentVisibilityMock } from "~~/tests/unit/utils/mocks/composables/core/useDocumentVisibility/useDocumentVisibility.mock";

const useDocumentVisibilityMock: MockHolder<UseDocumentVisibilityMock> = {
  instance: createUseDocumentVisibilityMock(),
};

mockNuxtImport("useDocumentVisibility", () => () => useDocumentVisibilityMock.instance.documentVisibilityRef);

beforeEach(() => {
  useDocumentVisibilityMock.instance = createUseDocumentVisibilityMock();
});

export { useDocumentVisibilityMock };