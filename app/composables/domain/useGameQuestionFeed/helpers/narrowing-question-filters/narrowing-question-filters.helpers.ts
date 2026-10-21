import type { NarrowingQuestionFilters } from "@/composables/domain/useGameQuestionFeed/helpers/narrowing-question-filters/narrowing-question-filters.types";

function hasNarrowingQuestionFilters(filters: NarrowingQuestionFilters): boolean {
  return filters.categories !== undefined || filters.cognitiveDifficulties !== undefined || filters.themeIds !== undefined;
}

export { hasNarrowingQuestionFilters };