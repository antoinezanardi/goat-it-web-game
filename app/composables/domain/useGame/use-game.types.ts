import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

type GameSettingsFetchFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent">;

export type { GameSettingsFetchFilters };