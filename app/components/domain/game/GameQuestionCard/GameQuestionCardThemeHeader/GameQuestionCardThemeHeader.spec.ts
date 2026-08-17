import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { GameQuestionCardThemeHeader } from "#components";

import type { GameQuestionCardThemeHeaderProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.types";

describe("GameQuestionCardThemeHeader Component", () => {
  const defaultProps: GameQuestionCardThemeHeaderProps = {
    theme: createFakeQuestionTheme({ label: "Histoire", slug: "history-civilizations" }),
    difficulty: "medium",
    category: "trivia",
  };

  let wrapper: VueWrapper;

  async function mountHeader(options: MountSuspendedOptions<typeof GameQuestionCardThemeHeader> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeHeader, {
      props: defaultProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountHeader();
  });

  it("should render the theme label when mounted.", () => {
    expect(wrapper.text()).toContain("Histoire");
  });

  it("should render the theme icon with the neon color class when component is mounted.", () => {
    const themeIcon = wrapper.findAllComponents({ name: "UIcon" }).find(comp => comp.props("name") === "i-lucide-landmark");

    expect(themeIcon?.classes()).toContain("text-(color:--game-theme-neon)");
  });

  it("should render the GameQuestionCardDifficultyBadge component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardDifficultyBadge" }).exists()).toBe(true);
  });

  it("should pass the difficulty prop to the GameQuestionCardDifficultyBadge when mounted.", () => {
    const badge = wrapper.findComponent({ name: "GameQuestionCardDifficultyBadge" });

    expect(badge.props("difficulty")).toBe("medium");
  });

  it("should apply the ml-auto class to the GameQuestionCardDifficultyBadge when mounted.", () => {
    const badge = wrapper.findComponent({ name: "GameQuestionCardDifficultyBadge" });

    expect(badge.classes()).toContain("ml-auto");
  });

  it.each([
    { category: "trivia", icon: "i-lucide-sparkle" },
    { category: "lexicon", icon: "i-lucide-languages" },
    { category: "riddle", icon: "i-lucide-puzzle" },
    { category: "explanation", icon: "i-lucide-atom" },
  ])("should render the category icon $icon when category is $category.", async({ category, icon }) => {
    await wrapper.setProps({ category });
    const categoryIcon = wrapper.findAllComponents({ name: "UIcon" }).find(comp => comp.props("name") === icon);

    expect(categoryIcon).toBeDefined();
  });

  it("should apply the game-theme-neon color class to the category icon when mounted.", () => {
    const categoryIcon = wrapper.findAllComponents({ name: "UIcon" }).find(comp => comp.props("name") === "i-lucide-sparkle");

    expect(categoryIcon?.classes()).toContain("text-(color:--game-theme-neon)");
  });

  it.each([
    { category: "trivia" },
    { category: "lexicon" },
    { category: "riddle" },
    { category: "explanation" },
  ])("should render the category label from the i18n key when category is $category.", async({ category }) => {
    await wrapper.setProps({ category });

    expect(wrapper.text()).toContain(`questions.category.${category}`);
  });
});