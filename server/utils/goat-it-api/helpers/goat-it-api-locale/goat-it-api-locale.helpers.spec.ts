import { getCookie } from "h3";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { createFakeH3Event } from "~~/tests/unit/utils/faketories/shared/h3/h3-event.faketory";

import { extractLocaleFromEvent } from "#server/utils/goat-it-api/helpers/goat-it-api-locale/goat-it-api-locale.helpers";

const mockedEvent = createFakeH3Event();

describe(extractLocaleFromEvent, () => {
  beforeEach(() => {
    vi.mocked(getCookie).mockReturnValue(undefined);
  });

  it("should return cookie locale when i18n_redirected cookie is valid.", () => {
    vi.mocked(getCookie).mockReturnValue("fr");

    const locale = extractLocaleFromEvent(mockedEvent, "en");

    expect(locale).toBe("fr");
  });

  it.each<{ cookieValue: string; description: string }>([
    { cookieValue: "", description: "an empty string" },
    { cookieValue: "FR", description: "an uppercase locale code" },
    { cookieValue: "ja", description: "an unsupported locale" },
    { cookieValue: "garbage", description: "a garbage value" },
  ])("should fall back to default locale when i18n_redirected cookie is $description.", ({ cookieValue }) => {
    vi.mocked(getCookie).mockReturnValue(cookieValue);

    const locale = extractLocaleFromEvent(mockedEvent, "en");

    expect(locale).toBe("en");
  });

  it("should fall back to default locale when cookie is missing.", () => {
    const locale = extractLocaleFromEvent(mockedEvent, "en");

    expect(locale).toBe("en");
  });

  it("should fall back to the provided default locale when cookie is missing and the default locale is fr.", () => {
    const locale = extractLocaleFromEvent(mockedEvent, "fr");

    expect(locale).toBe("fr");
  });

  it.each<{ cookieValue: string; description: string }>([
    { cookieValue: "", description: "an empty string" },
    { cookieValue: "FR", description: "an uppercase locale code" },
    { cookieValue: "ja", description: "an unsupported locale" },
    { cookieValue: "garbage", description: "a garbage value" },
  ])("should fall back to the provided fr default locale when i18n_redirected cookie is $description.", ({ cookieValue }) => {
    vi.mocked(getCookie).mockReturnValue(cookieValue);

    const locale = extractLocaleFromEvent(mockedEvent, "fr");

    expect(locale).toBe("fr");
  });
});