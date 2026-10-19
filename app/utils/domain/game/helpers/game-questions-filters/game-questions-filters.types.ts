import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";

import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

type GameSettingsFetchFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent" | "cognitiveDifficulties" | "categories" | "themeIds">;

type GameQuestionsFilterGroupDefinition = {
  buildFetchFilter: (settings: GameSettings, activeThemeIds: readonly string[]) => GameSettingsFetchFilters;
  isActiveInQuestionFiltersUi: (settings: GameSettings, activeThemeIds: readonly string[]) => boolean;
};

export type { GameQuestionsFilterGroupDefinition, GameSettingsFetchFilters };