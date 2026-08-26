import { getCookie } from "h3";
import type { Locale } from "@goat-it/schemas/shared/locale";
import { defineNitroPlugin } from "nitropack/runtime";

import { resolveCookieLocale } from "#shared/utils/helpers/locale/locale.helpers";

type NuxtI18nContext = {
  vueI18nOptions: { defaultLocale: Locale };
  detectLocale: Locale;
};

export default defineNitroPlugin(nitro => {
  nitro.hooks.hook("render:before", context => {
    const { event } = context;
    // Acceptable as H3 event context types dynamic module properties as any; @nuxtjs/i18n populates this before this hook
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    const nuxtI18n: NuxtI18nContext | undefined = event.context.nuxtI18n;

    if (nuxtI18n === undefined) {
      return;
    }

    const { defaultLocale } = nuxtI18n.vueI18nOptions;
    // Acceptable as detectLocale is a known property set by @nuxtjs/i18n's own render:before hook
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    nuxtI18n.detectLocale = resolveCookieLocale(getCookie(event, "i18n_redirected"), defaultLocale);
  });
});