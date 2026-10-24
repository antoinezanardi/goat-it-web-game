import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { beforeEach } from "vitest";

import { createUsePreferredLanguagesMock } from "~~/tests/unit/utils/mocks/composables/core/usePreferredLanguages/usePreferredLanguages.mock";
import type { UsePreferredLanguagesMock } from "~~/tests/unit/utils/mocks/composables/core/usePreferredLanguages/usePreferredLanguages.mock";
import type { MockHolder } from "~~/tests/unit/utils/types/mock.types";

const usePreferredLanguagesMock: MockHolder<UsePreferredLanguagesMock> = {
  instance: createUsePreferredLanguagesMock(),
};

mockNuxtImport("usePreferredLanguages", () => () => usePreferredLanguagesMock.instance.preferredLanguagesRef);

beforeEach(() => {
  usePreferredLanguagesMock.instance = createUsePreferredLanguagesMock();
});

export { usePreferredLanguagesMock };