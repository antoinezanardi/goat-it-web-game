import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { nextTick, ref } from "vue";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { UseQuestionCardRingOptions } from "./use-question-card-ring.types";
import { useQuestionCardRing } from "./useQuestionCardRing";

import type { Question } from "#shared/types/question.types";

describe(useQuestionCardRing, () => {
  let questions: Ref<Question[]>;
  let currentIndex: Ref<number>;
  let pendingDirection: Ref<"backward" | "forward" | undefined>;
  let onStaged: Mock<() => void>;
  let onResetSlot: Mock<(slotIndex: number) => void>;
  let requestAnimationFrameCallbacks: FrameRequestCallback[];

  function createOptions(): UseQuestionCardRingOptions {
    return {
      currentIndex,
      onResetSlot,
      onStaged,
      pendingDirection,
      questions,
    };
  }

  function flushRestage(): void {
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
  }

  beforeEach(() => {
    vi.resetAllMocks();
    questions = ref<Question[]>([createFakeQuestion(), createFakeQuestion(), createFakeQuestion()]);
    currentIndex = ref(1);
    pendingDirection = ref<"backward" | "forward" | undefined>(undefined);
    onStaged = vi.fn<() => void>();
    onResetSlot = vi.fn<(slotIndex: number) => void>();
    requestAnimationFrameCallbacks = [];
    // Acceptable as requestAnimationFrame is a callback-based browser API with no async alternative
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(callback => {
      requestAnimationFrameCallbacks.push(callback);

      return requestAnimationFrameCallbacks.length;
    });
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("visible");
  });

  it("should stage the current question in the active slot when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[0]?.question).toBe(questions.value[1]);
  });

  it("should mark the active slot as active when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[0]?.isActive).toBe(true);
  });

  it("should stage the next question in the +1 slot when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[1]?.question).toBe(questions.value[2]);
  });

  it("should stage undefined in the -1 slot when currentIndex is 0.", () => {
    currentIndex.value = 0;
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[2]?.question).toBeUndefined();
  });

  it("should stage undefined in the +1 slot when currentIndex is at the last question.", () => {
    currentIndex.value = 2;
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[1]?.question).toBeUndefined();
  });

  it.each<{ direction: "backward" | "forward"; expectedActiveIndex: number }>([
    { direction: "forward", expectedActiveIndex: 1 },
    { direction: "backward", expectedActiveIndex: 2 },
  ])("should rotate the active slot to $expectedActiveIndex when completing $direction.", ({ direction, expectedActiveIndex }) => {
    const { complete, currentSlotIndex } = useQuestionCardRing(createOptions());

    complete(direction);

    expect(currentSlotIndex.value).toBe(expectedActiveIndex);
  });

  it("should mark the active slot with the active data-testid when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[0]?.dataTestid).toBe("game-question");
  });

  it("should mark non-active slots with the staged data-testid when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[1]?.dataTestid).toBe("game-question-staged");
  });

  it("should set inert on the active slot to false when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[0]?.inert).toBe(false);
  });

  it("should set aria-hidden on the active slot to undefined when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[0]?.ariaHidden).toBeUndefined();
  });

  it("should set inert on non-active slots to true when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[1]?.inert).toBe(true);
  });

  it("should set aria-hidden on non-active slots to true when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[1]?.ariaHidden).toBe("true");
  });

  it("should freeze all slots when a transition starts.", async() => {
    const { slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();

    expect(slots.value.every(slot => slot.isFrozen)).toBe(true);
  });

  it("should unfreeze the new active slot when a transition is completed.", () => {
    const { complete, slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    complete("forward");

    expect(slots.value[1]?.isFrozen).toBe(false);
  });

  it("should keep non-active slots frozen when a transition is completed.", () => {
    const { complete, slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    complete("forward");

    expect(slots.value[0]?.isFrozen).toBe(true);
  });

  it("should freeze all slots when the document is hidden.", () => {
    vi.spyOn(document, "visibilityState", "get").mockReturnValue("hidden");
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value.every(slot => slot.isFrozen)).toBe(true);
  });

  it("should call onStaged after restaging when currentIndex changes following a transition.", async() => {
    const { complete } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    flushRestage();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);

    expect(onStaged).toHaveBeenCalledExactlyOnceWith();
  });

  it("should call onResetSlot for the far slot when restaging is triggered.", async() => {
    const { complete } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    flushRestage();

    expect(onResetSlot).toHaveBeenCalledExactlyOnceWith(2);
  });

  it("should update the far slot question when restaging is triggered.", async() => {
    const { complete, slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    flushRestage();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);

    expect(slots.value[2]?.question).toBe(questions.value[3]);
  });

  it("should stage a newly available next question when the questions array grows.", async() => {
    currentIndex.value = 2;
    const { slots } = useQuestionCardRing(createOptions());

    questions.value = [...questions.value, createFakeQuestion()];
    await nextTick();

    expect(slots.value[1]?.question).toBe(questions.value[3]);
  });

  it("should not restage when questions shrink.", async() => {
    const { slots } = useQuestionCardRing(createOptions());
    const originalFarSlotQuestion = slots.value[1]?.question;

    questions.value = questions.value.slice(0, -1);
    await nextTick();

    expect(slots.value[1]?.question).toBe(originalFarSlotQuestion);
  });

  it("should not stage when questions grow while a transition is in progress.", async() => {
    const { slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    questions.value = [...questions.value, createFakeQuestion()];

    expect(slots.value[1]?.question).toBe(questions.value[2]);
  });

  it("should not restage when currentIndex changes without a pending transition.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    currentIndex.value = 2;

    expect(slots.value[0]?.question).toBe(questions.value[1]);
  });

  it("should not call onStaged when currentIndex changes without a pending transition.", () => {
    useQuestionCardRing(createOptions());

    currentIndex.value = 2;

    expect(onStaged).not.toHaveBeenCalled();
  });
});