import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";

import { GameQuestionCardDifficultyBadge } from "#components";

import type { GameQuestionCardDifficultyBadgeProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardDifficultyBadge/game-question-card-difficulty-badge.types";

describe("GameQuestionCardDifficultyBadge Component", () => {
  const defaultGameQuestionCardDifficultyBadgeProps: GameQuestionCardDifficultyBadgeProps = {
    difficulty: "medium" as const,
  };

  let wrapper: VueWrapper;

  async function mountGameQuestionCardDifficultyBadge(options: MountSuspendedOptions<typeof GameQuestionCardDifficultyBadge> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardDifficultyBadge, {
      props: defaultGameQuestionCardDifficultyBadgeProps,
      shallow: false,
      attachTo: document.body,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountGameQuestionCardDifficultyBadge();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the UBadge component when mounted.", () => {
    expect(wrapper.findComponent({ name: "UBadge" }).exists()).toBe(true);
  });

  it.each<{ difficulty: string; icon: string }>([
    { difficulty: "easy", icon: "i-lucide-brain" },
    { difficulty: "medium" as const, icon: "i-lucide-brain-cog" },
    { difficulty: "hard", icon: "i-lucide-brain-circuit" },
  ])("should set the UBadge icon to $icon when difficulty is $difficulty.", async({ difficulty, icon }) => {
    await wrapper.setProps({ difficulty });

    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("icon")).toBe(icon);
  });

  it.each<{ difficulty: string; color: string }>([
    { difficulty: "easy", color: "success" },
    { difficulty: "medium" as const, color: "warning" },
    { difficulty: "hard", color: "error" },
  ])("should set the UBadge color to $color when difficulty is $difficulty.", async({ difficulty, color }) => {
    await wrapper.setProps({ difficulty });

    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.props("color")).toBe(color);
  });

  it.each<{ difficulty: string; ringClass: string }>([
    { difficulty: "easy", ringClass: "ring-success/50" },
    { difficulty: "medium" as const, ringClass: "ring-warning/50" },
    { difficulty: "hard", ringClass: "ring-error/50" },
  ])("should apply the $ringClass ring class when difficulty is $difficulty.", async({ difficulty, ringClass }) => {
    await wrapper.setProps({ difficulty });

    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.classes()).toContain(ringClass);
  });

  it("should set the UBadge aria-label to the difficulty tooltip i18n key when difficulty is medium.", () => {
    const badge = wrapper.findComponent({ name: "UBadge" });

    expect(badge.attributes("aria-label")).toBe("questions.difficultyTooltip.medium");
  });

  it("should wrap the badge in a UPopover when mounted.", () => {
    expect(wrapper.findComponent({ name: "UPopover" }).exists()).toBe(true);
  });

  it("should render the difficulty tooltip popover content when the badge is hovered.", async() => {
    vi.useFakeTimers();

    await wrapper.find("[data-testid='game-question-difficulty']").trigger("pointerenter");
    vi.advanceTimersByTime(1000);
    await flushPromises();

    const content = document.body.querySelector("[data-testid='game-question-difficulty-popover']");

    expect(content?.textContent).toBe("questions.difficultyTooltip.medium");
  });

  it("should apply the data-testid attribute to the badge when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-difficulty']").exists()).toBe(true);
  });
});