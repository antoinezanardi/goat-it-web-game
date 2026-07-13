import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frErrors from "~/i18n/locales/fr/errors.json";
import enErrors from "~/i18n/locales/en/errors.json";
import deErrors from "~/i18n/locales/de/errors.json";
import esErrors from "~/i18n/locales/es/errors.json";
import itErrors from "~/i18n/locales/it/errors.json";
import ptErrors from "~/i18n/locales/pt/errors.json";

describe("errors.json translations", () => {
  it("should have the same keys in english as in french when context is errors.", () => {
    const crushedFrErrorsKeys = Object.keys(crush(frErrors)).toSorted();
    const crushedEnErrorsKeys = Object.keys(crush(enErrors)).toSorted();

    expect(crushedEnErrorsKeys).toStrictEqual(crushedFrErrorsKeys);
  });

  it("should have the same keys in english as in german when context is errors.", () => {
    const crushedDeErrorsKeys = Object.keys(crush(deErrors)).toSorted();
    const crushedEnErrorsKeys = Object.keys(crush(enErrors)).toSorted();

    expect(crushedEnErrorsKeys).toStrictEqual(crushedDeErrorsKeys);
  });

  it("should have the same keys in english as in spanish when context is errors.", () => {
    const crushedEsErrorsKeys = Object.keys(crush(esErrors)).toSorted();
    const crushedEnErrorsKeys = Object.keys(crush(enErrors)).toSorted();

    expect(crushedEnErrorsKeys).toStrictEqual(crushedEsErrorsKeys);
  });

  it("should have the same keys in english as in italian when context is errors.", () => {
    const crushedItErrorsKeys = Object.keys(crush(itErrors)).toSorted();
    const crushedEnErrorsKeys = Object.keys(crush(enErrors)).toSorted();

    expect(crushedEnErrorsKeys).toStrictEqual(crushedItErrorsKeys);
  });

  it("should have the same keys in english as in portuguese when context is errors.", () => {
    const crushedPtErrorsKeys = Object.keys(crush(ptErrors)).toSorted();
    const crushedEnErrorsKeys = Object.keys(crush(enErrors)).toSorted();

    expect(crushedEnErrorsKeys).toStrictEqual(crushedPtErrorsKeys);
  });
});