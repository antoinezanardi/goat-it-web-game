import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frDocs from "~/i18n/locales/fr/docs.json";
import enDocs from "~/i18n/locales/en/docs.json";
import deDocs from "~/i18n/locales/de/docs.json";
import esDocs from "~/i18n/locales/es/docs.json";
import itDocs from "~/i18n/locales/it/docs.json";
import ptDocs from "~/i18n/locales/pt/docs.json";

describe("docs.json translations", () => {
  it.each<[string, typeof frDocs]>([
    ["de", deDocs],
    ["en", enDocs],
    ["es", esDocs],
    ["it", itDocs],
    ["pt", ptDocs],
  ])("should have the same keys in every locale as in french when context is docs.", (_locale, docsTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frDocs)).toSorted();
    const crushedDocsKeys = Object.keys(crush(docsTranslations)).toSorted();

    expect(crushedDocsKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});