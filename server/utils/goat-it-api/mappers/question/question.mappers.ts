import type { QuestionDto } from "@goat-it/schemas/question";

import type { Question } from "#shared/types/question.types";
import { filterSafeSourceUrls } from "#shared/utils/helpers/question/source/question-source.helpers";
import { createQuestionThemeFromQuestionThemeDto } from "#server/utils/goat-it-api/mappers/question-theme/question-theme.mappers";

/**
 * Maps a question DTO from the upstream API to the domain `Question`.
 *
 * Date strings become `Date` instances, each theme assignment is mapped to a domain theme with its `isPrimary`/`isHint` flags,
 * and `sourceUrls` is filtered down to safe schemes. `status` and `rejection` are passed through unchanged.
 */
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
    isAdultContent: dto.isAdultContent,
    author: dto.author,
    status: dto.status,
    rejection: dto.rejection,
    sourceUrls: filterSafeSourceUrls(dto.sourceUrls),
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

export {
  createQuestionFromQuestionDto,
};