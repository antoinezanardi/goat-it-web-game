import { vi } from "vitest";
import { ref } from "vue";
import type { Ref } from "vue";

import type { SupportedLocaleCodeForMock, SupportedMockedLocale } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.types";
import { DEFAULT_MOCKED_LOCALE, MOCKED_LOCALE_CODES, MOCKED_LOCALES } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.constants";
import type { ToMock } from "~~/tests/unit/utils/types/mock.types";

type UseI18nStub = {
  t: (key: string) => string;
  te: (key: string) => boolean;
  locale: Ref<SupportedLocaleCodeForMock>;
  localeCodes: Ref<SupportedLocaleCodeForMock[]>;
  locales: Ref<SupportedMockedLocale[]>;
  setLocale: (locale: Ref<SupportedLocaleCodeForMock>) => void;
};

type UseI18nMock = ToMock<UseI18nStub>;

/**
 * Creates a mock implementation of the `useI18n` composable for unit testing purposes.
 * Can only be used from unit tests setup functions.
 */
function createUseI18nMock(): UseI18nMock {
  return {
    t: vi.fn<UseI18nStub["t"]>((key: string) => key),
    te: vi.fn<UseI18nStub["te"]>(() => false),
    locale: ref<SupportedLocaleCodeForMock>(DEFAULT_MOCKED_LOCALE),
    localeCodes: ref([...MOCKED_LOCALE_CODES]),
    locales: ref<SupportedMockedLocale[]>([...MOCKED_LOCALES]),
    setLocale: vi.fn<UseI18nStub["setLocale"]>(),
  };
}

export type { UseI18nMock };

export { createUseI18nMock };