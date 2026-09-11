import { computed, nextTick, ref, toValue, watch } from "vue";
import { useDocumentVisibility } from "@vueuse/core";

import { QUESTION_CARD_RING_RADIUS, QUESTION_CARD_RING_SIZE } from "~/composables/domain/useQuestionCardRing/use-question-card-ring.constants";
import type { QuestionCardRingSlot, UseQuestionCardRingOptions, UseQuestionCardRingReturn } from "~/composables/domain/useQuestionCardRing/use-question-card-ring.types";
import type { Question } from "#shared/types/question.types";

function useQuestionCardRing(options: UseQuestionCardRingOptions): UseQuestionCardRingReturn {
  const { questions } = options;
  const { currentIndex } = options;
  const { pendingDirection } = options;
  const documentVisibility = useDocumentVisibility();

  const currentSlotIndex = ref(0);
  // Acceptable as `undefined` marks empty ring slots before stageSlots fills them
  // oxlint-disable-next-line unicorn/no-useless-undefined
  const slotQuestions = ref<(Question | undefined)[]>(Array.from({ length: QUESTION_CARD_RING_SIZE }, () => undefined));
  const isSliding = ref<boolean>(false);
  const isTransitioning = ref<boolean>(false);
  const hasPendingRestage = ref<boolean>(false);
  const isRestaging = ref<boolean>(false);
  const lastCompletedDirection = ref<"backward" | "forward">("forward");

  function getSlotIndexForOffset(offset: number): number {
    return (currentSlotIndex.value + offset + QUESTION_CARD_RING_SIZE) % QUESTION_CARD_RING_SIZE;
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
    const farOffset = lastCompletedDirection.value === "forward" ? QUESTION_CARD_RING_RADIUS : -QUESTION_CARD_RING_RADIUS;
    const farSlotIndex = getSlotIndexForOffset(farOffset);
    slotQuestions.value[farSlotIndex] = getQuestionAtOffset(farOffset);
  }

  function scheduleRestage(): void {
    isRestaging.value = true;
    requestAnimationFrame(() => {
      restageFarSlot();
      const farOffset = lastCompletedDirection.value === "forward" ? QUESTION_CARD_RING_RADIUS : -QUESTION_CARD_RING_RADIUS;
      options.onResetSlot?.(getSlotIndexForOffset(farOffset));

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
    lastCompletedDirection.value = direction;
    const delta = direction === "forward" ? 1 : -1;
    currentSlotIndex.value = (currentSlotIndex.value + delta + QUESTION_CARD_RING_SIZE) % QUESTION_CARD_RING_SIZE;
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