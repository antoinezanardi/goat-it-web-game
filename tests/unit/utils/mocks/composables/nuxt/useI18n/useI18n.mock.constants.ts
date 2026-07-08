import type { SupportedMockedLocale, SupportedLocaleCodeForMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useI18n/useI18n.mock.types";

const DEFAULT_MOCKED_LOCALE = "en" as const satisfies SupportedLocaleCodeForMock;

const MOCKED_LOCALE_CODES = [
  "de",
  "en",
  "es",
  "fr",
  "it",
  "pt",
] as const satisfies readonly SupportedLocaleCodeForMock[];

const MOCKED_LOCALES = [
  {
    code: "de",
    name: "Deutsch",
    dir: "ltr",
  },
  {
    code: "en",
    name: "English",
    dir: "ltr",
  },
  {
    code: "es",
    name: "Español",
    dir: "ltr",
  },
  {
    code: "fr",
    name: "Français",
    dir: "ltr",
  },
  {
    code: "it",
    name: "Italiano",
    dir: "ltr",
  },
  {
    code: "pt",
    name: "Português",
    dir: "ltr",
  },
] as const satisfies readonly SupportedMockedLocale[];

export {
  DEFAULT_MOCKED_LOCALE,
  MOCKED_LOCALE_CODES,
  MOCKED_LOCALES,
};