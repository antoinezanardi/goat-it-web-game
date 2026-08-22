import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frQuestionThemes from "~/i18n/locales/fr/question-themes.json";
import enQuestionThemes from "~/i18n/locales/en/question-themes.json";
import deQuestionThemes from "~/i18n/locales/de/question-themes.json";
import esQuestionThemes from "~/i18n/locales/es/question-themes.json";
import itQuestionThemes from "~/i18n/locales/it/question-themes.json";
import ptQuestionThemes from "~/i18n/locales/pt/question-themes.json";

describe("question-themes.json translations", () => {
  it.each<[string, typeof frQuestionThemes]>([
    ["de", deQuestionThemes],
    ["en", enQuestionThemes],
    ["es", esQuestionThemes],
    ["it", itQuestionThemes],
    ["pt", ptQuestionThemes],
  ])("should have the same keys in every locale as in french when context is question-themes.", (_locale, questionThemesTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frQuestionThemes)).toSorted();
    const crushedQuestionThemesKeys = Object.keys(crush(questionThemesTranslations)).toSorted();

    expect(crushedQuestionThemesKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});