import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameNoMoreQuestions } from "#components";

describe("GameNoMoreQuestions Component", () => {
  let wrapper: VueWrapper;

  async function mountGameNoMoreQuestionsComponent(options: MountSuspendedOptions<typeof GameNoMoreQuestions> = {}): Promise<VueWrapper> {
    return mountSuspended(GameNoMoreQuestions, { ...options });
  }

  beforeEach(async() => {
    wrapper = await mountGameNoMoreQuestionsComponent();
  });

  it("should render GameNoMoreQuestions when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the no more questions message when mounted.", () => {
    expect(wrapper.text()).toContain("game.noMoreQuestions");
  });

  it("should render the party-popper icon when mounted.", () => {
    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.props("name")).toBe("i-lucide-party-popper");
  });

  it("should render the back to home button with correct label when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("label")).toBe("game.backToHome");
  });

  it("should render the back to home button with to prop set to root when mounted.", () => {
    const button = wrapper.findComponent({ name: "UButton" });

    expect(button.props("to")).toBe("/");
  });

  it("should render the component with the correct test id when mounted.", () => {
    expect(wrapper.find("[data-testid='game-no-more-questions']").exists()).toBeTruthy();
  });
});