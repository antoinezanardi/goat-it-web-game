import type { Question } from "#shared/types/question.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";

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

export {
  getPrimaryTheme,
  getSecondaryThemes,
  hasSecondaryThemes,
  isPrimaryThemeHint,
};