import { getCookie } from "h3";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";

import { CookieNames } from "#shared/enums/cookie.enums";
import { resolveCookieLocale } from "#shared/utils/helpers/locale/locale.helpers";

/**
 * Resolves the locale to forward upstream from the locale cookie only, falling back to `defaultLocale`.
 *
 * The incoming `Accept-Language` header is deliberately ignored so the client controls its own preference.
 */
function extractLocaleFromEvent(event: H3Event, defaultLocale: Locale): Locale {
  return resolveCookieLocale(getCookie(event, CookieNames.LOCALE), defaultLocale);
}

export { extractLocaleFromEvent };