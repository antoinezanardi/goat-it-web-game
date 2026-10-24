import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import type { UIcon, UKbd, UTooltip } from "#components";
import { GameTutorialPopoverContent } from "#components";

import type { GameTutorialPopoverContentProps } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.types";
import { GAME_TUTORIAL_CONTROL_ICONS, GAME_TUTORIAL_SKIP_SHORTCUT } from "@/components/domain/game/GameTutorial/GameTutorialPopoverContent/game-tutorial-popover-content.constants";
import { GAME_SHORTCUT_TOOLTIP_KBD_UI } from "@/utils/ui/game/game-shortcuts.constants";

describe("GameTutorialPopoverContent Component", () => {
  const defaultGameTutorialPopoverContentProps: GameTutorialPopoverContentProps = {
    hasNextStep: true,
    hasPreviousStep: false,
    popoverMaxHeight: "320px",
    stepDescription: "game.interactiveTutorial.steps.welcome.description",
    stepIcon: "i-lucide-crown",
    stepTitle: "game.interactiveTutorial.steps.welcome.title",
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
    return wrapper.findAllComponents<typeof UIcon>({ name: "UIcon" })
      .map(icon => String(icon.props("name")));
  }

  function getControlTooltip(testId: string): VueWrapper<InstanceType<typeof UTooltip>> {
    const tooltip = wrapper.findAllComponents<typeof UTooltip>({ name: "UTooltip" })
      .find(candidate => candidate.find(`[data-testid='${testId}']`).exists());

    if (!tooltip) {
      throw new Error(`Tooltip for data-testid="${testId}" not found`);
    }
    return tooltip;
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
    expect(getGameTutorialPopoverContentElement("game-tutorial-title").text()).toBe(defaultGameTutorialPopoverContentProps.stepTitle);
  });

  it("should render the step description when mounted.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-description").text()).toBe(defaultGameTutorialPopoverContentProps.stepDescription);
  });

  it("should render a separator between the title and the content and another one between the content and the actions when mounted.", () => {
    expect(wrapper.findAllComponents({ name: "USeparator" })).toHaveLength(2);
  });

  it("should render the step icon and the visible control icons in order when mounted.", () => {
    expect(getRenderedIconNames()).toStrictEqual([
      defaultGameTutorialPopoverContentProps.stepIcon,
      GAME_TUTORIAL_CONTROL_ICONS.skip,
      GAME_TUTORIAL_CONTROL_ICONS.next,
    ]);
  });

  it("should not render the step icon when no icon is provided.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, stepIcon: undefined } });

    expect(getRenderedIconNames()).toStrictEqual([
      GAME_TUTORIAL_CONTROL_ICONS.skip,
      GAME_TUTORIAL_CONTROL_ICONS.next,
    ]);
  });

  it("should render the skip control label when mounted.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-skip").text()).toContain("game.interactiveTutorial.controls.skip");
  });

  it("should set the Escape aria-keyshortcuts attribute on the Skip control when there is a next step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-skip").attributes("aria-keyshortcuts")).toBe(GAME_TUTORIAL_SKIP_SHORTCUT.ariaKeyshortcuts);
  });

  it("should render the Escape keyboard hint inside the Skip control when there is a next step.", () => {
    const skipShortcut = wrapper.findComponent<typeof UKbd>("[data-testid='game-tutorial-skip-shortcut']");

    expect(skipShortcut.props("value")).toBe(GAME_TUTORIAL_SKIP_SHORTCUT.kbd);
  });

  it("should hide the Escape keyboard hint from assistive technologies when there is a next step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-skip-shortcut").attributes("aria-hidden")).toBe("true");
  });

  it("should not render the Back control when there is no previous step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-back").exists()).toBeFalsy();
  });

  it("should render the Back control as an icon-only button with an accessible label when there is a previous step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPreviousStep: true } });
    const backControl = getGameTutorialPopoverContentElement("game-tutorial-back");

    expect({
      ariaLabel: backControl.attributes("aria-label"),
      icons: getRenderedIconNames(),
      text: backControl.text(),
    }).toStrictEqual({
      ariaLabel: "game.interactiveTutorial.controls.back",
      icons: [
        defaultGameTutorialPopoverContentProps.stepIcon,
        GAME_TUTORIAL_CONTROL_ICONS.skip,
        GAME_TUTORIAL_CONTROL_ICONS.back,
        GAME_TUTORIAL_CONTROL_ICONS.next,
      ],
      text: "",
    });
  });

  it("should emit goToPreviousStep when the Back control is clicked.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPreviousStep: true } });
    await getGameTutorialPopoverContentElement("game-tutorial-back").trigger("click");

    expect(wrapper.emitted("goToPreviousStep")).toStrictEqual([[]]);
  });

  it("should set the ArrowLeft aria-keyshortcuts attribute on the Back control when there is a previous step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPreviousStep: true } });

    expect(getGameTutorialPopoverContentElement("game-tutorial-back").attributes("aria-keyshortcuts")).toBe("ArrowLeft");
  });

  it("should pass the arrowleft kbd to the Back control tooltip when there is a previous step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPreviousStep: true } });

    expect(getControlTooltip("game-tutorial-back").props("kbds")).toStrictEqual(["arrowleft"]);
  });

  it("should pass the pointer-gated kbd ui config to the Back control tooltip when there is a previous step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPreviousStep: true } });

    expect(getControlTooltip("game-tutorial-back").props("ui")).toStrictEqual(GAME_SHORTCUT_TOOLTIP_KBD_UI);
  });

  it("should pass the Back control label key as the tooltip text when there is a previous step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasPreviousStep: true } });

    expect(getControlTooltip("game-tutorial-back").props("text")).toBe("game.interactiveTutorial.controls.back");
  });

  it("should render the Next control label when there is a next step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-next").text()).toContain("game.interactiveTutorial.controls.next");
  });

  it("should emit goToNextStep when the Next control is clicked.", async() => {
    await getGameTutorialPopoverContentElement("game-tutorial-next").trigger("click");

    expect(wrapper.emitted("goToNextStep")).toStrictEqual([[]]);
  });

  it("should set the ArrowRight aria-keyshortcuts attribute on the Next control when there is a next step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-next").attributes("aria-keyshortcuts")).toBe("ArrowRight");
  });

  it("should not wrap the Next control in a tooltip when there is a next step.", () => {
    const nextTooltip = wrapper.findAllComponents<typeof UTooltip>({ name: "UTooltip" })
      .find(candidate => candidate.find("[data-testid='game-tutorial-next']").exists());

    expect(nextTooltip).toBeUndefined();
  });

  it("should not render the Finish control when there is a next step.", () => {
    expect(getGameTutorialPopoverContentElement("game-tutorial-finish").exists()).toBeFalsy();
  });

  it("should render the Finish control label when there is no next step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNextStep: false } });

    expect(getGameTutorialPopoverContentElement("game-tutorial-finish").text()).toContain("game.interactiveTutorial.controls.finish");
  });

  it("should render the Finish control icon when there is no next step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNextStep: false } });

    expect(getRenderedIconNames()).toStrictEqual([
      defaultGameTutorialPopoverContentProps.stepIcon,
      GAME_TUTORIAL_CONTROL_ICONS.finish,
    ]);
  });

  it("should emit finishTutorial when the Finish control is clicked.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNextStep: false } });
    await getGameTutorialPopoverContentElement("game-tutorial-finish").trigger("click");

    expect(wrapper.emitted("finishTutorial")).toStrictEqual([[]]);
  });

  it("should set the ArrowRight aria-keyshortcuts attribute on the Finish control when there is no next step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNextStep: false } });

    expect(getGameTutorialPopoverContentElement("game-tutorial-finish").attributes("aria-keyshortcuts")).toBe("ArrowRight");
  });

  it("should not wrap the Finish control in a tooltip when there is no next step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNextStep: false } });
    const finishTooltip = wrapper.findAllComponents<typeof UTooltip>({ name: "UTooltip" })
      .find(candidate => candidate.find("[data-testid='game-tutorial-finish']").exists());

    expect(finishTooltip).toBeUndefined();
  });

  it("should not render the Skip control when there is no next step.", async() => {
    wrapper = await mountGameTutorialPopoverContent({ props: { ...defaultGameTutorialPopoverContentProps, hasNextStep: false } });

    expect(getGameTutorialPopoverContentElement("game-tutorial-skip").exists()).toBeFalsy();
  });

  it("should emit skipTutorial when the Skip control is clicked.", async() => {
    await getGameTutorialPopoverContentElement("game-tutorial-skip").trigger("click");

    expect(wrapper.emitted("skipTutorial")).toStrictEqual([[]]);
  });
});