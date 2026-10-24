import { isValidLocale } from "@goat-it/schemas/shared/locale";
import type { Locale } from "@goat-it/schemas/shared/locale";

/**
 * Returns the locale stored in the cookie when it is supported, otherwise the default locale.
 */
function resolveCookieLocale(cookieValue: string | undefined, defaultLocale: Locale): Locale {
  if (cookieValue !== undefined && isValidLocale(cookieValue)) {
    return cookieValue;
  }
  return defaultLocale;
}

/**
 * Returns the first browser language that maps to a supported locale, falling back to its base language (`fr-CA` becomes `fr`).
 *
 * Returns `undefined` when no supported locale matches.
 */
function resolveSuggestedLocale(browserLanguages: readonly string[]): Locale | undefined {
  for (const browserLanguage of browserLanguages) {
    if (isValidLocale(browserLanguage)) {
      return browserLanguage;
    }

    const baseLanguage = browserLanguage.split("-").shift();
    if (baseLanguage !== undefined && isValidLocale(baseLanguage)) {
      return baseLanguage;
    }
  }
  return undefined;
}

export {
  resolveCookieLocale,
  resolveSuggestedLocale,
};