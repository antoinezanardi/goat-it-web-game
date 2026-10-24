import { faker } from "@faker-js/faker";
import { QUESTION_AUTHOR_ROLES } from "@goat-it/schemas/question";

import type { QuestionAuthor } from "#shared/types/question.types";

function createFakeQuestionAuthor(questionAuthor: Partial<QuestionAuthor> = {}): QuestionAuthor {
  const role = questionAuthor.role ?? faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES);
  const fakeAuthor: QuestionAuthor = {
    role,
    name: faker.person.fullName(),
  };

  if (role === "game") {
    fakeAuthor.gameId = faker.database.mongodbObjectId();
  }
  return {
    ...fakeAuthor,
    ...questionAuthor,
  };
}

export {
  createFakeQuestionAuthor,
};