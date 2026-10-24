import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";

type GameQuestionsFiltersModalProps = {
  isFiltersModalOpen: boolean;
  isApplyFiltersPending: boolean;
};

type GameQuestionsFiltersModalEmits = {
  "update:isFiltersModalOpen": [value: boolean];
  "applyFilters": [draft: GameQuestionsFiltersDraft];
};

export type { GameQuestionsFiltersModalEmits, GameQuestionsFiltersModalProps };