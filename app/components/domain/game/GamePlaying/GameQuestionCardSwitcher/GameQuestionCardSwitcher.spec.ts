import type { DOMWrapper, VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { useGsapMock } from "~~/tests/unit/setup/nuxt/composables/use-gsap.nuxt.unit-setup";
import { usePreferredReducedMotionMock } from "~~/tests/unit/setup/nuxt/composables/use-preferred-reduced-motion.nuxt.unit-setup";

import { GameQuestionCardSwitcher } from "#components";

import type { GameQuestionCardSwitcherProps } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";

describe("GameQuestionCardSwitcher Component", () => {
  const firstQuestion = createFakeQuestion();
  const secondQuestion = createFakeQuestion();
  const thirdQuestion = createFakeQuestion();

  const defaultGameQuestionCardSwitcherProps: GameQuestionCardSwitcherProps = {
    currentIndex: 1,
    questions: [firstQuestion, secondQuestion, thirdQuestion],
  } as const;

  let wrapper: VueWrapper;
  let requestAnimationFrameCallbacks: FrameRequestCallback[];

  async function mountGameQuestionCardSwitcher(options: MountSuspendedOptions<typeof GameQuestionCardSwitcher> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardSwitcher, {
      props: defaultGameQuestionCardSwitcherProps,
      ...options,
    });
  }

  function getCardContainers(wrapperInstance: VueWrapper): DOMWrapper<Element>[] {
    return wrapperInstance.findAll(".absolute.inset-0.will-change-transform");
  }

  function getVisibleCardElement(wrapperInstance: VueWrapper): DOMWrapper<Element> {
    return wrapperInstance.find("[data-testid='game-question']");
  }

  function getStagedCardElement(wrapperInstance: VueWrapper, index: number): DOMWrapper<Element> {
    const elements = wrapperInstance.findAll("[data-testid='game-question-staged']");
    const element = elements[index];
    if (!element) {
      throw new Error(`No staged card at index ${index}`);
    }
    return element;
  }

  function getContainerParent(element: Element): HTMLElement {
    const parent = (element as HTMLElement).parentElement;

    if (!(parent instanceof HTMLElement)) {
      throw new Error("Expected mounted card container to have an HTMLElement parent.");
    }
    return parent;
  }

  beforeEach(async() => {
    requestAnimationFrameCallbacks = [];
    // Acceptable as requestAnimationFrame mock captures the callback synchronously for test control
    // oxlint-disable-next-line promise/prefer-await-to-callbacks
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(callback => {
      requestAnimationFrameCallbacks.push(callback);

      return requestAnimationFrameCallbacks.length;
    });
    wrapper = await mountGameQuestionCardSwitcher();
  });

  it("should render GameQuestionCardSwitcher when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render three card containers when mounted.", () => {
    expect(getCardContainers(wrapper)).toHaveLength(3);
  });

  it("should render the current question when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCard" }).props("question")).toStrictEqual(secondQuestion);
  });

  it("should set the active card prop when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCard" }).props("isActive")).toBe(true);
  });

  it("should render staged cards in the non-active slots when mounted.", () => {
    expect(wrapper.findAll("[data-testid='game-question-staged']")).toHaveLength(2);
  });

  it("should set the active card container to resting state when mounted.", () => {
    expect(useGsapMock.instance.set).toHaveBeenCalledWith(
      getContainerParent(getVisibleCardElement(wrapper).element),
      { opacity: 1, rotation: 0, xPercent: 0, zIndex: 1 },
    );
  });

  it("should set the first staged container to resting state when mounted.", () => {
    expect(useGsapMock.instance.set).toHaveBeenCalledWith(
      getContainerParent(getStagedCardElement(wrapper, 0).element),
      { opacity: 0, rotation: 0, xPercent: 0, zIndex: 0 },
    );
  });

  it("should set the second staged container to resting state when mounted.", () => {
    expect(useGsapMock.instance.set).toHaveBeenCalledWith(
      getContainerParent(getStagedCardElement(wrapper, 1).element),
      { opacity: 0, rotation: 0, xPercent: 0, zIndex: 0 },
    );
  });

  it("should create a paused gsap timeline once when mounted.", () => {
    expect(useGsapMock.instance.timeline).toHaveBeenCalledExactlyOnceWith({ paused: true });
  });

  it("should start a forward slide when pendingDirection becomes forward.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.restart).toHaveBeenCalledWith();
  });

  it("should position the entering card to the right when pendingDirection is forward.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.set).toHaveBeenCalledWith(
      getContainerParent(getStagedCardElement(wrapper, 0).element),
      { opacity: 0, rotation: 6, xPercent: 100, zIndex: 2 },
    );
  });

  it("should position the entering card to the left when pendingDirection is backward.", async() => {
    await wrapper.setProps({ pendingDirection: "backward" });
    await nextTick();

    expect(useGsapMock.instance.set).toHaveBeenCalledWith(
      getContainerParent(getStagedCardElement(wrapper, 1).element),
      { opacity: 0, rotation: -6, xPercent: -100, zIndex: 2 },
    );
  });

  it("should animate the leaving card out when pendingDirection is forward.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(
      1,
      getContainerParent(getVisibleCardElement(wrapper).element),
      { duration: 0.4, ease: "expo.out", opacity: 0, rotation: -6, xPercent: -100 },
      0,
    );
  });

  it("should animate the entering card in when pendingDirection is forward.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(
      2,
      getContainerParent(getStagedCardElement(wrapper, 0).element),
      { duration: 0.4, ease: "expo.out", opacity: 1, rotation: 0, xPercent: 0 },
      0,
    );
  });

  it("should never use autoAlpha when a slide starts.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    const allCalls = [
      ...useGsapMock.instance.set.mock.calls,
      ...useGsapMock.instance.timelineTo.mock.calls,
    ];

    expect(allCalls.every(call => !Object.keys(call[1]).includes("autoAlpha"))).toBe(true);
  });

  it("should use a duration of 0 when reduced motion is preferred.", async() => {
    usePreferredReducedMotionMock.instance.preferredReducedMotionRef.value = "reduce";
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(
      1,
      getContainerParent(getVisibleCardElement(wrapper).element),
      { duration: 0, ease: "expo.out", opacity: 0, rotation: -6, xPercent: -100 },
      0,
    );
  });

  it("should use duration 0 when reduced-motion preference changes during a slide.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    usePreferredReducedMotionMock.instance.preferredReducedMotionRef.value = "reduce";
    await wrapper.setProps({ pendingDirection: undefined });
    await nextTick();
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(
      3,
      getContainerParent(getVisibleCardElement(wrapper).element),
      { duration: 0, ease: "expo.out", opacity: 0, rotation: -6, xPercent: -100 },
      0,
    );
  });

  it("should reuse the existing timeline when a second slide starts.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();
    await nextTick();
    await wrapper.setProps({ currentIndex: 2 });
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    await wrapper.setProps({ pendingDirection: undefined });
    await nextTick();
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.timeline).toHaveBeenCalledOnce();
  });

  it("should clear the timeline when a second slide starts.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();
    await nextTick();
    await wrapper.setProps({ currentIndex: 2 });
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    await wrapper.setProps({ pendingDirection: undefined });
    await nextTick();
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.clear).toHaveBeenCalledTimes(2);
  });

  it("should emit complete when the timeline onComplete fires.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();

    expect(wrapper.emitted("complete")).toStrictEqual([[]]);
  });

  it("should emit staged when the restage cycle completes.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();
    await nextTick();
    await wrapper.setProps({ currentIndex: 2 });
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();

    expect(wrapper.emitted("staged")).toStrictEqual([[]]);
  });

  it("should emit complete count when a slide finishes.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();
    await nextTick();
    await wrapper.setProps({ currentIndex: 2 });
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();

    expect(wrapper.emitted("complete")?.length).toBe(1);
  });

  it("should emit staged count when a slide finishes.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();
    await nextTick();
    await wrapper.setProps({ currentIndex: 2 });
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();
    await nextTick();
    requestAnimationFrameCallbacks[0]?.(0);
    requestAnimationFrameCallbacks.splice(0, 1);
    await nextTick();

    expect(wrapper.emitted("staged")?.length).toBe(1);
  });

  it("should revert the gsap context when the component unmounts.", () => {
    wrapper.unmount();

    expect(useGsapMock.instance.revert).toHaveBeenCalledExactlyOnceWith();
  });
});