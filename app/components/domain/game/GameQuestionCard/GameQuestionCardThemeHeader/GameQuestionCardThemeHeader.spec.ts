import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { GameQuestionCardThemeHeader } from "#components";

import type { GameQuestionCardThemeHeaderProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeHeader/game-question-card-theme-header.types";

describe("GameQuestionCardThemeHeader Component", () => {
  const defaultProps: GameQuestionCardThemeHeaderProps = {
    theme: createFakeQuestionTheme({ label: "Histoire" }),
    icon: "i-lucide-landmark",
    difficulty: "medium",
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

  it("should render the difficulty label translation key when mounted.", () => {
    expect(wrapper.text()).toContain("questions.difficulty.label");
  });

  it("should render the medium difficulty translation key when mounted.", () => {
    expect(wrapper.text()).toContain("questions.difficulty.medium");
  });

  it("should render the easy difficulty translation key when difficulty is easy.", async() => {
    await wrapper.setProps({ difficulty: "easy" });

    expect(wrapper.text()).toContain("questions.difficulty.easy");
  });

  it("should render the hard difficulty translation key when difficulty is hard.", async() => {
    await wrapper.setProps({ difficulty: "hard" });

    expect(wrapper.text()).toContain("questions.difficulty.hard");
  });

  it("should render the theme icon with the neon color class when component is mounted.", () => {
    const themeIcon = wrapper.findAllComponents({ name: "UIcon" }).find(comp => comp.props("name") === "i-lucide-landmark");

    expect(themeIcon?.classes()).toContain("text-[var(--game-theme-neon)]");
  });

  it("should render the difficulty icon with text-text-secondary class when component is mounted.", () => {
    const difficultyIcon = wrapper.findAllComponents({ name: "UIcon" }).find(comp => comp.props("name") === "i-lucide-gauge");

    expect(difficultyIcon?.classes()).toContain("text-text-secondary");
  });
});