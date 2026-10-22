import type { DOMWrapper, VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import type { ComponentVm } from "~~/tests/unit/utils/types/vtu.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";
import { useGsapMock } from "~~/tests/unit/setup/nuxt/composables/use-gsap.nuxt.unit-setup";
import { usePreferredReducedMotionMock } from "~~/tests/unit/setup/nuxt/composables/use-preferred-reduced-motion.nuxt.unit-setup";

import type { GameQuestionCard } from "#components";
import { GameQuestionCardSwitcher } from "#components";

import type { GameQuestionCardSwitcherProps } from "@/components/domain/game/GamePlaying/GameQuestionCardSwitcher/game-question-card-switcher.types";
import type { GameNavigationDirection } from "@/utils/domain/game/game-navigation.types";

type GameQuestionCardSwitcherVm = ComponentVm & {
  applyRestingState: () => void;
  cardContainerReferences: (HTMLElement | undefined)[];
  resetSlot: (slotIndex: number) => void;
  startSlide: (direction: GameNavigationDirection) => void;
};

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
    return wrapperInstance.findAll("[data-testid^='game-question-slot-']");
  }

  function getVisibleCardElement(wrapperInstance: VueWrapper): DOMWrapper<Element> {
    return wrapperInstance.find("[data-testid='game-question']");
  }

  function getCardContainer(wrapperInstance: VueWrapper, slotIndex: number): DOMWrapper<Element> {
    return wrapperInstance.find(`[data-testid='game-question-slot-${slotIndex}']`);
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

  it("should render the card containers in slot order when mounted.", () => {
    const slotTestIds = wrapper.findAll("[data-testid^='game-question-slot-']")
      .map(container => container.attributes("data-testid"));

    expect(slotTestIds).toStrictEqual([
      "game-question-slot-0",
      "game-question-slot-1",
      "game-question-slot-2",
    ]);
  });

  it("should render the current question when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCard" }).props("question")).toStrictEqual(secondQuestion);
  });

  it("should set the active card prop when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCard" }).props("isActive")).toBe(true);
  });

  it("should mark the active question card as not frozen when mounted.", () => {
    expect(wrapper.findComponent<typeof GameQuestionCard>("[data-testid='game-question']").props("isFrozen")).toBe(false);
  });

  it("should mark the staged question card as frozen when mounted.", () => {
    expect(wrapper.findComponent<typeof GameQuestionCard>("[data-testid='game-question-staged']").props("isFrozen")).toBe(true);
  });

  it("should render staged cards in the non-active slots when mounted.", () => {
    expect(wrapper.findAll("[data-testid='game-question-staged']")).toHaveLength(2);
  });

  it.each<{
    description: string;
    getContainer: () => Element;
    expectedState: { opacity: number; rotation: number; xPercent: number; zIndex: number };
  }>([
    {
      description: "active card container",
      getContainer: (): Element => getCardContainer(wrapper, 0).element,
      expectedState: { opacity: 1, rotation: 0, xPercent: 0, zIndex: 1 },
    },
    {
      description: "first staged container",
      getContainer: (): Element => getCardContainer(wrapper, 1).element,
      expectedState: { opacity: 0, rotation: 0, xPercent: 0, zIndex: 0 },
    },
    {
      description: "second staged container",
      getContainer: (): Element => getCardContainer(wrapper, 2).element,
      expectedState: { opacity: 0, rotation: 0, xPercent: 0, zIndex: 0 },
    },
  ])("should set the $description to resting state when mounted.", ({ getContainer, expectedState }) => {
    expect(useGsapMock.instance.set).toHaveBeenCalledWith(
      getContainer(),
      expectedState,
    );
  });

  it("should create a paused gsap timeline once when mounted.", () => {
    expect(useGsapMock.instance.timeline).toHaveBeenCalledExactlyOnceWith({ paused: true });
  });

  it("should apply the visible resting class to the active card container when mounted.", () => {
    const activeContainer = getContainerParent(getVisibleCardElement(wrapper).element);

    expect(activeContainer.classList.contains("opacity-100")).toBe(true);
  });

  it("should apply the hidden resting class to every staged card container when mounted.", () => {
    const stagedContainers = [getCardContainer(wrapper, 1), getCardContainer(wrapper, 2)]
      .map(container => container.element);

    expect(stagedContainers.filter(container => container.classList.contains("opacity-0"))).toHaveLength(2);
  });

  it("should not apply the transition compositing class to the card containers when at rest.", () => {
    expect(getCardContainers(wrapper).every(container => !container.classes("will-change-transform"))).toBe(true);
  });

  it("should apply the transition compositing class to the card containers when a slide is in progress.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    await nextTick();

    expect(getCardContainers(wrapper).every(container => container.classes("will-change-transform"))).toBe(true);
  });

  it("should remove the transition compositing class from the card containers when the slide completes.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();
    useGsapMock.instance.capturedOnComplete.current?.();
    await nextTick();

    expect(getCardContainers(wrapper).every(container => !container.classes("will-change-transform"))).toBe(true);
  });

  it.each<{ description: string; getContainer: () => Element; expectedAttributes: { ariaHidden: string | null; inert: boolean } }>([
    {
      description: "active card container",
      getContainer: (): Element => getCardContainer(wrapper, 0).element,
      expectedAttributes: { ariaHidden: null, inert: false },
    },
    {
      description: "first staged card container",
      getContainer: (): Element => getCardContainer(wrapper, 1).element,
      expectedAttributes: { ariaHidden: "true", inert: true },
    },
    {
      description: "second staged card container",
      getContainer: (): Element => getCardContainer(wrapper, 2).element,
      expectedAttributes: { ariaHidden: "true", inert: true },
    },
  ])("should set the accessibility attributes of the $description when mounted.", ({ getContainer, expectedAttributes }) => {
    const container = getContainer();

    expect({ ariaHidden: container.getAttribute("aria-hidden"), inert: container.hasAttribute("inert") }).toStrictEqual(expectedAttributes);
  });

  it("should start a forward slide when pendingDirection becomes forward.", async() => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.restart).toHaveBeenCalledWith();
  });

  it.each<{ direction: GameNavigationDirection; side: "right" | "left"; stagedSlotIndex: number; rotation: number; xPercent: number }>([
    { direction: "forward", side: "right", stagedSlotIndex: 1, rotation: 6, xPercent: 100 },
    { direction: "backward", side: "left", stagedSlotIndex: 2, rotation: -6, xPercent: -100 },
  ])("should position the entering card to the $side when pendingDirection is $direction.", async({ direction, stagedSlotIndex, rotation, xPercent }) => {
    await wrapper.setProps({ pendingDirection: direction });
    await nextTick();

    expect(useGsapMock.instance.set).toHaveBeenCalledWith(
      getCardContainer(wrapper, stagedSlotIndex).element,
      { opacity: 0, rotation, xPercent, zIndex: 2 },
    );
  });

  type CardSlideVariables = { duration: number; ease: string; opacity: number; rotation: number; xPercent: number };

  it.each<{ description: string; timelineCall: number; getContainer: () => Element; expectedVars: CardSlideVariables }>([
    {
      description: "leaving card out",
      timelineCall: 1,
      getContainer: (): Element => getCardContainer(wrapper, 0).element,
      expectedVars: { duration: 0.4, ease: "expo.out", opacity: 0, rotation: -6, xPercent: -100 },
    },
    {
      description: "entering card in",
      timelineCall: 2,
      getContainer: (): Element => getCardContainer(wrapper, 1).element,
      expectedVars: { duration: 0.4, ease: "expo.out", opacity: 1, rotation: 0, xPercent: 0 },
    },
  ])("should animate the $description when pendingDirection is forward.", async({ timelineCall, getContainer, expectedVars }) => {
    await wrapper.setProps({ pendingDirection: "forward" });
    await nextTick();

    expect(useGsapMock.instance.timelineTo).toHaveBeenNthCalledWith(timelineCall, getContainer(), expectedVars, 0);
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

  it("should skip the resting state update when a card container is missing.", () => {
    const vm = getWrapperVm<GameQuestionCardSwitcherVm>(wrapper);
    useGsapMock.instance.set.mockClear();
    vm.cardContainerReferences = [undefined, document.createElement("div")];

    vm.applyRestingState();

    expect(useGsapMock.instance.set).toHaveBeenCalledOnce();
  });

  it("should skip the slide when the leaving card container is missing.", () => {
    const vm = getWrapperVm<GameQuestionCardSwitcherVm>(wrapper);
    useGsapMock.instance.timelineTo.mockClear();
    vm.cardContainerReferences = [undefined, document.createElement("div"), document.createElement("div")];

    vm.startSlide("forward");

    expect(useGsapMock.instance.timelineTo).not.toHaveBeenCalled();
  });

  it("should skip the slide when the entering card container is missing.", () => {
    const vm = getWrapperVm<GameQuestionCardSwitcherVm>(wrapper);
    useGsapMock.instance.timelineTo.mockClear();
    vm.cardContainerReferences = [document.createElement("div"), undefined, document.createElement("div")];

    vm.startSlide("forward");

    expect(useGsapMock.instance.timelineTo).not.toHaveBeenCalled();
  });

  it("should skip resetting a card container when it is missing.", () => {
    const vm = getWrapperVm<GameQuestionCardSwitcherVm>(wrapper);
    useGsapMock.instance.set.mockClear();
    vm.cardContainerReferences = [];

    vm.resetSlot(0);

    expect(useGsapMock.instance.set).not.toHaveBeenCalled();
  });

  describe("safety timeout", () => {
    const safetyTimeoutMs = 600;

    it("should emit complete when the safety timeout fires and onComplete never fires.", async() => {
      await wrapper.setProps({ pendingDirection: "forward" });
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);

      expect(wrapper.emitted("complete")).toStrictEqual([[]]);
    });

    it("should not emit complete twice when onComplete fires after the safety timeout already settled.", async() => {
      await wrapper.setProps({ pendingDirection: "forward" });
      await nextTick();
      vi.advanceTimersByTime(safetyTimeoutMs);
      useGsapMock.instance.capturedOnComplete.current?.();

      expect(wrapper.emitted("complete")?.length).toBe(1);
    });

    it("should not emit complete twice when the safety timeout fires after onComplete already settled.", async() => {
      await wrapper.setProps({ pendingDirection: "forward" });
      await nextTick();
      useGsapMock.instance.capturedOnComplete.current?.();
      vi.advanceTimersByTime(safetyTimeoutMs);

      expect(wrapper.emitted("complete")?.length).toBe(1);
    });
  });
});