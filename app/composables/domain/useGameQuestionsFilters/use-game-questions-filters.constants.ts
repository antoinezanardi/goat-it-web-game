import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import { resolveSelectedThemeIds } from "~/composables/domain/question-theme/helpers/question-theme.helpers";
import type { GameQuestionsFilterGroupActivityCheck } from "~/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

const GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS: readonly GameQuestionsFilterGroupActivityCheck[] = [
  (settings: GameSettings): boolean => settings.isAdultContentEnabled,
  (settings: GameSettings): boolean => settings.cognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length,
  (settings: GameSettings): boolean => settings.categories.length < QUESTION_CATEGORIES.length,
  (settings: GameSettings, activeThemeIds: readonly string[]): boolean => {
    const selectedThemeIds = resolveSelectedThemeIds(settings.themeIds, activeThemeIds);

    return activeThemeIds.length > 0 && selectedThemeIds !== undefined && selectedThemeIds.length < activeThemeIds.length;
  },
];

export { GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS };