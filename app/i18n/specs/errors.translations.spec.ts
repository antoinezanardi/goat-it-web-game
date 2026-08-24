import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frErrors from "~/i18n/locales/fr/errors.json";
import enErrors from "~/i18n/locales/en/errors.json";
import deErrors from "~/i18n/locales/de/errors.json";
import esErrors from "~/i18n/locales/es/errors.json";
import itErrors from "~/i18n/locales/it/errors.json";
import ptErrors from "~/i18n/locales/pt/errors.json";

describe("errors.json translations", () => {
  it.each<[string, typeof frErrors]>([
    ["de", deErrors],
    ["en", enErrors],
    ["es", esErrors],
    ["it", itErrors],
    ["pt", ptErrors],
  ])("should have the same keys in every locale as in french when context is errors.", (_locale, errorsTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frErrors)).toSorted();
    const crushedErrorsKeys = Object.keys(crush(errorsTranslations)).toSorted();

    expect(crushedErrorsKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});