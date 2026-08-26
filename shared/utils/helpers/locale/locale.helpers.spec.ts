import { describe, it, expect } from "vitest";

import { resolveCookieLocale, resolveSuggestedLocale } from "#shared/utils/helpers/locale/locale.helpers";

describe(resolveCookieLocale, () => {
  it.each<{ cookieValue: string | undefined; expected: string; description: string }>([
    { cookieValue: "fr", expected: "fr", description: "a valid supported locale" },
    { cookieValue: undefined, expected: "en", description: "undefined" },
    { cookieValue: "", expected: "en", description: "an empty string" },
    { cookieValue: "FR", expected: "en", description: "an uppercase locale code" },
    { cookieValue: "ja", expected: "en", description: "an unsupported locale" },
    { cookieValue: "garbage", expected: "en", description: "a garbage value" },
  ])("should return '$expected' when cookie value is $description.", ({ cookieValue, expected }) => {
    expect(resolveCookieLocale(cookieValue, "en")).toBe(expected);
  });
});

describe(resolveSuggestedLocale, () => {
  it.each<{ browserLanguages: string[]; expected: string | undefined; description: string }>([
    { browserLanguages: ["fr"], expected: "fr", description: "an exact supported locale code" },
    { browserLanguages: ["fr-FR", "fr"], expected: "fr", description: "a region subtag resolvable to a supported base code" },
    { browserLanguages: ["pt-BR"], expected: "pt", description: "a Brazilian Portuguese preference resolvable to pt" },
    { browserLanguages: ["de-DE", "fr-FR"], expected: "de", description: "a list where the first resolvable preference wins" },
    { browserLanguages: ["ja-JP", "ja"], expected: undefined, description: "a list with only unsupported locales" },
    { browserLanguages: [], expected: undefined, description: "an empty list" },
  ])("should return '$expected' when browser languages are $description.", ({ browserLanguages, expected }) => {
    expect(resolveSuggestedLocale(browserLanguages)).toBe(expected);
  });
});