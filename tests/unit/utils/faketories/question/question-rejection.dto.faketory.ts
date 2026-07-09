import { faker } from "@faker-js/faker";
import { QUESTION_REJECTION_TYPES } from "@goat-it/schemas/question";
import type { QuestionDto } from "@goat-it/schemas/question";

type QuestionRejectionDto = NonNullable<QuestionDto["rejection"]>;

function createFakeQuestionRejectionDto(questionRejectionDto: Partial<QuestionRejectionDto> = {}): QuestionRejectionDto {
  return {
    type: faker.helpers.arrayElement(QUESTION_REJECTION_TYPES),
    comment: faker.lorem.sentence(),
    ...questionRejectionDto,
  };
}

export {
  createFakeQuestionRejectionDto,
};