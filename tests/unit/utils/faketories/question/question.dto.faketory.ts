import { faker } from "@faker-js/faker";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_STATUSES } from "@goat-it/schemas/question";
import type { QuestionDto } from "@goat-it/schemas/question";

import { createFakeQuestionAuthorDto } from "~~/tests/unit/utils/faketories/question/question-author.dto.faketory";
import { createFakeQuestionContentDto } from "~~/tests/unit/utils/faketories/question/question-content.dto.faketory";
import { createFakeQuestionRejectionDto } from "~~/tests/unit/utils/faketories/question/question-rejection.dto.faketory";
import { createFakeQuestionThemeAssignmentDto } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.dto.faketory";

function createFakeQuestionDto(questionDto: Partial<QuestionDto> = {}): QuestionDto {
  return {
    id: faker.database.mongodbObjectId(),
    category: faker.helpers.arrayElement(QUESTION_CATEGORIES),
    themes: [createFakeQuestionThemeAssignmentDto({ isPrimary: true })],
    content: createFakeQuestionContentDto(),
    cognitiveDifficulty: faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES),
    author: createFakeQuestionAuthorDto(),
    status: faker.helpers.arrayElement(QUESTION_STATUSES),
    rejection: faker.helpers.maybe(() => createFakeQuestionRejectionDto()),
    sourceUrls: [faker.internet.url()],
    createdAt: faker.date.anytime().toISOString(),
    updatedAt: faker.date.anytime().toISOString(),
    ...questionDto,
  };
}

export {
  createFakeQuestionDto,
};