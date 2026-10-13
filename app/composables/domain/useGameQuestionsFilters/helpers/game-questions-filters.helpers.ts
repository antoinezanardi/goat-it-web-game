import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import { resolveSelectedThemeIds } from "~/composables/domain/question-theme/helpers/question-theme.helpers";
import type { GameSettingsFetchFilters } from "~/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

function buildGameSettingsFetchFilters(settings: GameSettings, activeThemeIds: readonly string[]): GameSettingsFetchFilters {
  const filters: GameSettingsFetchFilters = {};
  if (!settings.isAdultContentEnabled) {
    filters.isAdultContent = false;
  }
  if (settings.cognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length) {
    filters.cognitiveDifficulties = [...settings.cognitiveDifficulties];
  }
  if (settings.categories.length < QUESTION_CATEGORIES.length) {
    filters.categories = [...settings.categories];
  }
  const selectedThemeIds = resolveSelectedThemeIds(settings.themeIds, activeThemeIds);
  if (selectedThemeIds !== undefined && (activeThemeIds.length === 0 || selectedThemeIds.length < activeThemeIds.length)) {
    filters.themeIds = selectedThemeIds;
  }
  return filters;
}

export { buildGameSettingsFetchFilters };