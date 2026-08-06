import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frSeo from "~/i18n/locales/fr/seo.json";
import enSeo from "~/i18n/locales/en/seo.json";
import deSeo from "~/i18n/locales/de/seo.json";
import esSeo from "~/i18n/locales/es/seo.json";
import itSeo from "~/i18n/locales/it/seo.json";
import ptSeo from "~/i18n/locales/pt/seo.json";

describe("seo.json translations", () => {
  it("should have the same keys in english as in french when context is seo.", () => {
    const crushedFrSeoKeys = Object.keys(crush(frSeo)).toSorted();
    const crushedEnSeoKeys = Object.keys(crush(enSeo)).toSorted();

    expect(crushedEnSeoKeys).toStrictEqual(crushedFrSeoKeys);
  });

  it("should have the same keys in english as in german when context is seo.", () => {
    const crushedDeSeoKeys = Object.keys(crush(deSeo)).toSorted();
    const crushedEnSeoKeys = Object.keys(crush(enSeo)).toSorted();

    expect(crushedEnSeoKeys).toStrictEqual(crushedDeSeoKeys);
  });

  it("should have the same keys in english as in spanish when context is seo.", () => {
    const crushedEsSeoKeys = Object.keys(crush(esSeo)).toSorted();
    const crushedEnSeoKeys = Object.keys(crush(enSeo)).toSorted();

    expect(crushedEnSeoKeys).toStrictEqual(crushedEsSeoKeys);
  });

  it("should have the same keys in english as in italian when context is seo.", () => {
    const crushedItSeoKeys = Object.keys(crush(itSeo)).toSorted();
    const crushedEnSeoKeys = Object.keys(crush(enSeo)).toSorted();

    expect(crushedEnSeoKeys).toStrictEqual(crushedItSeoKeys);
  });

  it("should have the same keys in english as in portuguese when context is seo.", () => {
    const crushedPtSeoKeys = Object.keys(crush(ptSeo)).toSorted();
    const crushedEnSeoKeys = Object.keys(crush(enSeo)).toSorted();

    expect(crushedEnSeoKeys).toStrictEqual(crushedPtSeoKeys);
  });
});