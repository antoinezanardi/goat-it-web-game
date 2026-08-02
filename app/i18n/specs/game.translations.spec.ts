import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frGame from "~/i18n/locales/fr/game.json";
import enGame from "~/i18n/locales/en/game.json";
import deGame from "~/i18n/locales/de/game.json";
import esGame from "~/i18n/locales/es/game.json";
import itGame from "~/i18n/locales/it/game.json";
import ptGame from "~/i18n/locales/pt/game.json";

describe("game.json translations", () => {
  it("should have the same keys in english as in french when context is game.", () => {
    const crushedFrGameKeys = Object.keys(crush(frGame)).toSorted();
    const crushedEnGameKeys = Object.keys(crush(enGame)).toSorted();

    expect(crushedEnGameKeys).toStrictEqual(crushedFrGameKeys);
  });

  it("should have the same keys in english as in german when context is game.", () => {
    const crushedDeGameKeys = Object.keys(crush(deGame)).toSorted();
    const crushedEnGameKeys = Object.keys(crush(enGame)).toSorted();

    expect(crushedEnGameKeys).toStrictEqual(crushedDeGameKeys);
  });

  it("should have the same keys in english as in spanish when context is game.", () => {
    const crushedEsGameKeys = Object.keys(crush(esGame)).toSorted();
    const crushedEnGameKeys = Object.keys(crush(enGame)).toSorted();

    expect(crushedEnGameKeys).toStrictEqual(crushedEsGameKeys);
  });

  it("should have the same keys in english as in italian when context is game.", () => {
    const crushedItGameKeys = Object.keys(crush(itGame)).toSorted();
    const crushedEnGameKeys = Object.keys(crush(enGame)).toSorted();

    expect(crushedEnGameKeys).toStrictEqual(crushedItGameKeys);
  });

  it("should have the same keys in english as in portuguese when context is game.", () => {
    const crushedPtGameKeys = Object.keys(crush(ptGame)).toSorted();
    const crushedEnGameKeys = Object.keys(crush(enGame)).toSorted();

    expect(crushedEnGameKeys).toStrictEqual(crushedPtGameKeys);
  });
});