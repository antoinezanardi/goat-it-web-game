import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GamePreviousQuestionButton } from "#components";

import type { GamePreviousQuestionButtonProps } from "@/components/domain/game/GamePreviousQuestionButton/game-previous-question-button.types";
import { GAME_INTERACTIVE_BUTTON_UI } from "@/utils/ui/game/game-buttons.constants";
import { GAME_SHORTCUT_TOOLTIP_KBD_UI } from "@/utils/ui/game/game-shortcuts.constants";

describe("GamePreviousQuestionButton Component", () => {
  const defaultGamePreviousQuestionButtonProps: GamePreviousQuestionButtonProps = { disabled: false } as const;

  let wrapper: VueWrapper;

  async function mountGamePreviousQuestionButton(options: MountSuspendedOptions<typeof GamePreviousQuestionButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePreviousQuestionButton, {
      props: defaultGamePreviousQuestionButtonProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountGamePreviousQuestionButton();
  });

  it("should render GamePreviousQuestionButton when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should emit click when the button is clicked.", async() => {
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeDefined();
  });

  it("should have the data-testid attribute when mounted.", () => {
    expect(wrapper.find("[data-testid='game-previous-question-button']").exists()).toBe(true);
  });

  it("should forward the disabled prop to the underlying button element when disabled is true.", async() => {
    await wrapper.setProps({ disabled: true });

    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
  });

  it("should set the aria-label attribute to the i18n tooltip key when mounted.", () => {
    expect(wrapper.find("button").attributes("aria-label")).toBe("game.previousQuestionTooltip");
  });

  it("should render the tooltip with the i18n text key when mounted.", () => {
    const tooltip = wrapper.findComponent({ name: "UTooltip" });

    expect(tooltip.attributes("text")).toBe("game.previousQuestionTooltip");
  });

  it("should set the ArrowLeft aria-keyshortcuts attribute on the button when mounted.", () => {
    expect(wrapper.find("button").attributes("aria-keyshortcuts")).toBe("ArrowLeft");
  });

  it("should pass the arrowleft kbd to the tooltip when mounted.", () => {
    expect(wrapper.findComponent({ name: "UTooltip" }).props("kbds")).toStrictEqual(["arrowleft"]);
  });

  it("should pass the pointer-gated kbd ui config to the tooltip when mounted.", () => {
    expect(wrapper.findComponent({ name: "UTooltip" }).props("ui")).toStrictEqual(GAME_SHORTCUT_TOOLTIP_KBD_UI);
  });

  it("should render the arrow-left icon when mounted.", () => {
    expect(wrapper.findComponent({ name: "UButton" }).props("icon")).toBe("i-lucide-arrow-left");
  });

  it("should pass the GAME_INTERACTIVE_BUTTON_UI ui config to the button when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("ui")).toStrictEqual(GAME_INTERACTIVE_BUTTON_UI);
  });
});