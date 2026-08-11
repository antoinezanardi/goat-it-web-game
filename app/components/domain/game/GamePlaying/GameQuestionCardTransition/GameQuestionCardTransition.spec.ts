import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { useGsapMock } from "~~/tests/unit/setup/nuxt/composables/use-gsap.nuxt.unit-setup";
import { createUseGSAPMock } from "~~/tests/unit/utils/mocks/composables/nuxt/useGsap/useGsap.mock";

import { GameQuestionCardTransition } from "#components";

import type { GameQuestionCardTransitionProps } from "@/components/domain/game/GamePlaying/GameQuestionCardTransition/game-question-card-transition.types";

describe("GameQuestionCardTransition Component", () => {
  const defaultProps: GameQuestionCardTransitionProps = {
    leavingQuestion: createFakeQuestion(),
    enteringQuestion: createFakeQuestion(),
    direction: "forward",
  };

  let wrapper: VueWrapper;

  async function mountTransition(options: MountSuspendedOptions<typeof GameQuestionCardTransition> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardTransition, { props: defaultProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountTransition();
  });

  it("should render the leaving question card when mounted.", () => {
    const leavingCard = wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" });

    expect(leavingCard.exists()).toBe(true);
  });

  it("should render the entering question card when mounted.", () => {
    const enteringCard = wrapper.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" });

    expect(enteringCard.exists()).toBe(true);
  });

  it("should pass the leaving question to the leaving card when mounted.", () => {
    const leavingCard = wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" });

    expect(leavingCard.props("question")).toBe(defaultProps.leavingQuestion);
  });

  it("should pass the entering question to the entering card when mounted.", () => {
    const enteringCard = wrapper.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" });

    expect(enteringCard.props("question")).toBe(defaultProps.enteringQuestion);
  });

  it("should position the wrapper relatively when mounted.", () => {
    expect(wrapper.find(".game-question-card-transition-wrapper").classes()).toContain("relative");
  });

  it("should position the leaving card container absolutely when mounted.", () => {
    expect(wrapper.find("[data-testid='card-transition-leaving']").classes()).toContain("absolute");
  });

  it("should apply the z-10 class to the entering card container when mounted.", () => {
    expect(wrapper.find("[data-testid='card-transition-entering']").classes()).toContain("z-10");
  });

  it("should create a gsap context when mounted.", () => {
    expect(useGsapMock.instance.context).toHaveBeenCalledExactlyOnceWith(expect.any(Function));
  });

  it("should set the entering card to its initial state when transition direction is forward.", () => {
    const enteringCardElement = wrapper.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" }).element as HTMLElement;

    expect(useGsapMock.instance.set).toHaveBeenCalledExactlyOnceWith(enteringCardElement, { xPercent: 100, rotation: 6, opacity: 0 });
  });

  it("should set the entering card to its initial state when transition direction is backward.", async() => {
    wrapper.unmount();
    useGsapMock.instance = createUseGSAPMock();
    wrapper = await mountTransition({ props: { ...defaultProps, direction: "backward" } });
    const enteringCardElement = wrapper.find("[data-testid='card-transition-entering']").findComponent({ name: "GameQuestionCard" }).element as HTMLElement;

    expect(useGsapMock.instance.set).toHaveBeenCalledExactlyOnceWith(enteringCardElement, { xPercent: -100, rotation: -6, opacity: 0 });
  });

  it("should create a gsap timeline with an onComplete callback when mounted.", () => {
    expect(useGsapMock.instance.timeline).toHaveBeenCalledExactlyOnceWith({ onComplete: expect.any(Function) as () => void });
  });

  it("should animate the leaving card out with expo.out ease when direction is forward.", () => {
    const leavingCardElement = wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" }).element as HTMLElement;

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(1, leavingCardElement, { xPercent: -100, rotation: -6, opacity: 0, duration: 0.4, ease: "expo.out" }, 0);
  });

  it("should animate the leaving card out with mirrored values when direction is backward.", async() => {
    wrapper.unmount();
    useGsapMock.instance = createUseGSAPMock();
    wrapper = await mountTransition({ props: { ...defaultProps, direction: "backward" } });
    const leavingCardElement = wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" }).element as HTMLElement;

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(1, leavingCardElement, { xPercent: 100, rotation: 6, opacity: 0, duration: 0.4, ease: "expo.out" }, 0);
  });

  it("should emit complete when the timeline onComplete callback fires.", () => {
    useGsapMock.instance.capturedOnComplete.current?.();

    expect(wrapper.emitted("complete")).toStrictEqual([[]]);
  });

  it("should revert the gsap context when the component unmounts.", () => {
    wrapper.unmount();

    expect(useGsapMock.instance.revert).toHaveBeenCalledExactlyOnceWith();
  });

  it("should not animate the cards when the card elements are not rendered.", async() => {
    wrapper.unmount();
    useGsapMock.instance = createUseGSAPMock();
    wrapper = await mountTransition({
      global: {
        stubs: {
          GameQuestionCard: {
            name: "GameQuestionCard",
            render: (): null => null,
          },
        },
      },
    });

    expect(useGsapMock.instance.set).not.toHaveBeenCalled();
  });

  it("should use a zero duration when prefers-reduced-motion is active.", async() => {
    vi.spyOn(globalThis, "matchMedia").mockReturnValue({ matches: true } as MediaQueryList);
    wrapper.unmount();
    useGsapMock.instance = createUseGSAPMock();
    wrapper = await mountTransition();
    const leavingCardElement = wrapper.find("[data-testid='card-transition-leaving']").findComponent({ name: "GameQuestionCard" }).element as HTMLElement;

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(1, leavingCardElement, { xPercent: -100, rotation: -6, opacity: 0, duration: 0, ease: "expo.out" }, 0);
  });
});