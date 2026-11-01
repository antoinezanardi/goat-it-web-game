import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

/** Random-question request keys inspected to decide whether an empty result was caused by filters. */
type NarrowingQuestionFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent" | "categories" | "cognitiveDifficulties" | "themeIds">;

export type { NarrowingQuestionFilters };