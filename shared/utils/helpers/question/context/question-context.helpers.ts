import type { Question } from "#shared/types/question.types";

/**
 * Returns whether the context contains at least one non-whitespace character.
 */
function hasNonEmptyContext(context?: string): boolean {
  return (context?.trim().length ?? 0) > 0;
}

/**
 * Returns the trivia entries that contain at least one non-whitespace character.
 */
function getNonEmptyTrivia(trivia?: string[]): string[] {
  return (trivia ?? []).filter(item => item.trim().length > 0);
}

/**
 * Returns whether the question has a non-empty context or at least one non-empty trivia entry.
 */
function hasContextAndTriviaSection(question: Question): boolean {
  return hasNonEmptyContext(question.content.context) || getNonEmptyTrivia(question.content.trivia).length > 0;
}

export {
  getNonEmptyTrivia,
  hasContextAndTriviaSection,
  hasNonEmptyContext,
};