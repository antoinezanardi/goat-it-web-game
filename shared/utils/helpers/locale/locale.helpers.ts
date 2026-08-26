import { isValidLocale } from "@goat-it/schemas/shared/locale";
import type { Locale } from "@goat-it/schemas/shared/locale";

function resolveCookieLocale(cookieValue: string | undefined, defaultLocale: Locale): Locale {
  if (cookieValue !== undefined && isValidLocale(cookieValue)) {
    return cookieValue;
  }
  return defaultLocale;
}

function resolveSuggestedLocale(browserLanguages: readonly string[]): Locale | null {
  for (const browserLanguage of browserLanguages) {
    if (isValidLocale(browserLanguage)) {
      return browserLanguage;
    }

    const baseLanguage = browserLanguage.split("-").shift();
    if (baseLanguage !== undefined && isValidLocale(baseLanguage)) {
      return baseLanguage;
    }
  }
  // Acceptable as the function must return null when no valid locale is found in the browser language list
  // oxlint-disable-next-line unicorn/no-null
  return null;
}

export {
  resolveCookieLocale,
  resolveSuggestedLocale,
};