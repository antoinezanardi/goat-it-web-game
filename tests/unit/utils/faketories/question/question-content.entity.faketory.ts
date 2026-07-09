import { faker } from "@faker-js/faker";

import type { QuestionContent } from "#shared/types/question.types";

function createFakeQuestionContent(questionContent: Partial<QuestionContent> = {}): QuestionContent {
  return {
    statement: faker.word.words(3),
    answer: faker.word.words(2),
    context: faker.helpers.maybe(() => faker.word.words(3)),
    trivia: faker.helpers.maybe(() => [faker.word.sample(), faker.word.sample()]),
    ...questionContent,
  };
}

export {
  createFakeQuestionContent,
};