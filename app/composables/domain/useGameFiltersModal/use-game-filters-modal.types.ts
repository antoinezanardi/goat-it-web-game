import type { AsyncResult } from "#shared/types/async-result.types";
import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";

type GameQuestionsFiltersButtonHandle = {
  playHighlight: () => Promise<void>;
};

type UseGameFiltersModalOptions = {
  syncQuestionsWithGameSettings: () => Promise<AsyncResult<void>>;
  getFiltersButton: () => GameQuestionsFiltersButtonHandle | undefined;
};

type UseGameFiltersModal = {
  isFiltersModalOpen: Ref<boolean>;
  isApplyFiltersPending: Ref<boolean>;
  openFiltersModal: () => void;
  setFiltersModalOpen: (isOpen: boolean) => void;
  requestFiltersModalFromSidebar: () => void;
  openRequestedFiltersModal: () => Promise<void>;
  applyFilters: (draft: GameQuestionsFiltersDraft) => Promise<void>;
};

export type { UseGameFiltersModal, UseGameFiltersModalOptions };