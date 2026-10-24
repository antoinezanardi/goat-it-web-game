import { GAME_QUESTIONS_FILTER_GROUP_DEFINITIONS } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.constants";
import type { GameQuestionsFilterGroupDefinition } from "@/utils/domain/game/helpers/game-questions-filters/game-questions-filters.types";
import type { UseGameQuestionsFilters } from "@/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";

/**
 * Counts the active questions-filter groups for the filters button, the sidebar, and the filters modal.
 *
 * A group is active when its saved selection differs from the default settings: adult content enabled, or a
 * cognitive-difficulty, category, or theme subset.
 */
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