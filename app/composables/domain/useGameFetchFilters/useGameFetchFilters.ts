import { buildGameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.helpers";
import type { GameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";
import type { UseGameFetchFilters } from "@/composables/domain/useGameFetchFilters/use-game-fetch-filters.types";

/**
 * Derives the random-question fetch filters from persisted game settings and the active theme catalog.
 *
 * An absent key means that filter is not narrowed.
 */
function useGameFetchFilters(): UseGameFetchFilters {
  const settingsStore = useGameSettingsStore();
  const questionThemesStore = useQuestionThemesStore();

  const fetchFilters = computed<GameSettingsFetchFilters>(() => buildGameSettingsFetchFilters(settingsStore.settings, questionThemesStore.activeQuestionThemeIds));

  return { fetchFilters };
}

export { useGameFetchFilters };