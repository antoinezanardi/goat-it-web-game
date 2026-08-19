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
  const defaultProps: GameQuestionCardThemeIconProps = {
    theme: createFakeQuestionTheme({ slug: "geography-travels", color: "#33A1FF" }),
  };

  let wrapper: VueWrapper;

  async function mountIcon(options: MountSuspendedOptions<typeof GameQuestionCardThemeIcon> = {}): Promise<VueWrapper> {
    return mountSuspended(GameQuestionCardThemeIcon, { props: defaultProps, shallow: false, ...options });
  }

  beforeEach(async() => {
    wrapper = await mountIcon();
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

  it("should apply the md icon size class when size is md.", async() => {
    await wrapper.setProps({ size: "md" });

    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.classes()).toContain("size-8");
  });

  it("should apply the sm icon size class when size is sm.", async() => {
    await wrapper.setProps({ size: "sm" });

    const icon = wrapper.findComponent({ name: "UIcon" });

    expect(icon.classes()).toContain("size-7");
  });

  it("should apply the default solid border class when isHint is omitted.", () => {
    expect(wrapper.classes()).toContain("border");
  });

  it("should apply the default solid border class when isHint is false.", async() => {
    await wrapper.setProps({ isHint: false });

    expect(wrapper.classes()).toContain("border");
  });

  it("should apply the dashed border class when isHint is true.", async() => {
    await wrapper.setProps({ isHint: true });

    expect(wrapper.classes()).toContain("border-dashed");
  });

  it("should apply the 2px border class when isHint is true.", async() => {
    await wrapper.setProps({ isHint: true });

    expect(wrapper.classes()).toContain("border-2");
  });
});