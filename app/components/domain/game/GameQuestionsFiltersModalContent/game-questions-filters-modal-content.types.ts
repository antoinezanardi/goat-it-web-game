import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";

type GameQuestionsFiltersModalContentProps = {
  draft: GameQuestionsFiltersDraft;
};

type GameQuestionsFiltersModalContentEmits = {
  "update:isAdultContentEnabled": [value: boolean];
  "update:cognitiveDifficulties": [value: QuestionCognitiveDifficulty[]];
  "update:categories": [value: QuestionCategory[]];
  "update:themeIds": [value: string[]];
};

export type { GameQuestionsFiltersModalContentEmits, GameQuestionsFiltersModalContentProps };