import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameTutorialPopoverContent } from "#components";

import type { GameTutorialPopoverContentProps } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.types";
import { GAME_TUTORIAL_CONTROL_ICONS } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.constants";

describe("GameTutorialPopoverContent Component", () => {
  const defaultGameTutorialPopoverContentProps: GameTutorialPopoverContentProps = {
    description: "game.interactiveTutorial.steps.welcome.description",
    hasNext: true,
    hasPrev: false,
    icon: "i-lucide-crown",
    maxHeight: "320px",
    title: "game.interactiveTutorial.steps.welcome.title",
  } as const;

  let wrapper: VueWrapper;

  async function mountGameTutorialPopoverContent(options: MountSuspendedOptions<typeof GameTutorialPopoverContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameTutorialPopoverContent, {
      props: defaultGameTutorialPopoverContentProps,
      ...options,
    });
  }

  function getGameTutorialPopoverContentElement(testId: string): ReturnType<VueWrapper["find"]> {
    return wrapper.find(`[data-testid='${testId}']`);
  }

  function getRenderedIconNames(): string[] {
    return wrapper.findAllComponents({ name: "UIcon" }).map(icon => icon.props("name") as string);
  }

  beforeEach(async() => {
    wrapper = await mountGameTutorialPopoverContent();
  });

  it("should render GameTutorialPopoverContent when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the popover content container when mounted.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial").exists()).toBeTruthy();
  });

  it("should apply the provided max height to the popover content container when mounted.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial").attributes("style")).toContain("max-height: 320px");
  });

  it("should render the step title when mounted.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-title").text()).toBe(defaultGameTutorialPopoverContentProps.title);
  });

  it("should render the step description when mounted.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-description").text()).toBe(defaultGameTutorialPopoverContentProps.description);
  });

  it("should render the separator between the content and the actions when mounted.", () => {
    expect(wrapper.findComponent({ name: "USeparator" }).exists()).toBeTruthy();
  });

  it("should render the step icon and the visible control icons in order when mounted.", () => {
    expect(getRenderedIconNames()).toStrictEqual([
      defaultGameTutorialPopoverContentProps.icon,
      GAME_TUTORIAL_CONTROL_ICONS.skip,
      GAME_TUTORIAL_CONTROL_ICONS.next,
    ]);
  });

  it("should not render the step icon when no icon is provided.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, icon: undefined } });

    expect(getRenderedIconNames()).toStrictEqual([
      GAME_TUTORIAL_CONTROL_ICONS.skip,
      GAME_TUTORIAL_CONTROL_ICONS.next,
    ]);
  });

  it("should render the skip control label when mounted.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-skip").text()).toContain("game.interactiveTutorial.controls.skip");
  });

  it("should not render the Back control when there is no previous step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-back").exists()).toBeFalsy();
  });

  it("should render the Back control label when there is a previous step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPrev: true } });

    expect(getGameTutorialPopoverContentElement("game-tutorial-back").text()).toContain("game.interactiveTutorial.controls.back");
  });

  it("should emit back when the Back control is clicked.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPrev: true } });
    await getGameTutorialPopoverContentElement("game-tutorial-back").trigger("click");

    expect(wrapper.emitted("back")).toStrictEqual([[]]);
  });

  it("should render the Next control label when there is a next step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-next").text()).toContain("game.interactiveTutorial.controls.next");
  });

  it("should emit next when the Next control is clicked.", async() => {
    await getGameTutorialPopoverContentElement("game-tutorial-next").trigger("click");

    expect(wrapper.emitted("next")).toStrictEqual([[]]);
  });

  it("should not render the Finish control when there is a next step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-finish").exists()).toBeFalsy();
  });

  it("should render the Finish control label when there is no next step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNext: false } });

    expect(getGameTutorialPopoverContentElement("game-tutorial-finish").text()).toContain("game.interactiveTutorial.controls.finish");
  });

  it("should emit finish when the Finish control is clicked.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNext: false } });
    await getGameTutorialPopoverContentElement("game-tutorial-finish").trigger("click");

    expect(wrapper.emitted("finish")).toStrictEqual([[]]);
  });

  it("should emit skip when the skip control is clicked.", async() => {
    await getGameTutorialPopoverContentElement("game-tutorial-skip").trigger("click");

    expect(wrapper.emitted("skip")).toStrictEqual([[]]);
  });
});