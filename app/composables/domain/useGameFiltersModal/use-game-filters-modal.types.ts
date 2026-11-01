import type { AsyncResult } from "#shared/types/async-result.types";
import type { GameQuestionsFiltersDraft } from "@/utils/domain/game/game-questions-filters-draft.types";

/** Handle on the filters button so the modal can replay its highlight when opened from the sidebar. */
type GameQuestionsFiltersButtonHandle = {
  /** Runs the highlight animation and resolves when it is done. */
  playHighlight: () => Promise<void>;
};

type UseGameFiltersModalOptions = {
  /** Restarts the feed with the settings just written; its failure suppresses the success toast. */
  syncQuestionsWithGameSettings: () => Promise<AsyncResult<void>>;
  /** Resolves the mounted filters button, or `undefined` before it exists. */
  getFiltersButton: () => GameQuestionsFiltersButtonHandle | undefined;
};

/**
 * Filters-modal state and actions returned by `useGameFiltersModal`.
 */
type UseGameFiltersModal = {
  /** Open state of the modal; written by the trigger, the modal events, and `applyFilters`. */
  isFiltersModalOpen: Ref<boolean>;
  /** True from the moment the draft is applied until the restart settles. */
  isApplyFiltersPending: Ref<boolean>;
  /** Opens immediately, without the sidebar highlight. */
  openFiltersModal: () => void;
  /** Mirrors open and close events coming from the modal itself. */
  setFiltersModalOpen: (isOpen: boolean) => void;
  /** Queues an open request instead of opening immediately. */
  requestFiltersModalFromSidebar: () => void;
  /** Consumes the queued request, including the button highlight; no-op when none is queued. */
  openRequestedFiltersModal: () => Promise<void>;
  /** Writes the draft settings, closes the modal, and waits for the feed restart. */
  applyFilters: (draft: GameQuestionsFiltersDraft) => Promise<void>;
};

export type { UseGameFiltersModal, UseGameFiltersModalOptions };