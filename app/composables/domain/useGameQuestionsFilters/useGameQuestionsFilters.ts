import { GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS } from "~/composables/domain/useGameQuestionsFilters/use-game-questions-filters.constants";
import type { UseGameQuestionsFilters } from "~/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";

function useGameQuestionsFilters(): UseGameQuestionsFilters {
  const gameSettingsStore = useGameSettingsStore();
  const questionThemesStore = useQuestionThemesStore();

  const activeFiltersCount = computed<number>(() => GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS.filter(check => check(
    gameSettingsStore.settings,
    questionThemesStore.activeQuestionThemeIds,
  )).length);

  return { activeFiltersCount };
}

export { useGameQuestionsFilters };