import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frDocs from "~/i18n/locales/fr/docs.json";
import enDocs from "~/i18n/locales/en/docs.json";
import deDocs from "~/i18n/locales/de/docs.json";
import esDocs from "~/i18n/locales/es/docs.json";
import itDocs from "~/i18n/locales/it/docs.json";
import ptDocs from "~/i18n/locales/pt/docs.json";

describe("docs.json translations", () => {
  it("should have the same keys in english as in french when context is docs.", () => {
    const crushedFrDocsKeys = Object.keys(crush(frDocs)).toSorted();
    const crushedEnDocsKeys = Object.keys(crush(enDocs)).toSorted();

    expect(crushedEnDocsKeys).toStrictEqual(crushedFrDocsKeys);
  });

  it("should have the same keys in english as in german when context is docs.", () => {
    const crushedDeDocsKeys = Object.keys(crush(deDocs)).toSorted();
    const crushedEnDocsKeys = Object.keys(crush(enDocs)).toSorted();

    expect(crushedEnDocsKeys).toStrictEqual(crushedDeDocsKeys);
  });

  it("should have the same keys in english as in spanish when context is docs.", () => {
    const crushedEsDocsKeys = Object.keys(crush(esDocs)).toSorted();
    const crushedEnDocsKeys = Object.keys(crush(enDocs)).toSorted();

    expect(crushedEnDocsKeys).toStrictEqual(crushedEsDocsKeys);
  });

  it("should have the same keys in english as in italian when context is docs.", () => {
    const crushedItDocsKeys = Object.keys(crush(itDocs)).toSorted();
    const crushedEnDocsKeys = Object.keys(crush(enDocs)).toSorted();

    expect(crushedEnDocsKeys).toStrictEqual(crushedItDocsKeys);
  });

  it("should have the same keys in english as in portuguese when context is docs.", () => {
    const crushedPtDocsKeys = Object.keys(crush(ptDocs)).toSorted();
    const crushedEnDocsKeys = Object.keys(crush(enDocs)).toSorted();

    expect(crushedEnDocsKeys).toStrictEqual(crushedPtDocsKeys);
  });
});