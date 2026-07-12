import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frCommon from "~/i18n/locales/fr/common.json";
import enCommon from "~/i18n/locales/en/common.json";
import deCommon from "~/i18n/locales/de/common.json";
import esCommon from "~/i18n/locales/es/common.json";
import itCommon from "~/i18n/locales/it/common.json";
import ptCommon from "~/i18n/locales/pt/common.json";

describe("common.json translations", () => {
  it("should have the same keys in english as in french when context is common.", () => {
    const crushedFrCommonKeys = Object.keys(crush(frCommon)).toSorted();
    const crushedEnCommonKeys = Object.keys(crush(enCommon)).toSorted();

    expect(crushedEnCommonKeys).toStrictEqual(crushedFrCommonKeys);
  });

  it("should have the same keys in english as in german when context is common.", () => {
    const crushedDeCommonKeys = Object.keys(crush(deCommon)).toSorted();
    const crushedEnCommonKeys = Object.keys(crush(enCommon)).toSorted();

    expect(crushedEnCommonKeys).toStrictEqual(crushedDeCommonKeys);
  });

  it("should have the same keys in english as in spanish when context is common.", () => {
    const crushedEsCommonKeys = Object.keys(crush(esCommon)).toSorted();
    const crushedEnCommonKeys = Object.keys(crush(enCommon)).toSorted();

    expect(crushedEnCommonKeys).toStrictEqual(crushedEsCommonKeys);
  });

  it("should have the same keys in english as in italian when context is common.", () => {
    const crushedItCommonKeys = Object.keys(crush(itCommon)).toSorted();
    const crushedEnCommonKeys = Object.keys(crush(enCommon)).toSorted();

    expect(crushedEnCommonKeys).toStrictEqual(crushedItCommonKeys);
  });

  it("should have the same keys in english as in portuguese when context is common.", () => {
    const crushedPtCommonKeys = Object.keys(crush(ptCommon)).toSorted();
    const crushedEnCommonKeys = Object.keys(crush(enCommon)).toSorted();

    expect(crushedEnCommonKeys).toStrictEqual(crushedPtCommonKeys);
  });
});