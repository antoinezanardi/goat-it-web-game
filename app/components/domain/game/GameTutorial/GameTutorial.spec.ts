import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { GameTutorialPopoverContent } from "#components";
import { GameTutorial } from "#components";

import type { GameTutorialProps } from "@/components/domain/game/GameTutorial/game-tutorial.types";
import { GAME_TUTORIAL_SPOTLIGHT_PADDING, GAME_TUTORIAL_STEPS } from "@/components/domain/game/GameTutorial/game-tutorial.constants";

const GAME_TUTORIAL_IN_CARD_TARGET_TEST_IDS = [
  "game-question-header",
  "game-question-statement",
  "game-question-answer",
  "game-question-source-links",
] as const;

const GAME_TUTORIAL_PAGE_TARGET_TEST_IDS = [
  "game-next-question-button",
  "game-sidebar-toggle-button",
] as const;

const GAME_TUTORIAL_STEP_KEYS = GAME_TUTORIAL_STEPS.map(step => step.key);

describe("GameTutorial Component", () => {
  const defaultGameTutorialProps: GameTutorialProps = {
    isActive: false,
  } as const;

  let wrapper: VueWrapper;

  async function mountGameTutorial(options: MountSuspendedOptions<typeof GameTutorial> = {}): Promise<VueWrapper> {
    return mountSuspended(GameTutorial, {
      props: defaultGameTutorialProps,
      shallow: false,
      attachTo: document.body,
      ...options,
    });
  }

  function createGameTutorialCardTargets(cardTestId: "game-question" | "game-question-staged"): void {
    const card = document.createElement("div");
    card.dataset.testid = cardTestId;

    for (const testId of GAME_TUTORIAL_IN_CARD_TARGET_TEST_IDS) {
      const element = document.createElement("div");
      element.dataset.testid = testId;
      card.append(element);
    }
    document.body.append(card);
  }

  function createGameTutorialTargets(): void {
    createGameTutorialCardTargets("game-question-staged");
    createGameTutorialCardTargets("game-question");

    for (const testId of GAME_TUTORIAL_PAGE_TARGET_TEST_IDS) {
      const element = document.createElement("div");
      element.dataset.testid = testId;
      document.body.append(element);
    }
  }

  function queryGameTutorialElement(testId: string): Element | null {
    return document.body.querySelector(`[data-testid='${testId}']`);
  }

  function getGameTutorialElement(testId: string): HTMLElement {
    const element = document.body.querySelector<HTMLElement>(`[data-testid='${testId}']`);

    if (element === null) {
      throw new Error(`Game tutorial element "${testId}" was not found.`);
    }
    return element;
  }

  function getActiveCardElement(testId: string): HTMLElement {
    const element = document.querySelector<HTMLElement>(`[data-testid='game-question'] [data-testid='${testId}']`);

    if (element === null) {
      throw new Error(`Active game question element "${testId}" was not found.`);
    }
    return element;
  }

  function getStagedCardElement(testId: string): HTMLElement {
    const element = document.querySelector<HTMLElement>(`[data-testid='game-question-staged'] [data-testid='${testId}']`);

    if (element === null) {
      throw new Error(`Staged game question element "${testId}" was not found.`);
    }
    return element;
  }

  function getGameTutorialPopoverContent(): VueWrapper<InstanceType<typeof GameTutorialPopoverContent>> {
    return wrapper.findComponent<typeof GameTutorialPopoverContent>("[data-testid='game-tutorial']");
  }

  function getGameTutorialSpotlightStyle(): { height: string; left: string; top: string; width: string } {
    const spotlight = getGameTutorialElement("game-tutorial-spotlight");

    return {
      height: spotlight.style.height,
      left: spotlight.style.left,
      top: spotlight.style.top,
      width: spotlight.style.width,
    };
  }

  async function startTour(): Promise<void> {
    await wrapper.setProps({ isActive: true });
    await flushPromises();
  }

  async function clickGameTutorialButton(testId: string): Promise<void> {
    getGameTutorialElement(testId).click();
    await flushPromises();
  }

  async function collectRenderedStepTitles(index = 0, titles: (string | null)[] = []): Promise<(string | null)[]> {
    titles.push(getGameTutorialElement("game-tutorial-title").textContent);

    if (index === GAME_TUTORIAL_STEP_KEYS.length - 1) {
      return titles;
    }
    await clickGameTutorialButton("game-tutorial-next");

    return collectRenderedStepTitles(index + 1, titles);
  }

  function pressTutorialKey(key: "ArrowLeft" | "ArrowRight"): KeyboardEvent {
    const event = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key,
    });

    globalThis.dispatchEvent(event);

    return event;
  }

  beforeEach(async() => {
    createGameTutorialTargets();
    wrapper = await mountGameTutorial();
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("should render GameTutorial when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it.each<{ testId: string }>([
    { testId: "game-tutorial" },
    { testId: "game-tutorial-backdrop" },
  ])("should not render the \"$testId\" element when isActive is false.", ({ testId }) => {
    expect(queryGameTutorialElement(testId)).toBeNull();
  });

  it.each<{ testId: string }>([
    { testId: "game-tutorial" },
    { testId: "game-tutorial-backdrop" },
  ])("should render the \"$testId\" element when isActive becomes true.", async({ testId }) => {
    await startTour();

    expect(queryGameTutorialElement(testId)).not.toBeNull();
  });

  it("should not emit tutorialEnd when mounted with isActive false.", () => {
    expect(wrapper.emitted("tutorialEnd")).toBeUndefined();
  });

  it("should render the popover content component when the tour starts.", async() => {
    await startTour();

    expect(getGameTutorialPopoverContent().exists()).toBe(true);
  });

  it("should pass the first step title to the popover content when the tour starts.", async() => {
    await startTour();

    expect(getGameTutorialPopoverContent().props("title")).toBe("game.interactiveTutorial.steps.welcome.title");
  });

  it("should pass the first step description to the popover content when the tour starts.", async() => {
    await startTour();

    expect(getGameTutorialPopoverContent().props("description")).toBe("game.interactiveTutorial.steps.welcome.description");
  });

  it("should pass the first step icon to the popover content when the tour starts.", async() => {
    await startTour();

    expect(getGameTutorialPopoverContent().props("icon")).toBe(GAME_TUTORIAL_STEPS[0]?.icon);
  });

  it("should pass hasPrev as false to the popover content when the first step is active.", async() => {
    await startTour();

    expect(getGameTutorialPopoverContent().props("hasPrev")).toBe(false);
  });

  it("should pass hasNext as true to the popover content when the first step is active.", async() => {
    await startTour();

    expect(getGameTutorialPopoverContent().props("hasNext")).toBe(true);
  });

  it("should render the first step title when the tour starts.", async() => {
    await startTour();

    expect(getGameTutorialElement("game-tutorial-title").textContent).toBe("game.interactiveTutorial.steps.welcome.title");
  });

  it("should render the first step description when the tour starts.", async() => {
    await startTour();

    expect(getGameTutorialElement("game-tutorial-description").textContent).toBe("game.interactiveTutorial.steps.welcome.description");
  });

  it("should render the eight steps in order when navigating forward with Next.", async() => {
    await startTour();

    await expect(collectRenderedStepTitles()).resolves.toStrictEqual(GAME_TUTORIAL_STEP_KEYS.map(key => `game.interactiveTutorial.steps.${key}.title`));
  });

  it("should not render the Back button when the first step is active.", async() => {
    await startTour();

    expect(queryGameTutorialElement("game-tutorial-back")).toBeNull();
  });

  it("should render the Next button when the first step is active.", async() => {
    await startTour();

    expect(queryGameTutorialElement("game-tutorial-next")).not.toBeNull();
  });

  it("should render the Back button when the second step is active.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");

    expect(queryGameTutorialElement("game-tutorial-back")).not.toBeNull();
  });

  it("should go back to the previous step when the Back button is clicked.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");
    await clickGameTutorialButton("game-tutorial-back");

    expect(getGameTutorialElement("game-tutorial-title").textContent).toBe("game.interactiveTutorial.steps.welcome.title");
  });

  it("should render the Finish button when the last step is active.", async() => {
    await startTour();
    await collectRenderedStepTitles();

    expect(queryGameTutorialElement("game-tutorial-finish")).not.toBeNull();
  });

  it("should not render the Next button when the last step is active.", async() => {
    await startTour();
    await collectRenderedStepTitles();

    expect(queryGameTutorialElement("game-tutorial-next")).toBeNull();
  });

  it("should hide the tutorial when the Skip button is clicked.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-skip");

    expect(queryGameTutorialElement("game-tutorial")).toBeNull();
  });

  it("should emit tutorialEnd when the Skip button is clicked.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-skip");

    expect(wrapper.emitted("tutorialEnd")).toStrictEqual([[]]);
  });

  it("should hide the tutorial when the Finish button is clicked on the last step.", async() => {
    await startTour();
    await collectRenderedStepTitles();
    await clickGameTutorialButton("game-tutorial-finish");

    expect(queryGameTutorialElement("game-tutorial")).toBeNull();
  });

  it("should emit tutorialEnd when the Finish button is clicked on the last step.", async() => {
    await startTour();
    await collectRenderedStepTitles();
    await clickGameTutorialButton("game-tutorial-finish");

    expect(wrapper.emitted("tutorialEnd")).toStrictEqual([[]]);
  });

  it("should hide the tutorial when isActive becomes false after it started.", async() => {
    await startTour();
    await wrapper.setProps({ isActive: false });
    await flushPromises();

    expect(queryGameTutorialElement("game-tutorial")).toBeNull();
  });

  it("should render the spotlight window when navigating to a targeted step.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");

    expect(queryGameTutorialElement("game-tutorial-spotlight")).not.toBeNull();
  });

  it("should position the spotlight window around the active card target when navigating to a targeted step.", async() => {
    getActiveCardElement("game-question-header").getBoundingClientRect = (): DOMRect => ({
      bottom: 300,
      height: 40,
      left: 100,
      right: 500,
      top: 260,
      width: 400,
      x: 100,
      y: 260,
      toJSON: (): Record<string, never> => ({}),
    });
    getStagedCardElement("game-question-header").getBoundingClientRect = (): DOMRect => ({
      bottom: 1400,
      height: 40,
      left: 1000,
      right: 1400,
      top: 1360,
      width: 400,
      x: 1000,
      y: 1360,
      toJSON: (): Record<string, never> => ({}),
    });
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");

    expect(getGameTutorialSpotlightStyle()).toStrictEqual({
      height: `${40 + GAME_TUTORIAL_SPOTLIGHT_PADDING * 2}px`,
      left: `${100 - GAME_TUTORIAL_SPOTLIGHT_PADDING}px`,
      top: `${260 - GAME_TUTORIAL_SPOTLIGHT_PADDING}px`,
      width: `${400 + GAME_TUTORIAL_SPOTLIGHT_PADDING * 2}px`,
    });
  });

  it("should open the tutorial above the target when the target is near the bottom of the viewport.", async() => {
    getActiveCardElement("game-question-statement").getBoundingClientRect = (): DOMRect => ({
      bottom: 700,
      height: 100,
      left: 0,
      right: 100,
      top: 600,
      width: 100,
      x: 0,
      y: 600,
      toJSON: (): Record<string, never> => ({}),
    });
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");
    await clickGameTutorialButton("game-tutorial-next");

    expect(wrapper.findComponent({ name: "UPopover" }).props("content")).toStrictEqual({ side: "top", sideOffset: 12 });
  });

  it("should not render the spotlight window when the centered first step is active.", async() => {
    await startTour();

    expect(queryGameTutorialElement("game-tutorial-spotlight")).toBeNull();
  });

  it("should remove the spotlight window when navigating from a targeted step to a centered step.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");
    await clickGameTutorialButton("game-tutorial-next");
    await clickGameTutorialButton("game-tutorial-next");

    expect(queryGameTutorialElement("game-tutorial-spotlight")).toBeNull();
  });

  it("should recompute the popover placement when the window is resized while the tour is open.", async() => {
    getActiveCardElement("game-question-header").getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 100,
      left: 0,
      right: 100,
      top: 0,
      width: 100,
      x: 0,
      y: 0,
      toJSON: (): Record<string, never> => ({}),
    });
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");

    getActiveCardElement("game-question-header").getBoundingClientRect = (): DOMRect => ({
      bottom: 700,
      height: 100,
      left: 0,
      right: 100,
      top: 600,
      width: 100,
      x: 0,
      y: 600,
      toJSON: (): Record<string, never> => ({}),
    });
    globalThis.dispatchEvent(new globalThis.Event("resize"));
    await flushPromises();

    expect(wrapper.findComponent({ name: "UPopover" }).props("content")).toStrictEqual({ side: "top", sideOffset: 12 });
  });

  it("should recompute the spotlight window when the window is resized while the tour is open.", async() => {
    getActiveCardElement("game-question-header").getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON: (): Record<string, never> => ({}),
    });
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");

    getActiveCardElement("game-question-header").getBoundingClientRect = (): DOMRect => ({
      bottom: 300,
      height: 40,
      left: 100,
      right: 500,
      top: 260,
      width: 400,
      x: 100,
      y: 260,
      toJSON: (): Record<string, never> => ({}),
    });
    globalThis.dispatchEvent(new globalThis.Event("resize"));
    await flushPromises();

    expect(getGameTutorialSpotlightStyle()).toStrictEqual({
      height: `${40 + GAME_TUTORIAL_SPOTLIGHT_PADDING * 2}px`,
      left: `${100 - GAME_TUTORIAL_SPOTLIGHT_PADDING}px`,
      top: `${260 - GAME_TUTORIAL_SPOTLIGHT_PADDING}px`,
      width: `${400 + GAME_TUTORIAL_SPOTLIGHT_PADDING * 2}px`,
    });
  });

  it("should not render the spotlight window when the window is resized while the tour is closed.", async() => {
    globalThis.dispatchEvent(new globalThis.Event("resize"));
    await flushPromises();

    expect(queryGameTutorialElement("game-tutorial-spotlight")).toBeNull();
  });

  it("should remove the spotlight window when the tour ends.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");
    await clickGameTutorialButton("game-tutorial-skip");

    expect(queryGameTutorialElement("game-tutorial-spotlight")).toBeNull();
  });

  it("should not render the spotlight window when replaying from the first step after the tour ended.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");
    await clickGameTutorialButton("game-tutorial-skip");
    await wrapper.setProps({ isActive: false });
    await flushPromises();
    await startTour();

    expect(queryGameTutorialElement("game-tutorial-spotlight")).toBeNull();
  });

  describe("keyboard shortcuts", () => {
    it("should move to the next step when the right arrow key is pressed.", async() => {
      await startTour();

      pressTutorialKey("ArrowRight");
      await flushPromises();

      expect(getGameTutorialElement("game-tutorial-title").textContent).toBe("game.interactiveTutorial.steps.framework.title");
    });

    it("should move back to the previous step when the left arrow key is pressed.", async() => {
      await startTour();
      await clickGameTutorialButton("game-tutorial-next");

      pressTutorialKey("ArrowLeft");
      await flushPromises();

      expect(getGameTutorialElement("game-tutorial-title").textContent).toBe("game.interactiveTutorial.steps.welcome.title");
    });

    it("should stay on the first step when the left arrow key is pressed on the first step.", async() => {
      await startTour();

      pressTutorialKey("ArrowLeft");
      await flushPromises();

      expect(getGameTutorialElement("game-tutorial-title").textContent).toBe("game.interactiveTutorial.steps.welcome.title");
    });

    it("should hide the tutorial when the right arrow key is pressed on the last step.", async() => {
      await startTour();
      await collectRenderedStepTitles();

      pressTutorialKey("ArrowRight");
      await flushPromises();

      expect(queryGameTutorialElement("game-tutorial")).toBeNull();
    });

    it("should emit tutorialEnd when the right arrow key finishes the last step.", async() => {
      await startTour();
      await collectRenderedStepTitles();

      pressTutorialKey("ArrowRight");
      await flushPromises();

      expect(wrapper.emitted("tutorialEnd")).toStrictEqual([[]]);
    });

    it("should not prevent the default event when the right arrow key is pressed while the tutorial is closed.", () => {
      const event = pressTutorialKey("ArrowRight");

      expect(event.defaultPrevented).toBe(false);
    });

    it("should not change the step when the right arrow key is pressed on an editable target.", async() => {
      await startTour();
      const input = document.createElement("input");
      document.body.append(input);

      input.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "ArrowRight" }));
      await flushPromises();

      expect(getGameTutorialElement("game-tutorial-title").textContent).toBe("game.interactiveTutorial.steps.welcome.title");
    });

    it("should prevent the default event when the right arrow key moves to the next step.", async() => {
      await startTour();

      const event = pressTutorialKey("ArrowRight");

      expect(event.defaultPrevented).toBe(true);
    });

    it("should not prevent the default event when the left arrow key is pressed on the first step.", async() => {
      await startTour();

      const event = pressTutorialKey("ArrowLeft");

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe("keyboard listener cleanup", () => {
    it("should not prevent the default event when the right arrow key is pressed after the component unmounts.", async() => {
      await startTour();
      wrapper.unmount();

      const event = pressTutorialKey("ArrowRight");

      expect(event.defaultPrevented).toBe(false);
    });
  });
});