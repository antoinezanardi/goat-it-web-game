import type { NarrowingQuestionFilters } from "@/composables/domain/useGameQuestionFeed/helpers/narrowing-question-filters/narrowing-question-filters.types";

/**
 * Tells whether a random-question request narrows the catalog through at least one filter key.
 *
 * Only category, cognitive-difficulty, and theme selections count; `isAdultContent` is ignored.
 */
function hasNarrowingQuestionFilters(filters: NarrowingQuestionFilters): boolean {
  return filters.categories !== undefined || filters.cognitiveDifficulties !== undefined || filters.themeIds !== undefined;
}

export { hasNarrowingQuestionFilters };