import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frHome from "~/i18n/locales/fr/home.json";
import enHome from "~/i18n/locales/en/home.json";
import deHome from "~/i18n/locales/de/home.json";
import esHome from "~/i18n/locales/es/home.json";
import itHome from "~/i18n/locales/it/home.json";
import ptHome from "~/i18n/locales/pt/home.json";

describe("home.json translations", () => {
  it.each<[string, typeof frHome]>([
    ["de", deHome],
    ["en", enHome],
    ["es", esHome],
    ["it", itHome],
    ["pt", ptHome],
  ])("should have the same keys in every locale as in french when context is home.", (_locale, homeTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frHome)).toSorted();
    const crushedHomeKeys = Object.keys(crush(homeTranslations)).toSorted();

    expect(crushedHomeKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});