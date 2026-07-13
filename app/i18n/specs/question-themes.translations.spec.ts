import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frQuestionThemes from "~/i18n/locales/fr/question-themes.json";
import enQuestionThemes from "~/i18n/locales/en/question-themes.json";
import deQuestionThemes from "~/i18n/locales/de/question-themes.json";
import esQuestionThemes from "~/i18n/locales/es/question-themes.json";
import itQuestionThemes from "~/i18n/locales/it/question-themes.json";
import ptQuestionThemes from "~/i18n/locales/pt/question-themes.json";

describe("question-themes.json translations", () => {
  it("should have the same keys in english as in french when context is question-themes.", () => {
    const crushedFrQuestionThemesKeys = Object.keys(crush(frQuestionThemes)).toSorted();
    const crushedEnQuestionThemesKeys = Object.keys(crush(enQuestionThemes)).toSorted();

    expect(crushedEnQuestionThemesKeys).toStrictEqual(crushedFrQuestionThemesKeys);
  });

  it("should have the same keys in english as in german when context is question-themes.", () => {
    const crushedDeQuestionThemesKeys = Object.keys(crush(deQuestionThemes)).toSorted();
    const crushedEnQuestionThemesKeys = Object.keys(crush(enQuestionThemes)).toSorted();

    expect(crushedEnQuestionThemesKeys).toStrictEqual(crushedDeQuestionThemesKeys);
  });

  it("should have the same keys in english as in spanish when context is question-themes.", () => {
    const crushedEsQuestionThemesKeys = Object.keys(crush(esQuestionThemes)).toSorted();
    const crushedEnQuestionThemesKeys = Object.keys(crush(enQuestionThemes)).toSorted();

    expect(crushedEnQuestionThemesKeys).toStrictEqual(crushedEsQuestionThemesKeys);
  });

  it("should have the same keys in english as in italian when context is question-themes.", () => {
    const crushedItQuestionThemesKeys = Object.keys(crush(itQuestionThemes)).toSorted();
    const crushedEnQuestionThemesKeys = Object.keys(crush(enQuestionThemes)).toSorted();

    expect(crushedEnQuestionThemesKeys).toStrictEqual(crushedItQuestionThemesKeys);
  });

  it("should have the same keys in english as in portuguese when context is question-themes.", () => {
    const crushedPtQuestionThemesKeys = Object.keys(crush(ptQuestionThemes)).toSorted();
    const crushedEnQuestionThemesKeys = Object.keys(crush(enQuestionThemes)).toSorted();

    expect(crushedEnQuestionThemesKeys).toStrictEqual(crushedPtQuestionThemesKeys);
  });
});