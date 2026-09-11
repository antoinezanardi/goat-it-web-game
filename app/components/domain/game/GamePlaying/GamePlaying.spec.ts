import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GamePlaying } from "#components";

import type { GamePlayingProps } from "@/components/domain/game/GamePlaying/game-playing.types";
import type { Question } from "#shared/types/question.types";

describe("GamePlaying Component", () => {
  const firstQuestion: Question = createFakeQuestion();
  const secondQuestion: Question = createFakeQuestion();
  const thirdQuestion: Question = createFakeQuestion();

  const defaultGamePlayingProps: GamePlayingProps = {
    canGoToPreviousQuestion: false,
    currentIndex: 0,
    currentQuestion: firstQuestion,
    questions: [firstQuestion, secondQuestion],
  };

  let wrapper: VueWrapper;
  let requestAnimationFrameCallbacks: FrameRequestCallback[];

  async function mountGamePlayingComponent(options: MountSuspendedOptions<typeof GamePlaying> = {}): Promise<VueWrapper> {
    const { props: propsOverride, ...restOptions } = options;

    return mountSuspended(GamePlaying, {
      shallow: false,
      props: propsOverride ?? defaultGamePlayingProps,
      ...restOptions,
    });
  }

  // Acceptable as return type is inferred from findComponent and explicit annotation causes typecheck issues with VueWrapper generics
  // oxlint-disable-next-line typescript/explicit-function-return-type
  function getSwitcher() {
    return wrapper.findComponent({ name: "GameQuestionCardSwitcher" });
  }

  function clickNext(): void {
    const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
    getWrapperVm(nextButton).$emit("click");
  }

  function clickPrevious(): void {
    const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });
    getWrapperVm(previousButton).$emit("click");
  }

  function completeTransition(): void {
    getWrapperVm(getSwitcher()).$emit("complete");
  }

  async function runStagedCycle(updatedCurrentIndex: number): Promise<void> {
    await wrapper.setProps({ currentIndex: updatedCurrentIndex });
    await nextTick();
    while (requestAnimationFrameCallbacks.length > 0) {
      requestAnimationFrameCallbacks.shift()?.(0);
      // Acceptable as sequential draining of requestAnimationFrame callbacks is required for intermediate state to resolve
      // oxlint-disable-next-line eslint/no-await-in-loop
      await nextTick();
    }
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
  }

  beforeEach(async() => {
    requestAnimationFrameCallbacks = [];
    // Acceptable as requestAnimationFrame mock intentionally captures the callback for manual execution
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(callback => {
      requestAnimationFrameCallbacks.push(callback);

      return requestAnimationFrameCallbacks.length;
    });
    wrapper = await mountGamePlayingComponent();
  });

  it("should render GamePlaying when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  describe("rendering", () => {
    it("should render GameNextQuestionButton when mounted.", () => {
      expect(wrapper.findComponent({ name: "GameNextQuestionButton" }).exists()).toBeTruthy();
    });

    it("should not render GamePreviousQuestionButton when canGoToPreviousQuestion is false.", () => {
      expect(wrapper.findComponent({ name: "GamePreviousQuestionButton" }).exists()).toBeFalsy();
    });

    it("should render GamePreviousQuestionButton when canGoToPreviousQuestion is true.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [firstQuestion, secondQuestion],
        },
      });

      expect(wrapper.findComponent({ name: "GamePreviousQuestionButton" }).exists()).toBeTruthy();
    });

    it("should render GameQuestionCardSwitcher when mounted.", () => {
      expect(getSwitcher().exists()).toBeTruthy();
    });

    it("should pass currentIndex to the switcher when mounted.", () => {
      expect(getSwitcher().props("currentIndex")).toBe(0);
    });

    it("should pass questions to the switcher when mounted.", () => {
      expect(getSwitcher().props("questions")).toStrictEqual([firstQuestion, secondQuestion]);
    });

    it("should not pass a pending direction to the switcher when no transition is active.", () => {
      expect(getSwitcher().props("pendingDirection")).toBeUndefined();
    });
  });

  describe("transition logic", () => {
    it("should set pendingDirection to forward when navigating forward.", async() => {
      clickNext();
      await nextTick();

      expect(getSwitcher().props("pendingDirection")).toBe("forward");
    });

    it("should set pendingDirection to backward when navigating previous.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [firstQuestion, secondQuestion, thirdQuestion],
        },
      });

      clickPrevious();
      await nextTick();

      expect(getSwitcher().props("pendingDirection")).toBe("backward");
    });

    it("should emit advance when the transition completes in forward direction.", async() => {
      clickNext();
      await nextTick();
      completeTransition();
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should emit previous when the transition completes in backward direction.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [firstQuestion, secondQuestion, thirdQuestion],
        },
      });

      clickPrevious();
      await nextTick();
      completeTransition();
      await nextTick();

      expect(wrapper.emitted("previous")).toHaveLength(1);
    });

    it("should hold the transition guard when a transition completes but staged has not fired.", async() => {
      clickNext();
      await nextTick();
      completeTransition();
      await nextTick();

      expect(wrapper.findComponent({ name: "GameNextQuestionButton" }).props("disabled")).toBe(true);
    });

    it("should release the transition guard when staged is emitted.", async() => {
      clickNext();
      await nextTick();
      completeTransition();
      await nextTick();
      await runStagedCycle(1);

      expect(wrapper.findComponent({ name: "GameNextQuestionButton" }).props("disabled")).toBe(false);
    });

    it("should clear pendingDirection when staged is emitted.", async() => {
      clickNext();
      await nextTick();
      completeTransition();
      await nextTick();
      await runStagedCycle(1);

      expect(getSwitcher().props("pendingDirection")).toBeUndefined();
    });

    it("should not trigger a double transition when clicking Next during an active transition.", async() => {
      clickNext();
      await nextTick();
      clickNext();
      await nextTick();

      expect(getSwitcher().props("pendingDirection")).toBe("forward");
    });

    it("should emit advance when clicking Next with no next question.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: false,
          currentIndex: 0,
          currentQuestion: firstQuestion,
          questions: [firstQuestion],
        },
      });

      clickNext();
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should emit advance when the next question equals the current question.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: false,
          currentIndex: 0,
          currentQuestion: firstQuestion,
          questions: [firstQuestion, firstQuestion],
        },
      });

      clickNext();
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should not trigger a transition when clicking Previous during an active transition.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [firstQuestion, secondQuestion, thirdQuestion],
        },
      });

      clickNext();
      await nextTick();
      clickPrevious();
      await nextTick();

      expect(wrapper.emitted("previous")).toBeUndefined();
    });

    it("should emit previous when clicking Previous with no valid previous question.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [secondQuestion, secondQuestion],
        },
      });

      clickPrevious();
      await nextTick();

      expect(wrapper.emitted("previous")).toHaveLength(1);
    });

    it("should disable the Next button when a transition is active.", async() => {
      clickNext();
      await nextTick();

      expect(wrapper.findComponent({ name: "GameNextQuestionButton" }).props("disabled")).toBe(true);
    });

    it("should disable the Previous button when a transition is active.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [firstQuestion, secondQuestion, thirdQuestion],
        },
      });

      clickPrevious();
      await nextTick();

      expect(wrapper.findComponent({ name: "GamePreviousQuestionButton" }).props("disabled")).toBe(true);
    });
  });

  describe("safety timeout", () => {
    const safetyTimeoutMs = 600;

    it("should emit advance when the safety timeout fires.", async() => {
      clickNext();
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should clear pendingDirection when the safety timeout fires.", async() => {
      clickNext();
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(getSwitcher().props("pendingDirection")).toBeUndefined();
    });

    it("should release the transition guard when the safety timeout fires.", async() => {
      clickNext();
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.findComponent({ name: "GameNextQuestionButton" }).props("disabled")).toBe(false);
    });

    it("should not fire safety timeout fallback when onTransitionComplete clears it first.", async() => {
      clickNext();
      await nextTick();
      completeTransition();
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should clear the safety timeout when unmounting during a transition.", async() => {
      clickNext();
      await nextTick();
      wrapper.unmount();
      vi.advanceTimersByTime(safetyTimeoutMs);

      expect(wrapper.emitted("advance")).toBeUndefined();
    });

    it("should return early from the safety timeout callback when onTransitionComplete already settled.", async() => {
      clickNext();
      await nextTick();
      completeTransition();
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should return early from onTransitionComplete when the safety timeout already settled.", async() => {
      clickNext();
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();
      completeTransition();
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });
  });
});