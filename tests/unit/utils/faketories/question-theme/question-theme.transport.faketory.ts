import type { Jsonify } from "type-fest";

import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import type { QuestionTheme } from "#shared/types/question-theme.types";

function createFakeQuestionThemeTransport(questionTheme: Partial<QuestionTheme> = {}): Jsonify<QuestionTheme> {
  const fakeQuestionTheme = createFakeQuestionTheme(questionTheme);

  return {
    ...fakeQuestionTheme,
    createdAt: fakeQuestionTheme.createdAt.toISOString(),
    updatedAt: fakeQuestionTheme.updatedAt.toISOString(),
  };
}

export { createFakeQuestionThemeTransport };