import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { nextTick, ref } from "vue";

import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";

import type { UseQuestionCardRingOptions } from "~/composables/domain/useQuestionCardRing/use-question-card-ring.types";
import { QUESTION_CARD_RING_RESTAGE_SAFETY_TIMEOUT_MS } from "~/composables/domain/useQuestionCardRing/use-question-card-ring.constants";
import { useQuestionCardRing } from "~/composables/domain/useQuestionCardRing/useQuestionCardRing";
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

  function freezeAnimationFrames(): void {
    // Acceptable as requestAnimationFrame is a callback-based browser API with no async alternative
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(callback => {
      requestAnimationFrameCallbacks.push(callback);

      return requestAnimationFrameCallbacks.length;
    });
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

  it.each<{ description: string; slotIndex: number; questionIndex: number }>([
    { description: "the current question in the active slot", slotIndex: 0, questionIndex: 1 },
    { description: "the next question in the +1 slot", slotIndex: 1, questionIndex: 2 },
  ])("should stage $description when the composable is set up.", ({ slotIndex, questionIndex }) => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[slotIndex]?.question).toBe(questions.value[questionIndex]);
  });

  it("should mark the active slot as active when the composable is set up.", () => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[0]?.isActive).toBe(true);
  });

  it.each<{ condition: string; index: number; slotDescription: string; slotIndex: number }>([
    { condition: "0", index: 0, slotDescription: "-1", slotIndex: 2 },
    { condition: "at the last question", index: 2, slotDescription: "+1", slotIndex: 1 },
  ])("should stage undefined in the $slotDescription slot when currentIndex is $condition.", ({ index, slotIndex }) => {
    currentIndex.value = index;
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[slotIndex]?.question).toBeUndefined();
  });

  it.each<{ direction: "backward" | "forward"; expectedActiveIndex: number }>([
    { direction: "forward", expectedActiveIndex: 1 },
    { direction: "backward", expectedActiveIndex: 2 },
  ])("should rotate the active slot to $expectedActiveIndex when completing $direction.", ({ direction, expectedActiveIndex }) => {
    const { complete, currentSlotIndex } = useQuestionCardRing(createOptions());

    complete(direction);

    expect(currentSlotIndex.value).toBe(expectedActiveIndex);
  });

  it.each<{ description: string; expectedDataTestid: string; slotIndex: number }>([
    { description: "the active slot with the active data-testid", expectedDataTestid: "game-question", slotIndex: 0 },
    { description: "non-active slots with the staged data-testid", expectedDataTestid: "game-question-staged", slotIndex: 1 },
  ])("should mark $description when the composable is set up.", ({ expectedDataTestid, slotIndex }) => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[slotIndex]?.dataTestid).toBe(expectedDataTestid);
  });

  it.each<{ description: string; expectedInert: boolean; slotIndex: number }>([
    { description: "the active slot", expectedInert: false, slotIndex: 0 },
    { description: "non-active slots", expectedInert: true, slotIndex: 1 },
  ])("should set inert on $description to $expectedInert when the composable is set up.", ({ expectedInert, slotIndex }) => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[slotIndex]?.inert).toBe(expectedInert);
  });

  it.each<{ description: string; expectedAriaHidden: string | undefined; slotIndex: number }>([
    { description: "the active slot", expectedAriaHidden: undefined, slotIndex: 0 },
    { description: "non-active slots", expectedAriaHidden: "true", slotIndex: 1 },
  ])("should set aria-hidden on $description to $expectedAriaHidden when the composable is set up.", ({ expectedAriaHidden, slotIndex }) => {
    const { slots } = useQuestionCardRing(createOptions());

    expect(slots.value[slotIndex]?.ariaHidden).toBe(expectedAriaHidden);
  });

  it("should freeze all slots when a transition starts.", async() => {
    const { slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();

    expect(slots.value.every(slot => slot.isFrozen)).toBe(true);
  });

  it.each<{ action: string; expectedFrozen: boolean; slotIndex: number }>([
    { action: "unfreeze the new active slot", expectedFrozen: false, slotIndex: 1 },
    { action: "keep non-active slots frozen", expectedFrozen: true, slotIndex: 0 },
  ])("should $action when a transition is completed.", async({ expectedFrozen, slotIndex }) => {
    const { complete, slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");

    expect(slots.value[slotIndex]?.isFrozen).toBe(expectedFrozen);
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

  it("should update the far slot question when the safety timeout fires without animation frames.", async() => {
    vi.useFakeTimers();
    freezeAnimationFrames();
    const { complete, slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    vi.advanceTimersByTime(QUESTION_CARD_RING_RESTAGE_SAFETY_TIMEOUT_MS);
    vi.useRealTimers();

    expect(slots.value[2]?.question).toBe(questions.value[3]);
  });

  it("should call onResetSlot for the far slot when the safety timeout fires without animation frames.", async() => {
    vi.useFakeTimers();
    freezeAnimationFrames();
    const { complete } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    vi.advanceTimersByTime(QUESTION_CARD_RING_RESTAGE_SAFETY_TIMEOUT_MS);
    vi.useRealTimers();

    expect(onResetSlot).toHaveBeenCalledExactlyOnceWith(2);
  });

  it("should call onStaged when the safety timeout fires without animation frames.", async() => {
    vi.useFakeTimers();
    freezeAnimationFrames();
    const { complete } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    vi.advanceTimersByTime(QUESTION_CARD_RING_RESTAGE_SAFETY_TIMEOUT_MS);
    vi.useRealTimers();

    expect(onStaged).toHaveBeenCalledExactlyOnceWith();
  });

  it("should not call onStaged twice when animation frames resume after the safety timeout restage.", async() => {
    vi.useFakeTimers();
    freezeAnimationFrames();
    const { complete } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    vi.advanceTimersByTime(QUESTION_CARD_RING_RESTAGE_SAFETY_TIMEOUT_MS);
    flushRestage();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    vi.useRealTimers();

    expect(onStaged).toHaveBeenCalledExactlyOnceWith();
  });

  it("should stage a newly available next question when the questions array grows.", async() => {
    currentIndex.value = 2;
    const { slots } = useQuestionCardRing(createOptions());

    questions.value = [...questions.value, createFakeQuestion()];
    await nextTick();

    expect(slots.value[1]?.question).toBe(questions.value[3]);
  });

  it("should clear the next slot question when the questions array no longer has a question at that offset.", async() => {
    const { slots } = useQuestionCardRing(createOptions());

    questions.value = questions.value.slice(0, -1);
    await nextTick();

    expect(slots.value[1]?.question).toBeUndefined();
  });

  it.each<{ description: string; questionIndex: number; slotIndex: number }>([
    { description: "the replaced current question in the active slot", questionIndex: 1, slotIndex: 0 },
    { description: "the replaced next question in the next slot", questionIndex: 2, slotIndex: 1 },
  ])("should stage $description when the questions array is replaced at the same length.", async({ questionIndex, slotIndex }) => {
    const { slots } = useQuestionCardRing(createOptions());

    questions.value = [createFakeQuestion(), createFakeQuestion(), createFakeQuestion()];
    await nextTick();

    expect(slots.value[slotIndex]?.question).toBe(questions.value[questionIndex]);
  });

  it("should keep the unchanged previous question in the previous slot when the questions array is replaced at the same length.", async() => {
    const { slots } = useQuestionCardRing(createOptions());
    const previousQuestion = createFakeQuestion();

    questions.value = [previousQuestion, createFakeQuestion(), createFakeQuestion()];
    await nextTick();
    questions.value = [previousQuestion, createFakeQuestion(), createFakeQuestion()];
    await nextTick();

    expect(slots.value[2]?.question).toBe(questions.value[0]);
  });

  it("should stage the refetched question in the next slot when the questions array shrinks and then grows.", async() => {
    currentIndex.value = 0;
    const { slots } = useQuestionCardRing(createOptions());

    questions.value = questions.value.slice(0, 1);
    await nextTick();
    questions.value = [...questions.value, createFakeQuestion(), createFakeQuestion(), createFakeQuestion()];
    await nextTick();

    expect(slots.value[1]?.question).toBe(questions.value[1]);
  });

  it("should apply the replaced questions after the restage completes when the questions array is replaced during a transition.", async() => {
    const { complete, currentSlotIndex, slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "forward";
    await nextTick();
    questions.value = [createFakeQuestion(), createFakeQuestion(), createFakeQuestion()];
    complete("forward");
    currentIndex.value = 2;
    await nextTick();
    flushRestage();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);

    expect(slots.value[currentSlotIndex.value]?.question).toBe(questions.value[2]);
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

  it("should display the correct question when two consecutive backward transitions complete.", async() => {
    questions.value = [createFakeQuestion(), createFakeQuestion(), createFakeQuestion(), createFakeQuestion()];
    currentIndex.value = 2;
    const { complete, currentSlotIndex, slots } = useQuestionCardRing(createOptions());

    pendingDirection.value = "backward";
    await nextTick();
    complete("backward");
    currentIndex.value = 1;
    await nextTick();
    flushRestage();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    pendingDirection.value = undefined;
    await nextTick();

    pendingDirection.value = "backward";
    await nextTick();
    complete("backward");
    currentIndex.value = 0;
    await nextTick();
    flushRestage();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);

    expect(slots.value[currentSlotIndex.value]?.question).toBe(questions.value[0]);
  });
});