import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { useGsapMock } from "~~/tests/unit/setup/nuxt/composables/use-gsap.nuxt.unit-setup";
import { createUseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";

import { GameQuestionCardSwitcher } from "#components";

import type { Question } from "#shared/types/question.types";
import type { GameQuestionCardSwitcherProps } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";

describe("GameQuestionCardSwitcher Component", () => {
  const defaultGameQuestionCardSwitcherProps: GameQuestionCardSwitcherProps = {
    direction: "forward",
    question: createFakeQuestion(),
  } as const;

  let wrapper: VueWrapper;
  let leavingQuestion: Question;
  let enteringQuestion: Question;

  function getCardElements(wrapperInstance: VueWrapper): { leavingCardElement: HTMLElement; enteringCardElement: HTMLElement } {
    return {
      leavingCardElement: wrapperInstance.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" }).element as HTMLElement,
      enteringCardElement: wrapperInstance.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" }).element as HTMLElement,
    };
  }

  async function mountGameQuestionCardSwitcher(options: MountSuspendedOptions<typeof GameQuestionCardSwitcher> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardSwitcher, { props: defaultGameQuestionCardSwitcherProps, ...options });
  }

  beforeEach(async() => {
    leavingQuestion = createFakeQuestion();
    enteringQuestion = createFakeQuestion();
    wrapper = await mountGameQuestionCardSwitcher();
  });

  it("should render the leaving question card when mounted.", () => {
    expect(wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" }).exists()).toBe(true);
  });

  it("should render the entering question card when mounted.", () => {
    expect(wrapper.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" }).exists()).toBe(true);
  });

  it("should pass the current question to the leaving card when no transition is active.", () => {
    const leavingCard = wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" });

    expect(leavingCard.props("question")).toBe(defaultGameQuestionCardSwitcherProps.question);
  });

  it("should pass the current question to the entering card when no transition is active.", () => {
    const enteringCard = wrapper.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" });

    expect(enteringCard.props("question")).toBe(defaultGameQuestionCardSwitcherProps.question);
  });

  it("should hide the leaving card when mounted.", () => {
    const { leavingCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.set).toHaveBeenCalledExactlyOnceWith(leavingCardElement, { autoAlpha: 0 });
  });

  it("should not create a gsap timeline when mounted without a transition.", () => {
    expect(useGsapMock.instance.timeline).not.toHaveBeenCalled();
  });

  it("should pass the leaving question to the leaving card when a transition starts.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    const leavingCard = wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" });

    expect(leavingCard.props("question")).toStrictEqual(leavingQuestion);
  });

  it("should pass the entering question to the entering card when a transition starts.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    const enteringCard = wrapper.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" });

    expect(enteringCard.props("question")).toStrictEqual(enteringQuestion);
  });

  it("should run the transition through the gsap context when a transition starts.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();

    expect(useGsapMock.instance.add).toHaveBeenCalledExactlyOnceWith(expect.any(Function));
  });

  it("should reveal the leaving card at its natural state when transition direction is forward.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    const { leavingCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.set).toHaveBeenNthCalledWith(2, leavingCardElement, { autoAlpha: 1, xPercent: 0, rotation: 0 });
  });

  it("should set the entering card to its initial state when transition direction is forward.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    const { enteringCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.set).toHaveBeenNthCalledWith(3, enteringCardElement, { autoAlpha: 0, xPercent: 100, rotation: 6 });
  });

  it("should set the entering card to its initial state when transition direction is backward.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "backward" });
    await nextTick();
    const { enteringCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.set).toHaveBeenNthCalledWith(3, enteringCardElement, { autoAlpha: 0, xPercent: -100, rotation: -6 });
  });

  it("should create a gsap timeline with an onComplete callback when a transition starts.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();

    expect(useGsapMock.instance.timeline).toHaveBeenCalledExactlyOnceWith({ onComplete: expect.any(Function) as () => void });
  });

  it("should animate the leaving card out with expo.out ease when direction is forward.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    const { leavingCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(1, leavingCardElement, { autoAlpha: 0, xPercent: -100, rotation: -6, duration: 0.4, ease: "expo.out" }, 0);
  });

  it("should animate the entering card in with expo.out ease when direction is forward.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    const { enteringCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(2, enteringCardElement, { autoAlpha: 1, xPercent: 0, rotation: 0, duration: 0.4, ease: "expo.out" }, 0);
  });

  it("should animate the leaving card out with mirrored values when direction is backward.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "backward" });
    await nextTick();
    const { leavingCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(1, leavingCardElement, { autoAlpha: 0, xPercent: 100, rotation: 6, duration: 0.4, ease: "expo.out" }, 0);
  });

  it("should emit complete when the timeline onComplete callback fires.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();

    expect(wrapper.emitted("complete")).toStrictEqual([[]]);
  });

  it("should not create a new timeline when the transition state is cleared.", async() => {
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    await wrapper.setProps({ leavingQuestion: undefined, enteringQuestion: undefined });
    await nextTick();

    expect(useGsapMock.instance.timeline).toHaveBeenCalledOnce();
  });

  it("should revert the gsap context when the component unmounts.", () => {
    wrapper.unmount();

    expect(useGsapMock.instance.revert).toHaveBeenCalledExactlyOnceWith();
  });

  it("should not animate the cards when the card elements are not rendered.", async() => {
    wrapper.unmount();
    useGsapMock.instance = createUseGSAPMock();
    wrapper = await mountGameQuestionCardSwitcher({
      global: {
        stubs: {
          GameQuestionCard: {
            name: "GameQuestionCard",
            render: (): null => null,
          },
        },
      },
    });
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();

    expect(useGsapMock.instance.set).not.toHaveBeenCalled();
  });

  it("should use a zero duration when prefers-reduced-motion is active.", async() => {
    vi.spyOn(globalThis, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    await wrapper.setProps({ leavingQuestion, enteringQuestion, direction: "forward" });
    await nextTick();
    const { leavingCardElement } = getCardElements(wrapper);

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(1, leavingCardElement, { autoAlpha: 0, xPercent: -100, rotation: -6, duration: 0, ease: "expo.out" }, 0);
  });
});