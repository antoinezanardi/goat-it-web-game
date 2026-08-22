import type { QuestionCategory } from "@goat-it/schemas/question";
import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestion } from "~~/tests/unit/utils/faketories/question/question.entity.faketory";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignment } from "~~/tests/unit/utils/faketories/question-theme/question-theme-assignment.entity.faketory";

import { GameQuestionCardThemeHeader } from "#components";

import type { GameQuestionCardThemeHeaderProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.types";

describe("GameQuestionCardThemeHeader Component", () => {
  const primaryTheme = createFakeQuestionTheme({ label: "Histoire", slug: "history-civilizations" });
  const secondaryTheme = createFakeQuestionTheme({ slug: "geography-travels" });

  const defaultGameQuestionCardThemeHeaderProps: GameQuestionCardThemeHeaderProps = {
    question: createFakeQuestion({
      category: "trivia",
      cognitiveDifficulty: "medium",
      themes: [createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme })],
    }),
  } as const;

  let wrapper: VueWrapper;

  async function mountHeader(options: MountSuspendedOptions<typeof GameQuestionCardThemeHeader> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeHeader, {
      props: defaultGameQuestionCardThemeHeaderProps,
      shallow: false,
      ...options,
    });
  }

  beforeEach(async() => {
    wrapper = await mountHeader();
  });

  it("should render GameQuestionCardThemeHeader when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the theme label when mounted.", () => {
    expect(wrapper.text()).toContain("Histoire");
  });

  it("should render the theme label element with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-theme']").exists()).toBe(true);
  });

  it("should render the category label element with its testid when mounted.", () => {
    expect(wrapper.find("[data-testid='game-question-category']").exists()).toBe(true);
  });

  it("should render the GameQuestionCardThemeStack component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardThemeStack" }).exists()).toBe(true);
  });

  it("should pass the question prop to the GameQuestionCardThemeStack when mounted.", () => {
    const stack = wrapper.findComponent({ name: "GameQuestionCardThemeStack" });

    expect(stack.props("question")).toBe(defaultGameQuestionCardThemeHeaderProps.question);
  });

  it("should render the GameQuestionCardDifficultyBadge component when mounted.", () => {
    expect(wrapper.findComponent({ name: "GameQuestionCardDifficultyBadge" }).exists()).toBe(true);
  });

  it("should pass the difficulty prop to the GameQuestionCardDifficultyBadge when mounted.", () => {
    const badge = wrapper.findComponent({ name: "GameQuestionCardDifficultyBadge" });

    expect(badge.props("difficulty")).toBe("medium");
  });

  it.each<{ category: QuestionCategory; icon: string }>([
    { category: "trivia", icon: "i-lucide-sparkle" },
    { category: "lexicon", icon: "i-lucide-languages" },
    { category: "riddle", icon: "i-lucide-puzzle" },
    { category: "explanation", icon: "i-lucide-atom" },
  ])("should render the category icon $icon when category is $category.", async({ category, icon }) => {
    await wrapper.setProps({
      question: createFakeQuestion({ ...defaultGameQuestionCardThemeHeaderProps.question, category }),
    });
    const categoryIcon = wrapper.findAllComponents({ name: "UIcon" }).find(comp => comp.props("name") === icon);

    expect(categoryIcon).toBeDefined();
  });

  it.each<{ category: QuestionCategory }>([
    { category: "trivia" },
    { category: "lexicon" },
    { category: "riddle" },
    { category: "explanation" },
  ])("should render the category label from the i18n key when category is $category.", async({ category }) => {
    await wrapper.setProps({
      question: createFakeQuestion({ ...defaultGameQuestionCardThemeHeaderProps.question, category }),
    });

    expect(wrapper.text()).toContain(`questions.category.${category}`);
  });

  it("should not render the other themes trigger when the question has only a primary theme.", () => {
    expect(wrapper.find("[data-testid='theme-other-themes-trigger']").exists()).toBe(false);
  });

  it("should render the other themes trigger when the question has secondary themes.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardThemeHeaderProps.question,
        themes: [
          createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme }),
          createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryTheme }),
        ],
      }),
    });

    expect(wrapper.find("[data-testid='theme-other-themes-trigger']").exists()).toBe(true);
  });

  it("should render the other themes trigger with the i18n key when the question has secondary themes.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardThemeHeaderProps.question,
        themes: [
          createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme }),
          createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryTheme }),
        ],
      }),
    });

    expect(wrapper.find("[data-testid='theme-other-themes-trigger']").text()).toContain("questions.themeStack.otherThemes");
  });

  it("should call t with the secondary themes count when the question has secondary themes.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardThemeHeaderProps.question,
        themes: [
          createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme }),
          createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryTheme }),
        ],
      }),
    });

    expect(useI18n().t).toHaveBeenCalledWith("questions.themeStack.otherThemes", { count: 1 });
  });

  it("should toggle the theme stack popover when the other themes trigger is clicked.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardThemeHeaderProps.question,
        themes: [
          createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme }),
          createFakeQuestionThemeAssignment({ isPrimary: false, isHint: false, theme: secondaryTheme }),
        ],
      }),
    });

    await wrapper.find("[data-testid='theme-other-themes-trigger']").trigger("click");
    await nextTick();

    const popover = wrapper.findComponent({ name: "UPopover" });

    expect(popover.props("open")).toBe(true);
  });

  it("should render the GameQuestionCardHintBadge when the primary theme is a hint.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardThemeHeaderProps.question,
        themes: [createFakeQuestionThemeAssignment({ isPrimary: true, isHint: true, theme: primaryTheme })],
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardHintBadge" }).exists()).toBe(true);
  });

  it("should not render the GameQuestionCardHintBadge when the primary theme is not a hint.", async() => {
    await wrapper.setProps({
      question: createFakeQuestion({
        ...defaultGameQuestionCardThemeHeaderProps.question,
        themes: [createFakeQuestionThemeAssignment({ isPrimary: true, isHint: false, theme: primaryTheme })],
      }),
    });

    expect(wrapper.findComponent({ name: "GameQuestionCardHintBadge" }).exists()).toBe(false);
  });
});