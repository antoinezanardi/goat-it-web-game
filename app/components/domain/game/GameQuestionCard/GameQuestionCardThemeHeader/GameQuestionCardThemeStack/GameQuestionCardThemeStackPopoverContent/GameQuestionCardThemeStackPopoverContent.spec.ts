import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { GameQuestionCardThemeStackPopoverContent } from "#components";

describe("GameQuestionCardThemeStackPopoverContent Component", () => {
  const primaryTheme = createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF", label: "Geography" });
  const secondaryTheme = createFakeQuestionTheme({ slug: "history-civilizations", color: "#FF5733", label: "History" });

  const defaultProps = {
    themes: [
      createFakeQuestionThemeAssignment({ isPrimary: true, isHint: true, theme: primaryTheme }),
      createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryTheme }),
    ],
  };

  let wrapper: VueWrapper;

  async function mountPopoverContent(options: MountSuspendedOptions<typeof GameQuestionCardThemeStackPopoverContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeStackPopoverContent, { props: defaultProps, shallow: false, attachTo: document.body, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountPopoverContent();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render one popover row per theme assignment when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows).toHaveLength(2);
  });

  it("should render the theme label in its row when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[0]?.text()).toContain("Geography");
  });

  it("should render the primary badge under the theme label instead of inline when mounted.", () => {
    const row = wrapper.find("[data-testid='theme-popover-row']");
    const labelContainer = row.find("div.min-w-0");

    expect(labelContainer.find("[data-testid='theme-primary-badge']").exists()).toBe(true);
  });

  it("should render the primary badge on the row flagged as primary when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[0]?.find("[data-testid='theme-primary-badge']").exists()).toBe(true);
  });

  it("should not render the primary badge on rows not flagged as primary when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[1]?.find("[data-testid='theme-primary-badge']").exists()).toBe(false);
  });

  it("should render the hint badge under the theme label instead of inline when mounted.", () => {
    const row = wrapper.find("[data-testid='theme-popover-row']");
    const labelContainer = row.find("div.min-w-0");

    expect(labelContainer.find("[data-testid='theme-hint-badge']").exists()).toBe(true);
  });

  it("should render the hint badge on rows flagged as hint when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[0]?.find("[data-testid='theme-hint-badge']").exists()).toBe(true);
  });

  it("should not render the hint badge on rows not flagged as hint when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[1]?.find("[data-testid='theme-hint-badge']").exists()).toBe(false);
  });

  it("should render the primary badge when a row is both primary and hint.", async() => {
    await wrapper.setProps({
      themes: [createFakeQuestionThemeAssignment({ isPrimary: true, isHint: true, theme: primaryTheme })],
    });

    const row = wrapper.find("[data-testid='theme-popover-row']");

    expect(row.find("[data-testid='theme-primary-badge']").exists()).toBe(true);
  });

  it("should render the hint badge when a row is both primary and hint.", async() => {
    await wrapper.setProps({
      themes: [createFakeQuestionThemeAssignment({ isPrimary: true, isHint: true, theme: primaryTheme })],
    });

    const row = wrapper.find("[data-testid='theme-popover-row']");

    expect(row.find("[data-testid='theme-hint-badge']").exists()).toBe(true);
  });

  it("should not render the primary badge when a row is hint-only.", async() => {
    await wrapper.setProps({
      themes: [createFakeQuestionThemeAssignment({ isPrimary: false, isHint: true, theme: primaryTheme })],
    });

    const row = wrapper.find("[data-testid='theme-popover-row']");

    expect(row.find("[data-testid='theme-primary-badge']").exists()).toBe(false);
  });

  it("should render the hint badge when a row is hint-only.", async() => {
    await wrapper.setProps({
      themes: [createFakeQuestionThemeAssignment({ isPrimary: false, isHint: true, theme: primaryTheme })],
    });

    const row = wrapper.find("[data-testid='theme-popover-row']");

    expect(row.find("[data-testid='theme-hint-badge']").exists()).toBe(true);
  });

  it("should pass isHint true to the first row's theme icon when mounted.", () => {
    const icons = wrapper.findAllComponents({ name: "GameQuestionCardThemeIcon" });

    expect(icons[0]?.props("isHint")).toBe(true);
  });

  it("should pass isHint false to the second row's theme icon when mounted.", () => {
    const icons = wrapper.findAllComponents({ name: "GameQuestionCardThemeIcon" });

    expect(icons[1]?.props("isHint")).toBe(false);
  });

  it("should set the primary badge icon to the question primary icon when mounted.", () => {
    const primaryBadge = wrapper.findAllComponents({ name: "UBadge" }).find(comp => comp.attributes("data-testid") === "theme-primary-badge");

    expect(primaryBadge?.props("icon")).toBe("i-lucide-star");
  });

  it("should set the primary badge color to primary when mounted.", () => {
    const primaryBadge = wrapper.findAllComponents({ name: "UBadge" }).find(comp => comp.attributes("data-testid") === "theme-primary-badge");

    expect(primaryBadge?.props("color")).toBe("primary");
  });

  it("should wrap the hint badge in a UPopover when mounted.", () => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.find("[data-testid='theme-hint-badge']").exists()).toBe(true);
  });

  it("should set the hint badge UPopover mode to hover when mounted.", () => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.props("mode")).toBe("hover");
  });

  it("should enable touch on the hint badge UPopover when mounted.", () => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.props("enableTouch")).toBe(true);
  });

  it("should render the hint tooltip popover content when the hint badge is hovered.", async() => {
    vi.useFakeTimers();

    await wrapper.find("[data-testid='theme-hint-badge']").trigger("pointerenter");
    vi.advanceTimersByTime(1000);
    await flushPromises();

    const content = document.body.querySelector("[data-testid='theme-hint-popover']");

    expect(content?.textContent).toBe("questions.themeStack.hintTooltip");
  });
});