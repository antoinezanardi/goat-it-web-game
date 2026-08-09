import type { VueWrapper } from "@vue/test-utils";
import { mockNuxtImport, mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { nextTick } from "vue";
import type { Ref } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import type { Question } from "#shared/types/question.types";
import GamePlaying from "@/components/domain/game/GamePlaying/GamePlaying.vue";

type GsapSetSignature = (element: HTMLElement, variables: Record<string, number>) => void;

type GsapTimelineToSignature = (target: HTMLElement, variables: Record<string, number | string>, position: number) => { to: Mock };

type GsapTimelineSignature = (config: { onComplete?: () => void }) => { to: Mock };

type GsapContextSignature = (callback: () => void) => { revert: Mock };

type GamePlayingSetupState = {
  enteringQuestion: Ref<Question | undefined>;
  leavingQuestion: Ref<Question | undefined>;
  handlePrevious: () => void;
};

function getGamePlayingSetupState(wrapper: VueWrapper): GamePlayingSetupState {
  return (wrapper as VueWrapper & { setupState: GamePlayingSetupState }).setupState;
}

// Acceptable as mock factory return type is inferred from vi.fn
// oxlint-disable-next-line typescript/explicit-function-return-type
mockNuxtImport("useGSAP", () => () => ({
  // Acceptable as gsap.context requires the callback pattern
  // oxlint-disable-next-line promise/prefer-await-to-callbacks
  context: vi.fn<GsapContextSignature>(callback => {
    // Acceptable as gsap.context invokes the callback synchronously
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    callback();

    return { revert: vi.fn<() => void>() };
  }),
  set: vi.fn<GsapSetSignature>(),
  timeline: vi.fn<GsapTimelineSignature>(() => ({
    to: vi.fn<GsapTimelineToSignature>(() => ({ to: vi.fn<GsapTimelineToSignature>() })),
  })),
}));

describe("GamePlaying Component", () => {
  let wrapper: VueWrapper;
  let firstQuestion: Question;
  let secondQuestion: Question;
  let thirdQuestion: Question;

  async function mountGamePlayingComponent(options: MountSuspendedOptions<typeof GamePlaying> = {}): Promise<VueWrapper> {
    const { props: propsOverride, ...restOptions } = options;

    return mountSuspended(GamePlaying, {
      shallow: false,
      props: propsOverride ?? {
        canGoToPreviousQuestion: false,
        currentIndex: 0,
        currentQuestion: firstQuestion,
        questions: [firstQuestion, secondQuestion],
      },
      ...restOptions,
    });
  }

  beforeEach(async() => {
    firstQuestion = createFakeQuestion();
    secondQuestion = createFakeQuestion();
    thirdQuestion = createFakeQuestion();
    wrapper = await mountGamePlayingComponent();
  });

  describe("rendering", () => {
    it("should render GameNextQuestionButton when mounted.", () => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });

      expect(nextButton.exists()).toBeTruthy();
    });

    it("should not render GamePreviousQuestionButton when canGoToPreviousQuestion is false.", () => {
      const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });

      expect(previousButton.exists()).toBeFalsy();
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

      const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });

      expect(previousButton.exists()).toBeTruthy();
    });

    it("should render GameQuestionCard with the current question when no transition is active.", () => {
      const card = wrapper.findComponent({ name: "GameQuestionCard" });

      expect(card.props("question")).toStrictEqual(firstQuestion);
    });

    it("should not render the single GameQuestionCard when a transition is active.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      expect(wrapper.findAllComponents({ name: "GameQuestionCard" })).toHaveLength(2);
    });

    it("should render GameQuestionCardTransition when navigating forward.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });

      expect(transition.exists()).toBeTruthy();
    });

    it("should pass leavingQuestion to the transition component when a transition is active.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });

      expect(transition.props("leavingQuestion")).toStrictEqual(firstQuestion);
    });

    it("should pass enteringQuestion to the transition component when a transition is active.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });

      expect(transition.props("enteringQuestion")).toStrictEqual(secondQuestion);
    });

    it("should pass transitionDirection to the transition component when navigating forward.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });

      expect(transition.props("direction")).toBe("forward");
    });

    it("should pass isTransitioning as disabled to the Next button when a transition is active.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const nextButtonAfter = wrapper.findComponent({ name: "GameNextQuestionButton" });

      expect(nextButtonAfter.props("disabled")).toBe(true);
    });

    it("should pass isTransitioning as disabled to the Previous button when a transition is active.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [firstQuestion, secondQuestion],
        },
      });

      const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });
      getWrapperVm(previousButton).$emit("click");
      await nextTick();

      const previousButtonAfter = wrapper.findComponent({ name: "GamePreviousQuestionButton" });

      expect(previousButtonAfter.props("disabled")).toBe(true);
    });
  });

  describe("transition logic", () => {
    it("should set transition direction to forward when navigating forward.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });

      expect(transition.props("direction")).toBe("forward");
    });

    it("should set transition direction to backward when navigating previous.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [firstQuestion, secondQuestion, thirdQuestion],
        },
      });

      const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });
      getWrapperVm(previousButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });

      expect(transition.props("direction")).toBe("backward");
    });

    it("should emit advance when the transition completes in forward direction.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });
      getWrapperVm(transition).$emit("complete");
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

      const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });
      getWrapperVm(previousButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });
      getWrapperVm(transition).$emit("complete");
      await nextTick();

      expect(wrapper.emitted("previous")).toHaveLength(1);
    });

    it("should remove the transition component when the transition completes.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });
      getWrapperVm(transition).$emit("complete");
      await nextTick();

      expect(wrapper.findComponent({ name: "GameQuestionCardTransition" }).exists()).toBeFalsy();
    });

    it("should emit advance when clicking Next with no entering question.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: false,
          currentIndex: 0,
          currentQuestion: firstQuestion,
          questions: [firstQuestion],
        },
      });

      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should not trigger a double transition when clicking Next during an active transition.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      expect(wrapper.findAllComponents({ name: "GameQuestionCardTransition" })).toHaveLength(1);
    });

    it("should not trigger a transition when clicking Previous with canGoToPreviousQuestion false.", () => {
      const setupState = getGamePlayingSetupState(wrapper);
      setupState.handlePrevious();

      expect(wrapper.findComponent({ name: "GameQuestionCardTransition" }).exists()).toBeFalsy();
    });

    it("should emit advance when the entering question equals the leaving question.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: false,
          currentIndex: 0,
          currentQuestion: firstQuestion,
          questions: [firstQuestion, firstQuestion],
        },
      });

      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
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

      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });
      getWrapperVm(previousButton).$emit("click");
      await nextTick();

      expect(wrapper.emitted("previous")).toBeUndefined();
    });

    it("should emit previous when clicking Previous with no valid entering question.", async() => {
      wrapper = await mountGamePlayingComponent({
        props: {
          canGoToPreviousQuestion: true,
          currentIndex: 1,
          currentQuestion: secondQuestion,
          questions: [secondQuestion, secondQuestion],
        },
      });

      const previousButton = wrapper.findComponent({ name: "GamePreviousQuestionButton" });
      getWrapperVm(previousButton).$emit("click");
      await nextTick();

      expect(wrapper.emitted("previous")).toHaveLength(1);
    });
  });

  describe("safety timeout", () => {
    const safetyTimeoutMs = 600;

    it("should emit advance when the safety timeout fires.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should clear the transition state when the safety timeout fires.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.findComponent({ name: "GameQuestionCardTransition" }).exists()).toBeFalsy();
    });

    it("should not fire safety timeout fallback when onTransitionComplete clears it first.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const transition = wrapper.findComponent({ name: "GameQuestionCardTransition" });
      getWrapperVm(transition).$emit("complete");
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.emitted("advance")).toHaveLength(1);
    });

    it("should not emit advance when the safety timeout fires with no entering question.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const setupState = getGamePlayingSetupState(wrapper);
      setupState.enteringQuestion.value = undefined;
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.emitted("advance")).toBeUndefined();
    });

    it("should not emit advance when the safety timeout fires with no leaving question.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      const setupState = getGamePlayingSetupState(wrapper);
      setupState.leavingQuestion.value = undefined;
      vi.advanceTimersByTime(safetyTimeoutMs);
      await nextTick();

      expect(wrapper.emitted("advance")).toBeUndefined();
    });

    it("should clear the safety timeout when unmounting during a transition.", async() => {
      const nextButton = wrapper.findComponent({ name: "GameNextQuestionButton" });
      getWrapperVm(nextButton).$emit("click");
      await nextTick();

      wrapper.unmount();
      vi.advanceTimersByTime(safetyTimeoutMs);

      expect(wrapper.emitted("advance")).toBeUndefined();
    });
  });
});