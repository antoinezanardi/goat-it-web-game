import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frSeo from "~/i18n/locales/fr/seo.json";
import enSeo from "~/i18n/locales/en/seo.json";
import deSeo from "~/i18n/locales/de/seo.json";
import esSeo from "~/i18n/locales/es/seo.json";
import itSeo from "~/i18n/locales/it/seo.json";
import ptSeo from "~/i18n/locales/pt/seo.json";

describe("seo.json translations", () => {
  it.each<[string, typeof frSeo]>([
    ["de", deSeo],
    ["en", enSeo],
    ["es", esSeo],
    ["it", itSeo],
    ["pt", ptSeo],
  ])("should have the same keys in every locale as in french when context is seo.", (_locale, seoTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frSeo)).toSorted();
    const crushedLocaleKeys = Object.keys(crush(seoTranslations)).toSorted();

    expect(crushedLocaleKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});