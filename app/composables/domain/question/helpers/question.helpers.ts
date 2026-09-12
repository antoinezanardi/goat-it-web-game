import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { Question } from "#shared/types/question.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";
import { DIFFICULTY_COLOR_MAP, DIFFICULTY_ICON_MAP, DIFFICULTY_RING_CLASS_MAP, QUESTION_CATEGORY_ICON_MAP } from "~/composables/domain/question/constants/question.constants";

function getPrimaryTheme(question: Question): QuestionTheme | undefined {
  return question.themes.find(theme => theme.isPrimary)?.theme;
}

function getSecondaryThemes(question: Question): QuestionTheme[] {
  return question.themes.filter(theme => !theme.isPrimary).map(theme => theme.theme);
}

function hasSecondaryThemes(question: Question): boolean {
  return getSecondaryThemes(question).length > 0;
}

function isPrimaryThemeHint(question: Question): boolean {
  return question.themes.find(theme => theme.isPrimary)?.isHint ?? false;
}

function hasNonEmptyContext(context?: string): boolean {
  return (context?.trim().length ?? 0) > 0;
}

function getNonEmptyTrivia(trivia?: string[]): string[] {
  return (trivia ?? []).filter(item => item.trim().length > 0);
}

function hasContextAndTriviaSection(question: Question): boolean {
  return hasNonEmptyContext(question.content.context) || getNonEmptyTrivia(question.content.trivia).length > 0;
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

function getDifficultyIcon(difficulty: QuestionCognitiveDifficulty): string {
  return DIFFICULTY_ICON_MAP[difficulty];
}

function getDifficultyRingClass(difficulty: QuestionCognitiveDifficulty): string {
  return DIFFICULTY_RING_CLASS_MAP[difficulty];
}

export {
  getCategoryIcon,
  getDifficultyColor,
  getDifficultyIcon,
  getDifficultyRingClass,
  getNonEmptyTrivia,
  getPrimaryTheme,
  getSecondaryThemes,
  getSourceDomain,
  hasContextAndTriviaSection,
  hasNonEmptyContext,
  hasSecondaryThemes,
  isPrimaryThemeHint,
};