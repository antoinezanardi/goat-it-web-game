import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

type NarrowingQuestionFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent" | "categories" | "cognitiveDifficulties" | "themeIds">;

function hasNarrowingQuestionFilters(filters: NarrowingQuestionFilters): boolean {
  return filters.categories !== undefined || filters.cognitiveDifficulties !== undefined || filters.themeIds !== undefined;
}

export { hasNarrowingQuestionFilters };