import type { Jsonify } from "type-fest";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { Question } from "#shared/types/question.types";

function createFakeQuestionTransport(question: Partial<Question> = {}): Jsonify<Question> {
  const fakeQuestion = createFakeQuestion(question);

  return {
    ...fakeQuestion,
    createdAt: fakeQuestion.createdAt.toISOString(),
    updatedAt: fakeQuestion.updatedAt.toISOString(),
    themes: fakeQuestion.themes.map(questionThemeAssignment => ({
      isPrimary: questionThemeAssignment.isPrimary,
      isHint: questionThemeAssignment.isHint,
      theme: {
        ...questionThemeAssignment.theme,
        createdAt: questionThemeAssignment.theme.createdAt.toISOString(),
        updatedAt: questionThemeAssignment.theme.updatedAt.toISOString(),
      },
    })),
  };
}

export { createFakeQuestionTransport };