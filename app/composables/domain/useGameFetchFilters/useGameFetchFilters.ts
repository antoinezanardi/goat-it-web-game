import { buildGameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.helpers";
import type { GameSettingsFetchFilters } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";
import type { UseGameFetchFilters } from "@/composables/domain/useGameFetchFilters/use-game-fetch-filters.types";

function useGameFetchFilters(): UseGameFetchFilters {
  const settingsStore = useGameSettingsStore();
  const questionThemesStore = useQuestionThemesStore();

  const fetchFilters = computed<GameSettingsFetchFilters>(() => buildGameSettingsFetchFilters(settingsStore.settings, questionThemesStore.activeQuestionThemeIds));

  return { fetchFilters };
}

export { useGameFetchFilters };