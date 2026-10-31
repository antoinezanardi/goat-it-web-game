import { describe, it, expect } from "vitest";
import type { Jsonify } from "type-fest";
import { ZodError } from "zod";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionSerialized } from "~~/tests/unit/utils/faketories/question/question.serialized.faketory";

import { QUESTION_SCHEMA, QUESTIONS_SCHEMA } from "#shared/schemas/question/question.schemas";
import type { Question } from "#shared/types/question.types";

type InvalidQuestionSerializedCase = {
  description: string;
  mutateSerialized: (serializedQuestion: Jsonify<Question>) => unknown;
};

describe("Question schema", () => {
  it("should return a question with date instances when given a JSON-transported question.", () => {
    const question = createFakeQuestion({ sourceUrls: ["https://example.com"] });

    expect(QUESTION_SCHEMA.parse(createFakeQuestionSerialized(question))).toStrictEqual(question);
  });

  it.each<InvalidQuestionSerializedCase>([
    {
      description: "an unsafe source URL",
      mutateSerialized: (serializedQuestion): unknown => ({ ...serializedQuestion, sourceUrls: ["http://insecure.example.com"] }),
    },
    {
      description: "an unknown key",
      mutateSerialized: (serializedQuestion): unknown => ({ ...serializedQuestion, unknownKey: "value" }),
    },
    {
      description: "duplicate source URLs",
      mutateSerialized: (serializedQuestion): unknown => ({ ...serializedQuestion, sourceUrls: ["https://example.com", "https://example.com"] }),
    },
    {
      description: "no themes",
      mutateSerialized: (serializedQuestion): unknown => ({ ...serializedQuestion, themes: [] }),
    },
    {
      description: "too many themes",
      mutateSerialized: (serializedQuestion): unknown => ({
        ...serializedQuestion,
        themes: [
          ...serializedQuestion.themes,
          ...serializedQuestion.themes,
          ...serializedQuestion.themes,
          ...serializedQuestion.themes,
        ],
      }),
    },
    {
      description: "an invalid date",
      mutateSerialized: (serializedQuestion): unknown => ({ ...serializedQuestion, createdAt: "not-a-date" }),
    },
    {
      description: "a null creation date",
      mutateSerialized: (serializedQuestion): unknown => ({ ...serializedQuestion, createdAt: null }),
    },
    {
      description: "a null update date",
      mutateSerialized: (serializedQuestion): unknown => ({ ...serializedQuestion, updatedAt: null }),
    },
  ])("should throw a ZodError when given a question with $description.", ({ mutateSerialized }) => {
    const serializedQuestion = createFakeQuestionSerialized(createFakeQuestion());

    expect(() => QUESTION_SCHEMA.parse(mutateSerialized(serializedQuestion))).toThrow(ZodError);
  });
});

describe("Questions schema", () => {
  it("should return questions with date instances when given JSON-transported questions.", () => {
    const questions = [
      createFakeQuestion({ sourceUrls: ["https://example.com"] }),
      createFakeQuestion({ sourceUrls: ["https://example.org"] }),
    ];

    expect(QUESTIONS_SCHEMA.parse(questions.map(createFakeQuestionSerialized))).toStrictEqual(questions);
  });
});