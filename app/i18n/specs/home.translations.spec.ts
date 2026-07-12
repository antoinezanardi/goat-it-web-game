import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frHome from "~/i18n/locales/fr/home.json";
import enHome from "~/i18n/locales/en/home.json";
import deHome from "~/i18n/locales/de/home.json";
import esHome from "~/i18n/locales/es/home.json";
import itHome from "~/i18n/locales/it/home.json";
import ptHome from "~/i18n/locales/pt/home.json";

describe("home.json translations", () => {
  it("should have the same keys in english as in french when context is home.", () => {
    const crushedFrHomeKeys = Object.keys(crush(frHome)).toSorted();
    const crushedEnHomeKeys = Object.keys(crush(enHome)).toSorted();

    expect(crushedEnHomeKeys).toStrictEqual(crushedFrHomeKeys);
  });

  it("should have the same keys in english as in german when context is home.", () => {
    const crushedDeHomeKeys = Object.keys(crush(deHome)).toSorted();
    const crushedEnHomeKeys = Object.keys(crush(enHome)).toSorted();

    expect(crushedEnHomeKeys).toStrictEqual(crushedDeHomeKeys);
  });

  it("should have the same keys in english as in spanish when context is home.", () => {
    const crushedEsHomeKeys = Object.keys(crush(esHome)).toSorted();
    const crushedEnHomeKeys = Object.keys(crush(enHome)).toSorted();

    expect(crushedEnHomeKeys).toStrictEqual(crushedEsHomeKeys);
  });

  it("should have the same keys in english as in italian when context is home.", () => {
    const crushedItHomeKeys = Object.keys(crush(itHome)).toSorted();
    const crushedEnHomeKeys = Object.keys(crush(enHome)).toSorted();

    expect(crushedEnHomeKeys).toStrictEqual(crushedItHomeKeys);
  });

  it("should have the same keys in english as in portuguese when context is home.", () => {
    const crushedPtHomeKeys = Object.keys(crush(ptHome)).toSorted();
    const crushedEnHomeKeys = Object.keys(crush(enHome)).toSorted();

    expect(crushedEnHomeKeys).toStrictEqual(crushedPtHomeKeys);
  });
});