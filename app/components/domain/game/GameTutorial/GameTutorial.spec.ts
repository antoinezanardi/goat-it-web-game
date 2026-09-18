import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import type { Mock } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { getWrapperVm } from "~~/tests/unit/utils/helpers/vtu.helpers";

import { GameTutorial } from "#components";

import type { GameTutorialProps } from "@/components/domain/game/GameTutorial/game-tutorial.types";

let resetTourMock: Mock<() => Promise<void>>;

let endTourMock: Mock<() => Promise<void>>;

const VTourStub = {
  name: "VTour",
  props: {
    name: { type: String, default: "" },
    steps: { type: Array, default: (): unknown[] => [] },
    highlight: { type: Boolean, default: false },
    backdrop: { type: Boolean, default: false },
    nextButton: { type: Object, default: undefined },
    prevButton: { type: Object, default: undefined },
    skipButton: { type: Object, default: undefined },
    finishButton: { type: Object, default: undefined },
  },
  emits: ["onTourEnd"],
  setup: (): { endTour: Mock<() => Promise<void>>; resetTour: Mock<() => Promise<void>> } => ({
    endTour: endTourMock,
    resetTour: resetTourMock,
  }),
  template: "<div/>",
};

describe("GameTutorial Component", () => {
  const defaultGameTutorialProps: GameTutorialProps = {
    isActive: false,
  } as const;

  let wrapper: VueWrapper;

  async function mountGameTutorial(options: MountSuspendedOptions<typeof GameTutorial> = {}): Promise<VueWrapper> {
    return mountSuspended(GameTutorial, {
      props: defaultGameTutorialProps,
      shallow: false,
      global: { stubs: { VTour: VTourStub } },
      ...options,
    });
  }

  // Acceptable as return type is inferred from findComponent and explicit annotation causes typecheck issues with VueWrapper generics
  // oxlint-disable-next-line typescript/explicit-function-return-type
  function getGameTourComponent() {
    return wrapper.findComponent({ name: "VTour" });
  }

  beforeEach(async() => {
    resetTourMock = vi.fn<() => Promise<void>>();
    endTourMock = vi.fn<() => Promise<void>>();
    wrapper = await mountGameTutorial();
  });

  afterEach(() => {
    wrapper.unmount();
    document.body.innerHTML = "";
  });

  it("should render GameTutorial when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should pass the game-tutorial name to VTour when mounted.", () => {
    expect(getGameTourComponent().props("name")).toBe("game-tutorial");
  });

  it("should pass the eight fixed tour targets in order to VTour when mounted.", () => {
    const steps = getGameTourComponent().props("steps") as { target: string | undefined }[];

    expect(steps.map(step => step.target)).toStrictEqual([
      undefined,
      "[data-testid='game-question-theme']",
      "[data-testid='game-question-statement']",
      "[data-testid='game-question-body']",
      "[data-testid='game-question-answer']",
      "[data-testid='game-question-source-links']",
      "[data-testid='game-next-question-button']",
      "[data-testid='game-sidebar-toggle-button']",
    ]);
  });

  it("should pass the localized step titles to VTour when mounted.", () => {
    const steps = getGameTourComponent().props("steps") as { title: string }[];

    expect(steps.map(step => step.title)).toStrictEqual([
      "game.interactiveTutorial.steps.welcome.title",
      "game.interactiveTutorial.steps.framework.title",
      "game.interactiveTutorial.steps.question.title",
      "game.interactiveTutorial.steps.clues.title",
      "game.interactiveTutorial.steps.answer.title",
      "game.interactiveTutorial.steps.sources.title",
      "game.interactiveTutorial.steps.continue.title",
      "game.interactiveTutorial.steps.sidebar.title",
    ]);
  });

  it("should pass the localized step descriptions to VTour when mounted.", () => {
    const steps = getGameTourComponent().props("steps") as { body: string }[];

    expect(steps.map(step => step.body)).toStrictEqual([
      "game.interactiveTutorial.steps.welcome.description",
      "game.interactiveTutorial.steps.framework.description",
      "game.interactiveTutorial.steps.question.description",
      "game.interactiveTutorial.steps.clues.description",
      "game.interactiveTutorial.steps.answer.description",
      "game.interactiveTutorial.steps.sources.description",
      "game.interactiveTutorial.steps.continue.description",
      "game.interactiveTutorial.steps.sidebar.description",
    ]);
  });

  it("should pass the localized next button label to VTour when mounted.", () => {
    expect(getGameTourComponent().props("nextButton")).toStrictEqual({ label: "game.interactiveTutorial.controls.next" });
  });

  it("should pass the localized previous button label to VTour when mounted.", () => {
    expect(getGameTourComponent().props("prevButton")).toStrictEqual({ label: "game.interactiveTutorial.controls.back" });
  });

  it("should pass the localized skip button label to VTour when mounted.", () => {
    expect(getGameTourComponent().props("skipButton")).toStrictEqual({ label: "game.interactiveTutorial.controls.skip" });
  });

  it("should pass the localized finish button label to VTour when mounted.", () => {
    expect(getGameTourComponent().props("finishButton")).toStrictEqual({ label: "game.interactiveTutorial.controls.finish" });
  });

  it("should reset the tour when isActive becomes true.", async() => {
    await wrapper.setProps({ isActive: true });
    await nextTick();

    expect(resetTourMock).toHaveBeenCalledExactlyOnceWith();
  });

  it("should not end a tour that never started when isActive is false on mount.", async() => {
    await nextTick();

    expect(endTourMock).not.toHaveBeenCalled();
  });

  it("should end the tour when isActive becomes false after it started.", async() => {
    await wrapper.setProps({ isActive: true });
    await nextTick();
    await wrapper.setProps({ isActive: false });
    await nextTick();

    expect(endTourMock).toHaveBeenCalledExactlyOnceWith();
  });

  it("should emit end when VTour emits onTourEnd.", () => {
    getWrapperVm(getGameTourComponent()).$emit("onTourEnd");

    expect(wrapper.emitted("end")).toStrictEqual([[]]);
  });

  it("should end the tour when the component is unmounted while a tour is running.", async() => {
    await wrapper.setProps({ isActive: true });
    await nextTick();
    wrapper.unmount();

    expect(endTourMock).toHaveBeenCalledExactlyOnceWith();
  });

  it("should not end any tour when the component is unmounted while none is running.", () => {
    wrapper.unmount();

    expect(endTourMock).not.toHaveBeenCalled();
  });
});