import { GAME_QUESTIONS_FILTER_GROUP_DEFINITIONS } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.constants";
import type { GameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";
import type { GameSettings } from "@/stores/domain/game-settings/game-settings.types";

function buildGameSettingsFetchFilters(settings: GameSettings, activeThemeIds: readonly string[]): GameSettingsFetchFilters {
  return GAME_QUESTIONS_FILTER_GROUP_DEFINITIONS.reduce<GameSettingsFetchFilters>(
    (fetchFilters, definition) => Object.assign(fetchFilters, definition.buildFetchFilter(settings, activeThemeIds)),
    {},
  );
}

export { buildGameSettingsFetchFilters };