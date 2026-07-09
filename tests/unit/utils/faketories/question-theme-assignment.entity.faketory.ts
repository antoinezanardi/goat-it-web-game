import { faker } from "@faker-js/faker";

import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme.entity.faketory";

import type { QuestionThemeAssignment } from "#shared/types/question.types";

function createFakeQuestionThemeAssignment(questionThemeAssignment: Partial<QuestionThemeAssignment> = {}): QuestionThemeAssignment {
  return {
    theme: createFakeQuestionTheme(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...questionThemeAssignment,
  };
}

export {
  createFakeQuestionThemeAssignment,
};