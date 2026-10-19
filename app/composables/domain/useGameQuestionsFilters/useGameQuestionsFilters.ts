import { GAME_QUESTIONS_FILTER_GROUP_DEFINITIONS } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.constants";
import type { GameQuestionsFilterGroupDefinition } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";
import type { UseGameQuestionsFilters } from "@/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";

function useGameQuestionsFilters(): UseGameQuestionsFilters {
  const gameSettingsStore = useGameSettingsStore();
  const questionThemesStore = useQuestionThemesStore();

  function isDefinitionActive(definition: GameQuestionsFilterGroupDefinition): boolean {
    return definition.isActiveInQuestionFiltersUi(gameSettingsStore.settings, questionThemesStore.activeQuestionThemeIds);
  }

  const activeFiltersCount = computed<number>(() => GAME_QUESTIONS_FILTER_GROUP_DEFINITIONS.filter(isDefinitionActive).length);

  return { activeFiltersCount };
}

export { useGameQuestionsFilters };