import type { Locale } from "@goat-it/schemas/shared/locale";
import { getCookie } from "h3";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { extractLocaleFromEvent } from "#server/utils/goat-it-api/helpers/goat-it-api-locale/goat-it-api-locale.helpers";

const mockedEvent = createFakeH3Event();

describe(extractLocaleFromEvent, () => {
  beforeEach(() => {
    vi.mocked(getCookie).mockReturnValue(undefined);
  });

  it("should return cookie locale when goat_it_locale cookie is valid.", () => {
    vi.mocked(getCookie).mockReturnValue("fr");

    const locale = extractLocaleFromEvent(mockedEvent, "en");

    expect(locale).toBe("fr");
  });

  it.each<{ cookieValue: string; defaultLocale: Locale; expectedLocale: Locale; description: string }>([
    { cookieValue: "", defaultLocale: "en", expectedLocale: "en", description: "an empty string" },
    { cookieValue: "FR", defaultLocale: "en", expectedLocale: "en", description: "an uppercase locale code" },
    { cookieValue: "ja", defaultLocale: "en", expectedLocale: "en", description: "an unsupported locale" },
    { cookieValue: "garbage", defaultLocale: "en", expectedLocale: "en", description: "a garbage value" },
    { cookieValue: "", defaultLocale: "fr", expectedLocale: "fr", description: "an empty string" },
    { cookieValue: "FR", defaultLocale: "fr", expectedLocale: "fr", description: "an uppercase locale code" },
    { cookieValue: "ja", defaultLocale: "fr", expectedLocale: "fr", description: "an unsupported locale" },
    { cookieValue: "garbage", defaultLocale: "fr", expectedLocale: "fr", description: "a garbage value" },
  ])("should fall back to the $defaultLocale default locale when goat_it_locale cookie is $description.", ({ cookieValue, defaultLocale, expectedLocale }) => {
    vi.mocked(getCookie).mockReturnValue(cookieValue);

    const locale = extractLocaleFromEvent(mockedEvent, defaultLocale);

    expect(locale).toBe(expectedLocale);
  });

  it.each<{ defaultLocale: Locale; expectedLocale: Locale; description: string }>([
    { defaultLocale: "en", expectedLocale: "en", description: "the en default locale" },
    { defaultLocale: "fr", expectedLocale: "fr", description: "the fr default locale" },
  ])("should fall back to the $defaultLocale default locale when cookie is missing.", ({ defaultLocale, expectedLocale }) => {
    const locale = extractLocaleFromEvent(mockedEvent, defaultLocale);

    expect(locale).toBe(expectedLocale);
  });

  it("should read the goat_it_locale cookie when resolving the locale from the event.", () => {
    extractLocaleFromEvent(mockedEvent, "en");

    expect(getCookie).toHaveBeenCalledExactlyOnceWith(mockedEvent, "goat_it_locale");
  });
});