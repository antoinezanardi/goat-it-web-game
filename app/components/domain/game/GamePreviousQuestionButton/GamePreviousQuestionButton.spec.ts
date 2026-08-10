import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GamePreviousQuestionButton } from "#components";

describe("GamePreviousQuestionButton Component", () => {
  let wrapper: VueWrapper;

  async function mountButton(options: MountSuspendedOptions<typeof GamePreviousQuestionButton> = {}): Promise<VueWrapper> {
    return mountSuspended(GamePreviousQuestionButton, { shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountButton();
  });

  it("should emit click when the button is clicked.", async() => {
    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click")).toBeDefined();
  });

  it("should have the data-testid attribute when mounted.", () => {
    expect(wrapper.find("[data-testid='game-previous-question-button']").exists()).toBe(true);
  });

  it("should apply the themed class when not disabled.", () => {
    expect(wrapper.find("button").classes()).toContain("game-question-navigation-button--themed");
  });

  it("should apply the themed class when disabled.", async() => {
    await wrapper.setProps({ disabled: true });

    expect(wrapper.find("button").classes()).toContain("game-question-navigation-button--themed");
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
});