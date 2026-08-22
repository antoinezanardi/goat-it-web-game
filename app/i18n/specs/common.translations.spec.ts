import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frCommon from "~/i18n/locales/fr/common.json";
import enCommon from "~/i18n/locales/en/common.json";
import deCommon from "~/i18n/locales/de/common.json";
import esCommon from "~/i18n/locales/es/common.json";
import itCommon from "~/i18n/locales/it/common.json";
import ptCommon from "~/i18n/locales/pt/common.json";

describe("common.json translations", () => {
  it.each<[string, typeof frCommon]>([
    ["de", deCommon],
    ["en", enCommon],
    ["es", esCommon],
    ["it", itCommon],
    ["pt", ptCommon],
  ])("should have the same keys in every locale as in french when context is common.", (_locale, commonTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frCommon)).toSorted();
    const crushedCommonKeys = Object.keys(crush(commonTranslations)).toSorted();

    expect(crushedCommonKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});