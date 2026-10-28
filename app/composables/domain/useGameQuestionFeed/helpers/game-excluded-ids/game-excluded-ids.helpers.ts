import type { Question } from "#shared/types/question.types";

/**
 * Collects the ids the next request must exclude, walking the buffer newest first.
 *
 * Duplicate ids are dropped and the result stops at `maximum` entries so the request body stays bounded.
 */
function buildExcludedQuestionIds(questions: readonly Question[], maximum: number): string[] {
  const excludedIds: string[] = [];
  const seenIds: Set<string> = new Set();

  for (let index = questions.length - 1; index >= 0 && excludedIds.length < maximum; index--) {
    const question = questions[index];

    if (question !== undefined && !seenIds.has(question.id)) {
      seenIds.add(question.id);
      excludedIds.push(question.id);
    }
  }
  return excludedIds;
}

export { buildExcludedQuestionIds };