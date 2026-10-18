import type { Question } from "#shared/types/question.types";

function hasNonEmptyContext(context?: string): boolean {
  return (context?.trim().length ?? 0) > 0;
}

function getNonEmptyTrivia(trivia?: string[]): string[] {
  return (trivia ?? []).filter(item => item.trim().length > 0);
}

function hasContextAndTriviaSection(question: Question): boolean {
  return hasNonEmptyContext(question.content.context) || getNonEmptyTrivia(question.content.trivia).length > 0;
}

export {
  getNonEmptyTrivia,
  hasContextAndTriviaSection,
  hasNonEmptyContext,
};