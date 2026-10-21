import { getCookie } from "h3";
import type { Locale } from "@goat-it/schemas/shared/locale";
import type { H3Event } from "h3";

import { CookieNames } from "#shared/enums/cookie.enums";
import { resolveCookieLocale } from "#shared/utils/helpers/locale/locale.helpers";

function extractLocaleFromEvent(event: H3Event, defaultLocale: Locale): Locale {
  return resolveCookieLocale(getCookie(event, CookieNames.LOCALE), defaultLocale);
}

export { extractLocaleFromEvent };