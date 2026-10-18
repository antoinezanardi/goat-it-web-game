import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

type GameSettingsFetchFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent" | "cognitiveDifficulties" | "categories" | "themeIds">;

export type { GameSettingsFetchFilters };