import { faker } from "@faker-js/faker";
import type { QuestionDto } from "@goat-it/schemas/question";

import { createFakeQuestionThemeDto } from "~~/tests/unit/utils/faketories/question-theme.dto.faketory";

type QuestionThemeAssignmentDto = QuestionDto["themes"][number];

function createFakeQuestionThemeAssignmentDto(questionThemeAssignmentDto: Partial<QuestionThemeAssignmentDto> = {}): QuestionThemeAssignmentDto {
  return {
    theme: createFakeQuestionThemeDto(),
    isPrimary: faker.datatype.boolean(),
    isHint: faker.datatype.boolean(),
    ...questionThemeAssignmentDto,
  };
}

export {
  createFakeQuestionThemeAssignmentDto,
};