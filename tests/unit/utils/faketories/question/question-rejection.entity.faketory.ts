import { faker } from "@faker-js/faker";
import { QUESTION_REJECTION_TYPES } from "@goat-it/schemas/question";

import type { QuestionRejection } from "#shared/types/question.types";

function createFakeQuestionRejection(questionRejection: Partial<QuestionRejection> = {}): QuestionRejection {
  return {
    type: faker.helpers.arrayElement(QUESTION_REJECTION_TYPES),
    comment: faker.lorem.sentence(),
    ...questionRejection,
  };
}

export {
  createFakeQuestionRejection,
};