import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GameQuestionCardHintBadge } from "#components";

describe("GameQuestionCardHintBadge Component", () => {
  let wrapper: VueWrapper;

  async function mountBadge(): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardHintBadge, { shallow: false, attachTo: document.body });
  }

  beforeEach(async() => {
    wrapper = await mountBadge();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the UBadge component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UBadge" }).exists()).toBe(true);
  });

  it("should set the UBadge color to warning when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("color")).toBe("warning");
  });

  it("should set the UBadge icon to the question hint icon when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("icon")).toBe("i-lucide-hat-glasses");
  });

  it("should set the UBadge square prop to true when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("square")).toBe(true);
  });

  it("should set the UBadge size to md when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("size")).toBe("md");
  });

  it("should set the UBadge variant to subtle when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("variant")).toBe("subtle");
  });

  it.each(["border-2", "border-dashed", "border-warning", "rounded-full"])(
    "should apply the %s class to the UBadge when mounted.",
    cssClass => {
      const badge = wrapper.findComponent({ name: "UBadge" });

      expect(badge.classes()).toContain(cssClass);
    },
  );

  it("should apply the data-testid attribute to the badge when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-hint']").exists()).toBe(true);
  });

  it("should set the UBadge aria-label to the hint tooltip i18n key when mounted.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.attributes("aria-label")).toBe("questions.themeStack.primaryThemeHintTooltip");
  });

  it("should wrap the badge in a UPopover when mounted.", () => {
    expect(wrapper.findComponent({ name: "UPopover" }).exists()).toBe(true);
  });

  it("should set the UPopover mode to hover when mounted.", () => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.props("mode")).toBe("hover");
  });

  it("should enable touch on the UPopover when mounted.", () => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.props("enableTouch")).toBe(true);
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