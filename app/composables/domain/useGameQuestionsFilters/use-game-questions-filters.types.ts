import type { FindRandomQuestionsBodyDto } from "@goat-it/schemas/question";
import type { ComputedRef } from "vue";

import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

type GameSettingsFetchFilters = Pick<FindRandomQuestionsBodyDto, "isAdultContent" | "cognitiveDifficulties" | "categories" | "themeIds">;

type GameQuestionsFilterGroupActivityCheck = (settings: GameSettings, activeThemeIds: readonly string[]) => boolean;

type UseGameQuestionsFilters = {
  activeFiltersCount: ComputedRef<number>;
};

export type { GameQuestionsFilterGroupActivityCheck, GameSettingsFetchFilters, UseGameQuestionsFilters };