import type { Question } from "#shared/types/question.types";
import type { QuestionTheme } from "#shared/types/question-theme.types";

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

export { getPrimaryTheme, getSourceDomain };