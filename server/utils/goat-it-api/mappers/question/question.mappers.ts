import type { QuestionDto } from "@goat-it/schemas/question";

import type { Question } from "#shared/types/question.types";
import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";

function createQuestionFromQuestionDto(dto: QuestionDto): Question {
  return {
    id: dto.id,
    category: dto.category,
    themes: dto.themes.map(themeAssignment => ({
      theme: createQuestionThemeFromQuestionThemeDto(themeAssignment.theme),
      isPrimary: themeAssignment.isPrimary,
      isHint: themeAssignment.isHint,
    })),
    content: dto.content,
    cognitiveDifficulty: dto.cognitiveDifficulty,
    author: dto.author,
    status: dto.status,
    rejection: dto.rejection,
    sourceUrls: dto.sourceUrls,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

export {
  createQuestionFromQuestionDto,
};