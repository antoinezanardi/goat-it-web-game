import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameQuestionsFilterGroupActivityCheck } from "~/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

const GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS: readonly GameQuestionsFilterGroupActivityCheck[] = [
  (settings: GameSettings): boolean => settings.isAdultContentEnabled,
  (settings: GameSettings): boolean => settings.cognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length,
  (settings: GameSettings): boolean => settings.categories.length < QUESTION_CATEGORIES.length,
  (settings: GameSettings, activeThemeIds: readonly string[]): boolean => {
    if (activeThemeIds.length === 0 || settings.themeIds.length === 0) {
      return false;
    }
    const activeSelection = activeThemeIds.filter(themeId => settings.themeIds.includes(themeId));

    return activeSelection.length > 0 && activeSelection.length < activeThemeIds.length;
  },
];

export { GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS };