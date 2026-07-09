import { faker } from "@faker-js/faker";
import type { QuestionDto } from "@goat-it/schemas/question";

type QuestionContentDto = QuestionDto["content"];

function createFakeQuestionContentDto(questionContentDto: Partial<QuestionContentDto> = {}): QuestionContentDto {
  return {
    statement: faker.word.words(3),
    answer: faker.word.words(2),
    context: faker.helpers.maybe(() => faker.word.words(3)),
    trivia: faker.helpers.maybe(() => [faker.word.sample(), faker.word.sample()]),
    ...questionContentDto,
  };
}

export {
  createFakeQuestionContentDto,
};