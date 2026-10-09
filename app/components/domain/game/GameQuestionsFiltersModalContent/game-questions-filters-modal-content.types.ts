import type { QuestionCategory, QuestionCognitiveDifficulty } from "@goat-it/schemas/question";

import type { GameQuestionsFiltersDraft } from "@/components/domain/game/GameQuestionsFiltersModal/game-questions-filters-modal.types";

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