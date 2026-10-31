import type { ComputedRef, Ref } from "vue";

import type { Question } from "#shared/types/question.types";
import type { GameNavigationDirection } from "@/utils/domain/game/game-navigation.types";

type QuestionCardRingSlot = {
  /** `"true"` on staged slots so assistive technology ignores them; `undefined` on the active slot. */
  ariaHidden: "true" | undefined;
  /** The active card exposes `game-question`; staged cards expose `game-question-staged`. */
  dataTestid: "game-question" | "game-question-staged";
  /** Staged slots are inert and cannot receive focus. */
  inert: boolean;
  isActive: boolean;
  /** True for every staged slot, and for the whole ring while a slide runs or the document is hidden. */
  isFrozen: boolean;
  /** Undefined while the slot points outside the available questions. */
  question: Question | undefined;
};

type UseQuestionCardRingOptions = {
  /** The slot window is read around it; changing it triggers restaging while a slide is pending. */
  currentIndex: Ref<number>;
  /** Receives the far slot index when that slot's question is swapped, so its animation state can be reset. */
  onResetSlot?: (slotIndex: number) => void;
  /** Called after a restage finishes, before slots are filled again. */
  onStaged?: () => void;
  /** Setting a direction freezes the ring and arms the next index change to restage. */
  pendingDirection: Ref<GameNavigationDirection | undefined>;
  questions: Ref<Question[]>;
};

/**
 * Ring rotation contract returned by `useQuestionCardRing`.
 */
type UseQuestionCardRingReturn = {
  /** Finalizes a slide by rotating the active slot in the given direction. */
  complete: (direction: GameNavigationDirection) => void;
  /** Slot currently displayed; rotates each time a slide completes. */
  currentSlotIndex: Ref<number>;
  /** Maps an offset from the active slot to a ring index, wrapping across the three slots. */
  getSlotIndexForOffset: (offset: number) => number;
  /** The three slots around the current index, with their focus and freeze metadata. */
  slots: ComputedRef<QuestionCardRingSlot[]>;
};

export type { QuestionCardRingSlot, UseQuestionCardRingOptions, UseQuestionCardRingReturn };