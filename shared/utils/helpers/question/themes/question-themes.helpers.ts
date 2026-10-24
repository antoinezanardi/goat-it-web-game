import type { Question } from "#shared/types/question.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";

/**
 * Returns the domain object of the assignment flagged as the question's primary theme.
 *
 * Returns `undefined` when no assignment is flagged as primary.
 */
function getPrimaryTheme(question: Question): QuestionTheme | undefined {
  return question.themes.find(theme => theme.isPrimary)?.theme;
}

/**
 * Returns the domain objects of every assignment not flagged as primary, in their original order.
 */
function getSecondaryThemes(question: Question): QuestionTheme[] {
  return question.themes.filter(theme => !theme.isPrimary).map(theme => theme.theme);
}

/**
 * Returns whether the question has at least one assignment not flagged as primary.
 */
function hasSecondaryThemes(question: Question): boolean {
  return getSecondaryThemes(question).length > 0;
}

/**
 * Returns whether the primary theme assignment is flagged as a hint.
 *
 * Returns `false` when no assignment is flagged as primary.
 */
function isPrimaryThemeHint(question: Question): boolean {
  return question.themes.find(theme => theme.isPrimary)?.isHint ?? false;
}

export {
  getPrimaryTheme,
  getSecondaryThemes,
  hasSecondaryThemes,
  isPrimaryThemeHint,
};