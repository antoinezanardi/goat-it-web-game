import { faker } from "@faker-js/faker";
import { QUESTION_AUTHOR_ROLES } from "@goat-it/schemas/question";

import type { QuestionAuthor } from "#shared/types/question.types";

function createFakeQuestionAuthor(questionAuthor: Partial<QuestionAuthor> = {}): QuestionAuthor {
  return {
    role: faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES),
    name: faker.person.fullName(),
    ...questionAuthor,
  };
}

export {
  createFakeQuestionAuthor,
};