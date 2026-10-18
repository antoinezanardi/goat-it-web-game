import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";

type GameQuestionsFiltersModalProps = {
  isOpen: boolean;
  isApplyPending: boolean;
};

type GameQuestionsFiltersModalEmits = {
  "update:isOpen": [value: boolean];
  "applyFilters": [draft: GameQuestionsFiltersDraft];
};

export type { GameQuestionsFiltersModalEmits, GameQuestionsFiltersModalProps };