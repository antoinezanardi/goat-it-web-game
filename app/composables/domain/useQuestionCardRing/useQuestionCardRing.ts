import { computed, nextTick, ref, toValue, watch } from "vue";
import { useDocumentVisibility } from "@vueuse/core";

import { QUESTION_CARD_RING_RADIUS } from "./use-question-card-ring.constants";
import type { QuestionCardRingSlot, UseQuestionCardRingOptions, UseQuestionCardRingReturn } from "./use-question-card-ring.types";

import type { Question } from "#shared/types/question.types";

// Acceptable as radius × 2 + 1 is the standard ring buffer size formula
// oxlint-disable-next-line eslint/no-magic-numbers
const RING_SIZE = QUESTION_CARD_RING_RADIUS * 2 + 1;

function useQuestionCardRing(options: UseQuestionCardRingOptions): UseQuestionCardRingReturn {
  const { questions } = options;
  const { currentIndex } = options;
  const { pendingDirection } = options;
  const documentVisibility = useDocumentVisibility();

  const currentSlotIndex = ref(0);
  // Acceptable as `undefined` marks empty ring slots before stageSlots fills them
  // oxlint-disable-next-line unicorn/no-useless-undefined
  const slotQuestions = ref<(Question | undefined)[]>(Array.from({ length: RING_SIZE }, () => undefined));
  const isSliding = ref(false);
  const isTransitioning = ref(false);
  const hasPendingRestage = ref(false);
  const isRestaging = ref(false);

  function getSlotIndexForOffset(offset: number): number {
    return (currentSlotIndex.value + offset + RING_SIZE) % RING_SIZE;
  }

  function getQuestionAtOffset(offset: number): Question | undefined {
    return toValue(questions)[toValue(currentIndex) + offset];
  }

  function stageSlots(): void {
    for (let offset = -QUESTION_CARD_RING_RADIUS; offset <= QUESTION_CARD_RING_RADIUS; offset++) {
      const slotIndex = getSlotIndexForOffset(offset);
      slotQuestions.value[slotIndex] = getQuestionAtOffset(offset);
    }
  }

  function restageFarSlot(): void {
    const farSlotIndex = getSlotIndexForOffset(QUESTION_CARD_RING_RADIUS);
    slotQuestions.value[farSlotIndex] = getQuestionAtOffset(QUESTION_CARD_RING_RADIUS);
  }

  function scheduleRestage(): void {
    isRestaging.value = true;
    requestAnimationFrame(() => {
      restageFarSlot();
      options.onResetSlot?.(getSlotIndexForOffset(QUESTION_CARD_RING_RADIUS));

      void nextTick(() => {
        requestAnimationFrame(() => {
          isTransitioning.value = false;
          hasPendingRestage.value = false;
          isRestaging.value = false;
          options.onStaged?.();
        });
      });
    });
  }

  const slots = computed<QuestionCardRingSlot[]>(() => {
    const isFrozen = isSliding.value || documentVisibility.value === "hidden";

    return slotQuestions.value.map((question, index) => {
      const isActive = index === currentSlotIndex.value;

      return {
        ariaHidden: isActive ? undefined : "true",
        dataTestid: isActive ? "game-question" : "game-question-staged",
        inert: !isActive,
        isActive,
        isFrozen: isFrozen || !isActive,
        question,
      };
    });
  });

  watch(pendingDirection, direction => {
    if (direction) {
      isSliding.value = true;
      isTransitioning.value = true;
      hasPendingRestage.value = true;
    }
  });

  watch(currentIndex, () => {
    if (hasPendingRestage.value && !isRestaging.value) {
      scheduleRestage();
    }
  });

  watch(() => toValue(questions).length, (nextLength, previousLength) => {
    if (isTransitioning.value || isRestaging.value) {
      return;
    }

    if (nextLength > previousLength) {
      const farSlotIndex = getSlotIndexForOffset(QUESTION_CARD_RING_RADIUS);
      slotQuestions.value[farSlotIndex] ??= getQuestionAtOffset(QUESTION_CARD_RING_RADIUS);
    }
  });

  function complete(direction: "backward" | "forward"): void {
    isSliding.value = false;
    const delta = direction === "forward" ? 1 : -1;
    currentSlotIndex.value = (currentSlotIndex.value + delta + RING_SIZE) % RING_SIZE;
  }

  stageSlots();

  return {
    complete,
    currentSlotIndex,
    getSlotIndexForOffset,
    slots,
  };
}

export { useQuestionCardRing };