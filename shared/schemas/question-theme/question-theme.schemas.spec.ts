import { describe, it, expect } from "vitest";
import { ZodError } from "zod";

import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeTransport } from "~~/tests/unit/utils/faketories/question-theme/question-theme.transport.faketory";

import { QUESTION_THEME_SCHEMA, QUESTION_THEMES_SCHEMA } from "#shared/schemas/question-theme/question-theme.schemas";

describe("QUESTION_THEME_SCHEMA parsing", () => {
  it("should return a question theme with date instances when given a JSON-transported question theme.", () => {
    const questionTheme = createFakeQuestionTheme();

    expect(QUESTION_THEME_SCHEMA.parse(createFakeQuestionThemeTransport(questionTheme))).toStrictEqual(questionTheme);
  });

  it("should throw a ZodError when given a question theme with an unknown key.", () => {
    const questionThemeTransport = createFakeQuestionThemeTransport(createFakeQuestionTheme());

    expect(() => QUESTION_THEME_SCHEMA.parse({ ...questionThemeTransport, unknownKey: "value" })).toThrow(ZodError);
  });

  it("should throw a ZodError when given a question theme with an invalid shape.", () => {
    expect(() => QUESTION_THEME_SCHEMA.parse({})).toThrow(ZodError);
  });
});

describe("QUESTION_THEMES_SCHEMA parsing", () => {
  it("should return question themes with date instances when given JSON-transported question themes.", () => {
    const questionThemes = [createFakeQuestionTheme(), createFakeQuestionTheme()];

    expect(QUESTION_THEMES_SCHEMA.parse(questionThemes.map(createFakeQuestionThemeTransport))).toStrictEqual(questionThemes);
  });
});