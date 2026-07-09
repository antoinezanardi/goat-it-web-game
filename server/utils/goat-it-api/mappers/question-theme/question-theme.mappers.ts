import type { QuestionThemeDto } from "@goat-it/schemas/question-theme";

import type { QuestionTheme } from "#shared/types/question-theme.types";

function createQuestionThemeFromQuestionThemeDto(questionThemeDto: QuestionThemeDto): QuestionTheme {
  return {
    id: questionThemeDto.id,
    slug: questionThemeDto.slug,
    color: questionThemeDto.color,
    label: questionThemeDto.label,
    aliases: questionThemeDto.aliases,
    description: questionThemeDto.description,
    status: questionThemeDto.status,
    createdAt: new Date(questionThemeDto.createdAt),
    updatedAt: new Date(questionThemeDto.updatedAt),
  };
}

export {
  createQuestionThemeFromQuestionThemeDto,
};