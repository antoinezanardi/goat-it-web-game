import { describe, it, expect } from "vitest";
import type { Jsonify } from "type-fest";
import { ZodError } from "zod";

import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeSerialized } from "~~/tests/unit/utils/faketories/question-theme/question-theme.serialized.faketory";

import { QUESTION_THEME_SCHEMA, QUESTION_THEMES_SCHEMA } from "#shared/schemas/question-theme/question-theme.schemas";
import type { QuestionTheme } from "#shared/types/question-theme.types";

type InvalidQuestionThemeSerializedCase = {
  description: string;
  mutateSerialized: (serializedQuestionTheme: Jsonify<QuestionTheme>) => unknown;
};

describe("Question theme schema", () => {
  it("should return a question theme with date instances when given a JSON-transported question theme.", () => {
    const questionTheme = createFakeQuestionTheme();

    expect(QUESTION_THEME_SCHEMA.parse(createFakeQuestionThemeSerialized(questionTheme))).toStrictEqual(questionTheme);
  });

  it.each<InvalidQuestionThemeSerializedCase>([
    {
      description: "an unknown key",
      mutateSerialized: (serializedQuestionTheme): unknown => ({ ...serializedQuestionTheme, unknownKey: "value" }),
    },
    {
      description: "an invalid shape",
      mutateSerialized: (): unknown => ({}),
    },
    {
      description: "a null creation date",
      mutateSerialized: (serializedQuestionTheme): unknown => ({ ...serializedQuestionTheme, createdAt: null }),
    },
    {
      description: "a null update date",
      mutateSerialized: (serializedQuestionTheme): unknown => ({ ...serializedQuestionTheme, updatedAt: null }),
    },
  ])("should throw a ZodError when given a question theme with $description.", ({ mutateSerialized }) => {
    const serializedQuestionTheme = createFakeQuestionThemeSerialized(createFakeQuestionTheme());

    expect(() => QUESTION_THEME_SCHEMA.parse(mutateSerialized(serializedQuestionTheme))).toThrow(ZodError);
  });
});

describe("Question themes schema", () => {
  it("should return question themes with date instances when given JSON-transported question themes.", () => {
    const questionThemes = [createFakeQuestionTheme(), createFakeQuestionTheme()];

    expect(QUESTION_THEMES_SCHEMA.parse(questionThemes.map(createFakeQuestionThemeSerialized))).toStrictEqual(questionThemes);
  });
});