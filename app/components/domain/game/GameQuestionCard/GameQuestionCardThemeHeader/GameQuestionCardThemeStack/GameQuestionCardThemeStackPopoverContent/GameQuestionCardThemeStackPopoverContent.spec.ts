import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { GameQuestionCardThemeStackPopoverContent } from "#components";

import type { QuestionTheme } from "#shared/types/question-theme.types";
import type { GameQuestionCardThemeStackPopoverContentProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/GameQuestionCardThemeStack/GameQuestionCardThemeStackPopoverContent/game-question-card-theme-stack-popover-content.types";
import { QUESTION_HINT_ICON } from "~/composables/domain/question/constants/question.constants";

describe("GameQuestionCardThemeStackPopoverContent Component", () => {
  const primaryTheme = createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF", label: "Geography" });
  const secondaryTheme = createFakeQuestionTheme({ slug: "history-civilizations", color: "#FF5733", label: "History" });

  const defaultGameQuestionCardThemeStackPopoverContentProps: GameQuestionCardThemeStackPopoverContentProps = {
    themes: [
      createFakeQuestionThemeAssignment({ isPrimary: true, isHint: true, theme: primaryTheme }),
      createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryTheme }),
    ],
  };

  let wrapper: VueWrapper;

  async function mountPopoverContent(options: MountSuspendedOptions<typeof GameQuestionCardThemeStackPopoverContent> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeStackPopoverContent, {
      props: defaultGameQuestionCardThemeStackPopoverContentProps,
      shallow: false,
      attachTo: document.body,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountPopoverContent();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render GameQuestionCardThemeStackPopoverContent when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the root list with the theme-popover-content testid when mounted.", () => {
    expect(wrapper.find("[data-testid='theme-popover-content']").exists()).toBe(true);
  });

  it("should render one popover row per theme assignment when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows).toHaveLength(2);
  });

  it("should render the theme label in its row when mounted.", () => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[0]?.text()).toContain("Geography");
  });

  it.each<{ index: number; badge: string; expected: boolean }>([
    { index: 0, badge: "theme-primary-badge", expected: true },
    { index: 1, badge: "theme-primary-badge", expected: false },
    { index: 0, badge: "theme-hint-badge", expected: true },
    { index: 1, badge: "theme-hint-badge", expected: false },
  ])("should render $badge=$expected on the row at index $index when mounted.", ({ index, badge, expected }) => {
    const rows = wrapper.findAll("[data-testid='theme-popover-row']");

    expect(rows[index]?.find(`[data-testid='${badge}']`).exists()).toBe(expected);
  });

  it.each<{ isPrimary: boolean; isHint: boolean; badge: string; expected: boolean }>([
    { isPrimary: true, isHint: true, badge: "theme-primary-badge", expected: true },
    { isPrimary: true, isHint: true, badge: "theme-hint-badge", expected: true },
    { isPrimary: false, isHint: true, badge: "theme-primary-badge", expected: false },
    { isPrimary: false, isHint: true, badge: "theme-hint-badge", expected: true },
  ])("should render $badge=$expected when isPrimary=$isPrimary and isHint=$isHint.", async({ isPrimary, isHint, badge, expected }) => {
    await wrapper.setProps({
      themes: [createFakeQuestionThemeAssignment({ isPrimary, isHint, theme: primaryTheme })],
    });

    const row = wrapper.find("[data-testid='theme-popover-row']");

    expect(row.find(`[data-testid='${badge}']`).exists()).toBe(expected);
  });

  it.each<{ index: number; expected: boolean }>([
    { index: 0, expected: true },
    { index: 1, expected: false },
  ])("should pass isHint $expected to the row at index $index's theme icon when mounted.", ({ index, expected }) => {
    const icons = wrapper.findAllComponents({ name: "GameQuestionCardThemeIcon" });

    expect(icons[index]?.props("isHint")).toBe(expected);
  });

  it.each<{ index: number; expected: QuestionTheme }>([
    { index: 0, expected: primaryTheme },
    { index: 1, expected: secondaryTheme },
  ])("should pass the row at index $index's theme to its theme icon when mounted.", ({ index, expected }) => {
    const icons = wrapper.findAllComponents({ name: "GameQuestionCardThemeIcon" });

    expect(icons[index]?.props("theme")).toBe(expected);
  });

  it.each<{ badge: string; prop: "icon" | "label"; expected: string }>([
    { badge: "theme-primary-badge", prop: "icon", expected: "i-lucide-star" },
    { badge: "theme-primary-badge", prop: "label", expected: "questions.themeStack.primaryBadge" },
    { badge: "theme-hint-badge", prop: "icon", expected: QUESTION_HINT_ICON },
    { badge: "theme-hint-badge", prop: "label", expected: "questions.themeStack.hintBadge" },
  ])("should set the $badge $prop to $expected when mounted.", ({ badge, prop, expected }) => {
    const badgeComponent = wrapper.findAllComponents({ name: "UBadge" }).find(comp => comp.attributes("data-testid") === badge);

    expect(badgeComponent?.props(prop)).toBe(expected);
  });

  it("should wrap the hint badge in a UPopover when mounted.", () => {
    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.find("[data-testid='theme-hint-badge']").exists()).toBe(true);
  });

  it("should render the hint tooltip popover content when the hint badge is hovered.", async() => {
    vi.useFakeTimers();

    await wrapper.find("[data-testid='theme-hint-badge']").trigger("pointerenter");
    vi.advanceTimersByTime(1000);
    await flushPromises();

    const content = document.body.querySelector("[data-testid='theme-hint-popover']");

    expect(content?.textContent).toBe("questions.themeStack.themeHintTooltip");
  });
});