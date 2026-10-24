import { describe, it, expect } from "vitest";
import { ZodError } from "zod";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTransport } from "~~/tests/unit/utils/faketories/question/question.transport.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { QUESTION_SCHEMA, QUESTIONS_SCHEMA } from "#shared/schemas/question/question.schemas";

describe("QUESTION_SCHEMA parsing", () => {
  it("should return a question with date instances when given a JSON-transported question.", () => {
    const question = createFakeQuestion({ sourceUrls: ["https://example.com"] });

    expect(QUESTION_SCHEMA.parse(createFakeQuestionTransport(question))).toStrictEqual(question);
  });

  it("should throw a ZodError when given a question with an unsafe source URL.", () => {
    const question = createFakeQuestion({ sourceUrls: ["http://insecure.example.com"] });

    expect(() => QUESTION_SCHEMA.parse(createFakeQuestionTransport(question))).toThrow(ZodError);
  });

  it("should throw a ZodError when given a question with an unknown key.", () => {
    const questionTransport = createFakeQuestionTransport(createFakeQuestion());

    expect(() => QUESTION_SCHEMA.parse({ ...questionTransport, unknownKey: "value" })).toThrow(ZodError);
  });

  it("should throw a ZodError when given a question with duplicate source URLs.", () => {
    const question = createFakeQuestion({ sourceUrls: ["https://example.com", "https://example.com"] });

    expect(() => QUESTION_SCHEMA.parse(createFakeQuestionTransport(question))).toThrow(ZodError);
  });

  it("should throw a ZodError when given a question without themes.", () => {
    const question = createFakeQuestion({ themes: [] });

    expect(() => QUESTION_SCHEMA.parse(createFakeQuestionTransport(question))).toThrow(ZodError);
  });

  it("should throw a ZodError when given a question with too many themes.", () => {
    const question = createFakeQuestion({
      themes: [
        createFakeQuestionThemeAssignment(),
        createFakeQuestionThemeAssignment(),
        createFakeQuestionThemeAssignment(),
        createFakeQuestionThemeAssignment(),
      ],
    });

    expect(() => QUESTION_SCHEMA.parse(createFakeQuestionTransport(question))).toThrow(ZodError);
  });

  it("should throw a ZodError when given a question with an invalid date.", () => {
    const questionTransport = createFakeQuestionTransport(createFakeQuestion());

    expect(() => QUESTION_SCHEMA.parse({ ...questionTransport, createdAt: "not-a-date" })).toThrow(ZodError);
  });
});

describe("QUESTIONS_SCHEMA parsing", () => {
  it("should return questions with date instances when given JSON-transported questions.", () => {
    const questions = [
      createFakeQuestion({ sourceUrls: ["https://example.com"] }),
      createFakeQuestion({ sourceUrls: ["https://example.org"] }),
    ];

    expect(QUESTIONS_SCHEMA.parse(questions.map(createFakeQuestionTransport))).toStrictEqual(questions);
  });
});