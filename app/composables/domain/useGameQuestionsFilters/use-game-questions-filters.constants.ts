import { QUESTION_COGNITIVE_DIFFICULTIES } from "@goat-it/schemas/question";

import type { GameQuestionsFilterGroupActivityCheck } from "~/composables/domain/useGameQuestionsFilters/use-game-questions-filters.types";
import type { GameSettings } from "~/stores/domain/game-settings/game-settings.types";

const GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS: readonly GameQuestionsFilterGroupActivityCheck[] = [
  (settings: GameSettings): boolean => settings.isAdultContentEnabled,
  (settings: GameSettings): boolean => settings.cognitiveDifficulties.length < QUESTION_COGNITIVE_DIFFICULTIES.length,
];

export { GAME_QUESTIONS_FILTER_GROUP_ACTIVITY_CHECKS };