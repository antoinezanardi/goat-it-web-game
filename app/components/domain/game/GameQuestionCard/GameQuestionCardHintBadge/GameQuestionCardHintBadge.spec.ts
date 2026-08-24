import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardHintBadge } from "#components";

describe("GameQuestionCardHintBadge Component", () => {
  let wrapper: VueWrapper;

  async function mountBadge(options: MountSuspendedOptions<typeof GameQuestionCardHintBadge> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardHintBadge, { shallow: false, attachTo: document.body, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountBadge();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render GameQuestionCardHintBadge when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the UBadge component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UBadge" }).exists()).toBe(true);
  });

  it("should set the UBadge icon to the question hint icon when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("icon")).toBe("i-lucide-hat-glasses");
  });

  it("should apply the data-testid attribute to the badge when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-hint']").exists()).toBe(true);
  });

  it("should set the UBadge aria-label to the hint tooltip i18n key when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-hint']").attributes("aria-label")).toBe("questions.themeStack.primaryThemeHintTooltip");
  });

  it("should wrap the badge in a UPopover when mounted.", () => {
    expect(wrapper.findComponent({ name: "UPopover" }).exists()).toBe(true);
  });

  it("should render the hint tooltip popover content when the badge is hovered.", async() => {
    vi.useFakeTimers();

    await wrapper.find("[data-testid='game-question-hint']").trigger("pointerenter");
    vi.advanceTimersByTime(1000);
    await flushPromises();

    const content = document.body.querySelector("[data-testid='game-question-hint-popover']");

    expect(content?.textContent).toBe("questions.themeStack.primaryThemeHintTooltip");
  });
});