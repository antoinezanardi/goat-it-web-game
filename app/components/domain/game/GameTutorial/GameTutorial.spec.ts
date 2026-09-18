import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameTutorial } from "#components";

import type { GameTutorialProps } from "@/components/domain/game/GameTutorial/game-tutorial.types";
import { GAME_TUTORIAL_HIGHLIGHT_CLASS } from "@/components/domain/game/GameTutorial/game-tutorial.constants";

const GAME_TUTORIAL_TARGET_TEST_IDS = [
  "game-question-theme",
  "game-question-statement",
  "game-question-body",
  "game-question-answer",
  "game-question-source-links",
  "game-next-question-button",
  "game-sidebar-toggle-button",
] as const;

const GAME_TUTORIAL_STEP_KEYS = [
  "welcome",
  "framework",
  "question",
  "clues",
  "answer",
  "sources",
  "continue",
  "sidebar",
] as const;

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

  function createGameTutorialTargets(): void {
    for (const testId of GAME_TUTORIAL_TARGET_TEST_IDS) {
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

  it("should not render the tutorial popover content when isActive is false.", () => {
    expect(queryGameTutorialElement("game-tutorial")).toBeNull();
  });

  it("should not render the tutorial backdrop when isActive is false.", () => {
    expect(queryGameTutorialElement("game-tutorial-backdrop")).toBeNull();
  });

  it("should not emit end when mounted with isActive false.", () => {
    expect(wrapper.emitted("end")).toBeUndefined();
  });

  it("should render the tutorial popover content when isActive becomes true.", async() => {
    await startTour();

    expect(queryGameTutorialElement("game-tutorial")).not.toBeNull();
  });

  it("should render the tutorial backdrop when isActive becomes true.", async() => {
    await startTour();

    expect(queryGameTutorialElement("game-tutorial-backdrop")).not.toBeNull();
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

  it("should emit end when the Skip button is clicked.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-skip");

    expect(wrapper.emitted("end")).toStrictEqual([[]]);
  });

  it("should hide the tutorial when the Finish button is clicked on the last step.", async() => {
    await startTour();
    await collectRenderedStepTitles();
    await clickGameTutorialButton("game-tutorial-finish");

    expect(queryGameTutorialElement("game-tutorial")).toBeNull();
  });

  it("should emit end when the Finish button is clicked on the last step.", async() => {
    await startTour();
    await collectRenderedStepTitles();
    await clickGameTutorialButton("game-tutorial-finish");

    expect(wrapper.emitted("end")).toStrictEqual([[]]);
  });

  it("should hide the tutorial when isActive becomes false after it started.", async() => {
    await startTour();
    await wrapper.setProps({ isActive: false });
    await flushPromises();

    expect(queryGameTutorialElement("game-tutorial")).toBeNull();
  });

  it("should highlight the second step target when navigating forward.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");

    expect(getGameTutorialElement("game-question-theme").classList.contains(GAME_TUTORIAL_HIGHLIGHT_CLASS)).toBe(true);
  });

  it("should open the tutorial above the target when the target is near the bottom of the viewport.", async() => {
    getGameTutorialElement("game-question-statement").getBoundingClientRect = (): DOMRect => ({
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

  it("should not highlight any target when the centered first step is active.", async() => {
    await startTour();

    expect(document.querySelectorAll(`.${GAME_TUTORIAL_HIGHLIGHT_CLASS}`)).toHaveLength(0);
  });

  it("should remove the target highlight when the tour ends.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");
    await clickGameTutorialButton("game-tutorial-skip");

    expect(getGameTutorialElement("game-question-theme").classList.contains(GAME_TUTORIAL_HIGHLIGHT_CLASS)).toBe(false);
  });

  it("should remove the target highlight when the component is unmounted while a targeted step is active.", async() => {
    await startTour();
    await clickGameTutorialButton("game-tutorial-next");
    wrapper.unmount();

    expect(getGameTutorialElement("game-question-theme").classList.contains(GAME_TUTORIAL_HIGHLIGHT_CLASS)).toBe(false);
  });
});