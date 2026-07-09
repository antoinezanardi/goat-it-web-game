import { faker } from "@faker-js/faker";
import { QUESTION_AUTHOR_ROLES } from "@goat-it/schemas/question";
import type { QuestionDto } from "@goat-it/schemas/question";

type QuestionAuthorDto = QuestionDto["author"];

function createFakeQuestionAuthorDto(questionAuthorDto: Partial<QuestionAuthorDto> = {}): QuestionAuthorDto {
  return {
    role: faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES),
    name: faker.person.fullName(),
    ...questionAuthorDto,
  };
}

export {
  createFakeQuestionAuthorDto,
};