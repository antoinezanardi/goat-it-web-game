import type { VueWrapper } from "@vue/test-utils";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it } from "vitest";

import type { MountSuspendedOptions } from "~~/tests/unit/utils/types/mount.types";
import { createFakeQuestionTheme } from "~~/tests/unit/utils/faketories/question-theme/question-theme.entity.faketory";

import { GameQuestionCardThemeIcon } from "#components";

import type { GameQuestionCardThemeIconProps } from "@/components/domain/game/GameQuestionCard/GameQuestionCardThemeIcon/game-question-card-theme-icon.types";
import { QUESTION_THEME_UNKNOWN_ICON } from "~/composables/domain/question-theme/constants/question-theme.constants";
import { getThemeIcon } from "~/composables/domain/question-theme/helpers/question-theme.helpers";

describe("GameQuestionCardThemeIcon Component", () => {
  const defaultGameQuestionCardThemeIconProps: GameQuestionCardThemeIconProps = {
    theme: createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF" }),
  } as const;

  let wrapper: VueWrapper;

  async function mountIcon(options: MountSuspendedOptions<typeof GameQuestionCardThemeIcon> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeIcon, { props: defaultGameQuestionCardThemeIconProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountIcon();
  });

  it("should render GameQuestionCardThemeIcon when mounted.", () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  it("should render the icon resolved from the theme slug when mounted.", () => {
    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.props("name")).toBe(getThemeIcon("geography-travels"));
  });

  it("should render the unknown icon when the slug is not in the map.", async() => {
    await wrapper.setProps({ theme: createFakeQuestionTheme({ slug: "unknown-slug" }) });

    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.props("name")).toBe(QUESTION_THEME_UNKNOWN_ICON);
  });

  it("should set inline glow shadow derived from the theme color when mounted.", () => {
    expect(wrapper.attributes("style")).toContain("box-shadow:");
  });

  it.each<{ size: "md" | "sm"; expectedClass: string }>([
    { size: "md", expectedClass: "size-8" },
    { size: "sm", expectedClass: "size-7" },
  ])("should apply the $expectedClass icon size class when size is $size.", async({ size, expectedClass }) => {
    await wrapper.setProps({ size });

    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.classes()).toContain(expectedClass);
  });

  it.each<{ hintLabel: string; isHint?: boolean; expectedClass: string }>([
    { hintLabel: "omitted", expectedClass: "border" },
    { hintLabel: "false", isHint: false, expectedClass: "border" },
    { hintLabel: "true", isHint: true, expectedClass: "border-dashed" },
    { hintLabel: "true", isHint: true, expectedClass: "border-2" },
  ])("should apply the $expectedClass border class when isHint is $hintLabel.", async({ isHint, expectedClass }) => {
    const hintWrapper = await mountIcon({ props: { ...defaultGameQuestionCardThemeIconProps, isHint } });

    expect(hintWrapper.classes()).toContain(expectedClass);
  });
});