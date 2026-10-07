import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameQuestionsFilterGroupActivityCheck, UseGameQuestionsFilters } from "~/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

const GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS: readonly GameQuestionsFilterGroupActivityCheck[] = [
  (settings: GameSettings): boolean => settings.isAdultContentEnabled,
  (settings: GameSettings): boolean => settings.cognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length,
];

function useGameQuestionsFilters(): UseGameQuestionsFilters {
  const gameSettingsStore = useGameSettingsStore();

  const activeFiltersCount = computed<number>(() => GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS.filter(check => check(gameSettingsStore.settings)).length);

  return { activeFiltersCount };
}

export { useGameQuestionsFilters };