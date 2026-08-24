import { crush } from "radashi";
import { describe, it, expect } from "vitest";

import frQuestions from "~/i18n/locales/fr/questions.json";
import enQuestions from "~/i18n/locales/en/questions.json";
import deQuestions from "~/i18n/locales/de/questions.json";
import esQuestions from "~/i18n/locales/es/questions.json";
import itQuestions from "~/i18n/locales/it/questions.json";
import ptQuestions from "~/i18n/locales/pt/questions.json";

describe("questions.json translations", () => {
  it.each<[string, typeof frQuestions]>([
    ["de", deQuestions],
    ["en", enQuestions],
    ["es", esQuestions],
    ["it", itQuestions],
    ["pt", ptQuestions],
  ])("should have the same keys in every locale as in french when context is questions.", (_locale, questionsTranslations) => {
    const crushedReferenceKeys = Object.keys(crush(frQuestions)).toSorted();
    const crushedLocaleKeys = Object.keys(crush(questionsTranslations)).toSorted();

    expect(crushedLocaleKeys).toStrictEqual<string[]>(crushedReferenceKeys);
  });
});