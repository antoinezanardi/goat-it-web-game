import type { ComputedRef, Ref } from "vue";

import type { Question } from "#shared/types/question.types";
import type { GameNavigationDirection } from "@/utils/domain/game/game-navigation.types";

type QuestionCardRingSlot = {
  ariaHidden: "true" | undefined;
  dataTestid: "game-question" | "game-question-staged";
  inert: boolean;
  isActive: boolean;
  isFrozen: boolean;
  question: Question | undefined;
};

type UseQuestionCardRingOptions = {
  currentIndex: Ref<number>;
  onResetSlot?: (slotIndex: number) => void;
  onStaged?: () => void;
  pendingDirection: Ref<GameNavigationDirection | undefined>;
  questions: Ref<Question[]>;
};

type UseQuestionCardRingReturn = {
  complete: (direction: GameNavigationDirection) => void;
  currentSlotIndex: Ref<number>;
  getSlotIndexForOffset: (offset: number) => number;
  slots: ComputedRef<QuestionCardRingSlot[]>;
};

export type { QuestionCardRingSlot, UseQuestionCardRingOptions, UseQuestionCardRingReturn };