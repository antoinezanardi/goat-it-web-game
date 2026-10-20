import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

type NarrowingQuestionFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent" | "categories" | "cognitiveDifficulties" | "themeIds">;

export type { NarrowingQuestionFilters };