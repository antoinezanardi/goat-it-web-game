import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { Question } from "#shared/types/question.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { DIFFICULTY_COLOR_MAP, QUESTION_CATEGORY_ICON_MAP } from "~/composables/domain/question/constants/question.constants";

function getPrimaryTheme(question: Question): QuestionTheme | undefined {
  return question.themes.find(t => t.isPrimary)?.theme;
}

function getSourceDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./u, "");
  } catch {
    return url;
  }
}

function getCategoryIcon(category: QuestionCategory): string {
  return QUESTION_CATEGORY_ICON_MAP[category];
}

function getDifficultyColor(difficulty: QuestionCognitiveDifficulty): "success" | "warning" | "error" {
  return DIFFICULTY_COLOR_MAP[difficulty];
}

export { getCategoryIcon, getDifficultyColor, getPrimaryTheme, getSourceDomain };